import express from "express";
import connectDB from "./db.js";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "mongo-sanitize";
import hpp from "hpp";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoute from "./routes/appointmentRoutes.js";
import doctorRoute from "./routes/doctorRoutes.js";
import monitorRoute from "./routes/monitorRoutes.js";
import { Server } from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mailerSystem from "./mailingconfig.js";
import Appointment from "./models/Appointment.js";
import Contract from "./models/Contract.js";
import logger from "./utils/logger.js";
import { recordRequest, recordError, recordSocketEvent, incrementConnections, decrementConnections } from "./utils/metrics.js";
import jwt from "jsonwebtoken";

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1);
const httpServer = http.createServer(app);
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGIN, methods: ["GET", "POST"] },
});

// ── Security headers ───────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // allow Cloudinary images
}));

// ── Rate limiters ──────────────────────────────────────────────────────────
// Strict limit on auth endpoints (login, register, OTP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));       // reduced from 50mb — base64 images now go to Cloudinary
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());

// ── Injection protection ───────────────────────────────────────────────────
// Strip $ and . from req.body/params/query to prevent NoSQL injection
app.use((req, res, next) => {
  req.body   = mongoSanitize(req.body);
  req.params = mongoSanitize(req.params);
  const sanitizedQuery = mongoSanitize({ ...req.query });
  Object.keys(req.query).forEach((k) => delete req.query[k]);
  Object.assign(req.query, sanitizedQuery);
  next();
});

// Prevent HTTP parameter pollution (e.g. ?role=user&role=admin)
app.use(hpp());

// Apply rate limiters
app.use("/auth", authLimiter);
app.use("/", apiLimiter);

// HTTP request logging via morgan → winston
app.use(morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } }));

// Response time + metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    recordRequest(req.method, req.path, res.statusCode, duration);
    if (res.statusCode >= 500) {
      logger.error(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
    } else if (duration > 1000) {
      logger.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  next();
});

