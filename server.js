import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import budgetFriendlyRoutes from "./routes/budgetFriendlyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import customBouquetRoutes from "./routes/customBouquetRoutes.js";
import giftOptionsRoutes from "./routes/giftOptionsRoutes.js";
import flowerRoutes from "./routes/flowerRoutes.js";
import adminFlowerRoutes from "./routes/adminFlowerRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARES =================
app.set("trust proxy", 1); // ✅ Needed for HTTPS cookies on Render/Firebase hosting
app.use(cookieParser());
app.use(express.json({ limit: "25mb" })); // allow JSON payloads for presigned uploads
app.use(compression()); // ✅ reduces payload size (esp. for image lists)

// ✅ CORS setup for Flutter Web (supports both dev & prod)
// ================= CORS (Flutter Web + Local Dev) =================
const allowedOrigins = [
  "https://flowers-c3633.web.app",
  "https://flowers.firebaseapp.com",
  "https://flowers.yourdomain.com", // optional custom domain later
  /http:\/\/localhost(:\d+)?$/,
  /http:\/\/127\.0\.0\.1(:\d+)?$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server / curl
      const allowed = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin
      );
      callback(allowed ? null : new Error("Not allowed by CORS"), allowed);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());





// ================= DATABASE CONNECTION =================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ================= ROUTES =================
app.get("/", (req, res) => res.send("Flowers API Running 🚀"));

app.use("/api/custom-bouquets", customBouquetRoutes);
app.use("/api/gift-options", giftOptionsRoutes);
app.use("/api/flowers", flowerRoutes);
app.use("/api/admin/flowers", adminFlowerRoutes);

app.use("/api/budget-friendly", budgetFriendlyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
