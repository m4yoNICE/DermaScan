import { Sequelize } from "sequelize";
import { ENV } from "./env.js";

const db = new Sequelize(ENV.DATABASE, ENV.USERNAME, ENV.PASSWORD, {
  host: ENV.HOST,
  port: ENV.DB_PORT || 3306,
  dialect: "mysql",
  logging: false,
});

async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connected to the database!");
  } catch (err) {
    const code = err.original?.code || err.code; // prefer err.original.code for Sequelize
    if (code === "ECONNREFUSED") {
      console.error("BOGO! TURN ON THE MYSQL. The backend won't run");
    } else if (code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Check your DB username/password. INVALID CREDENTIALS");
    } else if (code === "ENOTFOUND") {
      console.error("Database host not found. Wrong config?");
    } else {
      console.error("DB connection failed:", err);
    }
  }
}
testConnection();
export default db;
