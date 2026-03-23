function formatLabel(rawLabel) {
  // "acne-blackheads-mild" → "Acne Blackheads"
  const parts = rawLabel.split("-");
  const severities = ["mild", "moderate", "severe"];
  const filtered = parts.filter((p) => !severities.includes(p));
  return filtered.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function buildAnalysisDescription(analysisData, top3) {
  if (!top3 || top3.length === 0) return null;
  const label = formatLabel(top3[0].label);
  return `Your skin shows signs of ${label}.`;
}

export function buildRecommendDescription(conditionData, recommendationResult) {
  const condition = conditionData?.condition ?? "your condition";
  const ingredients = conditionData?.targetIngredients ?? null;
  const count = recommendationResult?.length ?? 0;

  const parts = [];
  parts.push(
    `For ${condition}, look for products containing ${ingredients ?? "general skincare ingredients"}.`,
  );

  if (count > 0) {
    parts.push(`We found ${count} product(s) that may suit your skin.`);
  } else {
    parts.push("We currently have no matching products in our catalog.");
  }

  return parts.join(" ");
}
