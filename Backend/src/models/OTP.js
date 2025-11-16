import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./User.js";

const OTP = db.define(
  "OTP",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    otp_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otp",
    timestamps: true,
    createdAt: "created_at",
  }
);
User.hasMany(OTP, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
OTP.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
export default OTP;
