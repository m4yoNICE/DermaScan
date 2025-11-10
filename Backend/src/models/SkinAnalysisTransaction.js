import { DataTypes } from "sequelize";
import User from "./User.js";
import Skin_Condition from "./SkinCondition.js";
import StoredImage from "./StoredImage.js";
import db from "../config/db.js";

const SkinAnalysisTransaction = db.define(
  "SkinAnalysisTransaction",
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
    condition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    confidence_scores: {
      type: DataTypes.FLOAT,
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
User.hasMany(SkinAnalysisTransaction, { foreignKey: "user_id" });
SkinAnalysisTransaction.belongsTo(User, { foreignKey: "user_id" });

StoredImage.hasMany(SkinAnalysisTransaction, { foreignKey: "image_id" });
SkinAnalysisTransaction.belongsTo(StoredImage, { foreignKey: "image_id" });

Skin_Condition.hasMany(SkinAnalysisTransaction, {
  foreignKey: "condition_id",
});
SkinAnalysisTransaction.belongsTo(Skin_Condition, {
  foreignKey: "condition_id",
});

export default SkinAnalysisTransaction;
