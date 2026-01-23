import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";

export async function adminFetchUsers() {
  return await prisma.user.findMany();
}

export async function updateUser(
  userId,
  firstname,
  lastname,
  birthdate,
  currentPassword,
  newPassword,
) {
  if (!firstname && !lastname && !newPassword) {
    return { success: false, message: "No fields provided" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const updateData = {};

  if (newPassword) {
    if (!currentPassword) {
      return { success: false, message: "Current password required" };
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, message: "Incorrect current password" };
    }
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  if (firstname) updateData.first_name = firstname;
  if (lastname) updateData.last_name = lastname;
  if (birthdate) updateData.birthdate = birthdate;

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return { success: true };
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      role: {
        select: {
          id: true,
          role_name: true,
        },
      },
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
    },
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({ where: { id } });
}

export async function getUserId(id) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function updateSkinData(userId, skin_type, skin_sensitivity) {
  console.log(
    "updateSkinData called with:",
    userId,
    skin_type,
    skin_sensitivity,
  );
  return await prisma.skinData.update({
    where: { user_id: userId },
    data: { skin_type, skin_sensitivity },
  });
}

export async function findUserById  (userId) {
  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}

export async function findAdminByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
}
