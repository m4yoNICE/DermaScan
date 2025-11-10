import express from "express";
import {
  login,
  register,
  forgetpassword,
} from "../controllers/authControllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgetpassword", forgetpassword);

export default router;
