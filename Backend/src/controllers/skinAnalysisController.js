import { analyzeSkinOrchestrator } from "../application/skinAnalysisOrchestrator.js";
import { recommendOrchestrator } from "../application/productRecommendationOrchestrator.js";
// === MAIN IMAGE PROCESSING LOGIC ===
// Handles the full lifecycle of a skin analysis request

export async function skinAnalysis(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const analysisResult = await analyzeSkinOrchestrator(
      req.user.id,
      req.file.buffer,
    );
    let recommendationResult = null;

    if (analysisResult.payload.result === "success") {
      console.log("begin reccomendations");
      recommendationResult = await recommendOrchestrator(
        analysisResult.payload.data.id,
        req.user.id,
        analysisResult.payload.data.conditionId,
      );
    }

    console.log("analysis Result: ", analysisResult);
    console.log("Recommendation Result: ", recommendationResult);

    return res.status(analysisResult.statusCode).json({
      analysis: analysisResult.payload,
      recommendation: recommendationResult,
    });
  } catch (err) {
    console.error("Error in skinAnalysisController:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
