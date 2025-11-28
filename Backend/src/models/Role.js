import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Role = db.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "role",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Role;
