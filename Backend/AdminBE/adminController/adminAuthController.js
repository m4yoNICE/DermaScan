import { findUserByEmail, createUser } from "../../src/services/authServices.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../src/config/env.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "15m" });
    res.status(200).json({
    message: "Login successful",
    user: { 
        id: user.id, 
        email: user.email,
        role: user.isAdmin ? "admin" : "user" 
     },
    token,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}