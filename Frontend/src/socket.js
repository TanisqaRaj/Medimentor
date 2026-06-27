import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8080", {
  transports: ["websocket"],        // skip polling — Render's proxy cuts long-poll connections
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  timeout: 60000,
});

socket.on("connect", () => console.log("Socket connected:", socket.id));
socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
socket.on("connect_error", (err) => console.error("Socket error:", err.message));

// Keep-alive ping every 4 minutes to prevent Render free tier spin-down (spins down after 15 min)
setInterval(() => {
  fetch(import.meta.env.VITE_BACKEND_URL || "http://localhost:8080").catch(() => {});
}, 4 * 60 * 1000);

export default socket;
