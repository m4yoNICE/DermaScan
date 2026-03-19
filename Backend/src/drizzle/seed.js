import { db } from "../config/db.js";
import {
  role,
  skinConditions,
  users,
  skinProfile,
  skinCareProducts,
} from "./schema.js";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

export async function main() {
  console.log("Seeding database...");

  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  await db.execute(sql`TRUNCATE TABLE reminder_logs`);
  await db.execute(sql`TRUNCATE TABLE user_routine`);
  await db.execute(sql`TRUNCATE TABLE product_recommendations`);
  await db.execute(sql`TRUNCATE TABLE skin_analysis`);
  await db.execute(sql`TRUNCATE TABLE stored_images`);
  await db.execute(sql`TRUNCATE TABLE condition_products`);
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

  await db.insert(role).values([
    { id: 1, roleName: "admin" },
    { id: 2, roleName: "user" },
  ]);

await db.insert(skinConditions).values([
  // MILD / MODERATE (Can Recommend)
  { id: 1, condition: "acne-blackheads-mild", canRecommend: "Yes", targetIngredients: "Salicylic Acid, Adapalene, Retinol, Retinoids" },
  { id: 2, condition: "acne-blackheads-moderate", canRecommend: "Yes", targetIngredients: "Salicylic Acid, Adapalene, Retinol, Retinoids" },
  { id: 3, condition: "acne-whiteheads-mild", canRecommend: "Yes", targetIngredients: "Salicylic Acid, Adapalene, Retinol, Retinoids" },
  { id: 4, condition: "acne-whiteheads-moderate", canRecommend: "Yes", targetIngredients: "Salicylic Acid, Adapalene, Retinol, Retinoids" },
  { id: 5, condition: "acne-papules-mild", canRecommend: "Yes", targetIngredients: "Benzoyl Peroxide, Retinol, Clindamycin, Retinoids" },
  { id: 6, condition: "acne-papules-moderate", canRecommend: "Yes", targetIngredients: "Benzoyl Peroxide, Retinol, Clindamycin, Retinoids" },
  { id: 7, condition: "acne-pustules-mild", canRecommend: "Yes", targetIngredients: "Benzoyl Peroxide, Retinol, Clindamycin, Retinoids" },
  { id: 8, condition: "acne-pustules-moderate", canRecommend: "Yes", targetIngredients: "Benzoyl Peroxide, Retinol, Clindamycin, Retinoids" },
  { id: 9, condition: "eczema-mild", canRecommend: "Yes", targetIngredients: "Oats, Lipids, Zinc Oxide, Emollients" },
  { id: 10, condition: "eczema-moderate", canRecommend: "Yes", targetIngredients: "Oats, Lipids, Zinc Oxide, Emollients" },
  { id: 11, condition: "melasma-mild", canRecommend: "Yes", targetIngredients: "Kojic Acid, Glutathione, Vitamin C" },
  { id: 12, condition: "melasma-moderate", canRecommend: "Yes", targetIngredients: "Kojic Acid, Glutathione, Vitamin C" },
  { id: 13, condition: "melasma-severe", canRecommend: "Yes", targetIngredients: "Kojic Acid, Glutathione, Vitamin C" },
  { id: 14, condition: "milia-mild", canRecommend: "Yes", targetIngredients: "Salicylic Acid, Retinol" },
  { id: 15, condition: "milia-moderate", canRecommend: "Yes", targetIngredients: "Salicylic Acid, Retinol" },
  { id: 16, condition: "enlarged-pores-mild", canRecommend: "Yes", targetIngredients: "Salicylic Acid, Adapalene" },
  { id: 17, condition: "enlarged-pores-moderate", canRecommend: "Yes", targetIngredients: "Salicylic Acid, Adapalene" },
  { id: 18, condition: "post-inflammatory-pigmentation-mild", canRecommend: "Yes", targetIngredients: "Vitamin C, Arbutin, Niacinamide, Glycolic Acid" },
  { id: 19, condition: "post-inflammatory-pigmentation-moderate", canRecommend: "Yes", targetIngredients: "Vitamin C, Arbutin, Niacinamide, Glycolic Acid" },
  { id: 20, condition: "post-inflammatory-erythema-mild", canRecommend: "Yes", targetIngredients: "Azelaic Acid, Glycolic Acid, Vitamin C" },
  { id: 21, condition: "post-inflammatory-erythema-moderate", canRecommend: "Yes", targetIngredients: "Azelaic Acid, Glycolic Acid, Vitamin C" },

  // SEVERE / MEDICAL (Cannot Recommend)
  { id: 22, condition: "milia-severe", canRecommend: "No", targetIngredients: null },
  { id: 23, condition: "enlarged-pores-severe", canRecommend: "No", targetIngredients: null },
  { id: 24, condition: "acne-blackheads-severe", canRecommend: "No", targetIngredients: null },
  { id: 25, condition: "acne-papules-severe", canRecommend: "No", targetIngredients: null },
  { id: 26, condition: "acne-pustules-severe", canRecommend: "No", targetIngredients: null },
  { id: 27, condition: "acne-whiteheads-severe", canRecommend: "No", targetIngredients: null },
  { id: 28, condition: "acne-cyst", canRecommend: "No", targetIngredients: null },
  { id: 29, condition: "acne-nodules", canRecommend: "No", targetIngredients: null },
  { id: 30, condition: "psoriasis", canRecommend: "No", targetIngredients: null },
  { id: 31, condition: "eczema-severe", canRecommend: "No", targetIngredients: null },
  { id: 32, condition: "post-inflammatory-erythema-severe", canRecommend: "No", targetIngredients: null },
  { id: 33, condition: "post-inflammatory-pigmentation-severe", canRecommend: "No", targetIngredients: null },
  { id: 34, condition: "out-of-scope", canRecommend: "No", targetIngredients: null },
]);
//adapalene, benzoid peroxide, and clindamycin is what i put there as not for sensitive

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

  await db.insert(skinProfile).values([
    {
      userId: 2,
      skinType: "oily",
      skinSensitivity: "resistant",
      createdAt: now,
    },
  ]);

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

  console.log("Seeding completed!");
}

try {
  await main();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
