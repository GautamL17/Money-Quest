import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, register } from "../api/auth";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // 🔹 Login
      loginUser: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const data = await login(credentials);
          set({ user: data.user, token: data.token, loading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || "Login failed", loading: false });
        }
      },

      // 🔹 Register
      // registerUser: async (credentials) => {
      //   try {
      //     set({ loading: true, error: null });
      //     const data = await register(credentials);
      //     set({ user: data.user, token: data.token, loading: false });
      //   } catch (err) {
      //     set({ error: err.response?.data?.message || "Signup failed", loading: false });
      //   }
      // },

registerUser: async (credentials) => {
  try {
    set({ loading: true, error: null });
    const data = await register(credentials);  // <-- api/auth.js register
    set({ user: data.user, token: data.token, loading: false });
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
    set({
      error: err.response?.data?.message || "Signup failed",
      loading: false,
    });
  }
},

      // 🔹 Logout
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      getStorage: () => localStorage, // default is localStorage
    }
  )
);

export default useAuthStore;
