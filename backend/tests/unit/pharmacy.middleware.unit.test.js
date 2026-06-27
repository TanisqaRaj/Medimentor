import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test_secret";

// ── helpers ───────────────────────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};
const next = jest.fn();

// ── adminGuard ─────────────────────────────────────────────────────────────
describe("Unit: adminGuard", () => {
  let adminGuard;
  beforeEach(async () => {
    next.mockClear();
    ({ adminGuard } = await import("../../pharmacy/middleware/adminGuard.js"));
  });

  it("calls next() when role is admin", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    adminGuard(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 403 when role is user", () => {
    const req = { user: { role: "user" } };
    const res = mockRes();
    adminGuard(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden. Admin access required." });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when user is missing", () => {
    const req = {};
    const res = mockRes();
    adminGuard(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

// ── verifyToken ────────────────────────────────────────────────────────────
describe("Unit: verifyToken", () => {
  let verifyToken;
  beforeEach(async () => {
    next.mockClear();
    ({ verifyToken } = await import("../../middleware/verifyToken.js"));
  });

  const makeReq = (token) => ({
    headers: { authorization: token ? `Bearer ${token}` : undefined },
  });

  it("calls next() and sets req.user for valid token", () => {
    const token = jwt.sign({ _id: "u1", role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const req = makeReq(token);
    const res = mockRes();
    verifyToken(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user._id).toBe("u1");
  });

  it("returns 401 when no token", () => {
    const req = makeReq(null);
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for invalid token", () => {
    const req = makeReq("bad.token.here");
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 for expired token", async () => {
    const token = jwt.sign({ _id: "u1" }, process.env.JWT_SECRET, { expiresIn: "1ms" });
    await new Promise((r) => setTimeout(r, 10));
    const req = makeReq(token);
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
