import express from "express";
import Authlogin from "../adminController/adminAuthController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";
import { getAllUsers } from "../adminauth/adminUserManagementController.js";
const router = express.Router();

router.post("/admin/login", Authlogin);
router.get("/admin/data", verifyToken, checkAdmin, getAllUsers);

export default router;
