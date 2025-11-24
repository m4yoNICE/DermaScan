import { adminFetchUsers } from "../adminservices/adminUserManagement";

export async function getAllUsers(req, res) {
  try {
    const userId = req.user.id;
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