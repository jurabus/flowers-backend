import mongoose from "mongoose";

// ✅ Categories (expand anytime)
export const CATEGORY_ENUM = [
  "Jackets",
  "Tops",
  "Bottoms",
  "Jeans",
  "Dresses",
  "Shoes",
  "Accessories",
];

// ✅ Full color palette (matches Flutter predefinedColors)
export const COLOR_ENUM = [
  "Black",
  "White",
  "Beige",
  "Cream",
  "Brown",
  "Red",
  "Pink",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Grey",
  "Navy",
  "Gold",
  "Silver",
];

// ========================= VARIANT SCHEMA =========================
const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      enum: COLOR_ENUM,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    }, // e.g. XS, S, M, L, XL, XXL, OneSize
    qty: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// ========================= PRODUCT SCHEMA =========================
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: CATEGORY_ENUM,
      index: true,
      trim: true,
    },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },

    // Inventory
    variants: { type: [variantSchema], default: [] },
  },
  { timestamps: true }
);

// ========================= VIRTUALS =========================
productSchema.virtual("totalQty").get(function () {
  return (this.variants || []).reduce(
    (sum, v) => sum + Number(v.qty || 0),
    0
  );
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// ========================= EXPORT =========================
const Product = mongoose.model("Product", productSchema);
export default Product;
