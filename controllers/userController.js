import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OtpCode } from "../models/OtpCode.js";
// ✅ Load JWT secret from environment (use Render’s env vars)
const JWT_SECRET = process.env.JWT_SECRET || "elvastore_secret_fallback";
// Temporary OTP store { phone: { lastSent, expiresAt } }
const otpMeta = new Map();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ Generate and send OTP
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone required" });

    const now = Date.now();
    const meta = otpMeta.get(phone);

    // Cooldown: 60s between OTPs
    if (meta && now - meta.lastSent < 60 * 1000) {
      const wait = Math.ceil((60 * 1000 - (now - meta.lastSent)) / 1000);
      return res.status(429).json({
        message: `Please wait ${wait}s before requesting another code.`,
      });
    }

    // Send via Twilio Verify
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phone, channel: "sms" });

    otpMeta.set(phone, {
      lastSent: now,
      expiresAt: now + 5 * 60 * 1000, // 5 minutes
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ===================================
// ✅ CHANGE PASSWORD (requires phone + old + new + OTP)
// ===================================
export const changePassword = async (req, res) => {
  try {
    const { phone, oldPassword, newPassword, code } = req.body;
    if (!phone || !oldPassword || !newPassword || !code)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const meta = otpMeta.get(phone);
    if (!meta)
      return res.status(400).json({ message: "No OTP requested for this phone" });

    if (Date.now() > meta.expiresAt) {
      otpMeta.delete(phone);
      return res.status(400).json({ message: "OTP expired, request a new one" });
    }

    // Verify via Twilio
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code });

    if (verification.status !== "approved")
      return res.status(400).json({ message: "Invalid OTP" });

    // Check old password
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid)
      return res.status(401).json({ message: "Incorrect old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    otpMeta.delete(phone); // ✅ cleanup after success
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, code } = req.body;
    const record = await OtpCode.findOne({ phone, code });
    if (!record)
      return res.status(400).json({ success: false, message: "Invalid or expired code" });

    await OtpCode.deleteMany({ phone }); // cleanup used codes
    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Signup after verification
export const signup = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ phone, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({ success: true, userId: user._id, token });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.json({ success: true, userId: user._id, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reset password (after OTP verified)
export const resetPassword = async (req, res) => {
  try {
    const { phone, code, newPassword } = req.body;
    const otp = await OtpCode.findOne({ phone, code });
    if (!otp) return res.status(400).json({ message: "Invalid or expired code" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ phone }, { password: hashed });
    await OtpCode.deleteMany({ phone });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, password } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: "Profile updated", user });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * POST /api/users/signup
 * Register a new user with phone
