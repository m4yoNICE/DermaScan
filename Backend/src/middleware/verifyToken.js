import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("📌 Incoming token:", token);
  console.log("📌 Authorization header raw:", authHeader);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: "Acess Denied" });
  }

  jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
    if (err) {
    console.log("❌ JWT Verify Error:", err);  // shows 'jwt expired' or 'invalid signature'
    console.log("Token passed in:", token);
     console.log("📌 Authorization header raw:", authHeader);
      return res.status(403).json({ error: "Invalid or Expired Session" });
    }
    console.log("✅ Decoded token:", decoded);
    req.user = decoded;
    next();
  });
}
