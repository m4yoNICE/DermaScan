import multer from "multer";

export function memorySaveMulter() {
  return multer({ storage: multer.memoryStorage() });
}
