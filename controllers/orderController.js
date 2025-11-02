import Order from "../models/Order.js";
import Cart from "../models/Cart.js"; // ✅ Import Cart model to clear it after order

// ✅ Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      phone,
      address,
      paymentMethod = "COD",
      items = [],
    } = req.body;

   if (!userId || !phone || !address) {
  return res.status(400).json({ message: "Missing required fields" });
}

    const normalized = items.map((it) => ({
      name: String(it.name || ""),
      price: Number(it.price || 0),
      qty: Number(it.qty || 1),
      size: String(it.size || ""),
      color: String(it.color || ""),
      imageUrl: String(it.imageUrl || ""),
    }));

    const subtotal = normalized.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.qty),
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

    // ✅ Clear user's backend cart after successful order
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ items: orders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// ✅ Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
};

// ✅ Get orders by userId
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ items: orders });
  } catch (err) {
    console.error("getOrdersByUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Error updating order status" });
  }
};

// ✅ Update order address (user)
export const updateOrderAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { address } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { address },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Error updating address" });
  }
};
