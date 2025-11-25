import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./User.js";

const SkinData = db.define(
  "SkinData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    skin_type: {
      type: DataTypes.ENUM("oily", "dry", "normal", "combination"),
      allowNull: true,
    },
    skin_sensitivity: {
      type: DataTypes.ENUM("resistant", "sensitive"),
      allowNull: true,
    },
    pigmentation: {
      type: DataTypes.ENUM("pigmented", "non-pigmented"),
      allowNull: true,
    },
    aging: {
      type: DataTypes.ENUM("wrinkled", "tight"),
      allowNull: true,
    },
  },
  {
    tableName: "Skin_data",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
User.hasOne(SkinData, {
  foreignKey: "user_id",
  as: "skinProfile",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
SkinData.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

export default SkinData;
