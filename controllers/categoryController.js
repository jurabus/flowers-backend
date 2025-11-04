import Category from "../models/Category.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ createdAt: -1 });
    res.json({ items: cats });
  } catch (e) {
    console.error("getCategories error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name, imageUrl, featured } = req.body;
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const cat = await Category.create({ name: name.trim(), imageUrl, featured });
    res.status(201).json(cat);
  } catch (e) {
    console.error("createCategory error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// Update
export const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Not found" });
    if (req.body.name !== undefined) cat.name = req.body.name.trim();
    if (req.body.imageUrl !== undefined) cat.imageUrl = req.body.imageUrl;
    if (req.body.featured !== undefined) cat.featured = !!req.body.featured;
    await cat.save();
    res.json(cat);
  } catch (e) {
    console.error("updateCategory error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete
export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Not found" });
    await cat.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
