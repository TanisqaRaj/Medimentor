import Appointment from "../models/Appointment.js";
import Contract from "../models/Contract.js";
import Doctor from "../models/Doctor.js";
import User from "../models/user.js";

// Helper function to find doctor and user by their IDs
const findDoctorAndUser = async (doctorId, userId) => {
    const doctor = await Doctor.findById(doctorId);
    const user = await User.findById(userId);
    return { doctor, user };
};

// Helper function to get total number of appointments in the database
const getTotalAppointmentsCount = async () => {
    return await Appointment.countDocuments();
};

// Create a new appointment

export const createAppointment = async (req, res) => {
    try {
        const {
            patientName,
            patientContact,
            gender,
            age,
            title,
            desc,
            expectedDate,
            patientAddress,
            disease,
            mode,
            doctorId,
            userId,
            email
        } = req.body;

        const { doctor, user } = await findDoctorAndUser(doctorId, userId);

        if (!doctor || !user) {
            return res.status(404).json({ message: "Doctor or User not found", success: false });
        }

        const newAppointment = new Appointment({
            patientName,
            patientContact,
            gender,
            age,
            title,
            desc,
            expectedDate,
            patientAddress,
            disease,
            mode,
            doctorID: doctor._id,
            patientID: user._id,
            patientEmail: email
        });

        await newAppointment.generateAppointmentID();
        await newAppointment.save();

        res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment, success: true });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ message: "Server Error: " + error.message, success: false });
    }
};

