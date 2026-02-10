import { saveBufferImage } from "../utils/saveBufferImage.js";
import { checkImgPython } from "../utils/python.checkImageQuality.js";
import { skinAnalyze } from "../utils/python.serverSkinAnalysis.js";
import { createStoredImage, getImageById } from "./imagesServices.js";
import { mapSkinResultToCatalog } from "./skinAnalysisDBMapping.js";
import { skinAnalysisTransactions } from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";
import { ENV } from "../config/env.js";

export async function analyzeSkinOrchestrator(userId, imageBuffer) {
  try {
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

    const skinResult = await skinAnalyze(imageBuffer);
    const transaction = await mapSkinResultToCatalog(userId, skinResult);

    if (!transaction) {
      return {
        statusCode: 404,
        payload: { error: "Failed to save data to skin analysis transaction" },
      };
    }

    const status = transaction.status.toLowerCase();
    let imageUrl = null;

    if (status === "flagged" || status === "success") {
      const savedImage = await saveImageLogic(userId, imageBuffer);
      await updateTransactionImage(transaction.id, savedImage.id);
      imageUrl = ENV.BASE_URL + "/uploads/" + savedImage.photoUrl;
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

    return {
      statusCode: 200,
      payload: {
        result: "success",
        message: "Analysis complete",
        data: {
          id: transaction.id,
          userId: transaction.userId,
          imageId: transaction.imageId,
          conditionId: transaction.conditionId,
          confidenceScores: transaction.confidenceScores,
          status: transaction.status,
          condition_name: transaction.condition_name,
          canRecommend: transaction.canRecommend,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          image_url: imageUrl,
        },
      },
    };
  } catch (err) {
    console.error("FATAL ERROR in analyzeSkin:", err);
    return {
      statusCode: 500,
      payload: { error: "Internal Server Error" },
    };
  }
}

//===== HELPER FUNCTION ==========================
async function saveImageLogic(userId, imageBuffer) {
  const savedPath = await saveBufferImage(imageBuffer);
  return createStoredImage(userId, savedPath);
}

async function updateTransactionImage(transactionId, imageId) {
  await db
    .update(skinAnalysisTransactions)
    .set({ imageId })
    .where(eq(skinAnalysisTransactions.id, transactionId));
}
