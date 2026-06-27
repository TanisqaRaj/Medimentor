import { describe, it, expect, beforeAll, afterAll, afterEach } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "../setup.js";

process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
process.env.NODE_ENV = "test";

const testUser = {
  name: "Test User",
  email: "testuser@example.com",
  phone: "9876543210",
  username: "testuser01",
  password: "Test@1234",
  gender: "male",
  role: "user",
};

const testDoctor = {
  name: "Dr Test",
  email: "doctor@example.com",
  phone: "9876543211",
  username: "drtest01",
  password: "Test@1234",
  gender: "male",
  role: "doctor",
  bio: "Test bio",
  mciNumber: "MCI-TEST-001",
  department: "Cardiology",
  experience: 5,
  profession: ["Cardiologist"],
  certificate: "dGVzdA==",
};

beforeAll(async () => { await connectTestDB(); });
afterEach(async () => { await clearTestDB(); });
afterAll(async () => { await closeTestDB(); });

// ── Registration ───────────────────────────────────────────────────────────
describe("Integration: POST /auth/register/user", () => {
  it("registers a new user successfully", async () => {
    const res = await request(app).post("/auth/register/user").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/successfully/i);
  });

  it("rejects duplicate email", async () => {
    await request(app).post("/auth/register/user").send(testUser);
    const res = await request(app).post("/auth/register/user").send(testUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("rejects missing required fields", async () => {
    const res = await request(app).post("/auth/register/user").send({ email: "x@x.com" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid email format", async () => {
    const res = await request(app).post("/auth/register/user").send({ ...testUser, email: "bademail" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid phone", async () => {
    const res = await request(app).post("/auth/register/user").send({ ...testUser, phone: "123" });
    expect(res.status).toBe(400);
  });
});

describe("Integration: POST /auth/register/doctor", () => {
  it("registers a new doctor successfully", async () => {
    const res = await request(app).post("/auth/register/doctor").send(testDoctor);
    expect(res.status).toBe(201);
    expect(res.body.doctor).toHaveProperty("_id");
  });

  it("rejects duplicate MCI number", async () => {
    await request(app).post("/auth/register/doctor").send(testDoctor);
    const res = await request(app).post("/auth/register/doctor").send({ ...testDoctor, email: "other@doc.com", username: "drtest02", phone: "9876543212" });
    expect(res.status).toBe(400);
  });
});

// ── Login ──────────────────────────────────────────────────────────────────
describe("Integration: POST /auth/login", () => {
  beforeAll(async () => {
    await connectTestDB();
    await request(app).post("/auth/register/user").send(testUser);
  });

  it("logs in with valid credentials and returns accessToken", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email, password: testUser.password, role: "user",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.success).toBe(true);
    // httpOnly cookie set
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toMatch(/refreshToken/);
  });

  it("rejects wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email, password: "WrongPass", role: "user",
    });
    expect(res.status).toBe(401);
  });

  it("rejects non-existent user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "nobody@x.com", password: "Test@1234", role: "user",
    });
    expect(res.status).toBe(401);
  });

  it("rejects invalid role", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email, password: testUser.password, role: "hacker",
    });
    expect(res.status).toBe(400);
  });
});

// ── Token Refresh ──────────────────────────────────────────────────────────
describe("Integration: POST /auth/refresh", () => {
  it("returns new accessToken with valid refresh cookie", async () => {
    await connectTestDB();
    await request(app).post("/auth/register/user").send(testUser);
    const loginRes = await request(app).post("/auth/login").send({
      email: testUser.email, password: testUser.password, role: "user",
    });
    const cookie = loginRes.headers["set-cookie"];

    const res = await request(app).post("/auth/refresh").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("rejects refresh with no cookie", async () => {
    const res = await request(app).post("/auth/refresh");
    expect(res.status).toBe(401);
  });
});

// ── Logout ─────────────────────────────────────────────────────────────────
describe("Integration: POST /auth/logout", () => {
  it("clears the refresh token cookie", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/refreshToken=;/);
  });
});

// ── Protected route guard ──────────────────────────────────────────────────
describe("Integration: Auth middleware", () => {
  it("blocks request with no token", async () => {
    const res = await request(app).get("/appointments/all");
    expect(res.status).toBe(401);
  });

  it("blocks request with invalid token", async () => {
    const res = await request(app).get("/appointments/all")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(401);
  });

  it("allows request with valid token", async () => {
    await connectTestDB();
    await request(app).post("/auth/register/user").send(testUser);
    const loginRes = await request(app).post("/auth/login").send({
      email: testUser.email, password: testUser.password, role: "user",
    });
    const token = loginRes.body.accessToken;
    const res = await request(app).get(`/appointments/current/someid`)
      .set("Authorization", `Bearer ${token}`);
    // 404 is fine — it means auth passed, just no data
    expect([200, 404]).toContain(res.status);
  });
});
