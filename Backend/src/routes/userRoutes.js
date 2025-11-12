import express from "express";
import {
  edituser,
  deleteuser,
  getuserid,
  updateskindata,
  deleteskindata,
} from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.put("/skin", verifyToken, updateskindata);
router.put("/skinreset", verifyToken, deleteskindata);
router.get("/", verifyToken, getuserid);
router.put("/", verifyToken, edituser);
router.delete("/", verifyToken, deleteuser);

export default router;
