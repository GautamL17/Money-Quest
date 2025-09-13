// backend/controllers/dashboardController.js
import asyncHandler from "express-async-handler";
import Budget from "../models/budget.js";
import UserBitsProgress from "../models/userBitsProgress.js";

// 📊 Get dashboard data for current user
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch all budgets for user
  const budgets = await Budget.find({ user: userId });

  // If no budgets exist, return default empty dashboard
  if (!budgets || budgets.length === 0) {
    return res.json({
      balance: 0,
      incomeThisMonth: 0,
      expensesThisMonth: 0,
      budgetLeft: 0,
      expenseBreakdown: [],
      incomeVsExpense: [],
      recentTransactions: [],
      goals: [],
      bitsProgress: {
        totalBits: 0,
        completedBits: 0,
        avgCompletion: 0,
        items: []
      }
    });
  }

  // Flatten all transactions from budgets
  const allTransactions = budgets.flatMap(b => b.transactions || []);

  // Current month/year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter transactions for current month
  const currentMonthTx = allTransactions.filter(t => {
    const d = new Date(t.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Calculate income & expenses for this month
  let incomeThisMonth = 0;
  let expensesThisMonth = 0;
  currentMonthTx.forEach(t => {
    if (t.amount > 0) incomeThisMonth += t.amount;
    else expensesThisMonth += Math.abs(t.amount);
  });

  // Calculate balance and total budget left
  const balance = incomeThisMonth - expensesThisMonth;
  const budgetLeft = budgets.reduce((acc, b) => acc + (b.remaining || 0), 0);

  // Expense breakdown by category
  const expenseByCategory = {};
  currentMonthTx.forEach(t => {
    if (t.amount < 0) {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Math.abs(t.amount);
    }
  });
  const expenseBreakdown = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Income vs Expense trend for last 6 months
  const incomeVsExpense = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const month = date.toLocaleString("default", { month: "short" });
    let income = 0;
    let expense = 0;

    allTransactions.forEach(t => {
      const d = new Date(t.createdAt);
      if (d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()) {
        if (t.amount > 0) income += t.amount;
        else expense += Math.abs(t.amount);
      }
    });

    incomeVsExpense.push({ month, income, expense });
  }

  // Recent 5 transactions
  const recentTransactions = allTransactions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Placeholder for goals (if you implement a separate collection)
  const goals = [];

  // 🔹 Bits Progress
  const progresses = await UserBitsProgress.find({ user: userId }).populate("bit", "title category");

  const totalBits = progresses.length;
  const completedBits = progresses.filter(
    p => p.levels.basic.completed && p.levels.intermediate.completed && p.levels.advanced.completed
  ).length;

  const avgCompletion = progresses.length
    ? Math.round(progresses.reduce((acc, p) => acc + p.getOverallCompletion(), 0) / progresses.length)
    : 0;

  const bitsProgress = {
    totalBits,
    completedBits,
    avgCompletion,
    items: progresses.map(p => ({
      bitId: p.bit._id,
      title: p.bit.title,
      category: p.bit.category,
      levels: p.levels,
      overallCompletion: p.getOverallCompletion()
    }))
  };

  // Send consolidated dashboard response
  res.json({
    balance,
    incomeThisMonth,
    expensesThisMonth,
    budgetLeft,
    expenseBreakdown,
    incomeVsExpense,
    recentTransactions,
    goals,
    bitsProgress
  });
});
