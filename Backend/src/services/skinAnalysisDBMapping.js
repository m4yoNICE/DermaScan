import prisma from "../config/prisma.js";

export async function mapSkinResultToCatalog(user_id, skinResult) {
  if (!skinResult || !skinResult.top3) return null;

  const top1 = skinResult.top3[0];
  const top3 = skinResult.top3;
  const condition = await prisma.skinCondition.findFirst({
    where: { condition: top1.label },
  });
  if (!condition) {
    return null;
  }
  const status = checkResults(top1, top3, condition);
  return prisma.skinAnalysisTransaction.create({
    data: {
      user_id,
      image_id: null,
      condition_id: condition.id,
      confidence_scores: top1.score,
      status,
    },
  });
}

function checkResults(top1, top3, condition) {
  if (top1.score < 0.55) return "out of scope";
  const margin = top1.score - top3[2].score;
  if (margin < 0.15) return "out of scope";
  if (condition.can_recommend.toLowerCase() === "no") return "flagged";

  return "success";
}

export async function findCondtionById(condition_id) {
  return prisma.skinCondition.findUnique({ where: { id: condition_id } });
}
