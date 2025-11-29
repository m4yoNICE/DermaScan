import { findAdminByEmail, createUser } from "../../services/authServices.js";
import  findUserById  from "../adminservices/adminUserManagement.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";
import User from "../../models/User.js";
import Role from "../../models/Role.js";

export default async function AuthLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Fetch user + role
    const user = await findAdminByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is actually an admin (role_id == 1)
    if (user.role_id !== 1) { 
      console.log("Non-admin user attempted admin login:", user.role_id);
      return res.status(403).json({ error: "Admins only" });
    }

    // JWT Payload
    const payload = {
      id: user.id,
      email: user.email,
      role: {
        id: user.Role.id,
        role_name: user.Role.role_name
      }
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "6h" });

    // Success response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: payload.role
      },
      token
    });

  } catch (err) {
    console.error("AuthLogin Error:", err);
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