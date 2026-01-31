import { db } from "../config/db.js";
import {
  role,
  skinConditions,
  users,
  skinData,
  skinCareProducts,
} from "./schema.js";
import bcrypt from "bcryptjs";
import { inArray } from "drizzle-orm";
import { reset } from "drizzle-seed";

async function main() {
  console.log("Seeding database...");

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const adminPassword = await bcrypt.hash("admin", 10);
  const userPassword = await bcrypt.hash("user", 10);

  // Seed Skin Conditions
  await db.insert(skinConditions).values([
    {
      id: 1,
      condition: "acne-blackheads",
      canRecommend: "Yes",
      updatedAt: now,
    },
    { id: 2, condition: "acne-cyst", canRecommend: "No", updatedAt: now },
    { id: 3, condition: "acne-fungal", canRecommend: "No", updatedAt: now },
    { id: 4, condition: "acne-nodules", canRecommend: "No", updatedAt: now },
    { id: 5, condition: "acne-papules", canRecommend: "Yes", updatedAt: now },
    { id: 6, condition: "acne-pustules", canRecommend: "Yes", updatedAt: now },
    {
      id: 7,
      condition: "acne-whiteheads",
      canRecommend: "Yes",
      updatedAt: now,
    },
    { id: 8, condition: "mild eczema", canRecommend: "Yes", updatedAt: now },
    { id: 9, condition: "severe eczema", canRecommend: "No", updatedAt: now },
    {
      id: 10,
      condition: "enlarged-pores",
      canRecommend: "Yes",
      updatedAt: now,
    },
    { id: 11, condition: "melasma", canRecommend: "Yes", updatedAt: now },
    { id: 12, condition: "milia", canRecommend: "Yes", updatedAt: now },
    {
      id: 13,
      condition: "post-inflammatory-erythema",
      canRecommend: "No",
      updatedAt: now,
    },
    {
      id: 14,
      condition: "post-inflammatory-pigmentation",
      canRecommend: "Yes",
      updatedAt: now,
    },
    { id: 15, condition: "psoriasis", canRecommend: "No", updatedAt: now },
  ]);

  // Seed Products
  await db.insert(skinCareProducts).values([
    {
      id: 1,
      productName: "Example Moisturizer",
      productImage: "placeholder.jpg",
      ingredient: "Aloe Vera, Vitamin E",
      description: "A gentle daily moisturizer for all skin types.",
      productType: "Moisturizer",
      locality: "Global",
      skinType: "All",
      dermaTested: true,
      timeRoutine: "daytime",
      updatedAt: now,
    },
    {
      id: 2,
      productName: "Example Night Cream",
      productImage: "placeholder.jpg",
      ingredient: "Retinol, Hyaluronic Acid",
      description: "Night cream to hydrate and repair skin overnight.",
      productType: "Night Cream",
      locality: "Global",
      skinType: "All",
      dermaTested: true,
      timeRoutine: "nighttime",
      updatedAt: now,
    },
  ]);

  // Seed Roles
  await db.insert(role).values([
    { id: 1, roleName: "admin", updatedAt: now },
    { id: 2, roleName: "user", updatedAt: now },
  ]);

  // Fetch Role IDs correctly
  const roles = await db
    .select()
    .from(role)
    .where(inArray(role.roleName, ["admin", "user"]));

  const adminRoleId = roles.find((r) => r.roleName === "admin").id;
  const userRoleId = roles.find((r) => r.roleName === "user").id;

  // Seed Users
  const insertedUsers = await db.insert(users).values([
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

  console.log("Seeding completed!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
