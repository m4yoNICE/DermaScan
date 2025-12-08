import User from "../../models/User.js";
import Role from "../../models/Role.js";

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

//ako ki balhin james since business logic siya
export default async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["id", "role_name"],
        },
      ],
      attributes: ["id", "email", "first_name", "last_name"],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", err);
    return res.status(500).json({ error: "Server error fetching users" });
  }
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

<<<<<<< HEAD:Backend/src/AdminBE/adminservices/adminUserManagement.js
export async function findUserById  (userId) {
=======
export async function findUserById(userId) {
>>>>>>> origin/main:Backend/src/AdminBE/services/adminUserServices.js
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}

export async function findAdminByEmail(email) {
  return await User.findOne({
    where: { email },
    include: [Role],
  });
}
