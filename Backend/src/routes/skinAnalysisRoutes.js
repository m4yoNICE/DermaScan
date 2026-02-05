import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getConditionNameByID } from "../controllers/skinAnalysisController.js";
import { skinAnalysis } from "../controllers/skinAnalysisController.js";
import { memorySaveMulter } from "../middleware/memorySaveMulter.js";

const router = express.Router();

router.get("/:id", verifyToken, getConditionNameByID);
router.post(
  "/skin",
  verifyToken,
  memorySaveMulter().single("image"),
  skinAnalysis,
);
export default router;
