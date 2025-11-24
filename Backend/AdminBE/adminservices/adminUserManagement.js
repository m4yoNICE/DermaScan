import express from "express";
import { User } from "../../src/models/User.js";

const router = express.Router();

export async function adminFetchUsers() {
  return await User.findAll();
}

export default router;