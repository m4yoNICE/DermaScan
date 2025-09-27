import { Sequelize } from "sequelize";
import { ENV } from "./env.js";

const sequelize = new Sequelize(ENV.DATABASE, ENV.USERNAME, ENV.PASSWORD, {
  host: ENV.HOST,
  port: ENV.DB_PORT || 3306,
  dialect: "mysql",
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate;
    console.log("Connected to the database!");
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      console.error("BOGO! TURN ON THE MYSQL. The backend wont run");
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Check your DB username/password. INVALID CREDENTIALS");
    } else if (err.code === "ENOTFOUND") {
      console.error("Database host not found. Wrong config cguro idk?");
    } else {
      console.error("DB connection failed:", err);
    }
  }
}

testConnection();
export default sequelize;
