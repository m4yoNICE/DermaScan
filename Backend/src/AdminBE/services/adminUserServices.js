import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";

/**
 * Get admin data by user ID
 */
export async function getAdminDataProcess(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

/**
 * Get all users with role information
 */
export async function getAllUsersProcess() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: {
        select: {
          id: true,
          role_name: true,
        },
      },
    },
  });
}

/**
 * Get user by ID
 */
export async function getUserByIdProcess(id) {
  return await prisma.user.findUnique({ where: { id } });
}

/**
 * Create new user
 */
export async function createUsersProcess(
  email,
  first_name,
  last_name,
  password,
  role_id,
  birthdate,
) {
  if (!email || !first_name || !last_name || !password || !role_id) {
    throw new Error("INCOMPLETE_FIELDS");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("EMAIL_FOUND");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      first_name,
      last_name,
      password: hashedPassword,
      role_id,
      birthdate: birthdate ? new Date(birthdate) : null,
    },
  });
}

/**
 * Delete user by ID
 */
export async function deleteUserProcess(id) {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!user) {
    throw new Error("ACCOUNT_NOT_FOUND");
  }

  return await prisma.user.delete({ where: { id: Number(id) } });
}

/**
 * Update user information
 */
export async function updateUserProcess(
  id,
  first_name,
  last_name,
  email,
  password,
  role_id,
  birthdate,
) {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const hashedPassword = password
    ? await bcrypt.hash(password, 10)
    : user.password;

  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role_id,
      birthdate: birthdate ? new Date(birthdate) : undefined,
    },
    include: { role: true },
  });
}

/**
 * Find admin by email (used in auth)
 */
export async function findAdminByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
}
