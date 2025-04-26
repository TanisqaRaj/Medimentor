import express from "express";
import connectDB from "./db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoute from "./routes/appointmentRoutes.js";
import doctorRoute from "./routes/doctorRoutes.js";
import { Server } from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import Appointment from "./models/Appointment.js";
import Contract from "./models/Contract.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the main server!");
});

app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoute);
app.use("/doctors", doctorRoute);

// 📧 Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Contact Form Route
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Form Submission from ${name}`,
    text: `You have received a new message from ${name} (${email}):\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(`Error sending message: ${error.message}`);
    }
    console.log("Email sent successfully:", info.response);
    res.status(200).send("Message sent successfully!");
  });
});

// Test Email Route
app.get("/test-email", (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Test email",
    text: "This is a test email.",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending test email:", error);
      return res.status(500).send("Error sending test email.");
    }
    console.log("Test email sent successfully:", info.response);
    res.status(200).send("Test email sent successfully!");
  });
});

// 🔌 Socket.io: Update Appointment Status
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("updateAppointmentStatus", async (data, callback) => {
    const {
      appointmentId,
      meetingPassword,
      meetingUrl,
      location,
      appointmentState,
    } = data;

    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: "doctorID",
        select:
          "name email phone department experience bio profession gender username",
      })
      .populate({
        path: "appointmentID",
        select:
          "patientName patientEmail patientContact gender age title desc mode state expectedDate patientAddress",
      })
      .select("-__v");

    if (!appointment) {
      return await callback({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentState === "approved") {
      let existingContract = await Contract.findOne({
        appointmentId: appointment._id,
      });


      if (existingContract) {
        return await callback({
          success: false,
          message: "Contract already exists for this appointment",
        });
      }

      const contract = new Contract({
        appointmentId: appointment._id,
        meetingDetails: {
          meetingPassword: meetingPassword,
          meetingUrl: appointment.mode === "online" ? meetingUrl : null,
          location: appointment.mode === "offline" ? location : null,
        },
      });
      await contract.save();
    }

    appointment.state = appointmentState;
    await appointment.save();

    // ✅ Immediate Socket Response
    await callback({ success: true, message: "Appointment status updated" });

    // 📧 Async Email to Patient
    if (
      appointmentState === "approved" ||
      appointmentState === "rejected"
    ) {
      const patientEmail = appointment.patientEmail;
      const patientName = appointment.patientName;
      const doctorName = appointment.doctorID.name;
      const appointmentDate = new Date(
        appointment.expectedDate
      ).toLocaleString();
      const appointmentMode =
        appointment.mode === "online" ? "Online" : "Offline";

      let mailOptions;

      if (appointmentState === "approved") {
        mailOptions = {
          from: process.env.EMAIL_USER,
          to: patientEmail,
          subject: `Appointment Approved - Dr. ${doctorName}`,
          text: `Hello ${patientName},\n\nYour appointment with Dr. ${doctorName} has been approved.\n\n📅 Date: ${appointmentDate}\n📍 Mode: ${appointmentMode}\n 🔗Url for meeting : ${meetingUrl}\n🔑 password: ${meetingPassword}\nThank you for using our platform.\n\n- Medi Mentor Team`,
        };
      } else {
        mailOptions = {
          from: process.env.EMAIL_USER,
          to: patientEmail,
          subject: `Appointment Rejected - Dr. ${doctorName}`,
          text: `Hello ${patientName},\n\nWe regret to inform you that your appointment with Dr. ${doctorName} scheduled on ${appointmentDate} has been rejected.\n\nPlease try rescheduling or contact support if you believe this was a mistake.\n\n- Medi Mentor Team`,
        };
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(
            `Error sending ${appointmentState} email to patient:`,
            error
          );
        } else {
          console.log(
            `${appointmentState.charAt(0).toUpperCase() + appointmentState.slice(1)} email sent to patient:`,
            info.response
          );
        }
      });
    }
    // Generate dynamic event name
    const dynamicEventName = `updateAppointmentStatus/${appointment?.patientID}`;
   
    // Emit the dynamically created event to clients
    io.emit(dynamicEventName, {
      appointmentState,
      appointmentId,
      appointment: {
        appointmentID: appointment._id,
        customAppointmentID: appointment.appointmentID,
        patientID: appointment.patientID._id,
        doctorID: appointment.doctorID._id,
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
          address: appointment.patientID.patientAddress,
          disease: appointment.disease,
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
          username: appointment.doctorID.username,
        },
      },
    });

    await callback({ success: true, message: "Appointment status updated" });
  });

   // socket disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Main server running on port ${PORT}`);
});
