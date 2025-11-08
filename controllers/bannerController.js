// controllers/bannerController.js
import Banner from "../models/Banner.js";

export const getBanners = async (req, res) => {
  try {
    const items = await Banner.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createBanner = async (req, res) => {
  try {
    const b = await Banner.create(req.body);
    res.status(201).json(b);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const b = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(b);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
