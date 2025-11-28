import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import Role from "./Role.js"; // Import Role model

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
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "role",
        key: "id",
      },
    },
    birthdate: {
      type: DataTypes.DATEONLY,
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

// Define association
User.belongsTo(Role, { foreignKey: "role_id", as: "userRole" });
Role.hasMany(User, { foreignKey: "role_id" });

export default User;
