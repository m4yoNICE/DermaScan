import { getSkinTypes } from "../services/skinTypeFetchServices.js";

export async function handleSkinTypes(req, res) {
    try {
        await getSkinTypes(req, res);
    } catch (err) {
        console.error("Fetch skin types error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}