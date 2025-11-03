import express from "express";
import {
  signup,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

// Auth
router.post("/signup", signup);
router.post("/login", login);

// Password
router.put("/change-password", changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
