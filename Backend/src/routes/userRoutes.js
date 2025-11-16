import express from "express";
import {
  edituser,
  deleteuser,
  getuserid,
  createskindata,
  deleteskindata,
} from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.put("/skin", verifyToken, createskindata);
router.put("/skinreset", verifyToken, deleteskindata);
router.get("/", verifyToken, getuserid);
router.put("/", verifyToken, edituser);
router.delete("/", verifyToken, deleteuser);

export default router;
