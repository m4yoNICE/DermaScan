import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getConditionNameByID } from "../controllers/skinAnalysisController.js";

const router = express.Router();

router.get("/:id", verifyToken, getConditionNameByID);

export default router;
