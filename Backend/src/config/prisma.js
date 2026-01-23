import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to the database!");
  } catch (err) {
    if (err.code === "P1001") {
      console.error("BOGO! TURN ON THE MYSQL. The backend won't run");
    } else if (err.code === "P1002") {
      console.error("Database connection timeout. Check your MySQL server.");
    } else if (err.code === "P1003") {
      console.error(
        "Database does not exist. Create 'derma_care' database first.",
      );
    } else {
      console.error("DB connection failed:", err.message);
    }
    process.exit(1);
  }
}
testConnection();
export default prisma;
