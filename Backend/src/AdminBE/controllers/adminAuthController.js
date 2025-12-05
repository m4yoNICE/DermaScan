import {
  findAdminByEmail,
  findUserById,
} from "../services/adminUserServices.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";
import User from "../../models/User.js";
import Role from "../../models/Role.js";

export async function AuthLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log("AuthLogin called with:", { email });

    // Check if request body is valid
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Login attempt:", { email });

    // Fetch user along with role
    const user = await findAdminByEmail(email);

    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("User fetched from DB:", user);

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log("Invalid password for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is actually an admin
    if (Number(user.role_id) !== 1) {
      console.log("Non-admin user attempted admin login:", user.role_id);
      return res.status(403).json({ error: "Admins only" });
    }

    // Safe JWT payload with optional chaining
    const payload = {
      id: user.id,
      email: user.email,
      role: {
        id: user.Role?.id || user.role_id,
        role_name: user.Role?.role_name || "admin",
      },
    };

    // Sign JWT token
    const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "6h" });

    // Success response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: payload.role,
      },
      token,
    });

    console.log("Admin login successful:", email);
  } catch (err) {
    console.error("AuthLogin error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getAdminData(req, res) {
  try {
    const admin = await findUserById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({
      id: admin.id,
      email: admin.email,
      role: admin.isAdmin ? "admin" : "user",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function createUsers(req, res) {
  try {
    const { email, first_name, last_name, password, role_id, birthdate } =
      req.body;

    if (!email || !first_name || !last_name || !password || !role_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      first_name,
      last_name,
      password: hashedPassword,
      role_id,
      birthdate: birthdate || null,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role_id: newUser.role_id,
        birthdate: newUser.birthdate,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function DeleteUser(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy(); // deletes the user
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function UpdateUser(req, res) {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password, role_id, birthdate } =
      req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // If password exists -> hash it
    let hashedPassword = user.password;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role_id,
      birthdate,
    });

    const updatedUser = await User.findByPk(id, {
      include: [{ model: Role, attributes: ["id", "role_name"] }],
    });

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Server error while updating user" });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // prevent caching so frontend always gets fresh data
    res.setHeader("Cache-Control", "no-store");

    // return clean user object
    res.json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id,
        birthdate: user.birthdate,
      },
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["id", "role_name"],
        },
      ],
      attributes: ["id", "email", "first_name", "last_name"],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", err);
    return res.status(500).json({ error: "Server error fetching users" });
  }
}
