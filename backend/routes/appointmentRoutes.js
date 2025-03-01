import express from 'express';
import {
    createAppointment,
    // getCurrentAppointments,
    getAppointmentHistory,
    getUserAppointments
    // getAppointmentById,
   
    //deleteAppointment
} from '../controllers/appointmentControl.js';

const appointmentRoute = express.Router();

// 🗓️ Create a new appointment (as-is)
appointmentRoute.post('/create', createAppointment);

// 🌱 Get current and future appointments
appointmentRoute.get('/current/:userId', getUserAppointments);

// 📜 Get appointment history (past appointments)
appointmentRoute.get('/history/:userId', getAppointmentHistory);

// 🔎 Get appointment details by ID
// appointmentRoute.get('/seedetails/:appointmentId', getAppointmentById);

// ❌ Delete appointment
//appointmentRoute.delete('/delete/:appointmentId', deleteAppointment);

export default appointmentRoute;
