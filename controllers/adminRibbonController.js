import Ribbon from "../models/Ribbon.js";

export const adminListRibbons = async (_, res) =>
  res.json({ ok: true, data: await Ribbon.find() });

export const adminCreateRibbon = async (req, res) =>
  res.json({ ok: true, data: await Ribbon.create(req.body) });

export const adminUpdateRibbon = async (req, res) =>
  res.json({
    ok: true,
    data: await Ribbon.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  });

export const adminToggleRibbon = async (req, res) => {
  const r = await Ribbon.findById(req.params.id);
  r.active = !r.active;
  await r.save();
  res.json({ ok: true });
};
