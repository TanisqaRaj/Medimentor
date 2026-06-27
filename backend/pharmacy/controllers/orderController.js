import prisma from "../pgClient.js";

const fmtOrder = (order) => ({
  id:              order.id,
  orderNumber:     order.orderNumber,
  userId:          order.userId,
  totalAmount:     parseFloat(order.totalAmount),
  shippingAddress: order.shippingAddress,
  paymentMethod:   order.paymentMethod,
  status:          order.status,
  prescriptionId:  order.prescriptionId,
  createdAt:       order.createdAt,
  updatedAt:       order.updatedAt,
  items:           (order.items ?? []).map((i) => ({
    id:              i.id,
    medicineId:      i.medicineId,
    medicineName:    i.medicineName,
    priceAtPurchase: parseFloat(i.priceAtPurchase),
    quantity:        i.quantity,
  })),
});

// POST /api/orders  — ACID interactive transaction
export const placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, prescriptionId } = req.body;
  if (!shippingAddress?.trim()) return res.status(400).json({ message: "shippingAddress is required" });
  if (!["COD", "UPI", "CARD"].includes(paymentMethod)) return res.status(400).json({ message: "Invalid paymentMethod" });

  try {
    const order = await prisma.$transaction(async (tx) => {
      // 1. Fetch cart — select only needed fields (no over-fetch)
      const cartItems = await tx.cartItem.findMany({
        where:   { userId: req.user._id },
        include: {
          medicine: {
            select: { id: true, name: true, price: true, stock: true, requiresPrescription: true },
          },
        },
      });
      if (!cartItems.length) throw Object.assign(new Error("Cart is empty"), { status: 400 });

      // 2. Validate prescription requirement
      if (cartItems.some((i) => i.medicine.requiresPrescription)) {
        if (!prescriptionId) throw Object.assign(new Error("Prescription required for one or more items"), { status: 400 });
        const rx = await tx.prescription.findFirst({
          where: { id: parseInt(prescriptionId), userId: req.user._id, status: { not: "REJECTED" } },
        });
        if (!rx) throw Object.assign(new Error("Invalid or rejected prescription"), { status: 400 });
      }

      // 3. Compute total (read stock from cart fetch — locks happen at decrement step)
      const total = cartItems.reduce((s, i) => s + parseFloat(i.medicine.price) * i.quantity, 0);

      // 4. Get race-condition-free sequence value for order number
      const [seqRow] = await tx.$queryRaw`SELECT nextval('order_number_seq') AS nextval`;
      const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(seqRow.nextval).padStart(6, "0")}`;

      // 5. Create order with items in one nested write
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId:          req.user._id,
          totalAmount:     parseFloat(total.toFixed(2)),
          shippingAddress: shippingAddress.trim(),
          paymentMethod,
          prescriptionId:  prescriptionId ? parseInt(prescriptionId) : null,
          items: {
            create: cartItems.map((i) => ({
              medicineId:      i.medicine.id,
              medicineName:    i.medicine.name,
              priceAtPurchase: parseFloat(i.medicine.price),
              quantity:        i.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // 6. Atomic stock decrement with guard — UPDATE ... WHERE stock >= qty
      //    If affected rows = 0, stock was insufficient → rollback
      for (const item of cartItems) {
        const affected = await tx.$executeRaw`
          UPDATE medicines
          SET    stock = stock - ${item.quantity}
          WHERE  id    = ${item.medicine.id}
          AND    stock >= ${item.quantity}
        `;
        if (affected === 0) {
          throw Object.assign(
            new Error(`Insufficient stock for "${item.medicine.name}"`),
            { status: 400 }
          );
        }
      }

      // 7. Clear cart
      await tx.cartItem.deleteMany({ where: { userId: req.user._id } });

      return newOrder;
    });

    res.status(201).json({ data: fmtOrder(order) });
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

// GET /api/orders
export const getMyOrders = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 0, 0);
    const size = Math.min(Math.max(parseInt(req.query.size) || 10, 1), 50);

    // Promise.all — true parallel on separate pool connections (not inside a transaction)
    const [total, orders] = await Promise.all([
      prisma.order.count({ where: { userId: req.user._id } }),
      prisma.order.findMany({
        where:   { userId: req.user._id },
        select:  {
          id: true, orderNumber: true, userId: true, totalAmount: true,
          shippingAddress: true, paymentMethod: true, status: true,
          prescriptionId: true, createdAt: true, updatedAt: true,
          items: { select: { id: true, medicineId: true, medicineName: true, priceAtPurchase: true, quantity: true } },
        },
        orderBy: { createdAt: "desc" },
        skip:    page * size,
        take:    size,
      }),
    ]);

    res.json({
      data: {
        content:       orders.map(fmtOrder),
        totalElements: total,
        totalPages:    Math.ceil(total / size),
        page,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/admin/all
export const adminGetOrders = async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page) || 0, 0);
    const size  = Math.min(Math.max(parseInt(req.query.size) || 20, 1), 100);
    const where = req.query.status ? { status: req.query.status } : {};

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        select: {
          id: true, orderNumber: true, userId: true, totalAmount: true,
          shippingAddress: true, paymentMethod: true, status: true,
          prescriptionId: true, createdAt: true, updatedAt: true,
          items: { select: { id: true, medicineId: true, medicineName: true, priceAtPurchase: true, quantity: true } },
        },
        orderBy: { createdAt: "desc" },
        skip:    page * size,
        take:    size,
      }),
    ]);

    res.json({
      data: {
        content:       orders.map(fmtOrder),
        totalElements: total,
        totalPages:    Math.ceil(total / size),
        page,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/orders/admin/:id/status
export const adminUpdateOrderStatus = (io) => async (req, res) => {
  const VALID = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const { status } = req.query;
  if (!VALID.includes(status)) return res.status(400).json({ message: "Invalid status" });

  try {
    const order = await prisma.order.update({
      where:  { id: parseInt(req.params.id) },
      data:   { status },
      select: { id: true, status: true, orderNumber: true, userId: true },
    });

    // Emit real-time update to the order-owner's room
    io?.to(`orders:${order.userId}`).emit("shipment:status", {
      orderId:     order.id,
      orderNumber: order.orderNumber,
      status:      order.status,
    });

    res.json({ data: order });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Order not found" });
    res.status(500).json({ message: err.message });
  }
};
