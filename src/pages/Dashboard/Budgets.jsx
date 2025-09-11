// Budget.jsx
import { useState, useEffect } from "react";
import useBudgetStore from "../../store/useBudgetStore";
import CreateBudgetForm from "../../components/CreateBudgetForm";

const defaultCategories = [
  "Food", "Transport", "Shopping", "Rent",
  "Entertainment", "Health", "Utilities", "Other"
];

const Budget = () => {
  const [goals, setGoals] = useState([
    { name: "Monthly Savings", amount: 5000, category: "Other" }
  ]);
  const [newGoal, setNewGoal] = useState({ name: "", amount: "", category: "" });
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  // Transaction state
  const [transaction, setTransaction] = useState({ category: "", amount: "", description: "" });
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  // From store
  const {
    budgets,
    loading,
    error,
    fetchBudgets,
    addSpending,
    removeBudget,
  } = useBudgetStore();

  // Fetch budgets on mount
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Add new goal
  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.amount || !newGoal.category) return;
    setGoals([...goals, { ...newGoal, amount: Number(newGoal.amount) }]);
    setNewGoal({ name: "", amount: "", category: "" });
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory || categories.includes(newCategory)) return;
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  // Add spending
  const handleAddSpending = async () => {
    if (!selectedBudgetId || !transaction.category || !transaction.amount) {
      console.error("Please select a budget, category, and enter an amount.");
      return;
    }
    await addSpending(selectedBudgetId, transaction.category, Number(transaction.amount));
    setTransaction({ category: "", amount: "", description: "" });
  };

  // Delete budget
  const handleDeleteBudget = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      await removeBudget(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">💰 Budget Setup</h1>
          <p className="text-gray-400 mt-1">
            Set your savings goals, define categories, and start tracking your finances.
          </p>
        </div>
      </div>

      {/* Loading & error state */}
      {loading && <p className="text-gray-400">Loading budgets...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Goals Section */}
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-600">
        <h4 className="text-lg font-semibold text-white mb-2">Your Goals</h4>
        <div className="flex flex-wrap gap-4 mb-4">
          {goals.map((goal, idx) => (
            <div key={idx} className="flex-1 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20">
              <div className="text-xs text-gray-400 mb-1">
                {goal.name}
                <span className="ml-2 px-2 py-1 rounded-full bg-purple-700/40 text-white text-xs">
                  {goal.category}
                </span>
              </div>
              <div className="text-xl font-bold text-white">₹{goal.amount}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Goal name"
            value={newGoal.name}
            onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newGoal.amount}
            onChange={e => setNewGoal({ ...newGoal, amount: e.target.value })}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          />
          <select
            value={newGoal.category}
            onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={handleAddGoal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-all"
          >
            Add Goal
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-600">
        <h4 className="text-lg font-semibold text-white mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat, idx) => (
            <span key={idx} className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white text-xs font-medium border border-zinc-700">
              {cat}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          />
          <button
            onClick={handleAddCategory}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500 transition-all"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Budget Form */}
      <CreateBudgetForm />

      {/* Transaction Section */}
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-600">
        <h4 className="text-lg font-semibold text-white mb-2">Add Transaction</h4>
        <div className="flex gap-2 mb-2">
          {/* Budget dropdown */}
          <select
            value={selectedBudgetId}
            onChange={e => setSelectedBudgetId(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          >
            <option value="">Select Budget</option>
            {budgets.map((budget) => (
              <option key={budget._id} value={budget._id}>
                {`${budget.period} budget`}
              </option>
            ))}
          </select>
          <select
            value={transaction.category}
            onChange={e => setTransaction({ ...transaction, category: e.target.value })}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={transaction.amount}
            onChange={e => setTransaction({ ...transaction, amount: e.target.value })}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={transaction.description}
            onChange={e => setTransaction({ ...transaction, description: e.target.value })}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          />
          <button
            onClick={handleAddSpending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition-all"
          >
            Add
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-600">
        <h4 className="text-lg font-semibold text-white mb-2">Budget Overview</h4>
        {budgets.map((budget) => (
          <div
            key={budget._id}
            className="p-4 mb-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium capitalize">
                {budget.period} Budget
              </span>
              <div className="flex items-center gap-3">
                <span className="text-gray-300">
                  ₹{budget.totalSpent} / ₹{budget.totalBudget}
                </span>
                <button
                  onClick={() => handleDeleteBudget(budget._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="w-full bg-zinc-700 h-3 rounded mb-4">
              <div
                className="bg-green-500 h-3 rounded"
                style={{
                  width: `${(budget.totalSpent / budget.totalBudget) * 100}%`,
                }}
              />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              {budget.categories.map((cat) => (
                <div key={cat._id} className="p-2 rounded bg-zinc-900/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-sm">{cat.name}</span>
                    <span className="text-gray-400 text-sm">
                      ₹{cat.spent} / ₹{cat.allocated || budget.totalBudget}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-700 h-2 rounded">
                    <div
                      className="bg-purple-500 h-2 rounded"
                      style={{
                        width: `${((cat.spent || 0) / (cat.allocated || budget.totalBudget)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budget;
