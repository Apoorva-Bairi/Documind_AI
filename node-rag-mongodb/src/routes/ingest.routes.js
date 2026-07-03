import express from "express";

import {
  ingestController
} from "../controllers/ingest.controller.js";

const router = express.Router();

router.get("/", ingestController);

export default router;