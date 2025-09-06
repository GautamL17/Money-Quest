export const calculateBudgetStats = (budget) => {
  const totalAllocated = budget.categories.reduce((acc, c) => acc + c.allocated, 0);
  const totalSpent = budget.categories.reduce((acc, c) => acc + c.spent, 0);
  const remaining = budget.totalBudget - totalSpent;

  // Update budget object
  budget.totalAllocated = totalAllocated;
  budget.totalSpent = totalSpent;
  budget.remaining = remaining;

  return budget;
};
