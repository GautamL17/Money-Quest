// controllers/featureController.js
import Feature from "../models/feature.js";

// Get all features
export const getFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch features" });
  }
};

// Add new feature
export const addFeature = async (req, res) => {
  try {
    const { name, description, route, icon } = req.body;
    const newFeature = new Feature({ name, description, route, icon });
    await newFeature.save();
    res.status(201).json(newFeature);
  } catch (err) {
    res.status(500).json({ error: "Failed to add feature" });
  }
};

// Delete feature
export const deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) return res.status(404).json({ error: "Feature not found" });
    res.json({ message: "Feature deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete feature" });
  }
};

// Toggle feature ON/OFF
export const toggleFeature = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) return res.status(404).json({ message: "Feature not found" });

    feature.isActive = !feature.isActive;
    await feature.save();
    res.json(feature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
