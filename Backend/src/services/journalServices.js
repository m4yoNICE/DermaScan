import Journal from "../models/Journal.js";

export async function getAllJournal(user_id) {
  return await Journal.findAll({ where: { user_id } });
}

export async function getSingleJournalByDate(user_id, date) {
  return await Journal.findOne({ where: { user_id, journal_date: date } });
}

export async function createJournal(user_id, journal_text, journal_date) {
  return await Journal.create({ journal_text, user_id, journal_date });
}

export async function updateJournal(user_id, journal_id, journal_text) {
  return await Journal.update(
    { journal_text },
    { where: { id: journal_id, user_id } }
  );
}

export async function deleteJournal(user_id, journal_id) {
  return await Journal.destroy({
    where: { id: journal_id, user_id },
  });
}
