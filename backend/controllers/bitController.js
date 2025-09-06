// import Bit from "../models/bit.js";
import Bit from '../models/bits.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * @desc Generate a new Bit using Gemini
 * @route POST /api/bits/generate
 */
export const generateBit = async (req, res) => {
  try {
    const { title, topic, category, difficulty, language } = req.body;

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    // Strict JSON-only prompt
    const prompt = `
    Generate a short financial literacy lesson (max 250 words) on the topic "${title}".
    Respond ONLY with JSON in this exact format:

    {
      "content": "lesson text here",
      "quiz": [
        {"question": "Q1", "options": ["A","B","C","D"], "answer": "A"},
        {"question": "Q2", "options": ["A","B","C","D"], "answer": "C"}
      ]
    }

    Rules:
    - Do NOT include markdown, code fences, or extra text.
    - Keep "content" under 250 words.
    - Quiz must have 2–3 questions.
    - "answer" must be the correct option letter (A/B/C/D).
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean possible code block wrappers
    text = text.replace(/```json|```/g, "").trim();

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to parse Gemini response:", text);
      return res.status(500).json({ error: "Failed to parse Gemini response" });
    }

    // Save to MongoDB
    const newBit = new Bit({
      title,
      topic: topic || title,
      content: parsed.content?.trim() || "",
      quiz: parsed.quiz || [],
      category: category || "general",
      difficulty: difficulty || "beginner",
      language: language || "en",
    });

    await newBit.save();
    res.status(201).json(newBit);
  } catch (error) {
    console.error("Error generating Bit:", error);
    res.status(500).json({ error: "Failed to generate bit" });
  }
};

/**
 * @desc Get all Bits
 * @route GET /api/bits
 */
export const getAllBits = async (req, res) => {
  try {
    const bits = await Bit.find().sort({ createdAt: -1 });
    res.json(bits);
  } catch (error) {
    console.error("Error fetching Bits:", error);
    res.status(500).json({ error: "Failed to fetch bits" });
  }
};

/**
 * @desc Get single Bit by ID
 * @route GET /api/bits/:id
 */
export const getBitById = async (req, res) => {
  try {
    const bit = await Bit.findById(req.params.id);
    if (!bit) {
      return res.status(404).json({ error: "Bit not found" });
    }
    res.json(bit);
  } catch (error) {
    console.error("Error fetching Bit:", error);
    res.status(500).json({ error: "Failed to fetch bit" });
  }
};

/**
 * @desc Delete a Bit
 * @route DELETE /api/bits/:id
 */
export const deleteBit = async (req, res) => {
  try {
    const bit = await Bit.findByIdAndDelete(req.params.id);
    if (!bit) {
      return res.status(404).json({ error: "Bit not found" });
    }
    res.json({ message: "Bit deleted successfully" });
  } catch (error) {
    console.error("Error deleting Bit:", error);
    res.status(500).json({ error: "Failed to delete bit" });
  }
};
