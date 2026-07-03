import express from "express";
import {
  getHistory,
  clearHistory,
} from "../controllers/history.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getHistory);
router.delete("/", protect, clearHistory);

export default router;