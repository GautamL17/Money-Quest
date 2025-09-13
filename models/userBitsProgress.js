// models/userBitsProgress.js
import mongoose from "mongoose";

const userBitsProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bit: { type: mongoose.Schema.Types.ObjectId, ref: "Bit", required: true },

  levels: {
    basic: {
      unlocked: { type: Boolean, default: true },
      completed: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      answeredQuestions: { type: [Number], default: [] },
      completedAt: { type: Date }
    },
    intermediate: {
      unlocked: { type: Boolean, default: false },
      completed: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      answeredQuestions: { type: [Number], default: [] },
      completedAt: { type: Date }
    },
    advanced: {
      unlocked: { type: Boolean, default: false },
      completed: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      answeredQuestions: { type: [Number], default: [] },
      completedAt: { type: Date }
    }
  }
}, { timestamps: true });

// Compute overall completion percentage (0-100)
userBitsProgressSchema.methods.getOverallCompletion = function() {
  const b = this.levels.basic?.score || 0;
  const i = this.levels.intermediate?.score || 0;
  const a = this.levels.advanced?.score || 0;
  return Math.round(((b + i + a) / (5 * 3)) * 100); // each level out of 5
};

// Update progress for a question
userBitsProgressSchema.methods.updateProgress = async function(level, questionIndex, isCorrect) {
  const lvl = this.levels[level];
  if (!lvl.answeredQuestions.includes(questionIndex)) {
    lvl.answeredQuestions.push(questionIndex);
    if (isCorrect) lvl.score += 1;

    if (lvl.answeredQuestions.length === 5) {
      lvl.completed = true;
      lvl.completedAt = new Date();

      // Unlock next level
      if (level === "basic") this.levels.intermediate.unlocked = true;
      if (level === "intermediate") this.levels.advanced.unlocked = true;
    }
    await this.save();
  }
};

// Unique index per user-bit pair
userBitsProgressSchema.index({ user: 1, bit: 1 }, { unique: true });

export default mongoose.model("UserBitsProgress", userBitsProgressSchema);
