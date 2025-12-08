import express from "express";
import { memorySaveMulter } from "../middleware/memorySaveMulter.js";
import { skinAnalysis } from "../controllers/skinAnalysisController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getImage } from "../controllers/imageControllers.js";
const router = express.Router();

router.post(
  "/skin",
  verifyToken,
  memorySaveMulter().single("image"),
  skinAnalysis
);
router.get("/results/:id", verifyToken, getImage);

export default router;
