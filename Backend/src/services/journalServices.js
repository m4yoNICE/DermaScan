import prisma from "../config/prisma.js";
export async function getAllJournal(user_id) {
  return await prisma.journal.findMany({ where: { user_id } });
}

export async function getSingleJournalByDate(user_id, date) {
  return await prisma.journal.findFirst({
    where: { user_id, journal_date: date },
  });
}

export async function createJournal(user_id, journal_text, journal_date) {
  return await prisma.journal.create({
    data: { journal_text, user_id, journal_date: new Date(journal_date) },
  });
}

export async function updateJournal(user_id, journal_id, journal_text) {
  return await prisma.journal.updateMany({
    where: { id: journal_id, user_id },
    data: { journal_text },
  });
}

export async function deleteJournal(user_id, journal_id) {
  return await prisma.journal.deleteMany({
    where: { id: journal_id, user_id },
  });
}
