// src/stores/userStore.js
import { create } from "zustand";
import { getUserById, updateUser, deleteUser } from "../api/users";

const useUserStore = create((set) => ({
  userData: null,
  loading: false,
  error: null,

  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await getUserById(id);
      set({ userData: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch user", loading: false });
    }
  },

  updateUser: async (id, updates) => {
    set({ loading: true });
    try {
      const data = await updateUser(id, updates);
      set({ userData: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Update failed", loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true });
    try {
      await deleteUser(id);
      set({ userData: null, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Delete failed", loading: false });
    }
  },
}));

export default useUserStore;
