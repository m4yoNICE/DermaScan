import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getImage } from "../controllers/imageControllers.js";
const router = express.Router();

router.get("/results/:id", verifyToken, getImage);

export default router;
