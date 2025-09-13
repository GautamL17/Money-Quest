  // src/components/BudgetForm.jsx
  import { useState } from "react";
  import useBudgetStore from "../../store/useBudgetStore";

  const defaultCategories = [
    "Food", "Transport", "Shopping", "Rent",
    "Entertainment", "Health", "Utilities", "Other"
  ];

  const BudgetForm = () => {
    const { createBudget, loading } = useBudgetStore();

    const [form, setForm] = useState({
      totalBudget: "",
      period: "monthly",
      salary: "",
      savingsGoal: "",
      // start clean — user must add categories explicitly or use defaults
      categories: [],
    });

    // generic handler
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    // category handlers
    const handleCategoryChange = (index, key, value) => {
      const newCategories = [...form.categories];
      newCategories[index] = { ...newCategories[index], [key]: key === "allocated" ? Number(value) : value };
      setForm({ ...form, categories: newCategories });
    };

    const addEmptyCategory = () => {
      setForm({ ...form, categories: [...form.categories, { name: "", allocated: 0 }] });
    };

    const addDefaultCategories = () => {
      const mapped = defaultCategories.map(name => ({ name, allocated: 0 }));
      setForm({ ...form, categories: mapped });
    };

    const removeCategory = (index) => {
      setForm({ ...form, categories: form.categories.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      // filter out empty names
      const validCategories = form.categories
        .map(c => ({ name: (c.name || "").trim(), allocated: Number(c.allocated || 0) }))
        .filter(c => c.name !== "");

      // If user accidentally left categories empty, we prefer default categories rather than submit invalid payload.
      if (validCategories.length === 0) {
        // Option A: ask user to add categories
        // alert("Please add at least one category or click 'Use default categories'.");
        // return;

        // Option B (safer for UX): fallback to default categories automatically and notify
        const fallback = defaultCategories.map(name => ({ name, allocated: 0 }));
        console.warn("No valid categories found — falling back to default categories.", fallback);
        submitPayload({ ...form, categories: fallback });
        return;
      }

      // build payload
      const payload = {
    totalBudget: Number(form.totalBudget) || 0,
    period: form.period,
    salary: Number(form.salary) || 0,
    savingsGoal: Number(form.savingsGoal) || 0,
    categories: validCategories,
  };


      submitPayload(payload);
    };

    // Extracted to log and call createBudget
    const submitPayload = (payload) => {
      console.log("Budget payload being sent:", payload);
      createBudget(payload);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-zinc-800/50">
        <div className="grid md:grid-cols-3 gap-2">
          <input
            type="number"
            name="salary"
            placeholder="Monthly Salary"
            value={form.salary}
            onChange={handleChange}
            className="border p-2 w-full bg-zinc-900 text-white"
          />
          <input
            type="number"
            name="savingsGoal"
            placeholder="Savings Goal"
            value={form.savingsGoal}
            onChange={handleChange}
            className="border p-2 w-full bg-zinc-900 text-white"
          />
          <input
            type="number"
            name="totalBudget"
            placeholder="Total Budget"
            value={form.totalBudget}
            onChange={handleChange}
            className="border p-2 w-full bg-zinc-900 text-white"
          />
        </div>

        <select
          name="period"
          value={form.period}
          onChange={handleChange}
          className="border p-2 w-full bg-zinc-900 text-white"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold">Categories</h4>
            <div className="flex gap-2">
              <button type="button" onClick={addEmptyCategory} className="bg-blue-600 text-white px-3 py-1 rounded">
                + Add
              </button>
              <button type="button" onClick={addDefaultCategories} className="bg-purple-600 text-white px-3 py-1 rounded">
                Use default categories
              </button>
            </div>
          </div>

          {form.categories.length === 0 && (
            <p className="text-sm text-gray-400">No categories yet — click "Use default categories" or "Add".</p>
          )}

          {form.categories.map((cat, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Category name"
                value={cat.name}
                onChange={(e) => handleCategoryChange(idx, "name", e.target.value)}
                className="border p-2 w-2/3 bg-zinc-900 text-white"
              />
              <input
                type="number"
                placeholder="Allocated"
                value={cat.allocated}
                onChange={(e) => handleCategoryChange(idx, "allocated", e.target.value)}
                className="border p-2 w-1/4 bg-zinc-900 text-white"
              />
              <button type="button" onClick={() => removeCategory(idx)} className="bg-red-500 text-white px-2 py-1 rounded">
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            {loading ? "Saving..." : "Create Budget"}
          </button>
        </div>
      </form>
    );
  };

  export default BudgetForm;
