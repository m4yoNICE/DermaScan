import express from "express";
import {
  getAllUsers,
  getOneUser,
} from "../admincontrollers/adminUserManagementController.js";
const router = express.Router();

router.get("/:id", getOneUser);
router.get("/", getAllUsers);

export default router;
