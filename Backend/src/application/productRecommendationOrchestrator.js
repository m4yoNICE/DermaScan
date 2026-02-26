import {
  filterBySkinType,
  getSkinData,
  matchProductByCondition,
  scoreProducts,
} from "../services/productRecommendationServices.js";

export async function recommendOrchestrator(
  analysis_id,
  user_id,
  condition_id,
) {
  try {
    const skinData = await getSkinData(user_id);
    console.log("Phase 1 - skinData:", skinData);
    if (!skinData) return null;

    const matchedProducts = await matchProductByCondition(condition_id);
    console.log("Phase 2 - matchedProducts:", matchedProducts);
    if (!matchedProducts.length) return null;

    const filteredProducts = filterBySkinType(matchedProducts, skinData);
    console.log("Phase 3 - filteredProducts:", filteredProducts);
    if (!filteredProducts.length) return null;

    const scoredProducts = scoreProducts(filteredProducts);
    console.log("Phase 4 - scoredProducts:", scoredProducts);

    return scoredProducts;
  } catch (error) {
    console.error("FATAL ERROR in recommendOrchestrator:", error);
    return null;
  }
}
