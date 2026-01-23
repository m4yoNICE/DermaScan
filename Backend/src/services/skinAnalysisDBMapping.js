import SkinAnalysisTransaction from "../models/SkinAnalysisTransaction.js";
import SkinCondition from "../models/SkinCondition.js";





export async function mapSkinResultToCatalog(user_id, skinResult) {
  if (!skinResult || !skinResult.top3) return null;

  const top1 = skinResult.top3[0];
  const top3 = skinResult.top3;
  const condition = await SkinCondition.findOne({
    where: { condition: top1.label },
  });
  if (!condition) {
    return null;
  }
  const status = checkResults(top1, top3, condition);
  return await SkinAnalysisTransaction.create({
    user_id,
    image_id: null,
    condition_id: condition.id,
    confidence_scores: top1.score,
    status,
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
  return await SkinCondition.findByPk(condition_id);
}
