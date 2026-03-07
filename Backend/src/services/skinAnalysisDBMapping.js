import { skinConditions, skinAnalysis } from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";

export async function fetchAnalysisLogsByUser(user_id) {
  return await db.query.skinAnalysis.findMany({
    where: eq(skinAnalysis.userId, user_id),
  });
}

export async function mapSkinResultToCatalog(user_id, skinResult) {
  if (!skinResult?.top3) return null;

  const top1 = skinResult.top3[0];
  const top3 = skinResult.top3;

  const condition = await findConditionByLabel(top1.label);
  if (!condition) return null;

  const status = checkResults(top1, top3, condition);
  const transactionId = await insertTransaction(
    user_id,
    condition.id,
    top1.score,
    status,
  );

  return await getTransactionWithCondition(transactionId);
}

async function findConditionByLabel(label) {
  const [condition] = await db
    .select({
      id: skinConditions.id,
      condition: skinConditions.condition,
      canRecommend: skinConditions.canRecommend,
    })
    .from(skinConditions)
    .where(eq(skinConditions.condition, label))
    .limit(1);

  return condition;
}

async function insertTransaction(userId, conditionId, score, status) {
  const [inserted] = await db
    .insert(skinAnalysis)
    .values({
      userId,
      //image id will be updated after checking status
      imageId: null,
      conditionId,
      confidenceScores: score,
      status,
    })
    .$returningId();

  return inserted.id;
}

export async function getTransactionWithCondition(transactionId) {
  const [result] = await db
    .select({
      id: skinAnalysis.id,
      userId: skinAnalysis.userId,
      //image id will be updated after checking status
      imageId: skinAnalysis.imageId,
      conditionId: skinAnalysis.conditionId,
      confidenceScores: skinAnalysis.confidenceScores,
      status: skinAnalysis.status,
      createdAt: skinAnalysis.createdAt,
      updatedAt: skinAnalysis.updatedAt,
      condition_name: skinConditions.condition,
      canRecommend: skinConditions.canRecommend,
    })
    .from(skinAnalysis)
    .leftJoin(skinConditions, eq(skinAnalysis.conditionId, skinConditions.id))
    .where(eq(skinAnalysis.id, transactionId))
    .limit(1);

  return result;
}

function checkResults(top1, top3, condition) {
  if (top1.score < 0.55) return "out of scope";
  const margin = top1.score - top3[2].score;
  if (margin < 0.15) return "out of scope";
  if (condition.canRecommend.toLowerCase() === "no") return "flagged";
  return "success";
}
