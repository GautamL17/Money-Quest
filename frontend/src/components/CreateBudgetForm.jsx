import { useState } from "react";
// import useBudgetStore from "../../store/useBudgetStore";
import useBudgetStore from "../store/useBudgetStore";

const CreateBudgetForm = () => {
const { addBudget } = useBudgetStore();
  const [period, setPeriod] = useState("monthly");
  const [totalBudget, setTotalBudget] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!totalBudget) return alert("Enter total budget");

    await addBudget({
      period,
      totalBudget: Number(totalBudget),
      categories: ["Food", "Transport", "Shopping", "Rent", "Entertainment", "Health", "Utilities", "Other"], // take from your chips
    });

    setTotalBudget("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-900 rounded-lg mb-6">
      <h2 className="text-white mb-2">Create Budget</h2>
      <div className="flex gap-2">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type="number"
          placeholder="Total Budget"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 px-4 rounded">
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateBudgetForm;
