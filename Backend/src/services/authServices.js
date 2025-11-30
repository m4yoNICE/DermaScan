import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export async function findUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

export async function createUser(
  email,
  first_name,
  birthdate,
  last_name,
  password,
  role
) {
  const passwordHash = await bcrypt.hash(password, 10);
  return await User.create({
    email,
    first_name,
    last_name,
    birthdate,
    password: passwordHash,
    role,
  });
}

export async function createAccessToken(payload, expiresIn = "15m") {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
}

export async function saveOTP(user_id, otp_code, expiresAt) {
  return await OTP.create({ user_id, otp_code, isUsed: false, expiresAt });
}
export async function usedOTP(user_id) {
  return await OTP.update(
    { isUsed: true },
    { where: { user_id, isUsed: false } }
  );
}

export async function findOTP(user_id, otp) {
  return await OTP.findOne({
    where: {
      user_id: user_id,
      otp_code: otp,
      isUsed: false,
    },
    order: [["created_at", "DESC"]],
  });
}

export async function resetPasword(email, password) {
  const hashed = await bcrypt.hash(password, 10);
  return await User.update({ password: hashed }, { where: { email: email } });
}
