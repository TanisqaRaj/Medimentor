import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test_secret";



const { default: app }    = await import("../pharmacyApp.js");
const { default: prisma } = await import("../../pharmacy/pgClient.js");

const userToken = jwt.sign({ _id: "user1", role: "user" }, "test_secret", { expiresIn: "1h" });
const auth      = { Authorization: `Bearer ${userToken}` };

const fakeCartItems = [
  {
    id: 10, medicineId: 1, quantity: 2,
    medicine: { name: "Paracetamol", imageUrl: null, price: "10.50", requiresPrescription: false },
  },
];

beforeEach(() => { jest.clearAllMocks(); });

// fmtCart helper is called after mutation — mock findMany for it
const mockFmtCart = () =>
  prisma.cartItem.findMany.mockResolvedValue(fakeCartItems);

describe("GET /api/cart", () => {
  it("returns user cart with formatted totals", async () => {
    prisma.cartItem.findMany.mockResolvedValue(fakeCartItems);
    const res = await request(app).get("/api/cart").set(auth);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].medicineName).toBe("Paracetamol");
    expect(res.body.data.items[0].subtotal).toBe(21);
    expect(res.body.data.totalAmount).toBe(21);
  });

  it("returns empty cart when no items", async () => {
    prisma.cartItem.findMany.mockResolvedValue([]);
    const res = await request(app).get("/api/cart").set(auth);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(0);
    expect(res.body.data.totalAmount).toBe(0);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/cart/items", () => {
  it("adds a new item to cart", async () => {
    // $transaction interactive form calls the callback with prisma mock
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.medicine.findUnique.mockResolvedValue({ id: 1, stock: 10, price: "10.50" });
    prisma.cartItem.findUnique.mockResolvedValue(null); // not in cart yet
    prisma.cartItem.upsert.mockResolvedValue({});
    mockFmtCart();

    const res = await request(app)
      .post("/api/cart/items?medicineId=1&quantity=2")
      .set(auth);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
  });

  it("returns 400 when medicineId is missing", async () => {
    const res = await request(app).post("/api/cart/items?quantity=1").set(auth);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/medicineId/);
  });

  it("returns 400 when quantity is invalid", async () => {
    const res = await request(app).post("/api/cart/items?medicineId=1&quantity=0").set(auth);
    expect(res.status).toBe(400);
  });

  it("returns 404 when medicine not found", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.medicine.findUnique.mockResolvedValue(null);
    const res = await request(app).post("/api/cart/items?medicineId=99&quantity=1").set(auth);
    expect(res.status).toBe(404);
  });

  it("returns 400 when medicine is out of stock", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.medicine.findUnique.mockResolvedValue({ id: 1, stock: 0, price: "10.50" });
    const res = await request(app).post("/api/cart/items?medicineId=1&quantity=1").set(auth);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/out of stock/);
  });

  it("returns 400 when requested quantity exceeds stock", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.medicine.findUnique.mockResolvedValue({ id: 1, stock: 3, price: "10.50" });
    prisma.cartItem.findUnique.mockResolvedValue({ quantity: 2 }); // already 2 in cart
    const res = await request(app).post("/api/cart/items?medicineId=1&quantity=2").set(auth);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/1 more unit/);
  });
});

describe("PUT /api/cart/items/:itemId", () => {
  it("updates item quantity", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.cartItem.findFirst.mockResolvedValue({ id: 10, medicineId: 1 });
    prisma.medicine.findUnique.mockResolvedValue({ stock: 10 });
    prisma.cartItem.update.mockResolvedValue({});
    mockFmtCart();

    const res = await request(app)
      .put("/api/cart/items/10?quantity=3")
      .set(auth);
    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid quantity", async () => {
    const res = await request(app).put("/api/cart/items/10?quantity=-1").set(auth);
    expect(res.status).toBe(400);
  });

  it("returns 404 when cart item not found", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.cartItem.findFirst.mockResolvedValue(null);
    const res = await request(app).put("/api/cart/items/99?quantity=1").set(auth);
    expect(res.status).toBe(404);
  });

  it("returns 400 when quantity exceeds stock", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.cartItem.findFirst.mockResolvedValue({ id: 10, medicineId: 1 });
    prisma.medicine.findUnique.mockResolvedValue({ stock: 2 });
    const res = await request(app).put("/api/cart/items/10?quantity=5").set(auth);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/cart/items/:itemId", () => {
  it("removes an item from cart", async () => {
    prisma.cartItem.findFirst.mockResolvedValue({ id: 10 });
    prisma.cartItem.delete.mockResolvedValue({});
    mockFmtCart();

    const res = await request(app).delete("/api/cart/items/10").set(auth);
    expect(res.status).toBe(200);
  });

  it("returns 404 when item not in cart", async () => {
    prisma.cartItem.findFirst.mockResolvedValue(null);
    const res = await request(app).delete("/api/cart/items/99").set(auth);
    expect(res.status).toBe(404);
  });
});
