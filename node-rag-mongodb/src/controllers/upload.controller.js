import path from "path";
import { ingestUploadedFile } from "../services/upload-ingest.service.js";

export async function uploadController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const absolutePath = path.resolve(process.cwd(), req.file.path);

    console.log("Multer file path:", req.file.path);
    console.log("Absolute file path:", absolutePath);

    const result = await ingestUploadedFile(
      absolutePath,
      req.file.originalname,
      req.user._id
    );

    res.json({
      success: true,
      message: "File uploaded and ingested",
      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}