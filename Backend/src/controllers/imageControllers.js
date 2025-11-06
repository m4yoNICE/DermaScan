import { skinAnalyze } from "../services/skinAnalysisServices.js";
import { saveBufferImage } from "../utils/saveBufferImage.js";
import { createStoredImage } from "../services/imagesServices.js";
export async function uploadskinimage(req, res) {
  try {
    //initialize userid from token
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //skin analysis on ML
    const imageBuffer = req.file.buffer;
    console.log("recieved");
    const result = await skinAnalyze(imageBuffer);
    console.log(result);
    //save image to local storage
    const savedPath = await saveBufferImage(imageBuffer);
    //save to storedImages table
    const imageSaveResult = await createStoredImage(userId, savedPath);
    if (!imageSaveResult) {
      return res.status(500).json({ error: "Failed to save image info to database" });
    }



    res.status(200).json({ message: "Analysis complete", data: result });
  } catch (err) {
    console.error("Error storing imageUrl in database:", err);
    res.status(500).json({ error: "Server error" });
  }
}

