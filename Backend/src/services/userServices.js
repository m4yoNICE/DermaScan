import User from "../models/User.js";
import bcrypt from "bcryptjs";

export async function updateUser(
  userId,
  firstname,
  lastname,
  email,
  currentPassword,
  newPassword
) {
  const user = await User.findByPk(userId);
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (newPassword) {
    if (!currentPassword) {
      return { success: false, message: "Current password required" };
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, message: "Incorrect current password" };
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }
  if (firstname) user.first_name = firstname;
  if (lastname) user.last_name = lastname;
  if (email) user.email = email;
  await user.save();
  return { success: true };
}

export async function deleteUser(id) {
  return await User.destroy({ where: { id } });
}

export async function getUserId(id) {
  return await User.findByPk(id);
}
