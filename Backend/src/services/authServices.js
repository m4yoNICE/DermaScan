import User from "../models/User.js";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

export async function createUser(email, first_name, last_name, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return await User.create({
    email,
    first_name,
    last_name,
    password: passwordHash,
  });
}

