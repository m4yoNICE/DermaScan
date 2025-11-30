"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        first_name: "firstadmin",
        last_name: "lastadmin",
        email: "admin@a.c",
        password: await bcrypt.hash("admin", 10),
        role_id: 1,
        birthdate: "2000-01-01",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "firstuser",
        last_name: "lastuser",
        email: "user@a.c",
        password: await bcrypt.hash("user", 10),
        role_id: 2,
        birthdate: "2000-01-01",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
