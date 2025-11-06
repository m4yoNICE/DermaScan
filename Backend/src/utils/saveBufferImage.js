import fs from "fs";
import path from "path";

export async function saveBufferImage(buffer) {
  const uploadsDir = path.join(process.cwd(), "skinUploads");
  try {
  await fs.mkdirSync(uploadsDir, { recursive: true });
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = `image-${uniqueSuffix}.jpg`;
  const filepath = path.join(uploadsDir, filename);
  await fs.writeFileSync(filepath, buffer);
  return filepath;
  }catch (err) {
    console.error("Error creating uploads directory:", err);
    throw err;
  }
}
