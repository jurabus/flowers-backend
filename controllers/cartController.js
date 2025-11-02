import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// 🟢 Get user cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    return res.json({ items: cart?.items || [] });
  } catch (err) {
    console.error("getCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Add or update an item
export const addToCart = async (req, res) => {
  try {
    const { userId, item } = req.body;
    if (!userId || !item) return res.status(400).json({ message: "userId and item required" });

    const cart = await Cart.findOne({ userId }) || new Cart({ userId, items: [] });

    // check if already exists
    const existing = cart.items.find(
      (it) => it.name === item.name && it.size === item.size && it.color === item.color
    );

    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      cart.items.push(item);
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error("addToCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Update quantity
export const updateQty = async (req, res) => {
  try {
    const { userId, productName, size, color, qty } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (it) => it.name === productName && it.size === size && it.color === color
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (qty <= 0) {
      cart.items = cart.items.filter((it) => it !== item);
    } else {
      item.qty = qty;
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error("updateQty:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Clear cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
