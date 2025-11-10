import express from "express";
import {
  loginAdmin,
  registerAdmin,
} from "../adminauth/adminUserManagementController.js";
const router = express.Router();

router.get("/", getOneUsers);
router.get("/", getAllUsers);

export default router;
