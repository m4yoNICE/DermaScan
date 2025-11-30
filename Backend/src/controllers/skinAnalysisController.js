import {
  findCondtionById,
  mapSkinResultToCatalog,
  skinAnalyze,
} from "../services/skinAnalysisServices.js";
import { saveBufferImage } from "../utils/saveBufferImage.js";
import { createStoredImage } from "../services/imagesServices.js";
import { checkImageQuality } from "../utils/checkImageQuality.js";
import SkinAnalysisTransaction from "../models/SkinAnalysisTransaction.js";

//THE MAIN IMAGE PROCESSING LOGIC
export async function skinAnalysis(req, res) {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //Saves the image in the memory first and saves it if it is actually completed
    console.log("image recieved: commencing analysing");
    const imageBuffer = req.file.buffer;

    //CHECK IMAGE QUALITY
    const imageQuality = await checkImageQuality(imageBuffer);
    console.log(imageQuality);
    if (!imageQuality.ok) {
      return res.status(200).json({
        result: "failed",
        message:
          "The photo is unclear. Please retake the picture in good lighting and ensure the skin is in focus.",
      });
    }
    //This is where the image processing goes..
    const skinResult = await skinAnalyze(imageBuffer);

    //save to skin analysis transaction
    const transaction = await mapSkinResultToCatalog(userId, skinResult);
    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Failed to save data to skin analysis transaction" });
    }
    const status = transaction.status.toLowerCase();
    if (status == "flagged") {
      console.log("skin result: flaggeds");

      const savedImage = await saveImageLogic(userId, imageBuffer);
      const saved = await transaction.update({ image_id: savedImage.id });
      console.log(saved);
      return res.status(200).json({
        result: "failed",
        message:
          "This concern may require professional consultation. Please see a dermatologist for proper care.",
      });
    }
    if (status == "out of scope") {
      console.log("skin result: out of scope");

      return res.status(200).json({
        result: "failed",
        message: "The image does not contain skin or a valid skin region.",
      });
    }
    if (status === "success") {
      console.log("skin result: success");
      const savedImage = await saveImageLogic(userId, imageBuffer);
      const saved = await transaction.update({ image_id: savedImage.id });
      console.log(saved);
    }
    const updatedTransaction = await SkinAnalysisTransaction.findByPk(
      transaction.id //gets the id of the first const transaction
    );
    res.status(200).json({
      result: "success",
      message: "Analysis complete",
      data: updatedTransaction,
    });
  } catch (err) {
    console.error("Error in uploadskinimage:", err);
    res.status(500).json({ error: "Server error" });
  }
}

//reusing this to "success" and "flagged"
async function saveImageLogic(userId, imageBuffer) {
  //save image to local storage
  //
  const savedPath = await saveBufferImage(imageBuffer);
  //save to storedImages table
  //
  const imageSaveResult = await createStoredImage(userId, savedPath);

  return imageSaveResult;
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
