import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/**
 * GET /api/cart/:userId
 * Fetch cart by userId
 */
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    return res.status(200).json(cart || { userId, items: [] });
  } catch (err) {
    console.error("getCart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/cart
 * Add or update a product in the cart
 * body: { userId, item }
 */
export const addToCart = async (req, res) => {
  try {
    const { userId, item } = req.body;
    if (!userId || !item?.name)
      return res.status(400).json({ message: "userId and item required" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existing = cart.items.find(
      (i) =>
        i.name === item.name &&
        i.size === item.size &&
        i.color === item.color
    );

    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({
        name: item.name,
        price: item.price || 0,
        qty: item.qty || 1,
        size: item.size || "",
        color: item.color || "",
        imageUrl: item.imageUrl || "",
      });
    }

    await cart.save();
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("addToCart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/cart/qty
 * Update quantity of an item in cart
 */
export const updateQty = async (req, res) => {
  try {
    const { userId, productName, size, color, qty } = req.body;
    if (!userId || !productName)
      return res.status(400).json({ message: "Invalid data" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.name === productName && i.size === size && i.color === color
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (qty <= 0) {
      cart.items = cart.items.filter(
        (i) => !(i.name === productName && i.size === size && i.color === color)
      );
    } else {
      item.qty = qty;
    }

    await cart.save();
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("updateQty error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/cart/:userId
 * Clear the user's cart
 */
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndDelete({ userId });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("clearCart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
