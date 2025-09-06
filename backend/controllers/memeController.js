import Meme from '../models/meme.js'

// Get all memes
export const getMemes = async (req, res) => {
  try {
    const memes = await Meme.find().sort({ createdAt: -1 });
    res.json(memes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch memes" });
  }
};

// Get single meme
export const getMemeById = async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ error: "Meme not found" });
    res.json(meme);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meme" });
  }
};

// Add new meme
export const addMeme = async (req, res) => {
  try {
    const { title, imageUrl, caption, createdBy, category } = req.body;
    const newMeme = new Meme({ title, imageUrl, caption, createdBy, category });
    await newMeme.save();
    res.status(201).json(newMeme);
  } catch (error) {
    res.status(500).json({ error: "Failed to add meme" });
  }
};

// Update meme (caption/category)
export const updateMeme = async (req, res) => {
  try {
    const meme = await Meme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meme) return res.status(404).json({ error: "Meme not found" });
    res.json(meme);
  } catch (error) {
    res.status(500).json({ error: "Failed to update meme" });
  }
};

// Delete meme
export const deleteMeme = async (req, res) => {
  try {
    const meme = await Meme.findByIdAndDelete(req.params.id);
    if (!meme) return res.status(404).json({ error: "Meme not found" });
    res.json({ message: "Meme deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete meme" });
  }
};

// Like a meme
export const likeMeme = async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ error: "Meme not found" });

    meme.likes += 1;
    await meme.save();
    res.json(meme);
  } catch (error) {
    res.status(500).json({ error: "Failed to like meme" });
  }
};
