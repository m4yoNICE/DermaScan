import express from "express";
import Authlogin from "../adminController/adminAuthController.js";
import {CreateUsers, UpdateUser,DeleteUser, getUserById} from "../adminController/adminAuthController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";
import  getAllUsers  from "../adminauth/adminUserManagementController.js";
const router = express.Router();

router.post("/admin/login", Authlogin);
router.get("/admin/data", verifyToken, checkAdmin, getAllUsers);
router.get("/admin/users", verifyToken, getAllUsers);
router.post("/admin/create-user", CreateUsers);
router.put("/admin/update-user/:id", UpdateUser);
router.get("/admin/users/:id", getUserById);
router.delete("/admin/users/:id",DeleteUser);

export default router;
