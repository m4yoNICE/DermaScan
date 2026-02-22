import {
  updateUser,
  deleteUser,
  getUserWithSkinData,
  createSkinData,
  deleteSkinData,
} from "../services/userServices.js";

export async function getuserid(req, res) {
  try {
    const userId = req.user.id;
    const user = await getUserWithSkinData(userId);
    console.log("fetched user data: ", user);
    console.log(user);
    if (!user || !user.dataValues) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function edituser(req, res) {
  try {
    const userId = req.user.id;
    const { firstname, lastname, birthdate, currentPassword, newPassword } =
      req.body;

    const result = await updateUser(
      userId,
      firstname,
      lastname,
      birthdate,
      currentPassword,
      newPassword,
    );

    if (!result) {
      return res.status(400).json({ error: result });
    }
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
export async function deleteskindata(req, res) {
  try {
    const userId = req.user.id;
    const updatedRows = await deleteSkinData(userId);

    if (!updatedRows) {
      // Change this
      return res
        .status(404)
        .json({ error: "User not found or no data updated" });
    }

    res.status(200).json({ message: "Skin data cleared successfully" });
  } catch (err) {
    console.error("Error deleting skin data:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function createskindata(req, res) {
  try {
    console.log(req.body);
    const { skin_type, skin_sensitivity, pigmentation, aging } = req.body;
    const userId = req.user.id;
    if (!skin_type || skin_sensitivity === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await createSkinData(
      userId,
      skin_type,
      skin_sensitivity,
      pigmentation,
      aging,
    );
    if (result[0] === 0) {
      return res
        .status(404)
        .json({ error: "User not found or no changes made" });
    }
    res.status(200).json({ message: "Skin data added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
