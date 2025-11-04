// routes/orderRoutes.js
import express from "express";
import {
  createOrder, listOrders, getOrder, updateOrderStatus, cancelOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", listOrders);              // ?userId=&status=
router.get("/:id", getOrder);
router.post("/", createOrder);

// Admin change status
router.put("/:id/status", updateOrderStatus);

// User cancel (only pending)
router.post("/:id/cancel", cancelOrder);

export default router;
