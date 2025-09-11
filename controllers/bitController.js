import Bit from '../models/bits.js';
import User from '../models/user.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateLevel } from "../helpers/levelHelper.js";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * @desc Generate all three difficulty levels for a topic (15 questions total)
 * @route POST /api/bits/generate-all
 */
export const generateAllLevels = async (req, res) => {
  try {
    const { title, topic, category, language } = req.body;

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    // Enhanced prompt to generate all three levels at once
    const prompt = `
Generate a complete financial literacy learning path for GenZ (ages 18-26) on the topic "${title}".

Create content for ALL THREE difficulty levels with exactly 5 questions each (15 questions total).

BASIC LEVEL:
- Focus on fundamental concepts and simple definitions
- Use everyday GenZ examples (budgeting for streaming services, saving for concerts, part-time job money management)
- Avoid financial jargon, explain in simple terms

INTERMEDIATE LEVEL:
- Build on basic concepts with more detailed explanations
- Introduce financial terminology with clear explanations
- Include practical applications and strategies
- Cover scenarios like student loans, building credit, investment basics

ADVANCED LEVEL:
- Cover complex financial concepts and advanced strategies
- Use appropriate financial terminology
- Include market analysis, tax implications, sophisticated strategies
- Topics like cryptocurrency, advanced investing, wealth building

Respond ONLY with JSON in this exact format:

{
  "basic": {
    "content": "basic level lesson text (150-250 words)",
    "quiz": [
      {
        "question": "Q1",
        "options": ["A","B","C","D"],
        "answer": "A",
        "explanations": {
          "A": "Correct explanation",
          "B": "Why B is wrong",
          "C": "Why C is wrong",
          "D": "Why D is wrong"
        }
      },
      // ... 4 more questions for basic
    ]
  },
  "intermediate": {
    "content": "intermediate level lesson text (200-300 words)",
    "quiz": [
      {
        "question": "Q1",
        "options": ["A","B","C","D"],
        "answer": "B",
        "explanations": {
          "A": "Why A is wrong",
          "B": "Correct explanation",
          "C": "Why C is wrong",
          "D": "Why D is wrong"
        }
      },
      // ... 4 more questions for intermediate
    ]
  },
  "advanced": {
    "content": "advanced level lesson text (250-350 words)",
    "quiz": [
      {
        "question": "Q1",
        "options": ["A","B","C","D"],
        "answer": "C",
        "explanations": {
          "A": "Why A is wrong",
          "B": "Why B is wrong",
          "C": "Correct explanation",
          "D": "Why D is wrong"
        }
      },
      // ... 4 more questions for advanced
    ]
  }
}

Rules:
- Each level must have EXACTLY 5 questions (15 total)
- Content should progressively build in complexity
- Questions should test understanding of the respective level's content
- All explanations must be clear and educational
- Use GenZ-friendly language throughout
- No markdown, code fences, or extra text
- "answer" must match one of the options exactly
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean possible code block wrappers
    text = text.replace(/```json|```/g, "").trim();

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to parse Gemini response:", text);
      return res.status(500).json({ error: "Failed to parse Gemini response" });
    }

    // Validate structure
    const levels = ['basic', 'intermediate', 'advanced'];
    for (const level of levels) {
      if (!parsed[level] || !parsed[level].quiz || parsed[level].quiz.length !== 5) {
        console.error(`❌ ${level} level doesn't have exactly 5 questions`);
        return res.status(500).json({ 
          error: `Generated content must have exactly 5 questions for ${level} level` 
        });
      }
    }

    // Save to MongoDB with new structure
    const newBit = new Bit({
      title,
      topic: topic || title,
      category: category || "general",
      language: language || "en",
      levels: {
        basic: {
          content: parsed.basic.content?.trim() || "",
          quiz: parsed.basic.quiz || []
        },
        intermediate: {
          content: parsed.intermediate.content?.trim() || "",
          quiz: parsed.intermediate.quiz || []
        },
        advanced: {
          content: parsed.advanced.content?.trim() || "",
          quiz: parsed.advanced.quiz || []
        }
      },
      userProgress: {
        basic: {
          completed: false,
          score: 0,
          answeredQuestions: []
        },
        intermediate: {
          unlocked: false,
          completed: false,
          score: 0,
          answeredQuestions: []
        },
        advanced: {
          unlocked: false,
          completed: false,
          score: 0,
          answeredQuestions: []
        }
      }
    });

    await newBit.save();
    res.status(201).json(newBit);
  } catch (error) {
    console.error("Error generating all levels:", error);
    res.status(500).json({ error: "Failed to generate complete learning path" });
  }
};

