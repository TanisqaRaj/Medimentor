import { describe, it, expect, beforeAll, afterAll, afterEach } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "../setup.js";
import mongoose from "mongoose";
import Doctor from "../../models/Doctor.js";
import User from "../../models/user.js";

process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
process.env.NODE_ENV = "test";

let userToken, userId, doctorId;

beforeAll(async () => {
  await connectTestDB();

  // Create user — plain password, pre-save hook will hash it
  const user = await User.create({ name: "Patient One", email: "patient@test.com", phone: "9000000001", username: "patient01", password: "Test@1234", gender: "male", role: "user" });
  userId = user._id.toString();

  // Create doctor — plain password, pre-save hook will hash it
  const doctor = await Doctor.create({ name: "Dr One", email: "drone@test.com", phone: 9000000002, username: "drone01", password: "Test@1234", gender: "male", bio: "bio", mciNumber: "MCI-001", department: "Cardiology", experience: 5, profession: ["Cardiologist"], certificate: "dGVzdA==" });
  doctorId = doctor._id.toString();

  // Login to get token
  const res = await request(app).post("/auth/login").send({ email: "patient@test.com", password: "Test@1234", role: "user" });
  userToken = res.body.accessToken;
});

afterAll(async () => { await closeTestDB(); });

// ── Create Appointment ─────────────────────────────────────────────────────
describe("Integration: POST /appointments/create", () => {
  it("creates appointment with valid data", async () => {
    const res = await request(app)
      .post("/appointments/create")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        patientName: "Patient One",
        patientContact: "9000000001",
        gender: "male",
        age: 25,
        title: "Chest pain",
        desc: "Mild chest pain",
        expectedDate: new Date(Date.now() + 86400000).toISOString(),
        patientAddress: "123 Main St",
        mode: "online",
        doctorId,
        userId,
        email: "patient@test.com",
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.appointment).toHaveProperty("appointmentID");
  });

  it("rejects without auth token", async () => {
    const res = await request(app).post("/appointments/create").send({});
    expect(res.status).toBe(401);
  });

  it("returns 404 for non-existent doctor", async () => {
    const res = await request(app)
      .post("/appointments/create")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        patientName: "P", patientContact: "9000000001", gender: "male",
        age: 25, title: "T", desc: "D",
        expectedDate: new Date().toISOString(),
        patientAddress: "Addr", mode: "online",
        doctorId: new mongoose.Types.ObjectId().toString(),
        userId, email: "patient@test.com",
      });
    expect(res.status).toBe(404);
  });
});

// ── Get User Appointments ──────────────────────────────────────────────────
describe("Integration: GET /appointments/current/:userId", () => {
  it("returns 404 when no appointments exist", async () => {
    const res = await request(app)
      .get(`/appointments/current/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });

  it("returns appointments after creating one", async () => {
    await request(app)
      .post("/appointments/create")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        patientName: "Patient One", patientContact: "9000000001", gender: "male",
        age: 25, title: "Headache", desc: "Severe",
        expectedDate: new Date(Date.now() + 86400000).toISOString(),
        patientAddress: "Addr", mode: "offline", doctorId, userId,
        email: "patient@test.com",
      });

    const res = await request(app)
      .get(`/appointments/current/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.appointments.length).toBeGreaterThan(0);
  });
});

// ── Appointment Stats ──────────────────────────────────────────────────────
describe("Integration: GET /appointments/stats", () => {
  it("returns stats with correct shape", async () => {
    const res = await request(app)
      .get("/appointments/stats")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalAppointments");
    expect(res.body).toHaveProperty("pendingAppointments");
    expect(res.body).toHaveProperty("approvedAppointments");
    expect(res.body).toHaveProperty("rejectedAppointments");
  });
});

// ── Doctor Appointments ────────────────────────────────────────────────────
describe("Integration: GET /appointments/docapp/:doctorId", () => {
  it("returns pending and approved arrays", async () => {
    const doc = await Doctor.create({ name: "Dr Two", email: "drtwo@test.com", phone: 9000000003, username: "drtwo01", password: "Test@1234", gender: "male", bio: "bio", mciNumber: "MCI-002", department: "Neurology", experience: 3, profession: ["Neurologist"], certificate: "dGVzdA==" });
    const loginRes = await request(app).post("/auth/login").send({ email: "drtwo@test.com", password: "Test@1234", role: "doctor" });
    const docToken = loginRes.body.accessToken;

    const res = await request(app)
      .get(`/appointments/docapp/${doc._id}`)
      .set("Authorization", `Bearer ${docToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("pendingAppointments");
    expect(res.body).toHaveProperty("approvedAppointments");
  });
});
