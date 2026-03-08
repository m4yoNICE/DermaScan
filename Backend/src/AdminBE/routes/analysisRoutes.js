import express from "express";
import { handleGetAllAnalysis } from "../controllers/analysisController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", verifyToken, checkAdmin, handleGetAllAnalysis);

export default router;