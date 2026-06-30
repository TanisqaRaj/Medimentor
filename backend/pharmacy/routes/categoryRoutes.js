import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { listCategories, createCategory, deleteCategory } from "../controllers/categoryController.js";

const router = Router();

router.get("/",          listCategories);
router.post("/",         verifyToken, adminGuard, createCategory);
router.delete("/:id",    verifyToken, adminGuard, deleteCategory);

export default router;
