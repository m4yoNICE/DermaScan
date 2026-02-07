import { skinConditions, skinAnalysisTransactions } from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";

export async function mapSkinResultToCatalog(user_id, skinResult) {
  if (!skinResult || !skinResult.top3) return null;

  const top1 = skinResult.top3[0];
  const top3 = skinResult.top3;

  console.log("User ID: ", user_id);
  console.log("Skin Result: ", top3);
  console.log("1st Result: ", top1);
  console.log("1st Result Label: ", top1.label);

  //db call to find skin condition
  console.log("FINDING CONDITION");
  const [condition] = await db
    .select({
      id: skinConditions.id,
      condition: skinConditions.condition,
      canRecommend: skinConditions.canRecommend,
    })
    .from(skinConditions)
    .where(eq(skinConditions.condition, top1.label))
    .limit(1);

  console.log("Skin Condition Found on DB: ", condition);
  if (!condition) {
    return null;
  }

  console.log("INSERTING RESULTS");
  const status = checkResults(top1, top3, condition);
  const [inserted] = await db
    .insert(skinAnalysisTransactions)
    .values({
      userId: user_id,
      imageId: null,
      conditionId: condition.id,
      confidenceScores: top1.score,
      status,
    })
    .$returningId();

  return await db.query.skinAnalysisTransactions.findFirst({
    where: eq(skinAnalysisTransactions.id, inserted.id),
  });
}

function checkResults(top1, top3, condition) {
  if (top1.score < 0.55) return "out of scope";
  const margin = top1.score - top3[2].score;
  if (margin < 0.15) return "out of scope";
  if (condition.canRecommend.toLowerCase() === "no") return "flagged";

  return "success";
}

export async function findCondtionById(condition_id) {
  return await db.query.skinConditions.findFirst({
    where: eq(skinConditions.id, condition_id),
  });
}
