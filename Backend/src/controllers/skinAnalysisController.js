import { findCondtionById } from "../services/skinAnalysisDBMapping.js";
import { analyzeSkinOrchestrator } from "../services/skinAnalysisOrchestrator.js";
import { recommendOrchestrator } from "../services/productRecommendationOrchestrator.js";
// === MAIN IMAGE PROCESSING LOGIC ===
// Handles the full lifecycle of a skin analysis request

export async function skinAnalysis(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await analyzeSkinOrchestrator(req.user.id, req.file.buffer);
    let recommendation = null;

    // commenting for now since im done with the return endpoint, will be bringing back if the orchestrator is finished
    // if (result.payload.result === "success") {
    //   recommendation = await recommendOrchestrator(result);
    // }

    return res.status(result.statusCode).json({
      analysis: result.payload,
      recommendation: recommendation,
    });
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
      return res.status(404).json({
        error: "Condition not found",
      });
    }

    return res.status(200).json({
      result: "success",
      data: condition,
    });
  } catch (err) {
    console.error("Error in getConditionNameByID:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
