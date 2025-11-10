import express from "express";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import cors from "cors";
import db from "./config/db.js";
import "./models/Stored_images.js";
import "./models/User.js";
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
app.use("/images", imageRoutes);
//admin
app.use("/admin/users", )
// Uncomment this line when setting up on a new device
await db.sync({ alter: true });


app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});
