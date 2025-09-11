// src/stores/budgetStore.js
import { create } from "zustand";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../api/budgets";
// import axios from "axios";
import api from "../api/axios";


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

  // addSpending: async (budgetId, categoryName, amount) => {
  //   set({ loading: true });
  //   try {
  //     const { data } = await axios.post(`/api/budgets/${budgetId}/spend`, {
  //       categoriesName: categoryName,
  //       amount,
  //     });
  //     // Replace the old budget with the new, updated one from the server
  //     set((state) => ({
  //       budgets: state.budgets.map((b) => (b._id === budgetId ? data : b)),
  //       loading: false,
  //     }));
  //   } catch (err) {
  //     set({
  //       error: err.response?.data?.message || "Failed to add spending",
  //       loading: false,
  //     });
  //   }
  // },


  addSpending: async (budgetId, categoryName, amount) => {
  set({ loading: true });
  try {
    const { data } = await api.post(`/budgets/${budgetId}/spend`, {
      categoryName,
      amount,
    });
    set((state) => ({
      budgets: state.budgets.map((b) => (b._id === budgetId ? data : b)),
      loading: false,
    }));
  } catch (err) {
    set({
      error: err.response?.data?.message || "Failed to add spending",
      loading: false,
    });
  }
},

}));

export default useBudgetStore;