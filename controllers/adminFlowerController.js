import Flower from "../models/Flower.js";

export const adminListFlowers = async (_, res) => {
  const data = await Flower.find().sort({ createdAt: -1 });
  res.json({ ok: true, data });
};

export const adminCreateFlower = async (req, res) => {
  const { name, description, imageUrl, price, active } = req.body;
  const flower = await Flower.create({
    name,
    description,
    imageUrl,
    price,
    active,
  });
  res.json({ ok: true, data: flower });
};

export const adminUpdateFlower = async (req, res) => {
  const flower = await Flower.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ ok: true, data: flower });
};

export const adminToggleFlower = async (req, res) => {
  const flower = await Flower.findById(req.params.id);
  flower.active = !flower.active;
  await flower.save();
  res.json({ ok: true });
};
