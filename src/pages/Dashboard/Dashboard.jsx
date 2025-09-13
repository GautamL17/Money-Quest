import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PlusCircle, MinusCircle, Target, Wallet, Bell } from "lucide-react";
import BudgetOverview from "./BudgetOverview";
import BudgetForm from './BudgetForm';
const Dashboard = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const expenseData = [
    { name: "Food", value: 400 },
    { name: "Rent", value: 700 },
    { name: "Travel", value: 200 },
    { name: "Entertainment", value: 150 },
  ];

  const incomeVsExpense = [
    { month: "Jan", income: 4000, expense: 2400 },
    { month: "Feb", income: 3000, expense: 1398 },
    { month: "Mar", income: 5000, expense: 2800 },
  ];

  return (
    <div className="min-h-screen bg- text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <div className="flex items-center gap-4[#141515]">
          <button className="bg-gray-800 p-2 rounded-full"><Bell size={20} /></button>
          <div className="bg-gray-800 px-4 py-2 rounded-lg">Profile</div>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-gray-400 text-sm">Total Balance</h2>
          <p className="text-2xl font-bold">₹12,500</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-gray-400 text-sm">Income (This Month)</h2>
          <p className="text-2xl font-bold text-green-400">₹8,000</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-gray-400 text-sm">Expenses (This Month)</h2>
          <p className="text-2xl font-bold text-red-400">₹5,200</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-gray-400 text-sm">Budget Left</h2>
          <p className="text-2xl font-bold text-yellow-400">₹2,800</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="mb-4 font-semibold">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="mb-4 font-semibold">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={incomeVsExpense}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#00C49F" />
              <Line type="monotone" dataKey="expense" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-900 p-4 rounded-xl shadow mb-6">
        <h2 className="mb-4 font-semibold">Recent Transactions</h2>
        <ul className="divide-y divide-gray-700">
          <li className="flex justify-between py-2">
            <span>Groceries</span>
            <span className="text-red-400">-₹500</span>
          </li>
          <li className="flex justify-between py-2">
            <span>Salary</span>
            <span className="text-green-400">+₹10,000</span>
          </li>
          <li className="flex justify-between py-2">
            <span>Netflix</span>
            <span className="text-red-400">-₹200</span>
          </li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500">
          <PlusCircle size={18} /> Add Income
        </button>
        <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500">
          <MinusCircle size={18} /> Add Expense
        </button>
        <button className="flex items-center gap-2 bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-500">
          <Target size={18} /> Set Goal
        </button>
        <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500">
          <Wallet size={18} /> Set Budget
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
