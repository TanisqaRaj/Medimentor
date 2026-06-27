import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

process.env.JWT_SECRET         = "test_secret";
process.env.CLOUDINARY_CLOUD_NAME = "test";
process.env.CLOUDINARY_API_KEY    = "test";
process.env.CLOUDINARY_API_SECRET = "test";



// Mock cloudinary upload_stream so no real HTTP call is made
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((_opts, cb) => {
        // Simulate a successful Cloudinary upload response
        const stream = { on: jest.fn(), end: jest.fn() };
        process.nextTick(() => cb(null, { secure_url: "https://res.cloudinary.com/test/rx.jpg", public_id: "medimentor/prescriptions/rx" }));
        return stream;
      }),
    },
  },
}));

// streamifier must pipe into our mock stream
jest.mock("streamifier", () => ({
  createReadStream: jest.fn(() => ({ pipe: jest.fn() })),
}));

const { default: app }    = await import("../pharmacyApp.js");
const { default: prisma } = await import("../../pharmacy/pgClient.js");

const userToken  = jwt.sign({ _id: "user1", role: "user"  }, "test_secret", { expiresIn: "1h" });
const adminToken = jwt.sign({ _id: "adm1",  role: "admin" }, "test_secret", { expiresIn: "1h" });

const fakePrescription = {
  id: 1, fileUrl: "https://res.cloudinary.com/test/rx.jpg",
  status: "PENDING", createdAt: new Date(),
};

beforeEach(() => { jest.clearAllMocks(); });

describe("POST /api/prescriptions/upload", () => {
  it("uploads a prescription image", async () => {
    prisma.prescription.create.mockResolvedValue(fakePrescription);

    const res = await request(app)
      .post("/api/prescriptions/upload")
      .set("Authorization", `Bearer ${userToken}`)
      .attach("file", Buffer.from("fake-image-data"), { filename: "rx.jpg", contentType: "image/jpeg" });

    expect(res.status).toBe(201);
    expect(res.body.data.fileUrl).toContain("cloudinary");
    expect(res.body.data.status).toBe("PENDING");
  });

  it("returns 400 when no file is attached", async () => {
    const res = await request(app)
      .post("/api/prescriptions/upload")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/No file/);
  });

  it("returns 400 for disallowed file type", async () => {
    const res = await request(app)
      .post("/api/prescriptions/upload")
      .set("Authorization", `Bearer ${userToken}`)
      .attach("file", Buffer.from("data"), { filename: "virus.exe", contentType: "application/octet-stream" });
    expect(res.status).toBe(400);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).post("/api/prescriptions/upload");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/prescriptions/admin", () => {
  it("returns pending prescriptions for admin", async () => {
    prisma.prescription.findMany.mockResolvedValue([
      { id: 1, userId: "user1", fileUrl: "https://x.jpg", status: "PENDING", createdAt: new Date() },
    ]);
    const res = await request(app)
      .get("/api/prescriptions/admin")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("returns 403 for non-admin", async () => {
    const res = await request(app)
      .get("/api/prescriptions/admin")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});

describe("PATCH /api/prescriptions/admin/:id", () => {
  it("approves a prescription", async () => {
    prisma.prescription.update.mockResolvedValue({ id: 1, status: "APPROVED", userId: "user1" });
    const res = await request(app)
      .patch("/api/prescriptions/admin/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "APPROVED" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("APPROVED");
  });

  it("rejects a prescription", async () => {
    prisma.prescription.update.mockResolvedValue({ id: 1, status: "REJECTED", userId: "user1" });
    const res = await request(app)
      .patch("/api/prescriptions/admin/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "REJECTED" });
    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid status", async () => {
    const res = await request(app)
      .patch("/api/prescriptions/admin/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "MAYBE" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when prescription not found", async () => {
    const err = new Error("Not found"); err.code = "P2025";
    prisma.prescription.update.mockRejectedValue(err);
    const res = await request(app)
      .patch("/api/prescriptions/admin/99")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "APPROVED" });
    expect(res.status).toBe(404);
  });
});
