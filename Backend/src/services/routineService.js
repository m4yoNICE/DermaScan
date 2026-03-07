import {
  userRoutine,
  routineNotifications,
  routineLogs,
  skinCareProducts,
  productRecommendations,
} from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";

export async function fetchRoutineNotifications(userId) {
  const results = await db
    .select({
      id: routineNotifications.id,
      analysisId: routineNotifications.analysisId,
      recommendationId: routineNotifications.recommendationId,
      lastCompletedAt: routineNotifications.lastCompletedAt,
      productName: skinCareProducts.productName,
      productImage: skinCareProducts.productImage,
      productType: skinCareProducts.productType,
      timeRoutine: skinCareProducts.timeRoutine,
    })
    .from(routineNotifications)
    .innerJoin(
      productRecommendations,
      eq(routineNotifications.recommendationId, productRecommendations.id),
    )
    .innerJoin(
      skinCareProducts,
      eq(productRecommendations.productId, skinCareProducts.id),
    )
    .where(eq(routineNotifications.userId, userId));

  return results;
}

export async function completeRoutineNotification(notificationId) {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  await db
    .update(routineNotifications)
    .set({ lastCompletedAt: now })
    .where(eq(routineNotifications.id, notificationId));

  return await db.query.routineNotifications.findFirst({
    where: eq(routineNotifications.id, notificationId),
  });
}

export async function fetchRoutineLogs(userId) {
  return await db.query.routineLogs.findMany({
    where: eq(routineLogs.userId, userId),
  });
}

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
