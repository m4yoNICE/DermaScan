import {
  conditionProducts,
  skinCareProducts,
  skinData,
} from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";

export async function getSkinData(user_id) {
  const [result] = await db
    .select({
      skinType: skinData.skinType,
      skinSensitivity: skinData.skinSensitivity,
      pigmentation: skinData.pigmentation,
      aging: skinData.aging,
    })
    .from(skinData)
    .where(eq(skinData.userId, user_id))
    .limit(1);

  return result;
}

export async function matchProductByCondition(condition_id) {
  const results = await db
    .select({
      id: skinCareProducts.id,
      productName: skinCareProducts.productName,
      productImage: skinCareProducts.productImage,
      ingredient: skinCareProducts.ingredient,
      description: skinCareProducts.description,
      productType: skinCareProducts.productType,
      locality: skinCareProducts.locality,
      skinType: skinCareProducts.skinType,
      dermaTested: skinCareProducts.dermaTested,
      timeRoutine: skinCareProducts.timeRoutine,
    })
    .from(conditionProducts)
    .innerJoin(
      skinCareProducts,
      eq(conditionProducts.productId, skinCareProducts.id),
    )
    .where(eq(conditionProducts.conditionId, condition_id));

  return results;
}

export function filterBySkinType(products, userSkinData) {
  const { skinType, skinSensitivity, pigmentation, aging } = userSkinData;
  console.log("getted skin data in filter by skin type: ", {
    skinType,
    skinSensitivity,
    pigmentation,
    aging,
  });

  return products.filter((product) => {
    const productSkinType = product.skinType?.toLowerCase() ?? "";
    if (skinType && !productSkinType.includes(skinType.toLowerCase()))
      return false;
    if (
      skinSensitivity &&
      !productSkinType.includes(skinSensitivity.toLowerCase())
    )
      return false;
    if (pigmentation && !productSkinType.includes(pigmentation.toLowerCase()))
      return false;
    if (aging && !productSkinType.includes(aging.toLowerCase())) return false;
    return true;
  });
}

export function scoreProducts(products, userLocality = "Philippines") {
  const scored = products.map((product) => {
    let score = 0;

    if (product.dermaTested === true) score += 50;
    if (product.locality?.toLowerCase() === userLocality.toLowerCase())
      score += 30;

    return { ...product, score };
  });

  return scored.sort((a, b) => b.score - a.score);
}

export function saveRecommendations(analysis_id, scoredProducts) {
  if (!scoredProducts.length) return null;

  const values = scoredProducts.map((product) => ({
    analysisId: shit,
  }));

  return values;
}
