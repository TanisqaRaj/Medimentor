import express from 'express';
import {
  checkTokenExpiry, registerUser, registerDoctor, loginAuth,
  sendOtp, verifyOtp, updatePassword, listUsers,
  refreshToken, logoutAuth, updateProfile
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/register/doctor', registerDoctor);
router.post('/login', loginAuth);
router.post('/refresh', refreshToken);
router.post('/logout', logoutAuth);
router.post('/verify-token', checkTokenExpiry);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.put('/update-password', updatePassword);
router.put('/update-profile', verifyToken, updateProfile);
router.get('/users', verifyToken, listUsers);

export default router;
