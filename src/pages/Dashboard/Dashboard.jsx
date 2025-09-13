// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaCoins, FaWallet, FaChartLine, FaPiggyBank } from "react-icons/fa";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [userBitsProgress, setUserBitsProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard + user bits progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, bitsRes] = await Promise.all([
          axios.get("/dashboard"),
          axios.get("/bits-progress")
        ]);

        setDashboard(dashboardRes.data);
        setUserBitsProgress(bitsRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("Failed to load dashboard");
        toast.error("Failed to load dashboard ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading dashboard...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!dashboard) return null;

  const {
    balance,
    incomeThisMonth,
    expensesThisMonth,
    budgetLeft,
    expenseBreakdown,
    incomeVsExpense,
    recentTransactions,
    goals,
    bitsProgress
  } = dashboard;

  const masteredTopicsCount = userBitsProgress.filter(
    (bit) => bit.levels.advanced.completed
  ).length;

  return (
    <div className="p-6 space-y-8 min-h-screen bg-zinc-900 text-gray-200">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">📊 Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Overview of your budgets and learning progress
          </p>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Balance" value={`₹${balance}`} icon={<FaWallet />} color="blue" />
        <StatCard label="Income (This Month)" value={`₹${incomeThisMonth}`} icon={<FaCoins />} color="green" />
        <StatCard label="Expenses (This Month)" value={`₹${expensesThisMonth}`} icon={<FaChartLine />} color="red" />
        <StatCard label="Budget Left" value={`₹${budgetLeft}`} icon={<FaPiggyBank />} color="yellow" />
      </div>

      {/* Expense Breakdown */}
      <SectionCard title="Expense Breakdown">
        {expenseBreakdown.length === 0 ? (
          <p className="text-gray-400">No expenses yet</p>
        ) : (
          <ul className="space-y-2">
            {expenseBreakdown.map((e, idx) => (
              <li key={idx} className="flex justify-between p-2 hover:bg-zinc-800 rounded">
                <span>{e.name}</span>
                <span>₹{e.value}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Income vs Expense */}
      <SectionCard title="Income vs Expense (Last 6 months)">
        <table className="w-full text-left text-gray-200 border-collapse">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="p-2">Month</th>
              <th className="p-2">Income</th>
              <th className="p-2">Expense</th>
            </tr>
          </thead>
          <tbody>
            {incomeVsExpense.map((ie, idx) => (
              <tr key={idx} className="hover:bg-zinc-800">
                <td className="p-2">{ie.month}</td>
                <td className="p-2">₹{ie.income}</td>
                <td className="p-2">₹{ie.expense}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Recent Transactions */}
      <SectionCard title="Recent Transactions">
        {recentTransactions.length === 0 ? (
          <p className="text-gray-400">No transactions yet</p>
        ) : (
          <ul className="space-y-2 max-h-56 overflow-y-auto">
            {recentTransactions.map((t, idx) => (
              <li key={idx} className="flex justify-between border-b border-zinc-700 pb-1 hover:bg-zinc-800 rounded px-2">
                <div>
                  <p className="font-medium">{t.category}</p>
                  <p className="text-xs text-gray-400">{t.description}</p>
                </div>
                <div className="text-right">
                  <p className={t.amount > 0 ? "text-green-400" : "text-red-400"}>
                    {t.amount > 0 ? `+₹${t.amount}` : `-₹${Math.abs(t.amount)}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.createdAt ? format(new Date(t.createdAt), "dd MMM") : "N/A"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Bits Progress */}
      <SectionCard title="Learning Progress">
        <p className="text-gray-200 mb-2">
          Mastered Topics: {masteredTopicsCount} / {bitsProgress.totalBits}
        </p>
        <div className="w-full bg-zinc-700 h-4 rounded mb-4 overflow-hidden">
          <div
            className="h-4 rounded bg-green-500 transition-all duration-500"
            style={{ width: `${bitsProgress.avgCompletion}%` }}
          />
        </div>
        <ul className="space-y-1 max-h-40 overflow-y-auto text-gray-200">
          {bitsProgress.items.map((b, idx) => (
            <li key={idx} className="flex justify-between p-1 hover:bg-zinc-800 rounded">
              <span>{b.title} ({b.category})</span>
              <span>{b.overallCompletion}%</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
};

// Reusable section wrapper
const SectionCard = ({ title, children }) => (
  <div className="bg-zinc-900 p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    {children}
  </div>
);

// Reusable stat card
const StatCard = ({ label, value, icon, color }) => {
  const colorClass = color === "green" ? "text-green-400" :
                     color === "red" ? "text-red-400" :
                     color === "blue" ? "text-blue-400" :
                     color === "yellow" ? "text-yellow-400" : "text-white";

  return (
    <div className="bg-zinc-900 p-4 rounded-lg shadow-md flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
      <div className={`text-2xl ${colorClass}`}>{icon}</div>
      <p className="text-gray-400">{label}</p>
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
};

export default Dashboard;
