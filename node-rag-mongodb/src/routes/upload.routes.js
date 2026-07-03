import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  uploadController
} from "../controllers/upload.controller.js";

import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadController
);

export default router;