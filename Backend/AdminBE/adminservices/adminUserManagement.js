import express from "express";
import  User  from "../../src/models/User.js";

const router = express.Router();

export async function adminFetchUsers() {
  return await User.findAll();
}

export async function updateUser(
  userId,
  firstname,
  lastname,
  birthdate,
  currentPassword,
  newPassword
) {
  if (!firstname && !lastname && !newPassword) {
    return res.status(400).json({ error: "No fields provided" });
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

export async function updateSkinData(userId, skin_type, skin_sensitivity) {
  console.log(
    "updateSkinData called with:",
    userId,
    skin_type,
    skin_sensitivity
  );
  return await User.update(
    { skin_type, skin_sensitivity },
    { where: { id: userId } }
  );
}



export default router;