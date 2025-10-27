import { DataTypes } from "sequelize";
import User from "./User.js";
import db from "../config/db.js";

const StoredImage = db.define(
  "StoredImage",
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
    updatedAt: false,
  }
);
User.hasMany(StoredImage, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
StoredImage.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default StoredImage;
