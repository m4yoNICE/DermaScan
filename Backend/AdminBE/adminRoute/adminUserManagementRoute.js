import express from "express";
import {
  loginAdmin,
} from "../adminauth/adminUserManagementController.js";
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/admin/login", checkAdmin, login);

export default router;