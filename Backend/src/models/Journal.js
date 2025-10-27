import { DataTypes } from "sequelize";
import User from "./User.js";
import db from "../config/db.js";

const Journal = db.define(
  "Journal",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    journal_text: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    journal_date: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },
  },
  {
    tableName: "journals",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
User.hasMany(Journal, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Journal.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Journal;
