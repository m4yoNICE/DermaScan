import { DataTypes } from "sequelize";
import db from "../config/db.js";

const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(255),
    },
    last_name: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    skin_type: {
      type: DataTypes.ENUM("oily", "dry", "normal"),
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
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;
