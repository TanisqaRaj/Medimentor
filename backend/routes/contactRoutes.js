// routes/contactRoutes.js
import express from 'express';
import { sendContactEmail } from '../controllers/contactController.js'; 

const router = express.Router();

// POST endpoint to send email
router.post('/send', sendContactEmail);

export default router;
