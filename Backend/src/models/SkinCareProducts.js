import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db";

const SkinCareProducts = db.define(
  "SkinCareProducts",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING(255),
    },
    product_image: {
      type: DataTypes.STRING(255),
    },
    ingredient: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.STRING(255),
    },
    product_type: {
      type: DataTypes.STRING(255),
    },
    locality: {
      type: DataTypes.STRING(255),
    },
    skin_type: {
      type: DataTypes.STRING(255),
    },
    derma_tested: {
      type: DataTypes.BOOLEAN,
    },
    time_routine: {
      type: DataTypes.ENUM("daytime", "nighttime", "daily", "weekly"),
    },
  },
  {
    tableName: "skin_care_products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
