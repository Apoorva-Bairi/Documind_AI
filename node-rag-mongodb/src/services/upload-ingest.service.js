// import fs from "fs/promises";

// import { RagChunk }
//   from "../models/RagChunk.js";

// import { chunkText }
//   from "./chunker.service.js";

// import { createEmbedding }
//   from "./openai.service.js";

// export async function ingestUploadedFile(
//   filePath,
//   fileName
// ) {

//   if (!filePath) {
//     throw new Error(
//       "File path is missing"
//     );
//   }

//   const text =
//     await fs.readFile(
//       filePath,
//       "utf-8"
//     );

//   console.log(
//     `Reading uploaded file ${fileName}`
//   );

//   const chunks =
//     chunkText(text);

//   await RagChunk.deleteMany({
//     source: fileName,
//   });

//   for (const chunk of chunks) {

//     const embedding =
//       await createEmbedding(chunk.text);

//     await RagChunk.create({
//       text: chunk.text,
//       embedding,
//       source: fileName,
//       chunkIndex: chunk.chunkIndex,
//       documentName: fileName,
//     });

//     console.log(
//       `Stored uploaded chunk ${chunk.chunkIndex}`
//     );
//   }

//   return {
//     fileName,
//     chunksStored: chunks.length,
//   };
// }

import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

import { RagChunk } from "../models/RagChunk.js";
import { chunkText } from "./chunker.service.js";
import { createEmbedding } from "./openai.service.js";

export async function ingestUploadedFile(filePath, fileName, userId) {
  if (!filePath) {
    throw new Error("File path is missing");
  }

  if (!userId) {
    throw new Error("User ID is missing");
  }

  let text = "";

  if (fileName.endsWith(".txt")) {
    text = await fs.readFile(filePath, "utf-8");
  } else if (fileName.endsWith(".pdf")) {
    const dataBuffer = await fs.readFile(filePath);

    const parser = new PDFParse({
      data: dataBuffer,
    });

    const pdfData = await parser.getText();
    text = pdfData.text;

    await parser.destroy();
  } else {
    throw new Error("Only .txt and .pdf files are supported");
  }

  const chunks = chunkText(text);

  await RagChunk.deleteMany({ userId });

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk.text);

    await RagChunk.create({
      userId,
      text: chunk.text,
      embedding,
      source: fileName,
      chunkIndex: chunk.chunkIndex,
      documentName: fileName,
    });
  }

  return {
    fileName,
    chunksStored: chunks.length,
  };
}