import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

//spawn python, this is where node will connect to python via spawn
export function skinAnalyze(imageBuffer) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const scriptDirectory = resolve(__dirname, "../ai/dermfoundation/classifier");
  const pythonScript = resolve(scriptDirectory, "predict.py");
  const python = spawn("python", [pythonScript], {
    cwd: scriptDirectory,
  });
  console.log(python);

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