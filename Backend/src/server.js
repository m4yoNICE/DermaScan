import express from "express";

dotenv.config();

const app = express();

connectDB();
app.listen(5001, () => {
  console.log("Server started on PORT: 5001");
});
