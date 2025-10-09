import express from "express";
import {
  edituser,
  deleteuser,
  getuserid,
  updateskindata,
} from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/skin", verifyToken, updateskindata);
router.get("/", verifyToken, getuserid);
router.put("/", verifyToken, edituser);
router.delete("/", verifyToken, deleteuser);

export default router;
