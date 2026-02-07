import { mapSkinResultToCatalog } from "./skinAnalysisDBMapping.js";
import { skinAnalyze } from "../utils/pythonSkinAnalysis.js";
import { saveBufferImage } from "../utils/saveBufferImage.js";
import { createStoredImage } from "./imagesServices.js";
import { checkImgPython } from "../utils/checkImageQuality.js";
import { skinAnalysisTransactions } from "../drizzle/schema.js";
import crypto from "crypto";
import { db } from "../config/db.js";

const jobs = new Map();

export async function orchestrateSkinAnalysis(userId, imageBuffer, res) {
  console.log("orchestrateSkinAnalysis started");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // === IMAGE QUALITY CHECK ===
    sendEvent({
      status: "checking_quality",
      message: "Checking image quality...",
    });
    const imgQuality = await checkImgPython(imageBuffer);
    if (!imgQuality.ok) {
      sendEvent({
        result: "failed",
        message: "The photo is unclear. Please retake the picture.",
      });
      res.end();
      return;
    }

    // === SKIN ANALYSIS ===
    sendEvent({ status: "analyzing", message: "Analyzing skin..." });

    const skinResult = await skinAnalyze(imageBuffer);
    const transaction = await mapSkinResultToCatalog(userId, skinResult);

    if (!transaction) {
      sendEvent({
        result: "error",
        message: "Failed to save data to skin analysis transaction",
      });
      res.end();
      return;
    }

    const status = transaction.status.toLowerCase();

    // === SAVE IMAGE ===
    let savedImage;
    if (status === "flagged" || status === "success") {
      sendEvent({ status: "saving_image", message: "Saving image..." });
      savedImage = await saveImageLogic(userId, imageBuffer);
      await transaction.update({ image_id: savedImage.id });
    }

    if (status === "flagged") {
      sendEvent({
        result: "failed",
        message: "This concern may require professional consultation.",
      });
      res.end();
      return;
    }

    if (status === "out of scope") {
      sendEvent({
        result: "failed",
        message: "The image does not contain skin or a valid skin region.",
      });
      res.end();
      return;
    }

    // success
    sendEvent({ status: "finalizing", message: "Finalizing results..." });

    const updatedTransaction = await findTransactionById(transaction.id);

    sendEvent({
      result: "success",
      message: "Analysis complete",
      data: updatedTransaction,
    });
    res.end();
  } catch (err) {
    console.error("Error in orchestrateSkinAnalysis:", err);
    return {
      statusCode: 500,
      payload: { error: "Server error during skin analysis orchestration" },
    };
  }
  a;
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
