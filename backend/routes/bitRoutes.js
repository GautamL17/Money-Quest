import express from "express";
import {
  generateBit,
  getAllBits,
  getBitById,
  deleteBit,
} from "../controllers/bitController.js";

const router = express.Router();

// Routes
router.post("/", generateBit);   // Generate new Bit
router.get("/", getAllBits);        // Get all Bits
router.get("/:id", getBitById);  // Get one Bit
router.delete("/:id", deleteBit); // Delete Bit

export default router;
