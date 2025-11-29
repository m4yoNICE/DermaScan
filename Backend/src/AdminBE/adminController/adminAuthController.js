import { findUserByEmail, createUser } from "../../services/authServices.js";
import  findUserById  from "../adminservices/adminUserManagement.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";

export default async function AuthLogin(req, res) {
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
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const payload = { 
      id: user.id, 
      email: user.email,
      role: user.role
    };
    const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "6h" });
    res.status(200).json({
    message: "Login successful",
    user: { 
        id: user.id, 
        email: user.email,
        role: user.role
     },
    token,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getAdminData(req, res){
  try {
    const admin = await findUserById(req.user.id);
    if (!admin){
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({
      id: admin.id,
      email: admin.email,
      role: admin.isAdmin ? "admin" : "user"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}