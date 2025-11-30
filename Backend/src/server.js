import express from "express";
import cors from "cors";
import path from "path";
import { ENV } from "./config/env.js";

//users routes imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import skinAnalysisRoutes from "./routes/skinAnalysisRoutes.js";

//admin routes imports
import adminAuthRoutes from "./AdminBE/routes/adminAuthRoutes.js";

const app = express();

const PORT = ENV.PORT || 6969; //just checking if port existed as usual or not

//8081 is for mobile, while 5173 is for admin web
const allowedOrigins = ["http://localhost:8081", "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/journals", journalRoutes);
app.use("/images", imageRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "skinUploads"))); //static
app.use("/condition", skinAnalysisRoutes);
//admin
app.use("/admin/auth", adminAuthRoutes);
app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});
