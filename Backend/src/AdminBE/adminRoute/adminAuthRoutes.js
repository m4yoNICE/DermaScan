import express from "express";
import Authlogin from "../adminController/adminAuthController.js";
// import {createUser} from "../adminController/adminUserManagementController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";
import  getAllUsers  from "../adminauth/adminUserManagementController.js";
const router = express.Router();

router.post("/admin/login", Authlogin);
router.get("/admin/data", verifyToken, checkAdmin, getAllUsers);
router.get("/admin/users", verifyToken, getAllUsers);
// router.post("/admin/create-user", createUser);

export default router;
