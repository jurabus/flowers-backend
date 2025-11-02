import express from "express";
import { getCart, addToCart, updateQty, clearCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/", addToCart);
router.put("/qty", updateQty);
router.delete("/:userId", clearCart);

export default router;
