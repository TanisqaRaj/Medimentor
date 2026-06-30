import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test_secret";



const { default: app }    = await import("../pharmacyApp.js");
const { default: prisma } = await import("../../pharmacy/pgClient.js");

const userToken  = jwt.sign({ _id: "user1", role: "user"  }, "test_secret", { expiresIn: "1h" });
const adminToken = jwt.sign({ _id: "adm1",  role: "admin" }, "test_secret", { expiresIn: "1h" });
const userAuth   = { Authorization: `Bearer ${userToken}` };
const adminAuth  = { Authorization: `Bearer ${adminToken}` };

const fakeCartItems = [
  {
    id: 1, quantity: 2,
    medicine: { id: 1, name: "Paracetamol", price: "10.50", stock: 10, requiresPrescription: false },
  },
];

const fakeOrder = {
  id: 1, orderNumber: "ORD-20260622-000001",
  userId: "user1", totalAmount: "21.00",
  shippingAddress: "123 Main St", paymentMethod: "COD",
  status: "PENDING", prescriptionId: null,
  createdAt: new Date(), updatedAt: new Date(),
  items: [{ id: 1, medicineId: 1, medicineName: "Paracetamol", priceAtPurchase: "10.50", quantity: 2 }],
};

beforeEach(() => { jest.clearAllMocks(); });

// ── placeOrder ─────────────────────────────────────────────────────────────
describe("POST /api/orders", () => {
  const mockFullTransaction = () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.cartItem.findMany.mockResolvedValue(fakeCartItems);
    prisma.$queryRaw.mockResolvedValue([{ nextval: 1n }]);
    prisma.order.create.mockResolvedValue(fakeOrder);
    prisma.order.update.mockResolvedValue(fakeOrder);
    prisma.$executeRaw.mockResolvedValue(1); // 1 row affected = stock OK
    prisma.cartItem.deleteMany.mockResolvedValue({});
  };

  it("places an order successfully", async () => {
    mockFullTransaction();
    const res = await request(app)
      .post("/api/orders")
      .set(userAuth)
      .send({ shippingAddress: "123 Main St", paymentMethod: "COD" });
    expect(res.status).toBe(201);
    expect(res.body.data.orderNumber).toBe("ORD-20260622-000001");
    expect(res.body.data.items).toHaveLength(1);
  });

  it("returns 400 when shippingAddress is missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set(userAuth)
      .send({ paymentMethod: "COD" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/shippingAddress/);
  });

  it("returns 400 for invalid paymentMethod", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set(userAuth)
      .send({ shippingAddress: "123 St", paymentMethod: "CASH" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/paymentMethod/);
  });

  it("returns 400 when cart is empty", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.cartItem.findMany.mockResolvedValue([]);
    const res = await request(app)
      .post("/api/orders")
      .set(userAuth)
      .send({ shippingAddress: "123 St", paymentMethod: "COD" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/empty/);
  });

  it("returns 400 when prescription required but not provided", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.cartItem.findMany.mockResolvedValue([
      { ...fakeCartItems[0], medicine: { ...fakeCartItems[0].medicine, requiresPrescription: true } },
    ]);
    const res = await request(app)
      .post("/api/orders")
      .set(userAuth)
      .send({ shippingAddress: "123 St", paymentMethod: "COD" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Prescription required/);
  });

  it("returns 400 when stock insufficient (executeRaw returns 0)", async () => {
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    prisma.cartItem.findMany.mockResolvedValue(fakeCartItems);
    prisma.$queryRaw.mockResolvedValue([{ nextval: 2n }]);
    prisma.order.create.mockResolvedValue(fakeOrder);
    prisma.order.update.mockResolvedValue(fakeOrder);
    prisma.$executeRaw.mockResolvedValue(0); // 0 rows = stock insufficient
    const res = await request(app)
      .post("/api/orders")
      .set(userAuth)
      .send({ shippingAddress: "123 St", paymentMethod: "COD" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Insufficient stock/);
  });

  it("returns 401 without token", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ shippingAddress: "x", paymentMethod: "COD" });
    expect(res.status).toBe(401);
  });
});

// ── getMyOrders ────────────────────────────────────────────────────────────
describe("GET /api/orders", () => {
  it("returns paginated user orders", async () => {
    prisma.order.count.mockResolvedValue(1);
    prisma.order.findMany.mockResolvedValue([fakeOrder]);
    const res = await request(app).get("/api/orders").set(userAuth);
    expect(res.status).toBe(200);
    expect(res.body.data.content).toHaveLength(1);
    expect(res.body.data.totalElements).toBe(1);
    expect(res.body.data.content[0].items[0].priceAtPurchase).toBe(10.5);
  });

  it("returns empty page when no orders", async () => {
    prisma.order.count.mockResolvedValue(0);
    prisma.order.findMany.mockResolvedValue([]);
    const res = await request(app).get("/api/orders").set(userAuth);
    expect(res.status).toBe(200);
    expect(res.body.data.content).toHaveLength(0);
  });
});

// ── adminGetOrders ─────────────────────────────────────────────────────────
describe("GET /api/orders/admin/all", () => {
  it("returns all orders for admin", async () => {
    prisma.order.count.mockResolvedValue(1);
    prisma.order.findMany.mockResolvedValue([fakeOrder]);
    const res = await request(app).get("/api/orders/admin/all").set(adminAuth);
    expect(res.status).toBe(200);
    expect(res.body.data.content).toHaveLength(1);
  });

  it("returns 403 for non-admin", async () => {
    const res = await request(app).get("/api/orders/admin/all").set(userAuth);
    expect(res.status).toBe(403);
  });
});

// ── adminUpdateOrderStatus ─────────────────────────────────────────────────
describe("PATCH /api/orders/admin/:id/status", () => {
  it("updates order status", async () => {
    prisma.order.update.mockResolvedValue({ id: 1, status: "SHIPPED", orderNumber: "ORD-x" });
    const res = await request(app)
      .patch("/api/orders/admin/1/status?status=SHIPPED")
      .set(adminAuth);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("SHIPPED");
  });

  it("returns 400 for invalid status value", async () => {
    const res = await request(app)
      .patch("/api/orders/admin/1/status?status=FLYING")
      .set(adminAuth);
    expect(res.status).toBe(400);
  });

  it("returns 404 when order not found", async () => {
    const err = new Error("Not found"); err.code = "P2025";
    prisma.order.update.mockRejectedValue(err);
    const res = await request(app)
      .patch("/api/orders/admin/999/status?status=SHIPPED")
      .set(adminAuth);
    expect(res.status).toBe(404);
  });
});
