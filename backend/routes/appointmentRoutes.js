import express from 'express';
import {
    createAppointment,
    getAppointmentHistory,
    getUserAppointments,
    getDoctorAppointments,
    getAllAppointments,
    getAppointmentStats,
    appointmentpasswordverify,
    getAppointmentLocation,
    cancelAppointment
} from '../controllers/appointmentControl.js';
import { verifyToken } from '../middleware/verifyToken.js';

const appointmentRoute = express.Router();

appointmentRoute.post('/create', verifyToken, createAppointment);
appointmentRoute.get('/current/:userId', verifyToken, getUserAppointments);
appointmentRoute.get('/history/:userId', verifyToken, getAppointmentHistory);
appointmentRoute.get('/docapp/:doctorId', verifyToken, getDoctorAppointments);
appointmentRoute.get('/all', verifyToken, getAllAppointments);
appointmentRoute.get('/stats', verifyToken, getAppointmentStats);
appointmentRoute.post('/veify', verifyToken, appointmentpasswordverify);
appointmentRoute.get('/:appointmentId/location', verifyToken, getAppointmentLocation);
appointmentRoute.delete('/:id', verifyToken, cancelAppointment);

export default appointmentRoute;
