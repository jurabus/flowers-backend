import express from "express";

import {
  adminListFlowers,
  adminCreateFlower,
  adminUpdateFlower,
  adminToggleFlower,
} from "../controllers/adminFlowerController.js";

import {
  adminListWraps,
  adminCreateWrap,
  adminUpdateWrap,
  adminToggleWrap,
} from "../controllers/adminWrapController.js";

import {
  adminListRibbons,
  adminCreateRibbon,
  adminUpdateRibbon,
  adminToggleRibbon,
} from "../controllers/adminRibbonController.js";

import {
  adminListTemplates,
  adminCreateTemplate,
  adminUpdateTemplate,
  adminDeleteTemplate,
} from "../controllers/adminBouquetTemplateController.js";

const router = express.Router();

/* FLOWERS */
router.get("/flowers", adminListFlowers);
router.post("/flowers", adminCreateFlower);
router.put("/flowers/:id", adminUpdateFlower);
router.put("/flowers/:id/toggle", adminToggleFlower);

/* WRAPS */
router.get("/wraps", adminListWraps);
router.post("/wraps", adminCreateWrap);
router.put("/wraps/:id", adminUpdateWrap);
router.put("/wraps/:id/toggle", adminToggleWrap);

/* RIBBONS */
router.get("/ribbons", adminListRibbons);
router.post("/ribbons", adminCreateRibbon);
router.put("/ribbons/:id", adminUpdateRibbon);
router.put("/ribbons/:id/toggle", adminToggleRibbon);

/* BOUQUET TEMPLATES */
router.get("/bouquet-templates", adminListTemplates);
router.post("/bouquet-templates", adminCreateTemplate);
router.put("/bouquet-templates/:id", adminUpdateTemplate);
router.delete("/bouquet-templates/:id", adminDeleteTemplate);

export default router;
