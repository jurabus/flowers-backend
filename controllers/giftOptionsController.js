import Wrap from "../models/Wrap.js";
import Ribbon from "../models/Ribbon.js";

export const listWraps = async (req, res) => {
  const wraps = await Wrap.find({ active: true });
  res.json({ ok: true, data: wraps });
};

export const listRibbons = async (req, res) => {
  const ribbons = await Ribbon.find({ active: true });
  res.json({ ok: true, data: ribbons });
};
