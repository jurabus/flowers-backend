import CustomBouquet from "../models/CustomBouquet.js";
import BouquetTemplate from "../models/BouquetTemplate.js";
import Flower from "../models/Flower.js";
import Wrap from "../models/Wrap.js";
import Ribbon from "../models/Ribbon.js";



export const listTemplates = async (req, res) => {
  const templates = await BouquetTemplate.find();
  res.json({ ok: true, data: templates });
};

export const createCustomBouquet = async (req, res) => {
  try {
    const {
      userId,
      templateId,
      items,
      wrapId,
      ribbonId,
      snapshotUrl
    } = req.body;

    const template = await BouquetTemplate.findById(templateId);
    if (!template)
      return res.status(400).json({ ok: false, message: "Invalid template" });

    if (items.length !== template.slotCount)
      return res
        .status(400)
        .json({ ok: false, message: "Bouquet not fully filled" });

    /* ================= FLOWER PRICING ================= */

    let flowersTotal = 0;
    const pricedItems = [];

    for (const item of items) {
      const flower = await Flower.findById(item.flowerId);
      if (!flower)
        return res.status(400).json({ ok: false, message: "Invalid flower" });

      flowersTotal += flower.price;

      pricedItems.push({
        slotIndex: item.slotIndex,
        flowerId: flower._id,
        flowerName: flower.name,
        unitPrice: flower.price
      });
    }

    /* ================= WRAP ================= */

    let wrapData = null;
    let wrapPrice = 0;

    if (wrapId) {
      const wrap = await Wrap.findById(wrapId);
      if (!wrap)
        return res.status(400).json({ ok: false, message: "Invalid wrap" });

      wrapPrice = wrap.price;
      wrapData = {
        wrapId: wrap._id,
        name: wrap.name,
        price: wrap.price
      };
    }

    /* ================= RIBBON ================= */

    let ribbonData = null;
    let ribbonPrice = 0;

    if (ribbonId) {
      const ribbon = await Ribbon.findById(ribbonId);
      if (!ribbon)
        return res.status(400).json({ ok: false, message: "Invalid ribbon" });

      ribbonPrice = ribbon.price;
      ribbonData = {
        ribbonId: ribbon._id,
        name: ribbon.name,
        price: ribbon.price
      };
    }

    const grandTotal = flowersTotal + wrapPrice + ribbonPrice;

    const bouquet = await CustomBouquet.create({
      userId,
      templateId,
      items: pricedItems,
      wrap: wrapData,
      ribbon: ribbonData,
      pricing: {
        flowersTotal,
        wrapPrice,
        ribbonPrice,
        grandTotal
      },
      snapshotUrl
    });

    res.json({ ok: true, data: bouquet });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Bouquet creation failed" });
  }
};
export const createTemplate = async (req, res) => {
  try {
    const { name, shape, size, slotCount, slots } = req.body;

    if (!name || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ ok: false, message: "Invalid payload" });
    }

    const template = await BouquetTemplate.create({
      name,
      shape,
      size,
      slotCount,
      slots,
    });

    res.json({ ok: true, data: template });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Template creation failed" });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shape, size, slotCount, slots } = req.body;

    const template = await BouquetTemplate.findById(id);
    if (!template)
      return res.status(404).json({ ok: false, message: "Template not found" });

    template.name = name;
    template.shape = shape;
    template.size = size;
    template.slotCount = slotCount;
    template.slots = slots;

    await template.save();

    res.json({ ok: true, data: template });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Template update failed" });
  }
};

//
//

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await BouquetTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ ok: false, message: "Template not found" });
    }

    await template.deleteOne();

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Template delete failed" });
  }
};
