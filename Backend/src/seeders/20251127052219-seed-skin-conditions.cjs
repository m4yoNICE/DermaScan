"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("skin_conditions", [
      {
        condition: "acne-blackheads",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "acne-cyst",
        can_recommend: "No",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "acne-fungal",
        can_recommend: "No",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "acne-nodules",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "acne-papules",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "acne-pustules",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "acne-whiteheads",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "eczema",
        can_recommend: "No",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "enlarged-pores",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "melasma",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "milia",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "post-inflammatory-erythema",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        condition: "post-inflammatory-pigmentation",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("skin_conditions", null, {});
  },
};
