import express from "express";
import {
  adminListFlowers,
  adminCreateFlower,
  adminUpdateFlower,
  adminToggleFlower,
} from "../controllers/adminFlowerController.js";
import { adminGuard } from "../middlewares/adminGuard.js";

const router = express.Router();

router.get("/", adminGuard, adminListFlowers);
router.post("/", adminGuard, adminCreateFlower);
router.put("/:id", adminGuard, adminUpdateFlower);
router.patch("/:id/toggle", adminGuard, adminToggleFlower);

export default router;
