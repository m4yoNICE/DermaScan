import {
  insertUserRoutine,
  updateUserRoutine,
  fetchRoutineProducts,
  insertReminderLog,
  fetchReminderLogs,
  fetchRoutineSchedule,
} from "../services/routineServices.js";

export async function getRoutineProducts(req, res) {
  try {
    const result = await fetchRoutineProducts(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function completeSchedule(req, res) {
  try {
    const { schedule } = req.body;
    const userId = req.user.id;

    if (!schedule) {
      return res.status(400).json({ error: "Schedule is required" });
    }

    await insertReminderLog(userId, schedule);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getReminderLogs(req, res) {
  try {
    const result = await fetchReminderLogs(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getRoutineSchedule(req, res) {
  try {
    const result = await fetchRoutineSchedule(req.user.id);
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
