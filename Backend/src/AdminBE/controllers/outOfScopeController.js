import {
    getScanPerDay,
    getOutOfScopeStatistics,
    deleteOutOfScope
} from "../services/outOfScopeServices.js";

export async function handleGetScanPerDay(req, res) {
    try {
        await getScanPerDay(req, res);
    } catch (err) {
        console.error("Get scans per day error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function handleGetOutOfScopeStatistics(req, res) {
    try {
        await getOutOfScopeStatistics(req, res);
    } catch (err) {
        console.error("Get out of scope statistics error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function handleDeleteOutOfScope(req, res) {
    try {
        await deleteOutOfScope(req, res);
    } catch (err) {
        console.error("Delete out of scope error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}