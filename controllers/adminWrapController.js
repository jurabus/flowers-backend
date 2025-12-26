import Wrap from "../models/Wrap.js";

export const adminListWraps = async (_, res) =>
  res.json({ ok: true, data: await Wrap.find() });

export const adminCreateWrap = async (req, res) =>
  res.json({ ok: true, data: await Wrap.create(req.body) });

export const adminUpdateWrap = async (req, res) =>
  res.json({
    ok: true,
    data: await Wrap.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  });

export const adminToggleWrap = async (req, res) => {
  const w = await Wrap.findById(req.params.id);
  w.active = !w.active;
  await w.save();
  res.json({ ok: true });
};
