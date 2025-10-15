import { DataTypes } from "sequelize";
import User from "./User.js";
import db from "../config/db.js";

const Stored_images = db.define(
  "Stored_images",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    photoUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "stored_images",
    timestamps: true,
    createdAt: "created_at",
  }
);
User.hasMany(Stored_images, { foreignKey: "user_id" });
Stored_images.belongsTo(User, { foreignKey: "user_id" });

export default Stored_images;
