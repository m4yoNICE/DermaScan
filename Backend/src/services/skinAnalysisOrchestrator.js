import { saveBufferImage } from "../utils/saveBufferImage.js";

//ai pipeline
import { checkImgPython } from "../utils/python.checkImageQuality.js";
import { skinAnalyze } from "../utils/python.serverSkinAnalysis.js";

//database pipeline
import { createStoredImage } from "./imagesServices.js";
import { mapSkinResultToCatalog } from "./skinAnalysisDBMapping.js";
import { skinAnalysisTransactions } from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm"; // Ensure this is imported

export async function analyzeSkinOrchestrator(userId, imageBuffer) {
  console.log("start");
  const startTime = Date.now();
  console.log(
    `\n[${new Date().toISOString()}] >>> STARTING ANALYSIS for User: ${userId}`,
  );

  try {
    // === IMAGE QUALITY CHECK ===
    console.log(
      `[${Date.now() - startTime}ms] Running Python Quality Check...`,
    );
    const imgQuality = await checkImgPython(imageBuffer);

    if (!imgQuality.ok) {
      console.warn(
        `[${Date.now() - startTime}ms] Quality Check FAILED: ${imgQuality.message || "Blurry/Unclear"}`,
      );
      return {
        statusCode: 200,
        payload: {
          result: "failed",
          message: "The photo is unclear. Please retake the picture.",
        },
      };
    }
    console.log(`[${Date.now() - startTime}ms] Quality Check PASSED.`);

    // === SKIN ANALYSIS ===
    console.log(`[${Date.now() - startTime}ms] Launching Python Skin AI...`);
    const skinResult = await skinAnalyze(imageBuffer);
    console.log();
    console.log(skinResult);
    console.log();
    console.log(
      `[${Date.now() - startTime}ms] Python AI returned raw results.`,
    );

    console.log(
      `[${Date.now() - startTime}ms] Mapping results to database catalog...`,
    );
    const transaction = await mapSkinResultToCatalog(userId, skinResult);

    if (!transaction) {
      console.error(
        `[${Date.now() - startTime}ms] DATABASE ERROR: Transaction mapping failed.`,
      );
      return {
        statusCode: 404,
        payload: { error: "Failed to save data to skin analysis transaction" },
      };
    }
    console.log(
      `[${Date.now() - startTime}ms] Transaction Created. ID: ${transaction.id}`,
    );

    const status = transaction.status.toLowerCase();
    console.log(
      `[${Date.now() - startTime}ms] Transaction Status: ${status.toUpperCase()}`,
    );

    // === SAVE IMAGE ===
    if (status === "flagged" || status === "success") {
      console.log(`[${Date.now() - startTime}ms] Saving image to storage...`);
      const savedImage = await saveImageLogic(userId, imageBuffer);
      console.log(
        `[${Date.now() - startTime}ms] Image saved. ID: ${savedImage.id}. Updating transaction...`,
      );

      await db
        .update(skinAnalysisTransactions)
        .set({ imageId: savedImage.id })
        .where(eq(skinAnalysisTransactions.id, transaction.id));
    }

    if (status === "flagged") {
      console.log(
        `[${Date.now() - startTime}ms] Result: FLAGGED (Medical concern)`,
      );
      return {
        statusCode: 200,
        payload: {
          result: "failed",
          message: "This concern may require professional consultation.",
        },
      };
    }

    if (status === "out of scope") {
      console.log(
        `[${Date.now() - startTime}ms] Result: OUT_OF_SCOPE (Non-skin detected)`,
      );
      return {
        statusCode: 200,
        payload: {
          result: "failed",
          message: "The image does not contain skin or a valid skin region.",
        },
      };
    }

    // success
    console.log(
      `[${Date.now() - startTime}ms] Finalizing and fetching updated transaction...`,
    );
    const updatedTransaction = await findTransactionById(transaction.id);

    console.log(
      `[${Date.now() - startTime}ms] >>> ANALYSIS COMPLETE. Total Time: ${Date.now() - startTime}ms\n`,
    );


    return {
      statusCode: 200,
      payload: {
        result: "success",
        message: "Analysis complete",
        data: updatedTransaction,
      },
    };
  } catch (err) {
    console.error(
      `[${Date.now() - startTime}ms] FATAL ERROR in analyzeSkin:`,
      err,
    );
    return {
      statusCode: 500,
      payload: { error: "Internal Server Error" },
    };
  }
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
