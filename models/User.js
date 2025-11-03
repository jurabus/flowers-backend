import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "New User" },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false }, // for future SMS OTP logic
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
