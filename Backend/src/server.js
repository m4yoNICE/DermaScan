import express from "express";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import sequelize from "./config/db.js";

const app = express();
const PORT = ENV.PORT || 6969;

app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Uncomment this line when setting up on a new device
// await sequelize.sync({ alter: true });

app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});
