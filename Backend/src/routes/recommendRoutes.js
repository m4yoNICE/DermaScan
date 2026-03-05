import express from "express";
import * as recommendController from "../controllers/recommendController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, recommendController.getHistory);
router.post("/", verifyToken, recommendController.saveRecommendation);

export default router;
