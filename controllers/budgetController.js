// controllers/budgetController.js
import Budget from "../models/budget.js";
import { calculateBudgetStats } from "../helpers/budgetHelper.js";
import asyncHandler from "express-async-handler";

// Create budget
export const createBudget = async (req, res) => {
  try {
    const { categories, totalBudget, period, month, week, salary, savingsGoal } = req.body;

    if (!categories || !totalBudget || !period) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize categories
    const normalizedCategories = categories.map((c) =>
      typeof c === "string"
        ? { name: c, allocated: 0, spent: 0 }
        : { ...c, allocated: c.allocated || 0, spent: c.spent || 0 }
    );

    const budget = new Budget({
      user: req.user._id,
      categories: normalizedCategories,
      totalBudget,
      totalSpent: 0,
      remaining: totalBudget,
      period,
      salary: salary || 0,
      savingsGoal: savingsGoal || 0,
      savings: salary ? salary : 0,
      month: period === "monthly" ? month : undefined,
      week: period === "weekly" ? week : undefined,
    });

    const updatedBudget = calculateBudgetStats(budget);
    const savedBudget = await updatedBudget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all budgets
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets.map(calculateBudgetStats));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single budget
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(calculateBudgetStats(budget));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update budget
export const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    Object.assign(budget, req.body);
    budget = calculateBudgetStats(budget);

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete budget
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get summary
export const getBudgetSummary = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });

    const summary = budgets.map((b) => {
      let label;
      if (b.period === "monthly" && b.month) {
        const monthName = new Date(2000, b.month - 1).toLocaleString("default", { month: "long" });
        label = `${monthName} ${b.createdAt.getFullYear()}`;
      } else if (b.period === "weekly" && b.week) {
        label = `Week ${b.week} - ${b.createdAt.getFullYear()}`;
      } else {
        label = `${b.period} budget (${b.createdAt.toDateString()})`;
      }

      return {
        id: b._id,
        label,
        period: b.period,
        totalBudget: b.totalBudget,
        totalSpent: b.totalSpent,
        remaining: b.remaining,
        salary: b.salary,
        savings: b.savings,
        savingsGoal: b.savingsGoal,
      };
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add spending
export const addSpending = asyncHandler(async (req, res) => {
  const { category, amount, description } = req.body;
  const { id } = req.params;

  // ✅ Validate input early
  if (!category || !amount) {
    return res.status(400).json({ message: "Category and amount are required" });
  }

  const budget = await Budget.findOne({ _id: id, user: req.user.id });
  if (!budget) {
    return res.status(404).json({ message: "Budget not found" });
  }

  if (!budget.categories || budget.categories.length === 0) {
    return res.status(400).json({ message: "This budget has no categories" });
  }

  // ✅ Case-insensitive + trim safe match
  const requestedCategory = category.trim().toLowerCase();
  const categoryToUpdate = budget.categories.find(
    (cat) => cat?.name?.trim().toLowerCase() === requestedCategory
  );

  if (!categoryToUpdate) {
    return res.status(404).json({ message: `Category "${category}" not found in this budget` });
  }

  // ✅ Ensure `spent` exists
  if (typeof categoryToUpdate.spent !== "number") {
    categoryToUpdate.spent = 0;
  }

  categoryToUpdate.spent += Number(amount);

  budget.transactions.push({
    category: categoryToUpdate.name,
    amount: Number(amount),
    description: description?.trim() || "",
    createdAt: new Date(), // ✅ good to store a timestamp
  });

  calculateBudgetStats(budget);

  await budget.save();
  res.status(200).json(budget);
});
