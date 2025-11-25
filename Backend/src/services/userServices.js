import User from "../models/User.js";
import SkinData from "../models/SkinData.js";
import bcrypt from "bcryptjs";

export async function updateUser(
  userId,
  firstname,
  lastname,
  birthdate,
  currentPassword,
  newPassword
) {
  if (!firstname && !lastname && !newPassword) {
    return { success: false, message: "No fields provided" };
  }
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
  if (birthdate) user.birthdate = birthdate;
  await user.save();
  return { success: true };
}

export async function deleteUser(id) {
  return await User.destroy({ where: { id } });
}

export async function getUserId(id) {
  return await User.findByPk(id);
}

export async function createSkinData(
  userId,
  skin_type,
  skin_sensitivity,
  pigmentation,
  aging
) {
  console.log(
    "createSkinData called with:",
    userId,
    skin_type,
    skin_sensitivity,
    pigmentation,
    aging
  );
  return await SkinData.create({
    user_id: userId,
    skin_type,
    skin_sensitivity,
    pigmentation,
    aging,
  });
}

export async function deleteSkinData(userId) {
  return await SkinData.destroy({ where: { user_id: userId } });
}
