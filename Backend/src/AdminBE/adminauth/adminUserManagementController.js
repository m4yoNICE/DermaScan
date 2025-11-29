import User from "../../models/User.js";
import Role from "../../models/Role.js";

export default async function getAllUsers(req, res) {
  try {
   const users = await User.findAll({
    include : [{ 
      model: Role, 
      attributes: ["id", "role_name"],
      },
    ],
    attributes: ["id", "email", "first_name", "last_name"]
   });
   res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", err);
    return res.status(500).json({ error: "Server error fetching users" });
  }
}
