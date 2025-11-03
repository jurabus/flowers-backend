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

// ✅ Create a new order
router.post("/", createOrder);

// ✅ Get all orders (Admin)
router.get("/all", getAllOrders);

// ✅ Get orders by specific user
router.get("/user/:userId", getOrdersByUser);

// ✅ Get single order by ID
router.get("/:id", getOrderById);

// ✅ Update order status (Admin)
router.put("/:id/status", updateOrderStatus);

// ✅ Update delivery address (User)
router.put("/:id/address", updateOrderAddress);

export default router;
