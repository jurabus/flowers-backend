import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },     // ✅ required per your spec
  color:    { type: String, default: '' },        // e.g. "red" or hex
  size:     { type: String, default: '' },        // e.g. "S","M","L","XL"
  price:    { type: Number, required: true },     // ✅ required
  category: { type: String, required: true },     // ✅ required (simple string for now)
  imageUrl: { type: String, default: '' },        // stored public URL from Firebase
  featured: { type: Boolean, default: false },
  active:   { type: Boolean, default: true }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
