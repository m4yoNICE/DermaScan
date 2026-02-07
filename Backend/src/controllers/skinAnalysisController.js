import { findCondtionById } from "../services/skinAnalysisDBMapping.js";
import { analyzeSkin } from "../services/skinAnalysisOrchestrator.js";

export async function skinAnalysis(req, res) {
  console.log("skinAnalysis controller called: ", req.body);
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const result = await analyzeSkin(req.user.id, req.file.buffer);
    return res.status(result.statusCode).json(result.payload);
    // await testAnalysis(req.user.id, req.file.buffer, res);
  } catch (err) {
    console.error("Error in skinAnalysisController:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getConditionNameByID(req, res) {
  try {
    const { id } = req.params;
    const condition_id = id;
    const condition = await findCondtionById(condition_id);
    if (!condition) {
      return res.status(404).json({ error: "Condition not found" });
    }

    return res.status(200).json({ result: "success", data: condition });
  } catch (err) {
    console.error("Error in getConditionNameByID:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
