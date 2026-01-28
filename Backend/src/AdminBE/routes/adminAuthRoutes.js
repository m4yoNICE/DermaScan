import express from "express";
<<<<<<< HEAD
import { AuthLogin } from "../controllers/adminAuthController.js";
import {CreateUsers, UpdateUser,DeleteUser, getUserById} from "../adminController/adminAuthController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";
import  getAllUsers  from "../adminauth/adminUserManagementController.js";


const router = express.Router();

router.post("/login", AuthLogin);
router.get("/data", verifyToken, checkAdmin, getAllUsers);
router.get("/admin/users", verifyToken, getAllUsers);
router.post("/admin/create-user", CreateUsers);
router.put("/admin/update-user/:id", UpdateUser);
router.get("/admin/users/:id", getUserById);
router.delete("/admin/users/:id",DeleteUser);
=======
import { login } from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login", login);
>>>>>>> 25beaf2c022d6d5fdbd4b90e2c60202308e6d51a

export default router;
