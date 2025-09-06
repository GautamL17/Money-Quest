// src/api/features.js
import axios from "./axios";

export const getFeatures = async () => {
  const { data } = await axios.get("/features");
  return data;
};

export const createFeature = async (feature) => {
  const { data } = await axios.post("/features", feature);
  return data;
};

export const deleteFeature = async (id) => {
  const { data } = await axios.delete(`/features/${id}`);
  return data;
};

export const getMe = async () => {
  const { data } = await axios.get("/users/me");
  return data;
};
