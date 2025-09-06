import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  allocated: { type: Number, default: 0 },
  spent: { type: Number, default: 0 }
});

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  period: { type: String, enum: ["monthly", "weekly"], required: true },
  month: { type: Number }, 
  week: { type: Number }, 
  totalBudget: { type: Number, required: true },
  categories: [categorySchema],
  savingsGoal: { type: Number, default: 0 },

  // New computed fields
  totalAllocated: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 }
});

export default mongoose.model("Budget", budgetSchema);
