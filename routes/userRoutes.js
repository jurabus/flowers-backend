import express from 'express';
import { protect } from '../middleware/auth.js';
import { login, registerAdmin, getProfile, updateProfile, changePassword } from '../controllers/userController.js';

const router = express.Router();
router.post('/login', login);
router.post('/register-admin', registerAdmin); // one-time bootstrap
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
