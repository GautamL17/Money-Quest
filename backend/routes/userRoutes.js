import User from '../models/user.js'

import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getMe,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fetch all users (admin use-case, optional)
router.get("/", protect, getAllUsers);

// ✅ Update user (self update or admin)
router.put("/:id", protect, updateUser);

// ✅ Delete user
router.delete("/:id", protect, deleteUser);


router.get("/me", protect, getMe);

export default router;
