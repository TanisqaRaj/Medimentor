import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getMetrics, recordRequest, recordError } from "../../utils/metrics.js";

process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";

// ── JWT ────────────────────────────────────────────────────────────────────
describe("Unit: JWT tokens", () => {
  it("creates a valid access token with _id and role", () => {
    const token = jwt.sign({ _id: "abc123", role: "user" }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded._id).toBe("abc123");
    expect(decoded.role).toBe("user");
  });

  it("rejects a tampered token", () => {
    const token = jwt.sign({ _id: "abc" }, process.env.JWT_SECRET);
    expect(() => jwt.verify(token + "tampered", process.env.JWT_SECRET)).toThrow();
  });

  it("rejects an expired token", async () => {
    const token = jwt.sign({ _id: "abc" }, process.env.JWT_SECRET, { expiresIn: "1ms" });
    await new Promise((r) => setTimeout(r, 10));
    expect(() => jwt.verify(token, process.env.JWT_SECRET)).toThrow(/expired/);
  });
});

// ── bcrypt ─────────────────────────────────────────────────────────────────
describe("Unit: Password hashing", () => {
  it("hashes a password and verifies it correctly", async () => {
    const hash = await bcrypt.hash("Admin@1234", 10);
    expect(await bcrypt.compare("Admin@1234", hash)).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await bcrypt.hash("Admin@1234", 10);
    expect(await bcrypt.compare("WrongPass", hash)).toBe(false);
  });
});

// ── Metrics ────────────────────────────────────────────────────────────────
describe("Unit: Metrics collector", () => {
  it("records requests and increments counters", () => {
    recordRequest("GET", "/test", 200, 50);
    const m = getMetrics();
    expect(m.requests.total).toBeGreaterThan(0);
    expect(m.requests.success).toBeGreaterThan(0);
  });

  it("records errors", () => {
    recordError("Test error", "stack trace", { route: "/test" });
    const m = getMetrics();
    expect(m.recentErrors.length).toBeGreaterThan(0);
    expect(m.recentErrors[0].message).toBe("Test error");
  });

  it("tracks slow requests (>1000ms)", () => {
    recordRequest("GET", "/slow", 200, 1500);
    const m = getMetrics();
    expect(m.slowRequests.length).toBeGreaterThan(0);
    expect(m.slowRequests[0].durationMs).toBe(1500);
  });

  it("calculates response time stats", () => {
    recordRequest("GET", "/a", 200, 100);
    recordRequest("GET", "/b", 200, 200);
    const m = getMetrics();
    expect(m.responseTime.avg).toBeGreaterThan(0);
    expect(m.responseTime.p95).toBeGreaterThanOrEqual(m.responseTime.avg);
  });
});

// ── Input validation helpers ───────────────────────────────────────────────
describe("Unit: Input validation patterns", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  it("validates correct email", () => {
    expect(emailRegex.test("user@example.com")).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(emailRegex.test("notanemail")).toBe(false);
  });

  it("validates 10-digit phone", () => {
    expect(phoneRegex.test("9876543210")).toBe(true);
  });

  it("rejects short phone", () => {
    expect(phoneRegex.test("12345")).toBe(false);
  });
});
