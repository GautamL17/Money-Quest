// src/api/budgets.js
import axios from "./axios";

export const getBudgets = async () => {
  const { data } = await axios.get("/budgets");
  return data;
};

export const createBudget = async (budget) => {
  const { data } = await axios.post("/budgets", budget);
  return data;
};

export const updateBudget = async (id, updates) => {
  const { data } = await axios.put(`/budgets/${id}`, updates);
  return data;
};

export const deleteBudget = async (id) => {
  const { data } = await axios.delete(`/budgets/${id}`);
  return data;
};

export const getMe = async () => {
  const { data } = await axios.get("/users/me");
  return data;
};
