import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";

/**
 * Processes admin login authentication
 *
 * @async
 * @function loginProcess
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} User data and JWT token
 * @throws {Error} INVALID_CREDENTIALS - Wrong email/password
 * @throws {Error} NOT_ADMIN - User is not an admin
 */
export async function loginProcess(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (user.role_id !== 1) {
    throw new Error("NOT_ADMIN");
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: {
      id: user.role.id,
      role_name: user.role.role_name,
    },
  };

  const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "6h" });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: payload.role,
    },
    token,
  };
}
