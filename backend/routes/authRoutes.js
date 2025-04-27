import express from 'express';
import { checkTokenExpiry, registerUser } from '../controllers/authController.js';
import { registerDoctor } from '../controllers/authController.js';
import { loginAuth } from '../controllers/authController.js';
import{sendOtp,verifyOtp,updatepassword} from '../controllers/authController.js'
import { verifyToken } from '../middleware/verifyToken.js'; // Ensure the middleware is correctly imported

const router = express.Router();

// Route for user registration (public)
router.post('/register/user', registerUser);

// Route for doctor registration (public)
router.post('/register/doctor', registerDoctor);

// Route for login (public)
router.post('/login', loginAuth);

router.post('/verify-token', checkTokenExpiry);

//Route for password reset 

router.post('/send-otp', sendOtp);
router.post('/verify-opt', verifyOtp);
router.put('/update-password', updatepassword)

// Example of a protected route
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});

export default router;
