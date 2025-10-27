import app from "express";
import { createStoreImage } from "../services/imagesServices.js";

export async function uploadskinimage(req, res) {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = req.file.filename;
    const result = await createStoreImage(userId, imageUrl);
    if (!result) {
      return res.status(400).json({ error: result });
    }
    res.status(200).json({ message: "Image Successfully Stored" });
  } catch (err) {
    console.error("Error storing imageUrl in database:", err);
    res.status(500).json({ error: "Server error" });
  }
}
