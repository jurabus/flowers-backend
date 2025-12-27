import BouquetTemplate from "../models/BouquetTemplate.js";

export const adminListTemplates = async (_, res) =>
  res.json({ ok: true, data: await BouquetTemplate.find() });

export const adminCreateTemplate = async (req, res) =>
  res.json({ ok: true, data: await BouquetTemplate.create(req.body) });

export const adminUpdateTemplate = async (req, res) =>
  res.json({
    ok: true,
    data: await BouquetTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ),
  });

export const adminDeleteTemplate = async (req, res) => {
  await BouquetTemplate.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
