// routes/bitsProgressRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllProgressForUser, getOrCreateProgressForBit, submitAnswer, getUserBitsProgress } from "../controllers/userBitsProgressController.js";

const router = express.Router();

// GET overall aggregation for user
router.get("/progress", protect, getAllProgressForUser);

// GET or create single bit progress
router.get("/:bitId/progress", protect, getOrCreateProgressForBit);

// POST an answer/update progress
router.post("/:bitId/answer", protect, submitAnswer);

router.get("/", protect, getUserBitsProgress);


export default router;
