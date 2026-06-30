import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test_secret";

// ESM-correct mock: must happen before any import that uses pgClient
const prisma = {
  category: { findMany: jest.fn(), create: jest.fn(), delete: jest.fn() },
  $connect: jest.fn(), $disconnect: jest.fn(),
};
jest.unstable_mockModule("../../pharmacy/pgClient.js", () => ({
  default: prisma,
  connectPharmacyDB: jest.fn().mockResolvedValue(undefined),
}));

const { default: app } = await import("../pharmacyApp.js");

const adminToken = jwt.sign({ _id: "admin1", role: "admin" }, "test_secret", { expiresIn: "1h" });
const userToken  = jwt.sign({ _id: "user1",  role: "user"  }, "test_secret", { expiresIn: "1h" });
const auth       = (t) => ({ Authorization: `Bearer ${t}` });

beforeEach(() => jest.clearAllMocks());

describe("GET /api/categories", () => {
  it("returns list of categories", async () => {
    prisma.category.findMany.mockResolvedValue([{ id: 1, name: "Antibiotics" }]);
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Antibiotics");
  });

  it("returns 500 on DB error", async () => {
    prisma.category.findMany.mockRejectedValue(new Error("DB down"));
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(500);
  });
});

describe("POST /api/categories", () => {
  it("creates a category as admin", async () => {
    prisma.category.create.mockResolvedValue({ id: 2, name: "Vitamins" });
    const res = await request(app)
      .post("/api/categories").set(auth(adminToken)).send({ name: "Vitamins" });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Vitamins");
  });

  it("returns 400 when name is missing", async () => {
    const res = await request(app).post("/api/categories").set(auth(adminToken)).send({});
    expect(res.status).toBe(400);
  });

  it("returns 409 on duplicate name", async () => {
    const err = new Error("Unique"); err.code = "P2002";
    prisma.category.create.mockRejectedValue(err);
    const res = await request(app)
      .post("/api/categories").set(auth(adminToken)).send({ name: "Antibiotics" });
    expect(res.status).toBe(409);
  });

  it("returns 403 when called by non-admin", async () => {
    const res = await request(app).post("/api/categories").set(auth(userToken)).send({ name: "X" });
    expect(res.status).toBe(403);
  });

  it("returns 401 with no token", async () => {
    const res = await request(app).post("/api/categories").send({ name: "X" });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/categories/:id", () => {
  it("deletes a category as admin", async () => {
    prisma.category.delete.mockResolvedValue({});
    const res = await request(app).delete("/api/categories/1").set(auth(adminToken));
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });

  it("returns 404 when category not found", async () => {
    const err = new Error("Not found"); err.code = "P2025";
    prisma.category.delete.mockRejectedValue(err);
    const res = await request(app).delete("/api/categories/99").set(auth(adminToken));
    expect(res.status).toBe(404);
  });
});
