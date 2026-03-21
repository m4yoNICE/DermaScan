export function buildAnalysisDescription(analysisData, top3) {
  if (!top3 || top3.length === 0) return null;

  const parts = [];
  const top1 = top3[0];
  const top2 = top3[1] ?? null;
  const top3rd = top3[2] ?? null;

  parts.push(`Your skin shows signs of ${top1.label} with a confidence level of ${(top1.score * 100).toFixed(2)}%.`);
  if (top2) parts.push(`Possible: ${top2.label} (${(top2.score * 100).toFixed(2)}%).`);
  if (top3rd) parts.push(`Also detected: ${top3rd.label} (${(top3rd.score * 100).toFixed(2)}%).`);

  return parts.join(" ");
}

export function buildRecommendDescription(conditionData, recommendationResult) {
  const condition = conditionData?.condition ?? "your condition";
  const ingredients = conditionData?.targetIngredients ?? null;
  const count = recommendationResult?.length ?? 0;

  const parts = [];
  parts.push(`For ${condition}, look for products containing ${ingredients ?? "general skincare ingredients"}.`);

  if (count > 0) {
    parts.push(`We found ${count} product(s) that may suit your skin.`);
  } else {
    parts.push("We currently have no matching products in our catalog.");
  }

  return parts.join(" ");
}