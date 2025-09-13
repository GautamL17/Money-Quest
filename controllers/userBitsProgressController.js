// controllers/userBitsProgressController.js
import asyncHandler from "express-async-handler";
import UserBitsProgress from "../models/userBitsProgress.js";
import User from "../models/user.js";
import Bit from "../models/bits.js"; // adjust filename if your model name/path differs
import {} from '../helpers/levelHelper.js'
// GET /api/bits/progress
// returns aggregated progress for the current user (summary)
export const getAllProgressForUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const progresses = await UserBitsProgress.find({ user: userId }).populate("bit", "title topic category");

  const totalBits = progresses.length;
  const completedBits = progresses.filter(p => {
    const lv = p.levels;
    return lv.basic?.completed && lv.intermediate?.completed && lv.advanced?.completed;
  }).length;

  const avgCompletion = progresses.length > 0
    ? Math.round(progresses.reduce((acc, p) => acc + p.getOverallCompletion(), 0) / progresses.length)
    : 0;

  res.json({
    totalBits,
    completedBits,
    avgCompletion,
    items: progresses
  });
});

// GET /api/bits/:bitId/progress
// returns or creates a progress doc for this user & bit
export const getOrCreateProgressForBit = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { bitId } = req.params;

  let progress = await UserBitsProgress.findOne({ user: userId, bit: bitId });
  if (!progress) {
    progress = await UserBitsProgress.create({ user: userId, bit: bitId });
  }

  res.json(progress);
});

// POST /api/bits/:bitId/answer
// body: { level: 'basic'|'intermediate'|'advanced', questionIndex: number, isCorrect: boolean }
// This will add answeredQuestion (if not already answered), update score, mark completed, unlock next level automatically
export const submitAnswer = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { bitId } = req.params;
  const { level, questionIndex, isCorrect } = req.body;

  const allowed = ["basic", "intermediate", "advanced"];
  if (!allowed.includes(level)) {
    res.status(400);
    throw new Error("Invalid level");
  }

  // ensure bit exists to know quiz length
  const bit = await Bit.findById(bitId);
  if (!bit) {
    res.status(404);
    throw new Error("Bit not found");
  }

  const quiz = bit.levels?.[level]?.quiz;
  const totalQuestions = Array.isArray(quiz) ? quiz.length : 0;
  if (typeof questionIndex !== "number" || questionIndex < 0 || questionIndex >= totalQuestions) {
    res.status(400);
    throw new Error("Invalid question index");
  }

  // find or create user progress
  let progress = await UserBitsProgress.findOne({ user: userId, bit: bitId });
  if (!progress) {
    progress = await UserBitsProgress.create({ user: userId, bit: bitId });
  }

  const levelState = progress.levels[level];

  // if already answered this question, ignore
  if (!levelState.answeredQuestions.includes(questionIndex)) {
    levelState.answeredQuestions.push(questionIndex);
    if (isCorrect) levelState.score += 1;

    // If reached total questions, mark completed and set completedAt
    if (levelState.answeredQuestions.length >= totalQuestions) {
      levelState.completed = true;
      levelState.completedAt = new Date();

      // unlock next level
      if (level === "basic") progress.levels.intermediate.unlocked = true;
      if (level === "intermediate") progress.levels.advanced.unlocked = true;
    }

    await progress.save();
  }

  res.json(progress);
});


export const updateProgress = async (req, res) => {
  try {
    const { id } = req.params; // bitId
    const { level, questionIndex, isCorrect } = req.body;

    if (!['basic', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: "Invalid level" });
    }

    const bit = await Bit.findById(id);
    if (!bit) return res.status(404).json({ error: "Bit not found" });

    // Fetch or create UserBitsProgress
    let progress = await UserBitsProgress.findOne({ user: req.user._id, bit: id });
    if (!progress) {
      progress = new UserBitsProgress({ user: req.user._id, bit: id });
    }

    // Update user progress
    await progress.updateProgress(level, questionIndex, isCorrect);

    // Optionally update user's overall points if the bit is fully completed
    const levelsCompleted = ['basic', 'intermediate', 'advanced'].every(lvl => progress.levels[lvl].completed);
    if (levelsCompleted) {
      const user = await User.findById(req.user._id);
      const pointsEarned = 100;
      user.points += pointsEarned;

      const completedBits = await UserBitsProgress.countDocuments({
        user: req.user._id,
        'levels.basic.completed': true,
        'levels.intermediate.completed': true,
        'levels.advanced.completed': true
      });

      const totalSavings = user.totalSavings || 0;

      user.level = calculateLevel({ points: user.points, completedBits, totalSavings });

      if (user.points >= 1000) user.rank = "Pro";
      else if (user.points >= 500) user.rank = "Veteran";
      else user.rank = "Rookie";

      await user.save();
    }

    res.json({
      message: "Progress updated successfully",
      userProgress: progress.levels,
      overallCompletion: progress.getOverallCompletion()
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

export const getUserBitsProgress = async (req, res) => {
  try {
    const progress = await UserBitsProgress.find({ user: req.user._id }).populate('bit', 'title');
    res.json(progress);
  } catch (error) {
    console.error("Error fetching user bits progress:", error);
    res.status(500).json({ error: "Failed to fetch user bits progress" });
  }
};