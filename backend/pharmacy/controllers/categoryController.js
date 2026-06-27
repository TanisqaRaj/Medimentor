import prisma from "../pgClient.js";

export const listCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json({ data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) return res.status(400).json({ message: "name is required" });
  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json({ data: category });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ message: "Category already exists" });
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Category not found" });
    res.status(500).json({ message: err.message });
  }
};
