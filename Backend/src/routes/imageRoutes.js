import express from "express";
import { uploadskinimage } from "../controllers/imageControllers.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post(
  "/skin",
  verifyToken,
  uploadMiddleware().single("image"),
  uploadskinimage
);

export default router;
