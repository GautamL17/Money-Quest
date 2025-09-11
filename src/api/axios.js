// api/axios.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

// Create axios instance
const instance = axios.create({
  baseURL: "http://localhost:8000/api", // 👈 change when deploying
  headers: { "Content-Type": "application/json" },
});

// Request interceptor → attach token
instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout if token invalid
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default instance;
