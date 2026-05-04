import express from "express";
import { getMetrics } from "../utils/metrics.js";
import { verifyToken } from "../middleware/verifyToken.js";

const monitorRoute = express.Router();

// Admin-only middleware — verifyToken + role check
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

// GET /monitor/health — public health check (for uptime monitors like UptimeRobot)
monitorRoute.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /monitor/stats — full metrics (admin only)
monitorRoute.get("/stats", verifyToken, adminOnly, (req, res) => {
  res.status(200).json({ success: true, metrics: getMetrics() });
});

export default monitorRoute;
