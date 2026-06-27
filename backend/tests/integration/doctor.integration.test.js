import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB } from "../setup.js";
import Doctor from "../../models/Doctor.js";
import Admin from "../../models/Admin.js";

process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
process.env.NODE_ENV = "test";

let adminToken;

beforeAll(async () => {
  await connectTestDB();

  // Seed doctors — plain passwords, pre-save hook hashes them
  await Doctor.create([
    { name: "Dr Heart", email: "heart@test.com", phone: 9100000001, username: "drheart", password: "Admin@1234", gender: "male", bio: "Cardiologist", mciNumber: "MCI-H01", department: "Cardiology", experience: 10, profession: ["Cardiologist"], certificate: "dGVzdA==" },
    { name: "Dr Brain", email: "brain@test.com", phone: 9100000002, username: "drbrain", password: "Admin@1234", gender: "female", bio: "Neurologist", mciNumber: "MCI-N01", department: "Neurology", experience: 8, profession: ["Neurologist"], certificate: "dGVzdA==" },
  ]);

  // Seed admin — plain password, pre-save hook hashes it
  await Admin.create({ name: "Admin", username: "admin_test", email: "admin@test.com", password: "Admin@1234", role: "admin" });
  const res = await request(app).post("/auth/login").send({ username: "admin_test", password: "Admin@1234", role: "admin" });
  adminToken = res.body.accessToken;
});

afterAll(async () => { await closeTestDB(); });

// ── Doctor Search ──────────────────────────────────────────────────────────
describe("Integration: GET /doctors/listdoctors", () => {
  it("returns paginated doctor list", async () => {
    const res = await request(app).get("/doctors/listdoctors?limit=10");
    expect(res.status).toBe(200);
    expect(res.body.doctors.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("totalDoctors");
  });
});

describe("Integration: GET /doctors/searchdoctor", () => {
  it("finds doctor by name", async () => {
    const res = await request(app).get("/doctors/searchdoctor?query=Heart&isDoctor=true");
    expect(res.status).toBe(200);
    expect(res.body.doctors.length).toBeGreaterThan(0);
  });

  it("returns empty for unknown query", async () => {
    const res = await request(app).get("/doctors/searchdoctor?query=xyzunknown&isDoctor=true");
    expect(res.status).toBe(200);
    expect(res.body.doctors.length).toBe(0);
  });
});

describe("Integration: GET /doctors/totaldoctors (admin only)", () => {
  it("returns total count for admin", async () => {
    const res = await request(app)
      .get("/doctors/totaldoctors")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.totalDoctors).toBe(2);
  });

  it("blocks non-admin", async () => {
    const res = await request(app).get("/doctors/totaldoctors");
    expect(res.status).toBe(401);
  });
});

// ── Monitor ────────────────────────────────────────────────────────────────
describe("Integration: GET /monitor/health", () => {
  it("returns ok status publicly", async () => {
    const res = await request(app).get("/monitor/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Integration: GET /monitor/stats", () => {
  it("returns metrics for admin", async () => {
    const res = await request(app)
      .get("/monitor/stats")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.metrics).toHaveProperty("uptime");
    expect(res.body.metrics).toHaveProperty("requests");
    expect(res.body.metrics).toHaveProperty("memory");
  });

  it("blocks non-admin from stats", async () => {
    const res = await request(app).get("/monitor/stats");
    expect(res.status).toBe(401);
  });
});
