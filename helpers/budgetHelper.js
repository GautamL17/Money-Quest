// helpers/budgetHelper.js
export const calculateBudgetStats = (budget) => {
  const categories = budget.categories || [];

  // Totals
  const totalAllocated = categories.reduce((acc, c) => acc + (c.allocated || 0), 0);
  const totalSpent = categories.reduce((acc, c) => acc + (c.spent || 0), 0);
  const remaining = (budget.totalBudget || 0) - totalSpent;

  // ✅ Savings calculation
  const salary = budget.salary || 0;
  const savingsGoal = budget.savingsGoal || 0;
  const savings = Math.max(salary - totalSpent, 0); // don’t allow negative savings

  // Update budget object
  budget.totalAllocated = totalAllocated;
  budget.totalSpent = totalSpent;
  budget.remaining = remaining;
  budget.savings = savings; // 👈 tracked dynamically
  budget.savingsGoal = savingsGoal;

  return budget;
};
