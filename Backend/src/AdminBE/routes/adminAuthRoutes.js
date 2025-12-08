import express from "express";
import { AuthLogin } from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login", AuthLogin);

export default router;
