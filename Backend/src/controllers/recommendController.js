import * as recommendationService from "../services/recommendServices.js";

export async function saveRecommendation(req, res) {
  try {
    console.log(req.body);
    const { analysisId, productIds } = req.body;

    if (!analysisId || !productIds?.length) {
      return res
        .status(400)
        .json({ error: "Analysis records and selected products are required" });
    }

    await recommendationService.insertRecommendations(analysisId, productIds);

    res.status(201).json({ success: true, message: "Recommendations saved." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
