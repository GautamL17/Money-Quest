// controllers/budgetController.js
import Budget from "../models/budget.js";
import { calculateBudgetStats } from "../helpers/budgetHelper.js";
import asyncHandler from 'express-async-handler';

export const createBudget = async (req, res) => {
  try {
    const { categories, totalBudget, period, month, week } = req.body;

    if (!categories || !totalBudget || !period) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize categories so schema gets { name, allocated, spent }
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
      month: period === "monthly" ? month : undefined, // ✅ only set if monthly
      week: period === "weekly" ? week : undefined,   // ✅ only set if weekly
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


// export const addSpending = async (req, res) => {
//   try {
//     const { categoriesName, amount } = req.body;
//     const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

//     if (!budget) return res.status(404).json({ message: "Budget not found" });

//     const category = budget.categories.find(c => c.name === categoriesName);
//     if (!category) return res.status(404).json({ message: "Category not found" });

//     category.spent += amount;

//     calculateBudgetStats(budget);
//     await budget.save();

//     res.json(budget);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


export const getBudgetSummary = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });

    const summary = budgets.map(b => {
      let label;
      if (b.period === "monthly" && b.month) {
        // Convert month number to name (1 -> January)
        const monthName = new Date(2000, b.month - 1).toLocaleString("default", { month: "long" });
        label = `${monthName} ${b.createdAt.getFullYear()}`;
      } else if (b.period === "weekly" && b.week) {
        label = `Week ${b.week} - ${b.createdAt.getFullYear()}`;
      } else {
        // fallback
        label = `${b.period} budget (${b.createdAt.toDateString()})`;
      }

      return {
        id: b._id,
        label,
        period: b.period,
        totalBudget: b.totalBudget,
        totalSpent: b.totalSpent,
        remaining: b.remaining,
        savingsGoal: b.savingsGoal,
      };
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// @desc    Add spending to a budget
// @route   POST /api/budgets/:id/spend
// @access  Private
export const addSpending = asyncHandler(async (req, res) => {
  const { categoryName, amount } = req.body;
  const { id } = req.params;

  // const budget = await Budget.findById(id);
  const budget = await Budget.findOne({ _id: id, user: req.user.id });


  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  // Find the category and update its spent amount
  const categoryToUpdate = budget.categories.find(
    (cat) => cat.name === categoryName
  );

  if (!categoryToUpdate) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Update spent amount for the category
  categoryToUpdate.spent += amount;

  // Recalculate totalSpent and remaining
  budget.totalSpent += amount;
  budget.remaining = budget.totalBudget - budget.totalSpent;

  // Save the updated budget
  await budget.save();

  res.status(200).json(budget);
});
