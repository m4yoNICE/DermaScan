import * as recommendationService from "../services/recommendServices.js";

export async function saveRecommendation(req, res) {
  try {
    const { analysisId, productIds } = req.body;

    if (!analysisId || !productIds?.length) {
      return res
        .status(400)
        .json({ error: "Analysis records and selected products are required" });
    }

    await recommendationService.insertRecommendations(analysisId, productIds);
    res.status(201).json({ success: true, message: "Recommendations saved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getHistory(req, res) {
  try {
    const history = await recommendationService.fetchHistory(req.user.id);
    res.status(200).json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
