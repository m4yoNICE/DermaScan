import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

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
    role: {
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

User.afterSync(async () => {
  const count = await User.count();
  if (count === 0) {
    await User.bulkCreate([
      {
        first_name: "firstuser",
        last_name: "lastuser",
        email: "user@a.c",
        password: await bcrypt.hash("user", 10),
        role: "user",
        birthdate: "2000-01-01",
      },
      {
        first_name: "firstadmin",
        last_name: "lastadmin",
        email: "admin@a.c",
        password: await bcrypt.hash("admin", 10),
        role: "admin",
        birthdate: "2000-01-01",
      },
    ]);
    console.log("Users seeded");
  } else {
    console.log("Users already seeded");
  }
});

export default User;
