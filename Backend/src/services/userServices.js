import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export async function updateUser(
  userId,
  firstname,
  lastname,
  birthdate,
  currentPassword,
  newPassword,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, message: "User not found" };

  const data = {};
  if (firstname) data.first_name = firstname;
  if (lastname) data.last_name = lastname;
  if (birthdate) data.birthdate = birthdate;

  if (newPassword) {
    if (!currentPassword)
      return { success: false, message: "Current password required" };
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return { success: false, message: "Incorrect current password" };
    data.password = await bcrypt.hash(newPassword, 10);
  }

  await prisma.user.update({ where: { id: userId }, data });
  return { success: true };
}

export async function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}

export async function getUserId(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createSkinData(
  userId,
  skin_type,
  skin_sensitivity,
  pigmentation,
  aging,
) {
  return prisma.skinData.create({
    data: { user_id: userId, skin_type, skin_sensitivity, pigmentation, aging },
  });
}

export async function deleteSkinData(userId) {
  return prisma.skinData.delete({ where: { user_id: userId } });
}
