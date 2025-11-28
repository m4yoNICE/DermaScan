"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      first_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      last_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "role", // table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      birthdate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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
    await queryInterface.dropTable("users");
  },
};
