// src/api/budgets.js
import axios from "./axios";

// ✅ Get all budgets
export const getBudgets = async () => {
  const { data } = await axios.get("/budgets");
  return data;
};

// ✅ Create new budget
export const createBudget = async (budget) => {
  const { data } = await axios.post("/budgets", budget);
  return data;
};

// ✅ Update budget
export const updateBudget = async (id, updates) => {
  const { data } = await axios.put(`/budgets/${id}`, updates);
  return data;
};

// ✅ Delete budget
export const deleteBudget = async (id) => {
  const { data } = await axios.delete(`/budgets/${id}`);
  return data;
};

// ✅ Add spending to a budget
export const addSpending = async (id, categoryName, amount) => {
  const { data } = await axios.post(`/budgets/${id}/spend`, {
    categoryName,
    amount,
  });
  return data;
};

// ✅ Get logged-in user info
export const getMe = async () => {
  const { data } = await axios.get("/users/me");
  return data;
};
