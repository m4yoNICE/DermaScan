import { db } from "../config/db.js";
import {
  role,
  skinConditions,
  users,
  skinProfile,
  skinCareProducts,
  conditionProducts,
  skinAnalysis,
  ingredients,
  conditionIngredients,
  productIngredients,
} from "./schema.js";
import bcrypt from "bcryptjs";
import { inArray, sql } from "drizzle-orm";

export async function main() {
  console.log("Seeding database...");

  // truncate all tables
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  await db.execute(sql`TRUNCATE TABLE routine_logs`);
  await db.execute(sql`TRUNCATE TABLE routine_notifications`);
  await db.execute(sql`TRUNCATE TABLE user_routine`);
  await db.execute(sql`TRUNCATE TABLE product_recommendations`);
  await db.execute(sql`TRUNCATE TABLE skin_analysis`);
  await db.execute(sql`TRUNCATE TABLE condition_ingredients`);
  await db.execute(sql`TRUNCATE TABLE product_ingredients`);
  await db.execute(sql`TRUNCATE TABLE condition_products`);
  await db.execute(sql`TRUNCATE TABLE ingredients`);
  await db.execute(sql`TRUNCATE TABLE skin_care_products`);
  await db.execute(sql`TRUNCATE TABLE skin_profile`);
  await db.execute(sql`TRUNCATE TABLE journals`);
  await db.execute(sql`TRUNCATE TABLE otp`);
  await db.execute(sql`TRUNCATE TABLE users`);
  await db.execute(sql`TRUNCATE TABLE skin_conditions`);
  await db.execute(sql`TRUNCATE TABLE role`);
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const adminPassword = await bcrypt.hash("admin", 10);
  const userPassword = await bcrypt.hash("user", 10);

  // Seed Roles
  await db.insert(role).values([
    { id: 1, roleName: "admin" },
    { id: 2, roleName: "user" },
  ]);

  // Seed Skin Conditions
  await db.insert(skinConditions).values([
    { id: 1, condition: "acne-blackheads", canRecommend: "Yes" },
    { id: 2, condition: "acne-cyst", canRecommend: "No" },
    { id: 3, condition: "acne-fungal", canRecommend: "No" },
    { id: 4, condition: "acne-nodules", canRecommend: "No" },
    { id: 5, condition: "acne-papules", canRecommend: "Yes" },
    { id: 6, condition: "acne-pustules", canRecommend: "Yes" },
    { id: 7, condition: "acne-whiteheads", canRecommend: "Yes" },
    { id: 8, condition: "mild eczema", canRecommend: "Yes" },
    { id: 9, condition: "severe eczema", canRecommend: "No" },
    { id: 10, condition: "enlarged-pores", canRecommend: "Yes" },
    { id: 11, condition: "melasma", canRecommend: "Yes" },
    { id: 12, condition: "milia", canRecommend: "Yes" },
    { id: 13, condition: "post-inflammatory-erythema", canRecommend: "No" },
    {
      id: 14,
      condition: "post-inflammatory-pigmentation",
      canRecommend: "Yes",
    },
    { id: 15, condition: "psoriasis", canRecommend: "No" },
  ]);

  // Seed Users
  await db.insert(users).values([
    {
      id: 1,
      firstName: "firstadmin",
      lastName: "lastadmin",
      email: "admin@a.c",
      password: adminPassword,
      roleId: 1,
      birthdate: "2000-01-01",
      updatedAt: now,
    },
    {
      id: 2,
      firstName: "firstuser",
      lastName: "lastuser",
      email: "user@a.c",
      password: userPassword,
      roleId: 2,
      birthdate: "2000-01-01",
      updatedAt: now,
    },
  ]);

  // Seed Skin Profile
  await db.insert(skinProfile).values([
    {
      userId: 2,
      skinType: "oily",
      skinSensitivity: "resistant",
      pigmentation: "pigmented",
      aging: "tight",
      updatedAt: now,
    },
  ]);

  // Seed Skin Care Products
  await db.insert(skinCareProducts).values([
    {
      id: 1,
      productName: "Placeholder Gel Cleanser",
      productImage: "yun1.jpg",
      ingredient: "Salicylic Acid, Niacinamide",
      description: "Placeholder description for gel cleanser.",
      productType: "Cleanser",
      locality: "Local",
      skinType: "oily, combination, resistant, pigmented, tight",
      dermaTested: true,
      timeRoutine: "Morning, Night",
      updatedAt: now,
    },
    {
      id: 2,
      productName: "Placeholder Cream Cleanser",
      productImage: "yun2.jpg",
      ingredient: "Ceramides, Aloe Vera",
      description: "Placeholder description for cream cleanser.",
      productType: "Cleanser",
      locality: "Local",
      skinType: "dry, sensitive, pigmented, tight",
      dermaTested: true,
      timeRoutine: "Morning, Night",
      updatedAt: now,
    },
    {
      id: 3,
      productName: "Placeholder Exfoliating Toner",
      productImage: "yun3.jpg",
      ingredient: "AHA, BHA",
      description: "Placeholder description for exfoliating toner.",
      productType: "Toner",
      locality: "Local",
      skinType: "oily, combination, resistant, pigmented, tight",
      dermaTested: true,
      timeRoutine: "Night",
      updatedAt: now,
    },
    {
      id: 4,
      productName: "Placeholder Hydrating Toner",
      productImage: "yun4.jpg",
      ingredient: "Hyaluronic Acid, Glycerin",
      description: "Placeholder description for hydrating toner.",
      productType: "Toner",
      locality: "Local",
      skinType: "dry, normal, sensitive, pigmented, tight",
      dermaTested: true,
      timeRoutine: "Morning, Night",
      updatedAt: now,
    },
    {
      id: 5,
      productName: "Placeholder Anti-Acne Serum",
      productImage: "yun1.jpg",
      ingredient: "Niacinamide, Zinc",
      description: "Placeholder description for anti-acne serum.",
      productType: "Serum",
      locality: "Local",
      skinType: "oily, combination, resistant, pigmented, tight",
      dermaTested: true,
      timeRoutine: "Morning, Night",
      updatedAt: now,
    },
    {
      id: 6,
      productName: "Placeholder Brightening Serum",
      productImage: "yun2.jpg",
      ingredient: "Vitamin C, Alpha Arbutin",
      description: "Placeholder description for brightening serum.",
      productType: "Serum",
      locality: "Local",
      skinType:
        "oily, dry, normal, combination, resistant, sensitive, pigmented, non-pigmented, tight, wrinkled",
      dermaTested: true,
      timeRoutine: "Morning",
      updatedAt: now,
    },
    {
      id: 7,
      productName: "Placeholder Hydrating Serum",
      productImage: "yun3.jpg",
      ingredient: "Hyaluronic Acid, Peptides",
      description: "Placeholder description for hydrating serum.",
      productType: "Serum",
      locality: "Local",
      skinType: "dry, sensitive, pigmented, tight",
      dermaTested: true,
      timeRoutine: "Morning, Night",
      updatedAt: now,
    },
    {
      id: 8,
      productName: "Placeholder Lightweight Moisturizer",
      productImage: "yun4.jpg",
      ingredient: "Niacinamide, Ceramides",
      description: "Placeholder description for lightweight moisturizer.",
      productType: "Moisturizer",
      locality: "Local",
      skinType: "oily, combination, resistant, pigmented, tight",
      dermaTested: true,
      timeRoutine: "Morning, Night",
      updatedAt: now,
    },
    {
      id: 9,
      productName: "Placeholder Rich Moisturizer",
      productImage: "yun1.jpg",
      ingredient: "Shea Butter, Ceramides",
      description: "Placeholder description for rich moisturizer.",
      productType: "Moisturizer",
      locality: "Local",
      skinType: "dry, sensitive, pigmented, tight",
      dermaTested: true,
      timeRoutine: "Morning, Night",
      updatedAt: now,
    },
    {
      id: 10,
      productName: "Placeholder Mineral Sunscreen SPF 50",
      productImage: "yun2.jpg",
      ingredient: "Zinc Oxide, Titanium Dioxide",
      description: "Placeholder description for mineral sunscreen.",
      productType: "Sunscreen",
      locality: "Local",
      skinType:
        "oily, dry, normal, combination, resistant, sensitive, pigmented, non-pigmented, tight, wrinkled",
      dermaTested: true,
      timeRoutine: "Morning",
      updatedAt: now,
    },
  ]);

  // Seed Ingredients
  await db.insert(ingredients).values([
    { id: 1, name: "salicylic acid", createdAt: now, updatedAt: now },
    { id: 2, name: "niacinamide", createdAt: now, updatedAt: now },
    { id: 3, name: "aha", createdAt: now, updatedAt: now },
    { id: 4, name: "bha", createdAt: now, updatedAt: now },
    { id: 5, name: "zinc", createdAt: now, updatedAt: now },
    { id: 6, name: "ceramides", createdAt: now, updatedAt: now },
    { id: 7, name: "hyaluronic acid", createdAt: now, updatedAt: now },
    { id: 8, name: "vitamin c", createdAt: now, updatedAt: now },
    { id: 9, name: "alpha arbutin", createdAt: now, updatedAt: now },
    { id: 10, name: "retinol", createdAt: now, updatedAt: now },
    { id: 11, name: "zinc oxide", createdAt: now, updatedAt: now },
    { id: 12, name: "shea butter", createdAt: now, updatedAt: now },
    { id: 13, name: "glycerin", createdAt: now, updatedAt: now },
    { id: 14, name: "aloe vera", createdAt: now, updatedAt: now },
    { id: 15, name: "peptides", createdAt: now, updatedAt: now },
  ]);

  // Seed Condition Ingredients (beneficial ingredients per condition)
  await db.insert(conditionIngredients).values([
    // acne-blackheads
    { conditionId: 1, ingredientId: 1, createdAt: now, updatedAt: now },
    { conditionId: 1, ingredientId: 2, createdAt: now, updatedAt: now },
    { conditionId: 1, ingredientId: 4, createdAt: now, updatedAt: now },
    // acne-papules
    { conditionId: 5, ingredientId: 1, createdAt: now, updatedAt: now },
    { conditionId: 5, ingredientId: 2, createdAt: now, updatedAt: now },
    { conditionId: 5, ingredientId: 5, createdAt: now, updatedAt: now },
    // acne-pustules
    { conditionId: 6, ingredientId: 1, createdAt: now, updatedAt: now },
    { conditionId: 6, ingredientId: 2, createdAt: now, updatedAt: now },
    { conditionId: 6, ingredientId: 5, createdAt: now, updatedAt: now },
    // acne-whiteheads
    { conditionId: 7, ingredientId: 1, createdAt: now, updatedAt: now },
    { conditionId: 7, ingredientId: 2, createdAt: now, updatedAt: now },
    { conditionId: 7, ingredientId: 4, createdAt: now, updatedAt: now },
    // mild eczema
    { conditionId: 8, ingredientId: 6, createdAt: now, updatedAt: now },
    { conditionId: 8, ingredientId: 7, createdAt: now, updatedAt: now },
    { conditionId: 8, ingredientId: 14, createdAt: now, updatedAt: now },
    // enlarged-pores
    { conditionId: 10, ingredientId: 1, createdAt: now, updatedAt: now },
    { conditionId: 10, ingredientId: 2, createdAt: now, updatedAt: now },
    { conditionId: 10, ingredientId: 3, createdAt: now, updatedAt: now },
    // melasma
    { conditionId: 11, ingredientId: 8, createdAt: now, updatedAt: now },
    { conditionId: 11, ingredientId: 9, createdAt: now, updatedAt: now },
    // milia
    { conditionId: 12, ingredientId: 10, createdAt: now, updatedAt: now },
    { conditionId: 12, ingredientId: 3, createdAt: now, updatedAt: now },
    // post-inflammatory-pigmentation
    { conditionId: 14, ingredientId: 8, createdAt: now, updatedAt: now },
    { conditionId: 14, ingredientId: 9, createdAt: now, updatedAt: now },
    { conditionId: 14, ingredientId: 2, createdAt: now, updatedAt: now },
  ]);

  // Seed Product Ingredients
  await db.insert(productIngredients).values([
    { productId: 1, ingredientId: 1, createdAt: now, updatedAt: now }, // Gel Cleanser - Salicylic Acid
    { productId: 1, ingredientId: 2, createdAt: now, updatedAt: now }, // Gel Cleanser - Niacinamide
    { productId: 2, ingredientId: 6, createdAt: now, updatedAt: now }, // Cream Cleanser - Ceramides
    { productId: 2, ingredientId: 14, createdAt: now, updatedAt: now }, // Cream Cleanser - Aloe Vera
    { productId: 3, ingredientId: 3, createdAt: now, updatedAt: now }, // Exfoliating Toner - AHA
    { productId: 3, ingredientId: 4, createdAt: now, updatedAt: now }, // Exfoliating Toner - BHA
    { productId: 4, ingredientId: 7, createdAt: now, updatedAt: now }, // Hydrating Toner - Hyaluronic Acid
    { productId: 4, ingredientId: 13, createdAt: now, updatedAt: now }, // Hydrating Toner - Glycerin
    { productId: 5, ingredientId: 2, createdAt: now, updatedAt: now }, // Anti-Acne Serum - Niacinamide
    { productId: 5, ingredientId: 5, createdAt: now, updatedAt: now }, // Anti-Acne Serum - Zinc
    { productId: 6, ingredientId: 8, createdAt: now, updatedAt: now }, // Brightening Serum - Vitamin C
    { productId: 6, ingredientId: 9, createdAt: now, updatedAt: now }, // Brightening Serum - Alpha Arbutin
    { productId: 7, ingredientId: 7, createdAt: now, updatedAt: now }, // Hydrating Serum - Hyaluronic Acid
    { productId: 7, ingredientId: 15, createdAt: now, updatedAt: now }, // Hydrating Serum - Peptides
    { productId: 8, ingredientId: 2, createdAt: now, updatedAt: now }, // Lightweight Moisturizer - Niacinamide
    { productId: 8, ingredientId: 6, createdAt: now, updatedAt: now }, // Lightweight Moisturizer - Ceramides
    { productId: 9, ingredientId: 6, createdAt: now, updatedAt: now }, // Rich Moisturizer - Ceramides
    { productId: 9, ingredientId: 12, createdAt: now, updatedAt: now }, // Rich Moisturizer - Shea Butter
    { productId: 10, ingredientId: 11, createdAt: now, updatedAt: now }, // Sunscreen - Zinc Oxide
  ]);

  // Seed Condition Products
  await db.insert(conditionProducts).values([
    { conditionId: 1, productId: 1, createdAt: now, updatedAt: now },
    { conditionId: 1, productId: 3, createdAt: now, updatedAt: now },
    { conditionId: 1, productId: 5, createdAt: now, updatedAt: now },
    { conditionId: 1, productId: 8, createdAt: now, updatedAt: now },
    { conditionId: 1, productId: 10, createdAt: now, updatedAt: now },
    { conditionId: 5, productId: 1, createdAt: now, updatedAt: now },
    { conditionId: 5, productId: 3, createdAt: now, updatedAt: now },
    { conditionId: 5, productId: 5, createdAt: now, updatedAt: now },
    { conditionId: 5, productId: 8, createdAt: now, updatedAt: now },
    { conditionId: 5, productId: 10, createdAt: now, updatedAt: now },
    { conditionId: 6, productId: 1, createdAt: now, updatedAt: now },
    { conditionId: 6, productId: 3, createdAt: now, updatedAt: now },
    { conditionId: 6, productId: 5, createdAt: now, updatedAt: now },
    { conditionId: 6, productId: 8, createdAt: now, updatedAt: now },
    { conditionId: 6, productId: 10, createdAt: now, updatedAt: now },
    { conditionId: 7, productId: 1, createdAt: now, updatedAt: now },
    { conditionId: 7, productId: 3, createdAt: now, updatedAt: now },
    { conditionId: 7, productId: 5, createdAt: now, updatedAt: now },
    { conditionId: 7, productId: 8, createdAt: now, updatedAt: now },
    { conditionId: 7, productId: 10, createdAt: now, updatedAt: now },
    { conditionId: 8, productId: 2, createdAt: now, updatedAt: now },
    { conditionId: 8, productId: 4, createdAt: now, updatedAt: now },
    { conditionId: 8, productId: 7, createdAt: now, updatedAt: now },
    { conditionId: 8, productId: 9, createdAt: now, updatedAt: now },
    { conditionId: 8, productId: 10, createdAt: now, updatedAt: now },
    { conditionId: 10, productId: 1, createdAt: now, updatedAt: now },
    { conditionId: 10, productId: 3, createdAt: now, updatedAt: now },
    { conditionId: 10, productId: 5, createdAt: now, updatedAt: now },
    { conditionId: 10, productId: 8, createdAt: now, updatedAt: now },
    { conditionId: 10, productId: 10, createdAt: now, updatedAt: now },
    { conditionId: 11, productId: 2, createdAt: now, updatedAt: now },
    { conditionId: 11, productId: 6, createdAt: now, updatedAt: now },
    { conditionId: 11, productId: 9, createdAt: now, updatedAt: now },
    { conditionId: 11, productId: 10, createdAt: now, updatedAt: now },
    { conditionId: 12, productId: 1, createdAt: now, updatedAt: now },
    { conditionId: 12, productId: 3, createdAt: now, updatedAt: now },
    { conditionId: 12, productId: 8, createdAt: now, updatedAt: now },
    { conditionId: 12, productId: 10, createdAt: now, updatedAt: now },
    { conditionId: 14, productId: 2, createdAt: now, updatedAt: now },
    { conditionId: 14, productId: 4, createdAt: now, updatedAt: now },
    { conditionId: 14, productId: 6, createdAt: now, updatedAt: now },
    { conditionId: 14, productId: 9, createdAt: now, updatedAt: now },
    { conditionId: 14, productId: 10, createdAt: now, updatedAt: now },
  ]);

  console.log("Seeding completed!");
}

try {
  await main();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
