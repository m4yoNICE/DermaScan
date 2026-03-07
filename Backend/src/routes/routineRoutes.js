import express from "express";
import {
  setUserRoutine,
  editUserRoutine,
  getRoutineNotifications,
  markNotificationDone,
  getRoutineLogs,
} from "../controllers/routineController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/schedule", verifyToken, setUserRoutine);
router.put("/schedule", verifyToken, editUserRoutine);
router.get("/notifications", verifyToken, getRoutineNotifications);
router.put("/notifications/:id", verifyToken, markNotificationDone);
router.get("/logs", verifyToken, getRoutineLogs);

export default router;
