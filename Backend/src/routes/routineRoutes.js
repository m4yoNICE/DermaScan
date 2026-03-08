import express from "express";
import {
  setUserRoutine,
  editUserRoutine,
  getRoutineProducts,
  completeSchedule,
  getReminderLogs,
  getRoutineSchedule,
} from "../controllers/routineController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/schedule", verifyToken, getRoutineSchedule);
router.post("/schedule", verifyToken, setUserRoutine);
router.put("/schedule", verifyToken, editUserRoutine);
router.get("/products", verifyToken, getRoutineProducts);
router.post("/complete", verifyToken, completeSchedule);
router.get("/logs", verifyToken, getReminderLogs);

export default router;
