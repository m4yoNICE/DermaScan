import { db } from "../config/db.js";
import {
  role,
  skinConditions,
  users,
  skinProfile,
  skinCareProducts,
  conditionProducts,
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
      pigmentation: "pigmented",
      aging: "tight",
      updatedAt: now,
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
