import mongoose from "mongoose";

const BouquetTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    imageUrl: String,
    price: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("BouquetTemplate", BouquetTemplateSchema);
