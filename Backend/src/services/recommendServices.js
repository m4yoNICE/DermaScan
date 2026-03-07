import {
  productRecommendations,
  routineNotifications,
  skinAnalysis,
  skinConditions,
  storedImages,
  skinCareProducts,
} from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq, desc, and, inArray } from "drizzle-orm";

export async function insertRecommendations(userId, analysisId, productIds) {
  // insert product recommendations first
  const values = productIds.map((productId) => ({
    analysisId,
    productId,
  }));

  await db.insert(productRecommendations).values(values);
  //find the recommendations again
  const inserted = await db
    .select()
    .from(productRecommendations)
    .where(
      and(
        eq(productRecommendations.analysisId, analysisId),
        inArray(productRecommendations.productId, productIds),
      ),
    );

  // insert one notification row per recommendation
  const notifications = inserted.map((rec) => ({
    userId,
    analysisId,
    recommendationId: rec.id,
  }));

  return await db.insert(routineNotifications).values(notifications);
}

export async function fetchHistory(userId) {
  const rows = await db
    .select({
      analysisId: skinAnalysis.id,
      createdAt: skinAnalysis.createdAt,
      status: skinAnalysis.status,
      confidenceScores: skinAnalysis.confidenceScores,
      condition: skinConditions.condition,
      canRecommend: skinConditions.canRecommend,
      photoUrl: storedImages.photoUrl,
      productId: productRecommendations.productId,
      productName: skinCareProducts.productName,
      productType: skinCareProducts.productType,
      productImage: skinCareProducts.productImage,
      timeRoutine: skinCareProducts.timeRoutine,
    })
    .from(skinAnalysis)
    .leftJoin(skinConditions, eq(skinAnalysis.conditionId, skinConditions.id))
    .leftJoin(storedImages, eq(skinAnalysis.imageId, storedImages.id))
    .leftJoin(
      productRecommendations,
      eq(productRecommendations.analysisId, skinAnalysis.id),
    )
    .leftJoin(
      skinCareProducts,
      eq(productRecommendations.productId, skinCareProducts.id),
    )
    .where(eq(skinAnalysis.userId, userId))
    .orderBy(desc(skinAnalysis.createdAt));

  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.analysisId]) {
      grouped[row.analysisId] = {
        id: row.analysisId,
        createdAt: new Date(row.createdAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: row.status,
        confidenceScores: row.confidenceScores,
        condition: row.condition,
        canRecommend: row.canRecommend,
        photoUrl: row.photoUrl,
        products: [],
      };
    }
    if (row.productId) {
      grouped[row.analysisId].products.push({
        productId: row.productId,
        productName: row.productName,
        productType: row.productType,
        productImage: row.productImage,
        timeRoutine: row.timeRoutine,
      });
    }
  }

  return Object.values(grouped);
}
