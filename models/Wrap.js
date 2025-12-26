import mongoose from "mongoose";

const WrapSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  price: Number,
  active: { type: Boolean, default: true }
});

export default mongoose.model("Wrap", WrapSchema);
