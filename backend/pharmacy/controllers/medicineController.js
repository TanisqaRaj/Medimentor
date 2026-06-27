import prisma from "../pgClient.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";

const ALLOWED_SORT = new Set(["name", "price", "stock", "createdAt"]);
const ALLOWED_DIR  = new Set(["asc", "desc"]);

const fmtMedicine = (m) => ({
  id:                   m.id,
  name:                 m.name,
  description:          m.description,
  price:                parseFloat(m.price),
  stock:                m.stock,
  imageUrl:             m.imageUrl,
  manufacturer:         m.manufacturer,
  dosage:               m.dosage,
  requiresPrescription: m.requiresPrescription,
  categoryId:           m.categoryId,
  categoryName:         m.category?.name ?? null,
  createdAt:            m.createdAt,
  updatedAt:            m.updatedAt,
});

export const listMedicines = async (req, res) => {
  try {
    const { search = "", categoryId, minPrice, maxPrice, requiresPrescription, sortBy = "name", sortDir = "asc", page = 0, size = 12 } = req.query;

    const col   = ALLOWED_SORT.has(sortBy) ? sortBy : "name";
    const dir   = ALLOWED_DIR.has(sortDir?.toLowerCase()) ? sortDir.toLowerCase() : "asc";
    const limit = Math.min(Math.max(parseInt(size) || 12, 1), 100);
    const skip  = Math.max(parseInt(page) || 0, 0) * limit;

    const where = {
      ...(search.trim() && {
        OR: [
          { name:         { contains: search.trim(), mode: "insensitive" } },
          { manufacturer: { contains: search.trim(), mode: "insensitive" } },
        ],
      }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(requiresPrescription !== undefined && requiresPrescription !== "" && requiresPrescription !== null && {
        requiresPrescription: requiresPrescription === "true" || requiresPrescription === true,
      }),
      ...(minPrice !== undefined && minPrice !== "" && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice !== undefined && maxPrice !== "" && {
        price: { ...(minPrice !== undefined && minPrice !== "" ? { gte: parseFloat(minPrice) } : {}), lte: parseFloat(maxPrice) },
      }),
    };

    const [total, rows] = await Promise.all([
      prisma.medicine.count({ where }),
      prisma.medicine.findMany({
        where,
        include: { category: { select: { name: true } } },
        orderBy: { [col]: dir },
        take: limit,
        skip,
      }),
    ]);

    res.json({
      data: {
        content:       rows.map(fmtMedicine),
        totalElements: total,
        totalPages:    Math.ceil(total / limit),
        page:          parseInt(page) || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMedicine = async (req, res) => {
  try {
    const medicine = await prisma.medicine.findUnique({
      where:   { id: parseInt(req.params.id) },
      include: { category: { select: { name: true } } },
    });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json({ data: fmtMedicine(medicine) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadMedicineImage = async (req, res) => {
  const { image } = req.body; // base64 data URI
  if (!image) return res.status(400).json({ message: "image is required" });
  try {
    const url = await uploadToCloudinary(image, "medimentor/medicines");
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMedicine = async (req, res) => {
  const { name, description, price, stock, imageUrl, manufacturer, dosage, requiresPrescription, categoryId } = req.body;
  if (!name?.trim() || price === undefined || stock === undefined || !categoryId) {
    return res.status(400).json({ message: "name, price, stock, categoryId are required" });
  }
  try {
    const medicine = await prisma.medicine.create({
      data: {
        name: name.trim(), description: description || null,
        price: parseFloat(price), stock: parseInt(stock),
        imageUrl: imageUrl || null, manufacturer: manufacturer || null,
        dosage: dosage || null, requiresPrescription: !!requiresPrescription,
        categoryId: parseInt(categoryId),
      },
    });
    res.status(201).json({ data: fmtMedicine(medicine) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMedicine = async (req, res) => {
  const { name, description, price, stock, imageUrl, manufacturer, dosage, requiresPrescription, categoryId } = req.body;
  try {
    const existing = await prisma.medicine.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) return res.status(404).json({ message: "Medicine not found" });
    // delete old image from Cloudinary only if replaced
    if (imageUrl && existing.imageUrl && existing.imageUrl !== imageUrl) {
      await deleteFromCloudinary(existing.imageUrl);
    }
    const medicine = await prisma.medicine.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name, description: description || null,
        price: parseFloat(price), stock: parseInt(stock),
        imageUrl: imageUrl || null, manufacturer: manufacturer || null,
        dosage: dosage || null, requiresPrescription: !!requiresPrescription,
        categoryId: parseInt(categoryId),
      },
    });
    res.json({ data: fmtMedicine(medicine) });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Medicine not found" });
    res.status(500).json({ message: err.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    await prisma.medicine.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Medicine not found" });
    res.status(500).json({ message: err.message });
  }
};
