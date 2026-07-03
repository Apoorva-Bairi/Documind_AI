import express from "express";
import cors from "cors";

import "./config.js";

import { connectDB } from "./db.js";

import askRoutes from "./routes/ask.routes.js";
import ingestRoutes from "./routes/ingest.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/history.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("RAG API Running");
});

app.use("/auth", authRoutes);
app.use("/ask", askRoutes);
app.use("/ingest", ingestRoutes);
app.use("/upload", uploadRoutes);
app.use("/history", historyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});