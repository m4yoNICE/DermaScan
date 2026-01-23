import {
  findCondtionById,
  mapSkinResultToCatalog,
  skinAnalyze,
} from "../services/skinAnalysisServices.js";
import { saveBufferImage } from "../utils/saveBufferImage.js";
import { createStoredImage } from "../services/imagesServices.js";
import SkinAnalysisTransaction from "../models/SkinAnalysisTransaction.js";
import { checkImgPython } from "../utils/checkImageQuality.js";
// === MAIN IMAGE PROCESSING LOGIC ===
// Handles the full lifecycle of a skin analysis request
export async function skinAnalysis(req, res) {
  try {
    const userId = req.user.id;

    // error trapping to ensure a file was uploaded with the request
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //Saves the image in the memory first and saves it if it is actually completed
    console.log("image recieved: commencing analysing");
    const imageBuffer = req.file.buffer;

    // === IMAGE QUALITY CHECK ===
    const imgQuality = await checkImgPython(imageBuffer);
    console.log(imgQuality);
    if (!imgQuality.ok) {
      let message = "The photo is unclear. Please retake the picture.";
      return res.status(200).json({
        result: "failed",
        message,
      });
    }
    // === SKIN ANALYSIS ===
    // Process the image using the ML/AI skin analysis pipeline
    const skinResult = await skinAnalyze(imageBuffer);

    // Map the analysis result to the skin condition catalog and save the transaction
    const transaction = await mapSkinResultToCatalog(userId, skinResult);
    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Failed to save data to skin analysis transaction" });
    }

    // Determine the analysis outcome and handle accordingly
    const status = transaction.status.toLowerCase();

    //fail if image result has complex skin condition that must be handled by a dermatologist
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

    //fail if confidence score doesnt reach 55% or more just to make sure the results are accurate
    if (status == "out of scope") {
      console.log("skin result: out of scope");

      return res.status(200).json({
        result: "failed",
        message: "The image does not contain skin or a valid skin region.",
      });
    }

    //success if confidence score is in suitable range and skin condition is manageable
    if (status === "success") {
      console.log("skin result: success");
      const savedImage = await saveImageLogic(userId, imageBuffer);
      const saved = await transaction.update({ image_id: savedImage.id });
    }

    //gets the data of the saved transaction so that
    //when it reaches Results.jsx, itll call the backend back to fetch data
    //pertaining to image_id, skincondition_id n such
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
