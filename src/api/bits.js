// src/api/bits.js
import axios from "./axios";

export const getBits = async () => {
  const { data } = await axios.get("/bits");
  return data;
};

export const createBit = async (bit) => {
  const { data } = await axios.post("/bits", bit);
  return data;
};

export const deleteBit = async (id) => {
  const { data } = await axios.delete(`/bits/${id}`);
  return data;
};

export const getMe = async () => {
  const { data } = await axios.get("/users/me");
  return data;
};
