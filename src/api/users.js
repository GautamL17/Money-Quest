// api/users.js
import axios from "./axios";

export const getMe = async () => {
  const { data } = await axios.get("/users/me");  // backend endpoint we made
  return data;
};

export const getUserById = async (id) => {
  const { data } = await axios.get(`/users/${id}`);
  return data;
};

export const updateUser = async (id, updates) => {
  const { data } = await axios.put(`/users/${id}`, updates);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`/users/${id}`);
  return data;
};