//see current user appointment and  all the  details of doctor
export const getUserAppointments = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }


        console.log("Fetching all appointments for user:", userId);

        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 5);  // +5 hours for IST
        currentDate.setMinutes(currentDate.getMinutes() + 30); // +30 minutes for IST
        currentDate.setUTCHours(0, 0, 0, 0);

        // Fetch all appointments for the given user and populate doctor details
        const appointments = await Appointment.find({ patientID: userId,
            expectedDate:{ $gte:currentDate}
         })
            .populate({
                path: "doctorID",
                select: "name email phone department experience bio profession gender username"
            })
            .populate({
                path: "appointmentID",
                select: "patientName patientEmail patientContact gender age  title desc mode state expectedDate patientAddress"
            })
            .select('-__v')
            .lean();

        if (!appointments.length) {
            return res.status(404).json({ success: false, message: "No appointments found for this user" });
        }

        // Prepare structured response
        const response = {
            success: true,
            totalAppointments: appointments.length,
            appointments: appointments.map((appointment) => ({
                appointmentID: appointment._id, // MongoDB Appointment ID
                customAppointmentID: appointment.appointmentID, // Custom generated Appointment ID
                patientID: appointment.patientID._id, // User (Patient) ID
                doctorID: appointment.doctorID._id, // Doctor ID
                status: appointment.state,
                appointment: {
                    title: appointment.title,
                    description: appointment.desc,
                    date: appointment.expectedDate,
                    mode: appointment.mode
                },
                patient: {
                    name: appointment.patientName,
                    email: appointment.patientEmail,
                    phone: appointment.patientContact,
                    gender: appointment.gender,
                    age: appointment.age,
                    address: appointment.patientID.patientAddress,
                    disease: appointment.disease
                },
                doctor: {
                    name: appointment.doctorID.name,
                    email: appointment.doctorID.email,
                    phone: appointment.doctorID.phone,
                    profession: appointment.doctorID.profession,
                    department: appointment.doctorID.department,
                    experience: appointment.doctorID.experience,
                    bio: appointment.doctorID.bio,
                    gender: appointment.doctorID.gender,
                    username: appointment.doctorID.username
                }
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Error fetching user-based appointments:", error.message);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

//get appointment history

export const getAppointmentHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const currentDate = new Date().setUTCHours(0, 0, 0, 0);

        const appointments = await Appointment.find({
            patientID: userId, // Correct field from schema
            expectedDate: { $lt: currentDate } // Fetch only past appointments
        })
            .populate({
                path: "doctorID",
                select: "name email phone department experience bio"
            })
            .populate({
                path: "appointmentID",
                select: "patientName patientEmail patientContact gender age  title desc mode state expectedDate patientAddress"
            })
            .select('-__v') // Remove unnecessary fields
            .lean(); // Optimize query performance

        if (!appointments.length) {
            return res.status(404).json({ success: false, message: "No past appointments found for this user" });
        }

        // Prepare structured response
        const response = {
            success: true,
            totalAppointments: appointments.length,
            appointments: appointments.map((appointment) => ({
                appointmentID: appointment._id, // MongoDB Appointment ID
                customAppointmentID: appointment.appointmentID, // Custom generated Appointment ID
                patientID: appointment.patientID._id, // User (Patient) ID
                doctorID: appointment.doctorID._id, // Doctor ID
                status: appointment.state,
                appointment: {
                    title: appointment.title,
                    description: appointment.desc,
                    date: appointment.expectedDate,
                    mode: appointment.mode
                },
                patient: {
                    name: appointment.patientName,
                    email: appointment.patientEmail,
                    phone: appointment.patientContact,
                    gender: appointment.gender,
                    age: appointment.age,
                    address: appointment.patientID.patientAddress,
                    disease: appointment.disease
                },
                doctor: {
                    name: appointment.doctorID.name,
                    email: appointment.doctorID.email,
                    phone: appointment.doctorID.phone,
                    profession: appointment.doctorID.profession,
                    department: appointment.doctorID.department,
                    experience: appointment.doctorID.experience,
                    bio: appointment.doctorID.bio,
                    gender: appointment.doctorID.gender,
                    username: appointment.doctorID.username
                }
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Error fetching appointment history:", error.message);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

// Fetch all appointments in the database
export const getAllAppointments = async (req, res) => {
    try {
        const totalAppointmentsCount = await getTotalAppointmentsCount(); // Get total count of appointments

        const appointments = await Appointment.find()
            .populate({
                path: "doctorID",
                select: "name email phone department experience bio profession gender username"
            })
            .populate({
                path: "patientID",
                select: "name email phone gender age patientAddress"
            })
            .select('-__v')
            .lean();

        if (!appointments.length) {
            return res.status(404).json({ success: false, message: "No appointments found" });
        }

        // Prepare structured response
        const response = {
            success: true,
            totalAppointments: appointments.length,
            totalAppointmentsCount, // Include total count in the response
            appointments: appointments.map((appointment) => ({
                appointmentID: appointment._id, // MongoDB Appointment ID
                customAppointmentID: appointment.appointmentID, // Custom generated Appointment ID
                patientID: appointment.patientID._id, // User (Patient) ID
                doctorID: appointment.doctorID._id, // Doctor ID
                status: appointment.state,
                appointment: {
                    title: appointment.title,
                    description: appointment.desc,
                    date: appointment.expectedDate,
                    mode: appointment.mode
                },
                patient: {
                    name: appointment.patientName,
                    email: appointment.patientEmail,
                    phone: appointment.patientContact,
                    gender: appointment.gender,
                    age: appointment.age,
                    address: appointment.patientID.patientAddress,
                    disease: appointment.disease
                },
                doctor: {
                    name: appointment.doctorID.name,
                    email: appointment.doctorID.email,
                    phone: appointment.doctorID.phone,
                    profession: appointment.doctorID.profession,
                    department: appointment.doctorID.department,
                    experience: appointment.doctorID.experience,
                    bio: appointment.doctorID.bio,
                    gender: appointment.doctorID.gender,
                    username: appointment.doctorID.username
                }
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Error fetching all appointments:", error.message);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

//*********************************  Doctor Dash appointment list *************************************************************************************/

export const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required" });
        }

        console.log("Fetching all appointments for doctor:", doctorId);

        // Fetch doctor's appointments
        const appointments = await Appointment.find({ doctorID: doctorId })
            .populate({
                path: "patientID",
                select: "name email phone gender age patientAddress"
            })
            .select('-__v')
            .lean();

        if (!appointments.length) {
            return res.status(404).json({ success: false, message: "No appointments found for this doctor" });
        }

        // Separate pending and approved appointments
        const pendingAppointments = appointments.filter(appointment => appointment.state === "pending");
        const approvedAppointments = appointments.filter(appointment => appointment.state === "approved");

        // Structured Response
        const response = {
            success: true,
            totalAppointments: appointments.length,
            pendingAppointments: pendingAppointments.map(appointment => ({
                appointmentID: appointment._id,
                patientID: appointment.patientID._id,
                status: appointment.state,
                appointment: {
                    title: appointment.title,
                    description: appointment.desc,
                    date: appointment.expectedDate,
                    mode: appointment.mode,
                },
                patient: {
                    name: appointment.patientName,
                    email: appointment.patientEmail,
                    phone: appointment.patientContact,
                    gender: appointment.gender,
                    age: appointment.age,
                    address: appointment.patientAddress,
                    disease: appointment.disease
                }
            })),
            approvedAppointments: approvedAppointments.map(appointment => ({
                appointmentID: appointment._id,
                patientID: appointment.patientID._id,
                status: appointment.state,
                appointment: {
                    appointmentID: appointment.appointmentID,
                    title: appointment.title,
                    description: appointment.desc,
                    date: appointment.expectedDate,
                    mode: appointment.mode,

                },
                patient: {
                    name: appointment.patientName,
                    email: appointment.patientEmail,
                    phone: appointment.patientContact,
                    gender: appointment.gender,
                    age: appointment.age,
                    address: appointment.patientAddress,
                    disease: appointment.disease
                }
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Error fetching doctor-based appointments:", error.message);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

export const getAppointmentStats = async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ state: "pending" });
        const completedAppointments = await Appointment.countDocuments({ state: "completed" });

        res.status(200).json({
            success: true,
            totalAppointments,
            pendingAppointments,
            completedAppointments,
        });
    } catch (error) {
        console.error("❌ Error fetching appointment stats:", error.message);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

export const appointmentpasswordverify = async (req, res) => {
    try {
        const { meetingPassword, appointmentID } = req.body;

        if (!meetingPassword || !appointmentID) {
            return res.status(400).json({ success: false, message: "Meeting password and appointment ID are required" });
        }

        // Step 1: Find appointment using the appointmentID string
        const appointment = await Appointment.findOne({ appointmentID });
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Step 2: Use appointment._id to find the matching contract
        const contract = await Contract.findOne({
            appointmentId: appointment._id,
            "meetingDetails.meetingPassword": meetingPassword
        });

        if (!contract) {
            return res.status(404).json({ success: false, message: "Invalid meeting password or appointment ID" });
        }

        return res.status(200).json({
            success: true,
            message: "Meeting password verified successfully",
            meetingUrl: contract.meetingDetails.meetingUrl,
        });
    } catch (error) {
        console.error("❌ Error verifying meeting password:", error.message);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};
