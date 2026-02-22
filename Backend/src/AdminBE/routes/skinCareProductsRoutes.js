import express from "express";
import * as skinCareController from "../controllers/skinCareProductController.js"
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";

const router = express.Router();

router.get("/getSkinProducts", verifyToken, checkAdmin, skinCareController.getAllProducts);
router.get("/getSkinProductsById/:id", verifyToken, checkAdmin, skinCareController.getProductById);
router.post("/createSkinProduct", verifyToken, checkAdmin, skinCareController.createProduct);
router.put("/updateSkinProduct/:id", verifyToken, checkAdmin, skinCareController.updateProduct);
router.delete("/deleteSkinProduct/:id", verifyToken, checkAdmin, skinCareController.deleteProduct);

export default router;