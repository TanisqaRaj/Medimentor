// Minimal Express app for pharmacy integration tests.
// Uses jest.mock to swap pgClient with the hand-rolled mock.
import express from "express";
import cookieParser from "cookie-parser";
import pharmacyRoutes from "../pharmacy/routes/index.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", pharmacyRoutes);

export default app;
