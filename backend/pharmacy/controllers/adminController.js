import prisma from "../pgClient.js";

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalMedicines,
      lowStockCount,
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      revenueResult,
      pendingPrescriptions,
    ] = await Promise.all([
      prisma.medicine.count(),
      prisma.medicine.count({ where: { stock: { lt: 10 } } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: "CANCELLED" } } }),
      prisma.prescription.count({ where: { status: "PENDING" } }),
    ]);

    res.json({
      data: {
        totalMedicines,
        lowStockCount,
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: parseFloat(revenueResult._sum.totalAmount ?? 0),
        pendingPrescriptions,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
