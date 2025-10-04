import { updateUser, deleteUser, getUserId } from "../services/userServices.js";

export async function getuserid(req, res) {
  try {
    const userId = req.user.id;
    const user = await getUserId(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...userData } = user.dataValues;
    return res.status(200).json(userData);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function edituser(req, res) {
  try {
    const userId = req.user.id;
    const { firstname, lastname, email, currentPassword, newPassword } =
      req.body;

    const result = await updateUser(
      userId,
      firstname,
      lastname,
      email,
      currentPassword,
      newPassword
    );

    if (!result.success) return res.status(400).json({ error: result.message });

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Edit user error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteuser(req, res) {
  try {
    const userId = req.user.id;
    const deleted = await deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
