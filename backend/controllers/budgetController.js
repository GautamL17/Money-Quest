// controllers/budgetController.js
import Budget from "../models/budget.js";
import { calculateBudgetStats } from "../helpers/budgetHelper.js";


export const createBudget = async (req, res) => {
  try {
    const { categories, totalBudget, period } = req.body;

    if (!categories || !totalBudget || !period) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const budget = new Budget({
      user: req.user._id,
      categories,
      totalBudget,
      spent: 0,
      remaining: totalBudget, // initialize remaining
      period,
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


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


export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const addSpending = async (req, res) => {
  try {
    const { categoriesName, amount } = req.body;
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const category = budget.categories.find(c => c.name === categoriesName);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.spent += amount;

    calculateBudgetStats(budget);
    await budget.save();

    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getBudgetSummary = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });

    const summary = budgets.map(b => ({
      id: b._id,
      period: b.period,
      totalBudget: b.totalBudget,
      totalSpent: b.totalSpent,
      remaining: b.remaining,
      savingsGoal: b.savingsGoal,
    }));

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
