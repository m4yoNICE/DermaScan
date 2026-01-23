import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email,
  first_name,
  birthdate,
  last_name,
  password,
  role,
) {
  const passwordHash = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      first_name,
      last_name,
      birthdate,
      password: passwordHash,
      role_id: role,
    },
  });
}

export async function createAccessToken(payload, expiresIn = "15m") {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
}

export async function saveOTP(user_id, otp_code, expiresAt) {
  return await prisma.oTP.create({
    data: { user_id, otp_code, isUsed: false, expiresAt },
  });
}
export async function usedOTP(user_id) {
  return await prisma.oTP.updateMany({
    where: { user_id, isUsed: false },
    data: { isUsed: true },
  });
}

export async function findOTP(user_id, otp) {
  return await prisma.oTP.findFirst({
    where: {
      user_id: user_id,
      otp_code: otp,
      isUsed: false,
    },
    orderBy: { created_at: "desc" },
  });
}

export async function resetPasword(email, password) {
  const hashed = await bcrypt.hash(password, 10);
  return await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });
}
