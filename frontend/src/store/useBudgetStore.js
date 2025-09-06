// src/stores/budgetStore.js
import { create } from "zustand";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../api/budgets";

const useBudgetStore = create((set) => ({
  budgets: [],
  loading: false,
  error: null,

  fetchBudgets: async () => {
    set({ loading: true });
    try {
      const data = await getBudgets();
      set({ budgets: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch budgets", loading: false });
    }
  },

  addBudget: async (budget) => {
    try {
      const data = await createBudget(budget);
      set((state) => ({ budgets: [...state.budgets, data] }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to create budget" });
    }
  },

  editBudget: async (id, updates) => {
    try {
      const data = await updateBudget(id, updates);
      set((state) => ({
        budgets: state.budgets.map((b) => (b._id === id ? data : b)),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update budget" });
    }
  },

  removeBudget: async (id) => {
    try {
      await deleteBudget(id);
      set((state) => ({ budgets: state.budgets.filter((b) => b._id !== id) }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete budget" });
    }
  },
}));

export default useBudgetStore;
 