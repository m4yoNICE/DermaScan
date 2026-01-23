import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed roles
  await prisma.role.createMany({
    data: [
      { id: 1, role_name: "admin" },
      { id: 2, role_name: "user" },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Roles seeded");

  // Seed skin conditions
  await prisma.skinCondition.createMany({
    data: [
      { id: 1, condition: "acne-blackheads", can_recommend: "Yes" },
      { id: 2, condition: "acne-cyst", can_recommend: "No" },
      { id: 3, condition: "acne-fungal", can_recommend: "No" },
      { id: 4, condition: "acne-nodules", can_recommend: "No" },
      { id: 5, condition: "acne-papules", can_recommend: "Yes" },
      { id: 6, condition: "acne-pustules", can_recommend: "Yes" },
      { id: 7, condition: "acne-whiteheads", can_recommend: "Yes" },
      { id: 8, condition: "mild eczema", can_recommend: "Yes" },
      { id: 9, condition: "severe eczema", can_recommend: "No" },
      { id: 10, condition: "enlarged-pores", can_recommend: "Yes" },
      { id: 11, condition: "melasma", can_recommend: "Yes" },
      { id: 12, condition: "milia", can_recommend: "Yes" },
      { id: 13, condition: "post-inflammatory-erythema", can_recommend: "No" },
      {
        id: 14,
        condition: "post-inflammatory-pigmentation",
        can_recommend: "Yes",
      },
      { id: 15, condition: "psoriasis", can_recommend: "No" },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Skin conditions seeded");

  // Seed users
  const adminPassword = await bcrypt.hash("admin", 10);
  const userPassword = await bcrypt.hash("user", 10);

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        first_name: "firstadmin",
        last_name: "lastadmin",
        email: "admin@a.c",
        password: adminPassword,
        role_id: 1,
        birthdate: new Date("2000-01-01"),
      },
      {
        id: 2,
        first_name: "firstuser",
        last_name: "lastuser",
        email: "user@a.c",
        password: userPassword,
        role_id: 2,
        birthdate: new Date("2000-01-01"),
      },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Users seeded");

  // Seed skin data
  await prisma.skinData.createMany({
    data: [
      {
        user_id: 2,
        skin_type: "oily",
        skin_sensitivity: "resistant",
        pigmentation: "pigmented",
        aging: "tight",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Skin data seeded");

  // Seed skin care products
  await prisma.skinCareProducts.createMany({
    data: [
      {
        product_name: "Example Moisturizer",
        product_image: "placeholder.jpg",
        ingredient: "Aloe Vera, Vitamin E",
        description: "A gentle daily moisturizer for all skin types.",
        product_type: "Moisturizer",
        locality: "Global",
        skin_type: "All",
        derma_tested: true,
        time_routine: "daytime",
      },
      {
        product_name: "Example Night Cream",
        product_image: "placeholder.jpg",
        ingredient: "Retinol, Hyaluronic Acid",
        description: "Night cream to hydrate and repair skin overnight.",
        product_type: "Night Cream",
        locality: "Global",
        skin_type: "All",
        derma_tested: true,
        time_routine: "nighttime",
      },
      {
        product_name: "Example Serum",
        product_image: "placeholder.jpg",
        ingredient: "Vitamin C, Niacinamide",
        description: "Brightening serum for daily use.",
        product_type: "Serum",
        locality: "Global",
        skin_type: "All",
        derma_tested: false,
        time_routine: "daytime",
      },
      {
        product_name: "Example Face Mask",
        product_image: "placeholder.jpg",
        ingredient: "Charcoal, Kaolin Clay",
        description: "Weekly purifying mask.",
        product_type: "Mask",
        locality: "Global",
        skin_type: "All",
        derma_tested: false,
        time_routine: "weekly",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Skin care products seeded");

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
