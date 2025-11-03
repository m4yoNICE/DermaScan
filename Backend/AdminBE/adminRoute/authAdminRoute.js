import express from "express";
import { loginAdmin, registerAdmin } from "../adminauth/adminAuthController.js";
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);