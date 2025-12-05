import express from "express";

import {
  createUsers,
  UpdateUser,
  getUserById,
  DeleteUser,
  getAllUsers,
} from "../controllers/adminAuthController.js";

import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";
const router = express.Router();

router.get("/", verifyToken, checkAdmin, getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUsers);
router.put("/:id", UpdateUser);
router.delete("/:id", DeleteUser);

export default router;
