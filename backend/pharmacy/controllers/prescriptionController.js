import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import multer from "multer";
import prisma from "../pgClient.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(Object.assign(new Error("Only JPG, PNG, PDF files are allowed"), { status: 415 }), false);
  },
});

const uploadStream = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

// GET /api/prescriptions/my
export const myPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      where:   { userId: req.user._id },
      orderBy: { createdAt: "desc" },
      select:  { id: true, fileUrl: true, status: true, createdAt: true },
    });
    res.json({ data: prescriptions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/prescriptions/upload
export const uploadPrescription = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  try {
    const isPDF = req.file.mimetype === "application/pdf";
    const result = await uploadStream(req.file.buffer, {
      folder:        "medimentor/prescriptions",
      resource_type: isPDF ? "raw" : "image",
      ...(!isPDF && { transformation: [{ width: 1200, crop: "limit", quality: "auto", fetch_format: "auto" }] }),
    });

    const prescription = await prisma.prescription.create({
      data: { userId: req.user._id, fileUrl: result.secure_url, publicId: result.public_id },
      select: { id: true, fileUrl: true, status: true, createdAt: true },
    });
    res.status(201).json({ data: prescription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/prescriptions/admin
export const adminListPrescriptions = async (req, res) => {
  try {
    const status = req.query.status ?? "PENDING";
    const prescriptions = await prisma.prescription.findMany({
      where:   { status },
      orderBy: { createdAt: "desc" },
      select:  { id: true, userId: true, fileUrl: true, status: true, createdAt: true },
    });
    res.json({ data: prescriptions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/prescriptions/admin/:id
export const adminUpdatePrescription = async (req, res) => {
  const { status } = req.body;
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "status must be APPROVED or REJECTED" });
  }
  try {
    const prescription = await prisma.prescription.update({
      where:  { id: parseInt(req.params.id) },
      data:   { status },
      select: { id: true, status: true, userId: true },
    });
    res.json({ data: prescription });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Prescription not found" });
    res.status(500).json({ message: err.message });
  }
};
