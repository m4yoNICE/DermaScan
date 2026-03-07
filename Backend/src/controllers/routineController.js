import {
  insertUserRoutine,
  updateUserRoutine,
  fetchRoutineNotifications,
  completeRoutineNotification,
  fetchRoutineLogs,
} from "../services/routineService.js";

export async function getRoutineNotifications(req, res) {
  try {
    const result = await fetchRoutineNotifications(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function markNotificationDone(req, res) {
  try {
    const { id } = req.params;
    const result = await completeRoutineNotification(id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getRoutineLogs(req, res) {
  try {
    const result = await fetchRoutineLogs(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function setUserRoutine(req, res) {
  try {
    const { morningTime, eveningTime } = req.body;
    const userId = req.user.id;

    if (!morningTime || !eveningTime) {
      return res.status(400).json({ error: "Both times are required" });
    }

    const result = await insertUserRoutine(userId, morningTime, eveningTime);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function editUserRoutine(req, res) {
  try {
    const { morningTime, eveningTime } = req.body;
    const userId = req.user.id;

    if (!morningTime || !eveningTime) {
      return res.status(400).json({ error: "Both times are required" });
    }

    const result = await updateUserRoutine(userId, morningTime, eveningTime);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
