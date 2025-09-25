import mysql from "mysql2";
import { ENV } from "./env.js";

const pool = mysql
  .createPool({
    host: ENV.HOST,
    user: ENV.USERNAME,
    password: ENV.PASSWORD,
    database: ENV.DATABASE,
    port: ENV.DB_PORT || 3306,
  })
  .promise();

async function testConnection() {
  try {
    await pool.query("SELECT 1");
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

export default pool;
