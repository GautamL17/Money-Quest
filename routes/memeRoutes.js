import express from "express";
import {
  getMemes,
  getMemeById,
  addMeme,
  updateMeme,
  deleteMeme,
  likeMeme
} from "../controllers/memeController.js";

const router = express.Router();

router.get("/", getMemes);
router.get("/:id", getMemeById);
router.post("/", addMeme);
router.put("/:id", updateMeme);
router.delete("/:id", deleteMeme);
router.post("/:id/like", likeMeme);

export default router;
