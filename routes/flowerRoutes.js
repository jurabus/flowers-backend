import express from "express";
import { listFlowers } from "../controllers/flowerController.js";

const router = express.Router();

router.get("/", listFlowers);

export default router;
