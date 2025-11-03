import express from "express";
import { memorySaveMulter } from "../middleware/memorySaveMulter.js";
import { uploadskinimage } from "../controllers/imageControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post(
  "/skin",
  verifyToken,
  memorySaveMulter().single("image"),
  uploadskinimage
);

export default router;
