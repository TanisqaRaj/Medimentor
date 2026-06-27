import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../../middleware/verifyToken.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { upload, uploadPrescription, myPrescriptions, adminListPrescriptions, adminUpdatePrescription } from "../controllers/prescriptionController.js";

const router = Router();

// Wrap multer so its errors are returned as JSON, not Express default HTML
const uploadMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(err.status ?? 400).json({ message: err.message });
    }
    next();
  });
};

router.get("/my",          verifyToken, myPrescriptions);
router.post("/upload",     verifyToken, uploadMiddleware, uploadPrescription);
router.get("/admin",       verifyToken, adminGuard, adminListPrescriptions);
router.patch("/admin/:id", verifyToken, adminGuard, adminUpdatePrescription);

export default router;
