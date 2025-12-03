"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "skin_care_products",
      [
        {
          product_name: "Example Moisturizer",
          product_image: "placeholder.jpg",
          ingredient: "Aloe Vera, Vitamin E",
          description: "A gentle daily moisturizer for all skin types.",
          product_type: "Moisturizer",
          locality: "Global",
          skin_type: "All",
          derma_tested: true,
          time_routine: "morning",
          created_at: new Date(),
          updated_at: new Date(),
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
          time_routine: "night",
          created_at: new Date(),
          updated_at: new Date(),
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
          time_routine: "morning",
          created_at: new Date(),
          updated_at: new Date(),
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
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("skin_care_products", null, {});
  },
};
