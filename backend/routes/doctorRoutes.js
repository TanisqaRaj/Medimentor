import express from 'express';
import { getDoctors, getTotalDoctors, searchdoctor, getTotalUsers } from '../controllers/getdetails.js';
import { verifyToken } from '../middleware/verifyToken.js';

const doctorRoute = express.Router();

// Public — used on landing/search page before login
doctorRoute.get('/searchdoctor', searchdoctor);
doctorRoute.get('/listdoctors', getDoctors);

// Protected — admin only
doctorRoute.get('/totaldoctors', verifyToken, getTotalDoctors);
doctorRoute.get('/totalusers', verifyToken, getTotalUsers);

export default doctorRoute;
