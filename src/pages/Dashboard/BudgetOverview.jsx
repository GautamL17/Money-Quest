import useBudgetStore from "../../store/useBudgetStore";
import { format } from "date-fns";
import toast from "react-hot-toast";

const BudgetOverview = ({ budgets }) => {
  const { deleteBudget } = useBudgetStore();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudget(id);
        toast.success("Budget deleted successfully ✅");
      } catch (err) {
        toast.error("Failed to delete budget ❌");
      }
    }
  };

  if (!budgets || budgets.length === 0) {
    return <p className="text-gray-400">No budgets available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {budgets.map((budget) => (
        <div
          key={budget._id}
          className="bg-zinc-900 text-white border border-zinc-700 rounded-2xl shadow p-4 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">
                {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
              </h3>
              <p className="text-gray-400">Total: ₹{budget.totalBudget}</p>
              <p className="text-green-400">Remaining: ₹{budget.remaining}</p>
              <p className="text-red-400">Spent: ₹{budget.totalSpent}</p>
            </div>
            <button
              onClick={() => handleDelete(budget._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-300">Categories</h4>
            <ul className="text-sm space-y-1">
              {budget.categories.map((c, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{c.name}</span>
                  <span>₹{c.spent} / ₹{c.allocated}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transactions */}
          {budget.transactions && budget.transactions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-300">Transactions</h4>
              <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
                {budget.transactions
                  .slice()
                  .reverse()
                  .map((t, idx) => (
                    <li key={idx} className="flex justify-between border-b border-zinc-700 pb-1">
                      <div>
                        <p className="font-medium">{t.category}</p>
                        <p className="text-xs text-gray-400">{t.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400">-₹{t.amount}</p>
                        <p className="text-xs text-gray-500">
                          {t.createdAt ? format(new Date(t.createdAt), "dd MMM") : "N/A"}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BudgetOverview;
