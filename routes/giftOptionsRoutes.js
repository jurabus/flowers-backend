import express from "express";
import { listWraps, listRibbons } from "../controllers/giftOptionsController.js";

const router = express.Router();

router.get("/wraps", listWraps);
router.get("/ribbons", listRibbons);

export default router;
