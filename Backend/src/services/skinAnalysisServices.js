import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import SkinAnalysisTransaction from "../models/SkinAnalysisTransaction.js";
import SkinCondition from "../models/SkinCondition.js";
export function skinAnalyze(imageBuffer) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const scriptDirectory = resolve(__dirname, "../ai/dermfoundation/classifier");
  const pythonScript = resolve(scriptDirectory, "predict.py");
  const python = spawn("python", [pythonScript], {
    cwd: scriptDirectory,
  });

  return new Promise((resolve, reject) => {
    let output = "";
    let errorOutput = "";

    python.stdin.write(imageBuffer);
    python.stdin.end();
    python.stdout.on("data", (data) => {
      const text = data.toString();
      console.log("Python stdout:", text);
      output += text;
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(output.trim()));
        } catch (e) {
          reject(`Invalid JSON. Output: ${output}`);
        }
      } else {
        reject(`Python exited with code ${code}. Stderr: ${errorOutput}`);
      }
    });

    python.on("error", (err) => {
      reject(`Failed to spawn: ${err.message}`);
    });
  });
}

export async function mapSkinResultToCatalog(user_id, skinResult) {
  if (!skinResult || !skinResult.top3) return null;

  const top1 = skinResult.top3[0];
  const condition = await SkinCondition.findOne({
    where: { condition: top1.label },
  });
  if (!condition) {
    return null;
  }
  const status = checkResults(top1, condition);
  return await SkinAnalysisTransaction.create({
    user_id,
    image_id: null,
    condition_id: condition.id,
    confidence_scores: top1.score,
    status,
  });
}

function checkResults(top1, condition) {
  if (condition.can_recommend.toLowerCase() === "no") return "flagged";
  if (top1.score < 0.07) return "out of scope";

  return "success";
}
