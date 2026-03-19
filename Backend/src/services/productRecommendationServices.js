import {
  skinCareProducts,
  skinProfile,
  skinConditions,
} from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";

export async function getSkinData(user_id) {
  const [result] = await db
    .select({
      skinType: skinProfile.skinType,
      skinSensitivity: skinProfile.skinSensitivity,
    })
    .from(skinProfile)
    .where(eq(skinProfile.userId, user_id))
    .limit(1);

  return result;
}

export async function getTargetIngredients(condition_id) {
  const [result] = await db
    .select({ targetIngredients: skinConditions.targetIngredients })
    .from(skinConditions)
    .where(eq(skinConditions.id, condition_id))
    .limit(1);

  if (!result?.targetIngredients) return [];

  return result.targetIngredients.split(",").map((i) => i.trim().toLowerCase());
}

export async function matchProductsByIngredients(targetIngredients) {
  if (!targetIngredients.length) return [];

  const allProducts = await db
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
    .from(skinCareProducts);

  return allProducts.filter((product) => {
    if (!product.ingredient) return false;
    const productIngredients = product.ingredient.toLowerCase();
    return targetIngredients.some((target) =>
      productIngredients.includes(target),
    );
  });
}

export function filterBySkinType(products, userSkinProfile) {
  const { skinType, skinSensitivity } = userSkinProfile;

  return products.filter((product) => {
    const productSkinType = product.skinType?.toLowerCase() ?? "";

    if (skinType && !productSkinType.includes(skinType.toLowerCase()))
      return false;

    // if user is sensitive, exclude products not marked for sensitive skin
    if (
      skinSensitivity === "sensitive" &&
      !productSkinType.includes("sensitive")
    )
      return false;

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
