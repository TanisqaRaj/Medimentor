import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { getDashboardStats } from "../controllers/adminController.js";

const router = Router();

router.get("/dashboard/stats", verifyToken, adminGuard, getDashboardStats);

export default router;
