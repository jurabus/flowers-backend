import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

/**
 * POST /api/orders
 * Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    const { userId, phone, address, paymentMethod = "COD", items = [] } = req.body;
    if (!userId || !phone || !address || !items.length)
      return res.status(400).json({ message: "Missing required fields" });

    const normalized = items.map((it) => ({
      name: String(it.name || ""),
      price: Number(it.price || 0),
      qty: Number(it.qty || 1),
      size: String(it.size || ""),
      color: String(it.color || ""),
      imageUrl: String(it.imageUrl || ""),
    }));

    const subtotal = normalized.reduce(
      (sum, it) => sum + it.price * it.qty,
      0
    );
    const shipping = 0;
    const total = subtotal + shipping;

    const order = await Order.create({
      userId,
      phone,
      address,
      paymentMethod,
      items: normalized,
      subtotal,
      shipping,
      total,
    });

    // Optionally clear user cart
    await Cart.findOneAndDelete({ userId });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/orders
 * Get all orders or filtered by userId
 */
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ items: orders });
  } catch (err) {
    console.error("getOrders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/orders/:id
 * Get order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json(order);
  } catch (err) {
    console.error("getOrderById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/orders/:id/status
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/orders/:id/address
 * Update order delivery address
 */
export const updateOrderAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { address },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("updateOrderAddress error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
