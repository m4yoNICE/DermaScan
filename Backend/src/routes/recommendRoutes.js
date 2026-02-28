import express from "express";
import * as recommendController from "../controllers/recommendController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, recommendController.saveRecommendation);
export default router;
