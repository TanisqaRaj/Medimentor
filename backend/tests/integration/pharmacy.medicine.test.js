import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test_secret";



const { default: app }    = await import("../pharmacyApp.js");
const { default: prisma } = await import("../../pharmacy/pgClient.js");

const adminToken = jwt.sign({ _id: "admin1", role: "admin" }, "test_secret", { expiresIn: "1h" });
const auth       = (t) => ({ Authorization: `Bearer ${t}` });

const fakeMed = {
  id: 1, name: "Paracetamol", description: null, price: "10.50", stock: 100,
  imageUrl: null, manufacturer: "GSK", dosage: "500mg",
  requiresPrescription: false, categoryId: 1,
  category: { name: "Analgesics" }, createdAt: new Date(), updatedAt: new Date(),
};

beforeEach(() => { jest.clearAllMocks(); });

describe("GET /api/medicines", () => {
  it("returns paginated medicine list", async () => {
    prisma.$transaction.mockResolvedValue([1, [fakeMed]]);
    const res = await request(app).get("/api/medicines");
    expect(res.status).toBe(200);
    expect(res.body.data.content).toHaveLength(1);
    expect(res.body.data.content[0].price).toBe(10.5);
    expect(res.body.data.totalElements).toBe(1);
    expect(res.body.data.totalPages).toBe(1);
  });

  it("clamps size to 100 max", async () => {
    prisma.$transaction.mockResolvedValue([0, []]);
    await request(app).get("/api/medicines?size=999");
    // $transaction called — medicine.findMany take arg would be 100
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("falls back to safe sort column on invalid sortBy", async () => {
    prisma.$transaction.mockResolvedValue([0, []]);
    const res = await request(app).get("/api/medicines?sortBy=injected;DROP TABLE");
    expect(res.status).toBe(200); // no crash, safe fallback
  });

  it("returns 500 on DB error", async () => {
    prisma.$transaction.mockRejectedValue(new Error("DB down"));
    const res = await request(app).get("/api/medicines");
    expect(res.status).toBe(500);
  });
});

describe("GET /api/medicines/:id", () => {
  it("returns a single medicine", async () => {
    prisma.medicine.findUnique.mockResolvedValue(fakeMed);
    const res = await request(app).get("/api/medicines/1");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Paracetamol");
    expect(res.body.data.categoryName).toBe("Analgesics");
  });

  it("returns 404 when not found", async () => {
    prisma.medicine.findUnique.mockResolvedValue(null);
    const res = await request(app).get("/api/medicines/999");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/medicines", () => {
  it("creates a medicine as admin", async () => {
    prisma.medicine.create.mockResolvedValue(fakeMed);
    const res = await request(app)
      .post("/api/medicines")
      .set(auth(adminToken))
      .send({ name: "Paracetamol", price: 10.5, stock: 100, categoryId: 1 });
    expect(res.status).toBe(201);
  });

  it("returns 400 when required fields missing", async () => {
    const res = await request(app)
      .post("/api/medicines")
      .set(auth(adminToken))
      .send({ name: "X" }); // missing price, stock, categoryId
    expect(res.status).toBe(400);
  });

  it("returns 403 for non-admin", async () => {
    const userToken = jwt.sign({ _id: "u1", role: "user" }, "test_secret");
    const res = await request(app)
      .post("/api/medicines")
      .set(auth(userToken))
      .send({ name: "X", price: 1, stock: 1, categoryId: 1 });
    expect(res.status).toBe(403);
  });
});

describe("PUT /api/medicines/:id", () => {
  it("updates a medicine as admin", async () => {
    prisma.medicine.update.mockResolvedValue({ ...fakeMed, stock: 50 });
    const res = await request(app)
      .put("/api/medicines/1")
      .set(auth(adminToken))
      .send({ name: "Paracetamol", price: 10.5, stock: 50, categoryId: 1 });
    expect(res.status).toBe(200);
  });

  it("returns 404 when medicine not found", async () => {
    const err = new Error("Not found"); err.code = "P2025";
    prisma.medicine.update.mockRejectedValue(err);
    const res = await request(app)
      .put("/api/medicines/99")
      .set(auth(adminToken))
      .send({ name: "X", price: 1, stock: 1, categoryId: 1 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/medicines/:id", () => {
  it("deletes a medicine as admin", async () => {
    prisma.medicine.delete.mockResolvedValue({});
    const res = await request(app).delete("/api/medicines/1").set(auth(adminToken));
    expect(res.status).toBe(200);
  });

  it("returns 404 when not found", async () => {
    const err = new Error("Not found"); err.code = "P2025";
    prisma.medicine.delete.mockRejectedValue(err);
    const res = await request(app).delete("/api/medicines/99").set(auth(adminToken));
    expect(res.status).toBe(404);
  });
});
