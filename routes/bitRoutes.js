import express from "express";
import {
  generateAllLevels,
  updateProgress,
  getAllBits,
  getBitById,
  deleteBit,
  getAnalytics,
} from "../controllers/bitController.js";

const router = express.Router();

// Generation routes
router.post("/generate-all", generateAllLevels);    // Generate complete learning path (all 3 levels)

// Fetch routes
router.get("/", getAllBits);                        // Get all learning paths
router.get("/:id", getBitById);                     // Get single learning path by ID
router.get("/:id/analytics", getAnalytics);        // Get user's learning analytics

// Progress tracking routes
router.patch("/:id/progress", updateProgress);     // Update user progress for a specific level/question

// Management routes
router.delete("/:id", deleteBit);                  // Delete learning path

export default router;