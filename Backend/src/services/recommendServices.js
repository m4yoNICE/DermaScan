import {
  productRecommendations,
  skinAnalysis,
  skinConditions,
  storedImages,
  skinCareProducts,
} from "../drizzle/schema.js";
import { db } from "../config/db.js";

import { db } from "../config/db.js";

export async function insertRecommendations(analysisId, productIds) {
  const values = productIds.map((productId) => ({
    analysisId,
    productId,
  }));

  await db.insert(productRecommendations).values(values);
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
        analysisId: row.analysisId,
        createdAt: row.createdAt,
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
