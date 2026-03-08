import {
  userRoutine,
  reminderLogs,
  skinCareProducts,
  productRecommendations,
  skinAnalysis,
} from "../drizzle/schema.js";
import { getInstructions } from "../utils/routineInstructions.js";
import { db } from "../config/db.js";
import { eq, desc } from "drizzle-orm";

// fetch latest analysis products for checklist
export async function fetchRoutineProducts(userId) {
  const [latestAnalysis] = await db
    .select({ id: skinAnalysis.id })
    .from(skinAnalysis)
    .where(eq(skinAnalysis.userId, userId))
    .orderBy(desc(skinAnalysis.createdAt))
    .limit(1);

  if (!latestAnalysis) return [];

  const results = await db
    .select({
      id: productRecommendations.id,
      productName: skinCareProducts.productName,
      productImage: skinCareProducts.productImage,
      productType: skinCareProducts.productType,
      timeRoutine: skinCareProducts.timeRoutine,
      morningTime: userRoutine.morningTime,
      eveningTime: userRoutine.eveningTime,
    })
    .from(productRecommendations)
    .innerJoin(
      skinCareProducts,
      eq(productRecommendations.productId, skinCareProducts.id),
    )
    .leftJoin(userRoutine, eq(userRoutine.userId, userId))
    .where(eq(productRecommendations.analysisId, latestAnalysis.id));

  return results.map((row) => {
    const isMorning = row.timeRoutine?.toLowerCase().includes("morning");
    const isNight = row.timeRoutine?.toLowerCase().includes("night");
    let resolvedTime = row.timeRoutine;

    if (row.morningTime || row.eveningTime) {
      if (isMorning && isNight)
        resolvedTime = `${row.morningTime} / ${row.eveningTime}`;
      else if (isMorning) resolvedTime = row.morningTime;
      else if (isNight) resolvedTime = row.eveningTime;
    }

    return {
      id: row.id,
      productName: row.productName,
      productImage: row.productImage,
      productType: row.productType,
      timeRoutine: resolvedTime,
      instructions: getInstructions(row.productType),
    };
  });
}

// called when user completes all products for a schedule
export async function insertReminderLog(userId, schedule) {
  const today = new Date().toISOString().slice(0, 10);
  await db
    .insert(reminderLogs)
    .values({ userId, schedule, completedDate: today });
}

export async function fetchReminderLogs(userId) {
  return await db
    .select()
    .from(reminderLogs)
    .where(eq(reminderLogs.userId, userId));
}

export async function fetchRoutineSchedule(userId) {
  const result = await db
    .select({
      morningTime: userRoutine.morningTime,
      eveningTime: userRoutine.eveningTime,
    })
    .from(userRoutine)
    .where(eq(userRoutine.userId, userId));

  return result[0] ?? null;
}

//=======================this is for user schedule===============================
export async function insertUserRoutine(userId, morningTime, eveningTime) {
  await db.insert(userRoutine).values({ userId, morningTime, eveningTime });
  return await db.query.userRoutine.findFirst({
    where: eq(userRoutine.userId, userId),
  });
}

export async function updateUserRoutine(userId, morningTime, eveningTime) {
  await db
    .update(userRoutine)
    .set({ morningTime, eveningTime })
    .where(eq(userRoutine.userId, userId));
  return await db.query.userRoutine.findFirst({
    where: eq(userRoutine.userId, userId),
  });
}
