import { DataTypes } from "sequelize";
import db from "../config/db.js";

const SkinCondition = db.define(
  "SkinCondition",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    condition: {
      type: DataTypes.STRING(255),
    },
    can_recommend: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "skin_conditions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

SkinCondition.afterSync(async () => {
  const count = await SkinCondition.count();
  if (count === 0) {
    await SkinCondition.bulkCreate([
      { condition: "mild-acne", can_recommend: "Yes" },
      { condition: "severe-acne", can_recommend: "No" },
      { condition: "eczema", can_recommend: "No" },
      { condition: "psoriasis", can_recommend: "No" },
      { condition: "blackheads", can_recommend: "No" },
      { condition: "darkspots", can_recommend: "Yes" },
      { condition: "milia", can_recommend: "Yes" },
      { condition: "pores", can_recommend: "Yes" },
      { condition: "wrinkles", can_recommend: "Yes" },
    ]);
    console.log("Skin_Condition table seeded");
  } else {
    console.log("Skin_Condition table already seeded");
  }
});

export default SkinCondition;
