import mongoose from "mongoose";

// Keep these aligned with your frontend dropdowns
export const CATEGORY_ENUM = ["Jackets", "Tops", "Bottoms", "Jeans", "Dresses"];
export const COLOR_ENUM    = ["Red", "Black", "Orange", "Beige", "White"];

const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true, enum: COLOR_ENUM, trim: true },
    size:  { type: String, required: true, trim: true }, // e.g. "XS","S","M","L","XL","XXL","OneSize"
    qty:   { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, index: true },
    price:    { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: CATEGORY_ENUM, index: true },
    images:   [String],
    featured: { type: Boolean, default: false },

    // Inventory at variant level
    variants: { type: [variantSchema], default: [] },
  },
  { timestamps: true }
);

// Virtual: total stock
productSchema.virtual("totalQty").get(function () {
  return (this.variants || []).reduce((sum, v) => sum + Number(v.qty || 0), 0);
});

productSchema.set("toJSON",  { virtuals: true });
productSchema.set("toObject",{ virtuals: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
