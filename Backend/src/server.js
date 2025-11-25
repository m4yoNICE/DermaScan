import express from "express";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
// import adminUserManagement from "./AdminBE/adminRoute/adminAuthRoutes.js";
// import adminAuthRoutes from "./AdminBE/adminRoute/adminAuthRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import adminUserManagementRoutes from "./admin/adminroutes/adminUserManagementRoute.js";
import cors from "cors";
import path from "path";
//importing table models here
import db from "./config/db.js";
import "./models/StoredImage.js";
import "./models/User.js";
import "./models/SkinCondition.js";
import "./models/SkinAnalysisTransaction.js";
import "./models/SkinData.js";
import "./models/OTP.js";
const app = express();
const PORT = ENV.PORT || 6969;

app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Admin UI CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/journals", journalRoutes);
app.use("/images", imageRoutes);
//admin
app.use("/admin/users", adminUserManagement);
app.use("/admin/auth", adminAuthRoutes);


// Uncomment this line when setting up on a new device
// await db.sync({ alter: true });

app.use("/uploads", express.static(path.join(process.cwd(), "skinUploads")));
//admin
app.use("admin/users", adminUserManagementRoutes);
// Uncomment this line when setting up on a new device
await db.sync();
app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});

