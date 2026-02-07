import { saveBufferImage } from "../utils/saveBufferImage.js";

//ai pipeline
import { checkImgPython } from "../utils/python.checkImageQuality.js";
import { skinAnalyze } from "../utils/python.serverSkinAnalysis.js";

//database pipeline
import { createStoredImage } from "./imagesServices.js";
import { mapSkinResultToCatalog } from "./skinAnalysisDBMapping.js";
import { skinAnalysisTransactions } from "../drizzle/schema.js";
import { db } from "../config/db.js";
export async function analyzeSkin(userId, imageBuffer) {
  // === IMAGE QUALITY CHECK ===
  const imgQuality = await checkImgPython(imageBuffer);
  if (!imgQuality.ok) {
    return {
      statusCode: 200,
      payload: {
        result: "failed",
        message: "The photo is unclear. Please retake the picture.",
      },
    };
  }

  // === SKIN ANALYSIS ===
  const skinResult = await skinAnalyze(imageBuffer);
  const transaction = await mapSkinResultToCatalog(userId, skinResult);
  if (!transaction) {
    return {
      statusCode: 404,
      payload: { error: "Failed to save data to skin analysis transaction" },
    };
  }

  const status = transaction.status.toLowerCase();

  // === SAVE IMAGE ===
  let savedImage;
  if (status === "flagged" || status === "success") {
    savedImage = await saveImageLogic(userId, imageBuffer);
    await transaction.update({ image_id: savedImage.id });
  }

  if (status === "flagged") {
    return {
      statusCode: 200,
      payload: {
        result: "failed",
        message: "This concern may require professional consultation.",
      },
    };
  }

  if (status === "out of scope") {
    return {
      statusCode: 200,
      payload: {
        result: "failed",
        message: "The image does not contain skin or a valid skin region.",
      },
    };
  }

  // success
  const updatedTransaction = await findTransactionById(transaction.id);

  return {
    statusCode: 200,
    payload: {
      result: "success",
      message: "Analysis complete",
      data: updatedTransaction,
    },
  };
}

//===========================================================================================================================

// helper
async function saveImageLogic(userId, imageBuffer) {
  const savedPath = await saveBufferImage(imageBuffer);
  return createStoredImage(userId, savedPath);
}

async function findTransactionById(id) {
  // Prisma version, no Sequelize
  return await db.query.skinAnalysisTransactions.findFirst({
    where: eq(skinAnalysisTransactions.id, id),
  });
}
