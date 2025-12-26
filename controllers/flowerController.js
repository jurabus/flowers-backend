import Flower from "../models/Flower.js";

export const listFlowers = async (req, res) => {
  const flowers = await Flower.find({ active: true }).sort({ name: 1 });
  res.json({ ok: true, data: flowers });
};
