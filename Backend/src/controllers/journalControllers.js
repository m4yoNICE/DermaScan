import {
  getAllJournal,
  createJournal,
  updateJournal,
  deleteJournal,
  getSingleJournalByDate,
} from "../services/journalServices.js";

export async function getsinglejournalbydate(req, res) {
  try {
    const userId = req.user.id;
    const { date } = req.params;
    console.log("Fetching journal for date:", date, "and userId:", userId);
    const journal = await getSingleJournalByDate(userId, date);
    if (!journal) {
      return res.status(200).json({ data: null });
    }
    return res.status(200).json(journal);
  } catch (err) {
    console.error("Error fetching single journal:", err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function getalljournal(req, res) {
  try {
    const userId = req.user.id;
    const journal = await getAllJournal(userId);
    return res.status(200).json(journal);
  } catch (err) {
    console.error("Error fetching all journal:", err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function createjournal(req, res) {
  try {
    const userId = req.user.id;
    const { date, journal_text } = req.body;
    console.log(date, journal_text, userId);
    const journal = await createJournal(userId, journal_text, date);
    if (!journal) {
      return res.status(400).json({ error: journal });
    }
    return res.status(200).json(journal);
  } catch (err) {
    console.error("Error creating journal:", err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function updatejournal(req, res) {
  try {
    const userId = req.user.id;
    const journalId = req.params.id;
    const { journal_text } = req.body;
    console.log("userId:", userId);
    console.log("journalId:", journalId);
    console.log("journal_text:", journal_text);
    const updated = await updateJournal(userId, journalId, journal_text);
    console.log("updated result:", updated);

    if (!updated) {
      return res.status(404).json({ error: "Journal not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating journal:", err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function deletejournal(req, res) {
  try {
    const userId = req.user.id;
    const journalId = req.params.id;
    const deleted = await deleteJournal(userId, journalId);
    if (!deleted) {
      return res.status(404).json({ error: "Journal not found" });
    }
    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (err) {
    console.error("Error creating journal:", err);
    res.status(500).json({ error: "Server error" });
  }
}
