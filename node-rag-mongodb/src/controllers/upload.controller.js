// import path from "path";
// import { ingestUploadedFile } from "../services/upload-ingest.service.js";

// export async function uploadController(req, res) {
//   try {
//     // File exists?
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         error: "No file uploaded",
//       });
//     }

//     // File type validation
//     const allowedExtensions = [".txt", ".pdf"];
//     const fileExtension = path.extname(req.file.originalname).toLowerCase();

//     if (!allowedExtensions.includes(fileExtension)) {
//       return res.status(400).json({
//         success: false,
//         error: "Only TXT and PDF files are allowed",
//       });
//     }

//     // File size validation (5MB)
//     const maxSize = 5 * 1024 * 1024;

//     if (req.file.size > maxSize) {
//       return res.status(400).json({
//         success: false,
//         error: "File size must be under 5MB",
//       });
//     }

//     // Process file
//     const result = await ingestUploadedFile(
//       req.file.path,
//       req.file.originalname,
//       req.user._id
//     );

//     res.json({
//       success: true,
//       message: "File uploaded and ingested",
//       data: result,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// }

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

    const absolutePath = path.resolve(req.file.path);

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