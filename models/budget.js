// models/budget.js
import mongoose from "mongoose";

// Category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  allocated: { type: Number, default: 0, min: 0 },
  spent: { type: Number, default: 0, min: 0 },
});

// Transaction schema
const transactionSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, default: "", trim: true },
  date: { type: Date, default: Date.now },
});

// Budget schema
const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categories: {
      type: [categorySchema],
      default: [],
    },

    transactions: {
      type: [transactionSchema],
      default: [],
    },

    totalBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    remaining: {
      type: Number,
      default: 0,
      min: 0,
    },

    period: {
      type: String,
      enum: ["monthly", "weekly", "yearly"],
      required: true,
    },
    month: {
      type: Number, // 1–12
      min: 1,
      max: 12,
    },
    week: {
      type: Number, // 1–52
      min: 1,
      max: 52,
    },

    // Salary and savings tracking
    salary: {
      type: Number,
      default: 0,
      min: 0,
    },
    savingsGoal: {
      type: Number,
      default: 0,
      min: 0,
    },
    savings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
