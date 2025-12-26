import mongoose from "mongoose";

const FlowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  active: { type: Boolean, default: true }
});

export default mongoose.model("Flower", FlowerSchema);
