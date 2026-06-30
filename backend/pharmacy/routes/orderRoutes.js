import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { placeOrder, getMyOrders, adminGetOrders, adminUpdateOrderStatus } from "../controllers/orderController.js";

// Accept io so the admin status-update handler can emit socket events.
// When io is omitted (e.g. in tests that don't need socket), the controller
// gracefully skips the emit via optional-chaining.
const createOrderRouter = (io) => {
  const router = Router();

  // Admin routes first to avoid /:id capturing "admin"
  router.get("/admin/all",          verifyToken, adminGuard, adminGetOrders);
  router.patch("/admin/:id/status", verifyToken, adminGuard, adminUpdateOrderStatus(io));

  router.post("/", verifyToken, placeOrder);
  router.get("/",  verifyToken, getMyOrders);

  return router;
};

export default createOrderRouter;
