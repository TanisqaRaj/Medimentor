import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";

const router = Router();

router.use(verifyToken);

router.get("/",                getCart);
router.post("/items",          addToCart);
router.put("/items/:itemId",   updateCartItem);
router.delete("/items/:itemId",removeCartItem);

export default router;
