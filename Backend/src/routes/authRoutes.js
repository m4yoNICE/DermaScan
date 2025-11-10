import express from "express";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { login, register } from "../controllers/authControllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/admin/login", checkAdmin, login);
router.post("/register", register);
router.post("/forget", forgetpassword);

export default router;
