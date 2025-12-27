import mongoose from "mongoose";

const BouquetTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shape: String,
    size: String,
    slotCount: Number,
    slots: [
      {
        index: Number,
        x: Number,
        y: Number,
      },
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);


export default mongoose.model("BouquetTemplate", BouquetTemplateSchema);
