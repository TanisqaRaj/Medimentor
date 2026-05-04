import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8080", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => console.log("Socket connected:", socket.id));
socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
socket.on("connect_error", (err) => console.error("Socket error:", err.message));

export default socket;
