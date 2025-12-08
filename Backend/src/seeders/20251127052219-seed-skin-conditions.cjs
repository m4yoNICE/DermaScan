"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("skin_conditions", [
      {
        id: 1,
        condition: "acne-blackheads",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        condition: "acne-cyst",
        can_recommend: "No",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        condition: "acne-fungal",
        can_recommend: "No",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        condition: "acne-nodules",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        condition: "acne-papules",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        condition: "acne-pustules",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        condition: "acne-whiteheads",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        condition: "eczema",
        can_recommend: "No",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        condition: "enlarged-pores",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        condition: "melasma",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        condition: "milia",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        condition: "post-inflammatory-erythema",
        can_recommend: "Yes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 13,
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
