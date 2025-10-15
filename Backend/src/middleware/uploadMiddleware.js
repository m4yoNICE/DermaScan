import multer from "multer";
import path from "path";

const appRoot = process.cwd();

export function uploadMiddleware() {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(appRoot, "skinUploads"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
      console.log("✅ File is being saved as:", file.originalname);
    },
  });

  return multer({ storage });
}
