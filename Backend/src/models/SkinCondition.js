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

export default SkinCondition;
