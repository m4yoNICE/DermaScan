import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAdmin } from "../../middleware/checkAdmin.js";
import {
  getAdminData,
  createUsers,
  updateUser,
  getUserById,
  getAllUsers,
  deleteUser,
} from "../controllers/adminUsersController.js";
import { 
  getScanPerDay,
  getOutOfScopeStatistics
} from "../services/adminAnalysisLog.js";
const router = express.Router();

router.get("/admin", verifyToken, checkAdmin, getAdminData);
router.get("/getData", verifyToken, checkAdmin, getAllUsers);
router.get("/getById/:id", verifyToken, checkAdmin, getUserById);
router.post("/", verifyToken, checkAdmin, createUsers);
router.put("/:id", verifyToken, checkAdmin, updateUser);
<<<<<<< HEAD
router.delete("/:id", verifyToken, checkAdmin, deleteUser);
router.get("/stats/scans", verifyToken, checkAdmin, getScanPerDay);
router.get("/stats/out-of-scope", verifyToken, checkAdmin, getOutOfScopeStatistics);
=======
router.delete("/delete/:id", verifyToken, checkAdmin, deleteUser);
>>>>>>> 655f91e83bd85e6a53ce18599574e9051a541594

export default router;