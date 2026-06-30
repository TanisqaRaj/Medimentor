import prisma from "../pgClient.js";

const fmtCart = async (userId) => {
  const items = await prisma.cartItem.findMany({
    where:   { userId },
    include: { medicine: { select: { name: true, imageUrl: true, price: true, requiresPrescription: true } } },
    orderBy: { id: "asc" },
  });
  
  const formatted = items.map((i) => ({
    id:                   i.id,
    medicineId:           i.medicineId,
    medicineName:         i.medicine.name,
    medicineImage:        i.medicine.imageUrl ?? "",
    price:                parseFloat(i.medicine.price),
    quantity:             i.quantity,
    subtotal:             parseFloat((parseFloat(i.medicine.price) * i.quantity).toFixed(2)),
    requiresPrescription: i.medicine.requiresPrescription,
  }));
  const totalAmount = parseFloat(formatted.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2));
  return { items: formatted, totalAmount };
};

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    res.json({ data: await fmtCart(req.user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cart/items?medicineId=&quantity=
export const addToCart = async (req, res) => {
  const { medicineId, quantity = 1 } = req.query;
  const qty = parseInt(quantity);
  if (!medicineId) return res.status(400).json({ message: "medicineId is required" });
  if (isNaN(qty) || qty < 1) return res.status(400).json({ message: "quantity must be >= 1" });

  try {
    await prisma.$transaction(async (tx) => {
      // Lock medicine row — prevents concurrent oversell
      const medicine = await tx.medicine.findUnique({ where: { id: parseInt(medicineId) } });
      if (!medicine) throw Object.assign(new Error("Medicine not found"), { status: 404 });
      if (medicine.stock === 0) throw Object.assign(new Error("Medicine is out of stock"), { status: 400 });

      const existing = await tx.cartItem.findUnique({
        where: { userId_medicineId: { userId: req.user._id, medicineId: parseInt(medicineId) } },
      });
      const currentQty = existing?.quantity ?? 0;
      if (currentQty + qty > medicine.stock) {
        throw Object.assign(
          new Error(`Only ${medicine.stock - currentQty} more units available`),
          { status: 400 }
        );
      }

      await tx.cartItem.upsert({
        where:  { userId_medicineId: { userId: req.user._id, medicineId: parseInt(medicineId) } },
        create: { userId: req.user._id, medicineId: parseInt(medicineId), quantity: qty },
        update: { quantity: { increment: qty } },
      });
    });

    res.json({ data: await fmtCart(req.user._id) });
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

// PUT /api/cart/items/:itemId?quantity=
export const updateCartItem = async (req, res) => {
  const qty = parseInt(req.query.quantity);
  if (isNaN(qty) || qty < 1) return res.status(400).json({ message: "quantity must be >= 1" });

  try {
    await prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findFirst({
        where: { id: parseInt(req.params.itemId), userId: req.user._id },
      });
      if (!item) throw Object.assign(new Error("Cart item not found"), { status: 404 });

      const medicine = await tx.medicine.findUnique({ where: { id: item.medicineId } });
      if (medicine && qty > medicine.stock) {
        throw Object.assign(new Error(`Only ${medicine.stock} units available`), { status: 400 });
      }

      await tx.cartItem.update({
        where: { id: parseInt(req.params.itemId) },
        data:  { quantity: qty },
      });
    });

    res.json({ data: await fmtCart(req.user._id) });
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

// DELETE /api/cart/items/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const item = await prisma.cartItem.findFirst({
      where: { id: parseInt(req.params.itemId), userId: req.user._id },
    });
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    await prisma.cartItem.delete({ where: { id: parseInt(req.params.itemId) } });
    res.json({ data: await fmtCart(req.user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
