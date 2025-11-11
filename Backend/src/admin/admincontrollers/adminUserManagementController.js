import {
  adminFetchUsers,
  adminFetchUsersById,
} from "../adminservices/adminUserManagement.js";

export async function getAllUsers(req, res) {
  try {
    const fetchedUsers = await adminFetchUsers();
    if (!fetchedUsers || fetchedUsers.length === 0) {
      res.status(404).json({ error: "Users cannot be fetched" });
    }
    return res.status(200).json(fetchedUsers);
  } catch (err) {
    console.error("Error fetching all journal:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getOneUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await adminFetchUsersById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
