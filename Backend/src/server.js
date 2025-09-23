import express from "express";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js"
import cors from "cors";

const app = express();
const PORT = ENV.PORT || 6969;

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});
