<<<<<<< HEAD
<<<<<<< HEAD
import { findAdminByEmail, findUserById } from "../services/adminUserServices.js";
=======
import prisma from "../../config/prisma.js";
>>>>>>> 1409f7b53e4491022b6f4c1f2e562a14e06349f8
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";
=======
import { loginProcess } from "../services/adminAuthServices.js";
>>>>>>> 25beaf2c022d6d5fdbd4b90e2c60202308e6d51a

/**
 * Handles admin login endpoint
 *
 * @async
 * @function login
 * @param {Object} req
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @param {Object} res
 * @returns {Promise<void>}
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await loginProcess(email, password);
    if (!result) return res.status(500).json({ error: "Database Error" });

    return res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    console.error("Admin login error:", err);

    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (err.message === "NOT_ADMIN") {
      return res.status(403).json({ error: "Admins only" });
    }

    return res.status(500).json({ error: "Server error" });
  }
}
