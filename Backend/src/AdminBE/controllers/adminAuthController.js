<<<<<<< HEAD
import { findAdminByEmail, findUserById } from "../services/adminUserServices.js";
=======
import prisma from "../../config/prisma.js";
>>>>>>> 1409f7b53e4491022b6f4c1f2e562a14e06349f8
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";

// Admin login
export async function AuthLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    if (user.role_id !== 1)
      return res.status(403).json({ error: "Admins only" });

    const payload = {
      id: user.id,
      email: user.email,
      role: {
        id: user.role?.id || user.role_id,
        role_name: user.role?.role_name || "admin",
      },
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "6h" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: payload.role,
      },
      token,
    });
  } catch (err) {
    console.error("AuthLogin error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// Get admin data
export async function getAdminData(req, res) {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.status(200).json({
      id: admin.id,
      email: admin.email,
      role: admin.role_id === 1 ? "admin" : "user",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Create user
export async function createUsers(req, res) {
  try {
    const { email, first_name, last_name, password, role_id, birthdate } =
      req.body;

    if (!email || !first_name || !last_name || !password || !role_id)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
        role_id,
        birthdate: birthdate || null,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Delete user
export async function DeleteUser(req, res) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// Update user
export async function UpdateUser(req, res) {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password, role_id, birthdate } =
      req.body;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role_id,
        birthdate,
      },
      include: { role: true },
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Server error while updating user" });
  }
}

// Get user by ID
export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.setHeader("Cache-Control", "no-store");
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: { select: { id: true, role_name: true } },
      },
    });
    res.status(200).json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ error: "Server error fetching users" });
  }
}
