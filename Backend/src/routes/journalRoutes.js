import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getalljournal,
  createjournal,
  updatejournal,
  deletejournal,
  getsinglejournalbydate,
} from "../controllers/journalControllers.js";
const router = express.Router();

router.get("/", verifyToken, getalljournal);
router.get("/date/:date", verifyToken, getsinglejournalbydate);
router.post("/", verifyToken, createjournal);
router.put("/", verifyToken, updatejournal);
router.delete("/", verifyToken, deletejournal);

export default router;
