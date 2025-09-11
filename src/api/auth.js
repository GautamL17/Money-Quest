// src/api/auth.js
import axios from "./axios";

// export const register = async (name, email, password) => {
//   try {
//     const { data } = await axios.post("/auth/signup", {
//       name,
//       email,
//       password,
//     });
//     return data;
//   } catch (err) {
//     throw err.response?.data?.message || "Registration failed";
//   }
// };

// export const login = async (email, password) => {
//   try {
//     const { data } = await axios.post("/auth/login", { email, password });
//     return data;
//   } catch (err) {
//     throw err.response?.data?.message || "Login failed";
//   }
// };

export const register = async (credentials) => {
  const { data } = await axios.post("/auth/signup", credentials);
  return data;
};

// 🔹 Login
export const login = async (credentials) => {
  const { data } = await axios.post("/auth/login", credentials);
  return data;
};


export const getProfile = async () => {
  const { data } = await axios.get("/auth/me");
  return data;
};

export const logout = async () => {
  // client-side only
  localStorage.removeItem("token");
};
