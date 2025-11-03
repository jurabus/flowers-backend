import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // expires after 5 min
});

export const OtpCode = mongoose.model("OtpCode", otpSchema);