/**
 * @desc Update user progress for a specific level and question
 * @route PATCH /api/bits/:id/progress
 */
export const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { level, questionIndex, isCorrect } = req.body;

    if (!['basic', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: "Invalid level" });
    }

    const bit = await Bit.findById(id);
    if (!bit) {
      return res.status(404).json({ error: "Bit not found" });
    }

    // Update progress using the schema method
    await bit.updateProgress(level, questionIndex, isCorrect);

    // Check if all levels are completed and all questions are answered
    const allLevels = ['basic', 'intermediate', 'advanced'];
    const allCompleted = allLevels.every(level => {
      const progress = bit.userProgress[level];
      return progress.completed && progress.answeredQuestions.length === 5;
    });

    if (allCompleted) {
      const user = await User.findById(req.user._id);
      const pointsEarned = 100;
      user.points += pointsEarned;

      // Fetch user's completed bits and savings (implement savings logic as needed)
      const completedBits = await Bit.countDocuments({
        "userProgress.basic.completed": true,
        "userProgress.intermediate.completed": true,
        "userProgress.advanced.completed": true
      });
      // Example: get totalSavings from budgets or transactions
      const totalSavings = user.totalSavings || 0;

      user.level = calculateLevel({
        points: user.points,
        completedBits,
        totalSavings
      });

      // Rank logic (optional)
      if (user.points >= 1000) user.rank = "Pro";
      else if (user.points >= 500) user.rank = "Veteran";
      else user.rank = "Rookie";

      await user.save();
    }

    res.json({
      message: "Progress updated successfully",
      userProgress: bit.userProgress,
      overallCompletion: bit.getOverallCompletion()
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

/**
 * @desc Get all Bits
 * @route GET /api/bits
 */
export const getAllBits = async (req, res) => {
  try {
    const bits = await Bit.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(bits);
  } catch (error) {
    console.error("Error fetching Bits:", error);
    res.status(500).json({ error: "Failed to fetch bits" });
  }
};

/**
 * @desc Get single Bit by ID
 * @route GET /api/bits/:id
 */
export const getBitById = async (req, res) => {
  try {
    const bit = await Bit.findById(req.params.id);
    if (!bit) {
      return res.status(404).json({ error: "Bit not found" });
    }
    res.json(bit);
  } catch (error) {
    console.error("Error fetching Bit:", error);
    res.status(500).json({ error: "Failed to fetch bit" });
  }
};

/**
 * @desc Delete a Bit
 * @route DELETE /api/bits/:id
 */
export const deleteBit = async (req, res) => {
  try {
    const bit = await Bit.findByIdAndDelete(req.params.id);
    if (!bit) {
      return res.status(404).json({ error: "Bit not found" });
    }
    res.json({ message: "Bit deleted successfully" });
  } catch (error) {
    console.error("Error deleting Bit:", error);
    res.status(500).json({ error: "Failed to delete bit" });
  }
};

/**
 * @desc Get user's learning analytics
 * @route GET /api/bits/:id/analytics
 */
export const getAnalytics = async (req, res) => {
  try {
    const bit = await Bit.findById(req.params.id);
    if (!bit) {
      return res.status(404).json({ error: "Bit not found" });
    }

    const analytics = {
      overallCompletion: bit.getOverallCompletion(),
      levelsCompleted: {
        basic: bit.userProgress.basic.completed,
        intermediate: bit.userProgress.intermediate.completed,
        advanced: bit.userProgress.advanced.completed
      },
      levelsUnlocked: {
        basic: true, // Always unlocked
        intermediate: bit.isIntermediateUnlocked(),
        advanced: bit.isAdvancedUnlocked()
      },
      scores: {
        basic: bit.userProgress.basic.score,
        intermediate: bit.userProgress.intermediate.score,
        advanced: bit.userProgress.advanced.score
      },
      totalQuestionsAnswered: 
        bit.userProgress.basic.answeredQuestions.length +
        bit.userProgress.intermediate.answeredQuestions.length +
        bit.userProgress.advanced.answeredQuestions.length
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};