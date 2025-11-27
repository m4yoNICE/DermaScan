"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Skin_data", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
      },
      skin_type: {
        type: Sequelize.ENUM("oily", "dry", "normal", "combination"),
        allowNull: true,
      },
      skin_sensitivity: {
        type: Sequelize.ENUM("resistant", "sensitive"),
        allowNull: true,
      },
      pigmentation: {
        type: Sequelize.ENUM("pigmented", "non-pigmented"),
        allowNull: true,
      },
      aging: {
        type: Sequelize.ENUM("wrinkled", "tight"),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Skin_data");
  },
};
