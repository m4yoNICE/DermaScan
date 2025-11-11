import express from "express";
import { User } from "../../src/models/User.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export async function adminFetchUsers() {
  return await User.findAll();
}

export default router;
