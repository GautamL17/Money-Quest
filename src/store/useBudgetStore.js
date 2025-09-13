// src/store/useBudgetStore.js
import { create } from "zustand";
import * as api from "../api/budgets.js";

const useBudgetStore = create((set, get) => ({
  budgets: [],
  loading: false,
  error: null,

  // Fetch all budgets
  fetchBudgets: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getBudgets();
      set({ budgets: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch budgets",
        loading: false,
      });
    }
  },

  // Create new budget
  createBudget: async (budgetData) => {
    set({ loading: true, error: null });
    try {
      const data = await api.createBudget(budgetData);
      set((state) => ({ budgets: [...state.budgets, data], loading: false }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create budget",
        loading: false,
      });
      console.error("Create budget failed:", err.response?.data || err.message);
    }
  },

  // Update budget
  updateBudget: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const data = await api.updateBudget(id, updatedData);
      set((state) => ({
        budgets: state.budgets.map((b) => (b._id === id ? data : b)),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update budget",
        loading: false,
      });
    }
  },

  // Add spending
// Add spending
addSpending: async (id, spendingData) => {
  set({ loading: true, error: null });
  try {
    const data = await api.addSpending(id, spendingData); // ✅ pass object directly
    set((state) => ({
      budgets: state.budgets.map((b) => (b._id === id ? data : b)),
      loading: false,
    }));
  } catch (err) {
    set({
      error: err.response?.data?.message || "Failed to add spending",
      loading: false,
    });
    console.error("Add spending failed:", err.response?.data || err.message);
  }
},


  // Delete budget
  deleteBudget: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.deleteBudget(id);
      set((state) => ({
        budgets: state.budgets.filter((b) => b._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete budget",
        loading: false,
      });
    }
  },
}));

export default useBudgetStore;
