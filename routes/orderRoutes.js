import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  updateOrderAddress,
} from "../controllers/orderController.js";

const router = express.Router();

// ✅ Create new order
router.post("/", createOrder);

// ✅ Get orders by user ID
router.get("/user/:userId", getOrdersByUser);

// ✅ Get single order
router.get("/:id", getOrderById);

// ✅ Update order status (Admin)
router.put("/:id/status", updateOrderStatus);

// ✅ Update address (User)
router.put("/:id/address", updateOrderAddress);

// ✅ Get all orders (Admin)
router.get("/all", getAllOrders);

export default router;
