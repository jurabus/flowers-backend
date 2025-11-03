// routes/uploadRoutes.js
import express from "express";
import { uploadImage, deleteByUrl } from "../controllers/uploadController.js";

const router = express.Router();

// ✅ We no longer need multer middleware here — handled inside uploadImage
router.post("/", uploadImage);
router.delete("/", deleteByUrl);

export default router;
