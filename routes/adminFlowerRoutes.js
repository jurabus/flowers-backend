import express from "express";
import {
  adminListFlowers,
  adminCreateFlower,
  adminUpdateFlower,
  adminToggleFlower,
} from "../controllers/adminFlowerController.js";

const router = express.Router();

router.get("/", adminListFlowers);
router.post("/", adminCreateFlower);
router.put("/:id", adminUpdateFlower);
router.patch("/:id/toggle", adminToggleFlower);

export default router;
