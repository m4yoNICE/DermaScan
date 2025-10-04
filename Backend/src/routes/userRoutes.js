import express from "express";
import {
  edituser,
  deleteuser,
  getuserid,
} from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, getuserid);
router.put("/", verifyToken, edituser);
router.delete("/", verifyToken, deleteuser);

export default router;
