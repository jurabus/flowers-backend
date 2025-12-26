import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  index: Number,
  x: Number, // normalized 0–1
  y: Number
});

const BouquetTemplateSchema = new mongoose.Schema({
  name: String,
  shape: String, // square | circle | heart
  size: String, // medium | large
  slotCount: Number,
  slots: [SlotSchema]
});

export default mongoose.model("BouquetTemplate", BouquetTemplateSchema);
