import express from "express";
import {
  listTemplates,
  createCustomBouquet,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/customBouquetController.js";

const router = express.Router();

router.get("/templates", listTemplates);
router.post("/create", createCustomBouquet);
router.post("/templates", createTemplate);
router.put("/templates/:id", updateTemplate);
router.delete("/templates/:id", deleteTemplate);

export default router;
