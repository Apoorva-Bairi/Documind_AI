import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  askController
} from "../controllers/ask.controller.js";

const router = express.Router();

router.post("/", protect, askController);

export default router;