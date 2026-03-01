import { db } from "../config/db.js";
import {
  role,
  skinConditions,
  users,
  skinData,
  skinCareProducts,
  conditionProducts,
  skinAnalysisTransactions,
} from "./schema.js";
import bcrypt from "bcryptjs";
import { inArray } from "drizzle-orm";

export async function main() {
  console.log("Seeding database...");

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const adminPassword = await bcrypt.hash("admin", 10);
  const userPassword = await bcrypt.hash("user", 10);

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

  // Seed Roles
  await db.insert(role).values([
    { id: 1, roleName: "admin" },
    { id: 2, roleName: "user" },
  ]);

  // Fetch Role IDs correctly
  const roles = await db
    .select()
    .from(role)
    .where(inArray(role.roleName, ["admin", "user"]));

  const adminRoleId = roles.find((r) => r.roleName === "admin").id;
  const userRoleId = roles.find((r) => r.roleName === "user").id;

  // Seed Users
  await db.insert(users).values([
    {
      id: 1,
      firstName: "firstadmin",
      lastName: "lastadmin",
      email: "admin@a.c",
      password: adminPassword,
      roleId: adminRoleId,
      birthdate: "2000-01-01",
      updatedAt: now,
    },
    {
      id: 2,
      firstName: "firstuser",
      lastName: "lastuser",
      email: "user@a.c",
      password: userPassword,
      roleId: userRoleId,
      birthdate: "2000-01-01",
      updatedAt: now,
    },
  ]);

  // Seed Skin Data (Using real user IDs)
  const userList = await db
    .select()
    .from(users)
    .where(inArray(users.email, ["user@a.c"]));
  const targetUserId = userList[0].id;

  await db.insert(skinData).values([
    {
      userId: targetUserId,
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
      sskinType: "dry, sensitive, pigmented, tight",
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

  await db.insert(skinAnalysisTransactions).values([
  {
    userId: 2,
    conditionId: 1,
    status: "moderate",
    confidenceScores: 0.85, 
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: 2,
    conditionId: 2,
    status: "moderate",
    confidenceScores: 0.60, 
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: 2,
    conditionId: 9,
    status: "severe",
    confidenceScores: 0.95, 
    createdAt: now,
    updatedAt: now,
  }
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
