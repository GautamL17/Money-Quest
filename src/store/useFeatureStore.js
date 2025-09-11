// src/stores/featureStore.js
import { create } from "zustand";
import { getFeatures, createFeature, deleteFeature } from "../api/features";

const useFeatureStore = create((set) => ({
  features: [],
  loading: false,
  error: null,

  fetchFeatures: async () => {
    set({ loading: true });
    try {
      const data = await getFeatures();
      set({ features: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch features", loading: false });
    }
  },

  addFeature: async (feature) => {
    try {
      const data = await createFeature(feature);
      set((state) => ({ features: [...state.features, data] }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add feature" });
    }
  },

  removeFeature: async (id) => {
    try {
      await deleteFeature(id);
      set((state) => ({ features: state.features.filter((f) => f._id !== id) }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete feature" });
    }
  },
}));

export default useFeatureStore;
