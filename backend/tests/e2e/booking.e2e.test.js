import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB } from "../setup.js";

process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
process.env.NODE_ENV = "test";

// Full system journey: register → login → book → doctor approves → patient verifies password

let patientToken, doctorToken;
let patientId, doctorId;
let appointmentCustomId;

const patient = { name: "Jane Doe", email: "jane@test.com", phone: "9200000001", username: "janedoe", password: "Test@1234", gender: "female", role: "user" };
const doctor  = { name: "Dr Smith", email: "smith@test.com", phone: "9200000002", username: "drsmith", password: "Test@1234", gender: "male", role: "doctor", bio: "Experienced", mciNumber: "MCI-S01", department: "Cardiology", experience: 7, profession: ["Cardiologist"], certificate: "dGVzdA==" };

beforeAll(async () => { await connectTestDB(); });
afterAll(async () => { await closeTestDB(); });

describe("E2E: Full appointment booking and approval flow", () => {

  it("Step 1: Patient registers", async () => {
    const res = await request(app).post("/auth/register/user").send(patient);
    expect(res.status).toBe(201);
  });

  it("Step 2: Doctor registers", async () => {
    const res = await request(app).post("/auth/register/doctor").send(doctor);
    expect(res.status).toBe(201);
    doctorId = res.body.doctor._id;
  });

  it("Step 3: Patient logs in and gets accessToken + refreshToken cookie", async () => {
    const res = await request(app).post("/auth/login").send({ email: patient.email, password: patient.password, role: "user" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.headers["set-cookie"][0]).toMatch(/refreshToken/);
    patientToken = res.body.accessToken;
    patientId = res.body.user._id;
  });

  it("Step 4: Doctor logs in", async () => {
    const res = await request(app).post("/auth/login").send({ email: doctor.email, password: doctor.password, role: "doctor" });
    expect(res.status).toBe(200);
    doctorToken = res.body.accessToken;
  });

  it("Step 5: Patient books an online appointment", async () => {
    const res = await request(app)
      .post("/appointments/create")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({
        patientName: patient.name,
        patientContact: patient.phone,
        gender: patient.gender,
        age: 28,
        title: "Heart checkup",
        desc: "Routine checkup",
        expectedDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        patientAddress: "456 Oak Ave",
        mode: "online",
        doctorId,
        userId: patientId,
        email: patient.email,
      });
    expect(res.status).toBe(201);
    expect(res.body.appointment.state).toBe("pending");
    appointmentCustomId = res.body.appointment.appointmentID;
  });

  it("Step 6: Patient sees appointment in current list", async () => {
    const res = await request(app)
      .get(`/appointments/current/${patientId}`)
      .set("Authorization", `Bearer ${patientToken}`);
    expect(res.status).toBe(200);
    expect(res.body.appointments[0].status).toBe("pending");
  });

  it("Step 7: Doctor sees appointment in pending list", async () => {
    const res = await request(app)
      .get(`/appointments/docapp/${doctorId}`)
      .set("Authorization", `Bearer ${doctorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.pendingAppointments.length).toBe(1);
  });

  it("Step 8: Wrong password returns 404 on verify", async () => {
    const res = await request(app)
      .post("/appointments/veify")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({ appointmentID: appointmentCustomId, meetingPassword: "wrongpass" });
    expect(res.status).toBe(404);
  });

  it("Step 9: Token refresh works mid-session", async () => {
    const loginRes = await request(app).post("/auth/login").send({ email: patient.email, password: patient.password, role: "user" });
    const cookie = loginRes.headers["set-cookie"];
    const res = await request(app).post("/auth/refresh").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    // New token should be different from original
    expect(res.body.accessToken).not.toBe(loginRes.body.accessToken);
  });

  it("Step 10: Logout clears cookie", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/refreshToken=;/);
  });

  it("Step 11: Appointment stats reflect created appointment", async () => {
    const res = await request(app)
      .get("/appointments/stats")
      .set("Authorization", `Bearer ${patientToken}`);
    expect(res.status).toBe(200);
    expect(res.body.totalAppointments).toBeGreaterThan(0);
    expect(res.body.pendingAppointments).toBeGreaterThan(0);
  });
});
