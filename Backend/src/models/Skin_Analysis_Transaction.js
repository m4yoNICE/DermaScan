import { DataTypes } from "sequelize";
import User from "./User.js";
import db from "../config/db.js";

const Skin_Analysis_Transaction = db.define(
  "Skin_Analysis_Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
  },
  {
    tableName: "skin_analysis_transactions",
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
Skin_Analysis_Transaction.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default sex;
