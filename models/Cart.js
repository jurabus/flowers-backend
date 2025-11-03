import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 },
  size: String,
  color: String,
  imageUrl: String,
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    items: [cartItemSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
