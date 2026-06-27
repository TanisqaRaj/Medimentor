import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { listMedicines, getMedicine, createMedicine, updateMedicine, deleteMedicine, uploadMedicineImage } from "../controllers/medicineController.js";

const router = Router();

router.get("/",           listMedicines);
router.get("/:id",        getMedicine);
router.post("/upload-image", verifyToken, adminGuard, uploadMedicineImage);
router.post("/",          verifyToken, adminGuard, createMedicine);
router.put("/:id",        verifyToken, adminGuard, updateMedicine);
router.delete("/:id",     verifyToken, adminGuard, deleteMedicine);

export default router;
