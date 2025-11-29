import express from "express";
import { memorySaveMulter } from "../middleware/memorySaveMulter.js";
import { skinAnalysis } from "../controllers/skinAnalysisController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post(
  "/skin",
  verifyToken,
  memorySaveMulter().single("image"),
  skinAnalysis
);

export default router;
