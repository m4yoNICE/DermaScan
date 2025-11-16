import express from "express";
import {
  login,
  register,
  forgetpassword,
  checkotp,
} from "../controllers/authControllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgetpassword", forgetpassword);
router.post("/checkOTP", checkotp);

export default router;
