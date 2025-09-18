import express from "express";
import { ENV } from "./config/env.js";
import pool from "./config/db.js";

const app = express();
const PORT = ENV.PORT || 5001;

app.get("/test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json({
      message: "yay nigana!",
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});
