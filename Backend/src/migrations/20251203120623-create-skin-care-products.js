"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("skin_care_products", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      product_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      ingredient: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      product_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      locality: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      skin_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      derma_tested: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      time_routine: {
        type: Sequelize.ENUM("morning", "night"),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("skin_care_products");
  },
};
