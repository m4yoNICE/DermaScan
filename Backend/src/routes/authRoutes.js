import express from "express";
import {
  login,
  register,
  forgetPassword,
  checkOtp,
} from "../controllers/authControllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgetpassword", forgetPassword);
router.post("/checkOTP", checkOtp);

export default router;