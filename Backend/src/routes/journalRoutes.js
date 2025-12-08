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
router.put("/:id", verifyToken, updatejournal);
router.delete("/:id", verifyToken, deletejournal);

export default router;
