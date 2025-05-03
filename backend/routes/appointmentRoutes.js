import express from 'express';
import {
    createAppointment,
    // getCurrentAppointments,
    getAppointmentHistory,
    getUserAppointments,
    getDoctorAppointments,
    getAllAppointments,
    getAppointmentStats,
    appointmentpasswordverify
   
    //deleteAppointment
} from '../controllers/appointmentControl.js';

const appointmentRoute = express.Router();

// 🗓️ Create a new appointment (as-is)
appointmentRoute.post('/create', createAppointment);

// 🌱 Get current and future appointments
appointmentRoute.get('/current/:userId', getUserAppointments);

// 📜 Get appointment history (past appointments)
appointmentRoute.get('/history/:userId', getAppointmentHistory);



// ❌ Delete appointment
//appointmentRoute.delete('/delete/:appointmentId', deleteAppointment);

//**************************************************************************************************** */

//Doctor dash appointment Routes

appointmentRoute.get('/docapp/:doctorId',getDoctorAppointments);

//***************************************************************************************************** */
//Admin Routes for appointments
appointmentRoute.get('/all',getAllAppointments);

// 📊 Get appointment statistics
appointmentRoute.get('/stats', getAppointmentStats);

//***************************************************************************************************** */

//meeting password verify

appointmentRoute.post('/veify',appointmentpasswordverify)
export default appointmentRoute;
