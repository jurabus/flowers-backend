import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: "" },
    size: { type: String, default: "" },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
