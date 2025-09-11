export const calculateBudgetStats = (budget) => {
  const categories = budget.categories || [];

  const totalAllocated = categories.reduce((acc, c) => acc + (c.allocated || 0), 0);
  const totalSpent = categories.reduce((acc, c) => acc + (c.spent || 0), 0);
  const remaining = (budget.totalBudget || 0) - totalSpent;

  budget.totalAllocated = totalAllocated;
  budget.totalSpent = totalSpent;
  budget.remaining = remaining;

  return budget;
};
