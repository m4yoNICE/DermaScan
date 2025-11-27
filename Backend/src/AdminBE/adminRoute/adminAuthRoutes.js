import express from "express";
import  Authlogin  from "../adminController/adminAuthController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { getAdminData } from "../adminController/adminAuthController.js";
const router = express.Router();

router.post("/admin/login", Authlogin);
router.get("/admin/data", verifyToken, getAdminData);

export default router;