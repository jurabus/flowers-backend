import express from "express";
import Wrap from "../models/Wrap.js";
import Ribbon from "../models/Ribbon.js";

const router = express.Router();

/* PUBLIC WRAPS */
router.get("/wraps", async (_, res) => {
  const wraps = await Wrap.find({ active: true });
  res.json({ ok: true, data: wraps });
});

/* PUBLIC RIBBONS */
router.get("/ribbons", async (_, res) => {
  const ribbons = await Ribbon.find({ active: true });
  res.json({ ok: true, data: ribbons });
});

export default router;
