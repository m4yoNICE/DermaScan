import mysql from 'mysql2'
import { ENV } from './env.js';

const pool = mysql.createPool({
    host: ENV.HOST,
    user: ENV.USERNAME,
    password: ENV.PASSWORD,
    database: ENV.DATABASE,
    port: ENV.DB_PORT || 3306
}).promise()


async function testConnection() {
    try {
        await pool.query("SELECT 1");
        console.log("Connected to the database!");
    } catch (err) {
        console.error("DB connection failed:", err);
    }
}
testConnection();

export default pool;