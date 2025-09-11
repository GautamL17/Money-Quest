import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  allocated: { type: Number, default: 0 },
  spent: { type: Number, default: 0 }
});

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  period: { type: String, enum: ["monthly", "weekly"], required: true },

  // If monthly budget, store month number (1–12)
  month: { type: Number }, 

  // If weekly budget, store week number (1–52)
  week: { type: Number }, 

  totalBudget: { type: Number, required: true },
  categories: [categorySchema],
  savingsGoal: { type: Number, default: 0 },

  // Computed fields
  totalAllocated: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 }
}, { timestamps: true });  // ✅ Adds createdAt & updatedAt automatically

export default mongoose.model("Budget", budgetSchema);
