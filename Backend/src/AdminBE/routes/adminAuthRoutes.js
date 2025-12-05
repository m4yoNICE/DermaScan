import express from "express";
import {
  AuthLogin,
  createUsers,
  UpdateUser,
  getUserById,
  DeleteUser,
  getAllUsers,
} from "../controllers/adminAuthController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";
const router = express.Router();

router.post("/admin/login", AuthLogin);
router.get("/admin/data", verifyToken, checkAdmin, getAllUsers);
router.get("/admin/users", verifyToken, getAllUsers);
router.post("/admin/create-user", createUsers);
router.put("/admin/update-user/:id", UpdateUser);
router.get("/admin/users/:id", getUserById);
router.delete("/admin/users/:id", DeleteUser);
export default router;
