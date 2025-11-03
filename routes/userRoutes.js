import express from 'express';

import { login, registerAdmin, getProfile, updateUser, changePassword, signup, sendOtp, verifyOtp} from '../controllers/userController.js';

const router = express.Router();
router.post('/login', login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post('/register-admin', registerAdmin); // one-time bootstrap
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateUser);
router.post("/change-password", changePassword);

export default router;
