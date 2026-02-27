"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Skin_data", [
      {
        user_id: 2,
        skin_type: "oily",
        skin_sensitivity: "resistant",
        pigmentation: "pigmented",
        aging: "tight",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Skin_data", null, {});
  },
};
