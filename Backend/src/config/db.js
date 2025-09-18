import mysql from 'mysql2'
import { ENV } from './env.js';

const pool = mysql.createPool({
    host: ENV.HOST,
    user: ENV.USERNAME,
    password: ENV.PASSWORD,
    database: ENV.DATABASE,
    port: ENV.DB_PORT || 3306
}).promise()


pool.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});


export default pool;