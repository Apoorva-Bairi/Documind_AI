import fs from "fs/promises";
import path from "path";

import { connectDB } from "../db.js";

import { RagChunk }
  from "../models/RagChunk.js";

import { chunkText }
  from "./chunker.service.js";

import { createEmbedding }
  from "./openai.service.js";

export async function ingestFile() {

  await connectDB();

  const dataFolderPath =
    path.resolve("src/data");

  const files =
    await fs.readdir(dataFolderPath);

  console.log(
    `Found ${files.length} files`
  );

  for (const file of files) {

    const filePath =
      path.join(dataFolderPath, file);

    const stats =
      await fs.stat(filePath);

    if (!stats.isFile()) {
      continue;
    }

    const text =
      await fs.readFile(filePath, "utf-8");

    console.log(`Reading ${file}`);

    const chunks =
      chunkText(text);

    console.log(
      `Created ${chunks.length} chunks for ${file}`
    );

    // remove old chunks
    await RagChunk.deleteMany({
      source: file,
    });

    for (const chunk of chunks) {

      const embedding =
        await createEmbedding(chunk.text);

      await RagChunk.create({
        text: chunk.text,
        embedding,
        source: file,
        chunkIndex: chunk.chunkIndex,
        documentName: file,
      });

      console.log(
        `Stored chunk ${chunk.chunkIndex} from ${file}`
      );
    }
  }

  console.log(
    "Multi-document ingestion completed"
  );
}