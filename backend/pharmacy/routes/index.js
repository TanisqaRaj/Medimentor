import { Router } from "express";
import categoryRoutes     from "./categoryRoutes.js";
import medicineRoutes     from "./medicineRoutes.js";
import cartRoutes         from "./cartRoutes.js";
import createOrderRouter  from "./orderRoutes.js";
import prescriptionRoutes from "./prescriptionRoutes.js";
import adminRoutes        from "./adminRoutes.js";

// io is optional — omit in test helpers that don't need socket
const createPharmacyRouter = (io) => {
  const router = Router();

  router.use("/categories",    categoryRoutes);
  router.use("/medicines",     medicineRoutes);
  router.use("/cart",          cartRoutes);
  router.use("/orders",        createOrderRouter(io));
  router.use("/prescriptions", prescriptionRoutes);
  router.use("/admin",         adminRoutes);

  return router;
};

export default createPharmacyRouter;