// TURN credentials proxy — keeps Metered API key server-side
app.get("/turn-credentials", async (req, res) => {
  try {
    const response = await fetch(
      `https://${process.env.METERED_DOMAIN}/api/v1/turn/credentials?apiKey=${process.env.METERED_SECRET}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TURN credentials" });
  }
});

// Routes
app.get("/", (req, res) => res.send("Welcome to the main server!"));
app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoute);
app.use("/doctors", doctorRoute);
app.use("/monitor", monitorRoute);

// Contact Form Route (single source of truth — contactServer.js removed)
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: "All fields required" });

  mailerSystem.sendMail({
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Form Submission from ${name}`,
    text: `Message from ${name} (${email}):\n\n${message}`,
  }, (error) => {
    if (error) return res.status(500).send(`Error: ${error.message}`);
    res.status(200).send("Message sent successfully!");
  });
});

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  incrementConnections();
  logger.info("User connected:", socket.id);

  // ── Appointment Status Update ──────────────────────────────────────────────
  socket.on("updateAppointmentStatus", async (data, callback) => {
    const { appointmentId, meetingPassword, meetingUrl, location, appointmentState } = data;

    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate({ path: "doctorID", select: "name email phone department experience bio profession gender username" })
        .select("-__v");

      if (!appointment) return callback({ success: false, message: "Appointment not found" });

      if (appointmentState === "approved") {
        const existingContract = await Contract.findOne({ appointmentId: appointment._id });
        if (existingContract) return callback({ success: false, message: "Contract already exists for this appointment" });

        const contract = new Contract({
          appointmentId: appointment._id,
          meetingDetails: {
            meetingPassword,
            meetingUrl: appointment.mode === "online" ? meetingUrl : null,
            location: appointment.mode === "offline" ? location : null,
          },
        });
        await contract.save();
      }

      appointment.state = appointmentState;
      await appointment.save();

      // ✅ Single callback — called once
      callback({ success: true, message: "Appointment status updated" });
      recordSocketEvent("appointmentUpdate");
      logger.info(`Appointment ${appointmentId} → ${appointmentState}`);

      // 📧 Email notification (fire and forget after callback)
      if (appointmentState === "approved" || appointmentState === "rejected") {
        const contract = appointmentState === "approved"
          ? await Contract.findOne({ appointmentId: appointment._id })
          : null;

        let extraInfo = "";
        if (appointmentState === "approved") {
          extraInfo = appointment.mode === "online"
            ? `\n🔗 Join Meeting: ${process.env.FRONTEND_URL || "http://localhost:5173"}/call/${meetingUrl}\n🔑 Password: ${meetingPassword}`
            : `\n📍 Location: ${location?.city}, ${location?.state} - ${location?.pincode}`;
        }

        const subject = appointmentState === "approved"
          ? `Appointment Approved - Dr. ${appointment.doctorID.name}`
          : `Appointment Rejected - Dr. ${appointment.doctorID.name}`;

        const text = appointmentState === "approved"
          ? `Hello ${appointment.patientName},\n\nYour appointment with Dr. ${appointment.doctorID.name} has been approved.\n\n📅 Date: ${new Date(appointment.expectedDate).toLocaleString()}\n📍 Mode: ${appointment.mode}${extraInfo}\n\n- Medi Mentor Team`
          : `Hello ${appointment.patientName},\n\nYour appointment with Dr. ${appointment.doctorID.name} on ${new Date(appointment.expectedDate).toLocaleString()} has been rejected.\n\nPlease try rescheduling.\n\n- Medi Mentor Team`;

        mailerSystem.sendMail({ from: process.env.EMAIL_USER, to: appointment.patientEmail, subject, text }, (err) => {
          if (err) console.error("Email error:", err.message);
        });
      }

      // Notify patient in real-time
      io.emit(`updateAppointmentStatus/${appointment.patientID}`, {
        appointmentState,
        appointmentId,
        appointment: {
          appointmentID: appointment._id,
          customAppointmentID: appointment.appointmentID,
          patientID: appointment.patientID,
          doctorID: appointment.doctorID._id,
          status: appointment.state,
          appointment: { title: appointment.title, description: appointment.desc, date: appointment.expectedDate, mode: appointment.mode },
          doctor: { name: appointment.doctorID.name, email: appointment.doctorID.email, phone: appointment.doctorID.phone, profession: appointment.doctorID.profession, department: appointment.doctorID.department },
        },
      });

    } catch (err) {
      logger.error("Socket updateAppointmentStatus error:", { message: err.message, stack: err.stack });
      recordError(err.message, err.stack, { appointmentId: data?.appointmentId });
      callback({ success: false, message: "Server error" });
    }
  });

  // ── WebRTC Signaling ───────────────────────────────────────────────────────
  // join-room: verify caller belongs to this appointment, enforce max 2 peers
  socket.on("join-room", async ({ roomId, token }, callback) => {
    try {
      // 1. Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded._id;

      // 2. Find appointment by MongoDB _id (both doctor and patient use _id as roomId)
      const appointment = await Appointment.findById(roomId).catch(() => null);
      if (!appointment) {
        return callback?.({ success: false, message: "Appointment not found" });
      }

      // 3. Only the doctor or patient of this appointment may join
      const isPatient = appointment.patientID.toString() === userId;
      const isDoctor  = appointment.doctorID.toString()  === userId;
      if (!isPatient && !isDoctor) {
        return callback?.({ success: false, message: "Not authorized for this room" });
      }

      // 4. Max 2 participants
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room && room.size >= 2) {
        return callback?.({ success: false, message: "Room is full" });
      }

      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
      recordSocketEvent("videoSignal");
      logger.info(`Socket ${socket.id} (user ${userId}) joined room ${roomId}`);
      callback?.({ success: true });

    } catch (err) {
      logger.error("join-room error:", err.message);
      callback?.({ success: false, message: "Invalid token" });
    }
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", { offer, from: socket.id });
    recordSocketEvent("videoSignal");
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
    recordSocketEvent("videoSignal");
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
    recordSocketEvent("videoSignal");
  });

  socket.on("leave-room", async (roomId) => {
    socket.to(roomId).emit("user-left");
    socket.leave(roomId);
    try {
      const appointment = await Appointment.findByIdAndUpdate(roomId, { state: "completed" }, { new: true });
      if (appointment) {
        io.emit(`updateAppointmentStatus/${appointment.patientID}`, { appointmentState: "completed", appointmentId: roomId });
        io.emit(`updateAppointmentStatus/${appointment.doctorID}`, { appointmentState: "completed", appointmentId: roomId });
      }
    } catch (err) {
      logger.error("leave-room update error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    decrementConnections();
    logger.info("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => logger.info(`Server running on port ${PORT} | ENV: ${process.env.NODE_ENV || "development"}`));
