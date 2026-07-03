// import { RagChunk } from "../models/RagChunk.js";
// import { createEmbedding } from "./openai.service.js";

// export async function askQuestion(question) {

//   // Create embedding for question
//   const questionEmbedding =
//     await createEmbedding(question);

//   // Search similar chunks
//   const chunks = await RagChunk.aggregate([
//     {
//       $vectorSearch: {
//         index: "vector_index",
//         path: "embedding",
//         queryVector: questionEmbedding,
//         numCandidates: 10,
//         limit: 3,
//       },
//     },
//     {
//       $project: {
//         text: 1,
//         source: 1,
//         chunkIndex: 1,
//         score: {
//           $meta: "vectorSearchScore",
//         },
//       },
//     },
//   ]);

//   // Create context from chunks
//   const context = chunks
//     .map((chunk) => chunk.text)
//     .join("\n");

//   // Build prompt
//   const prompt = `
// You are a helpful company policy assistant.

// Answer ONLY using the provided context.

// If the answer is not present in the context,
// say:
// "I could not find that information."

// Context:
// ${context}

// Question:
// ${question}
// `;

//   // Ask Ollama
//   const response = await fetch(
//     "http://localhost:11434/api/generate",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "llama3",
//         prompt,
//         stream: false,
//       }),
//     }
//   );

//   const data = await response.json();

//   // Format sources for frontend
//   const formattedSources = chunks.map(
//     (chunk) => ({
//       id: chunk._id.toString(),
//       source: chunk.source,
//       chunkIndex: chunk.chunkIndex,
//       score: chunk.score,
//       index: "vector_index",
//       documentId: chunk._id.toString(),
//       text: chunk.text,
//     })
//   );

//   return {
//     answer: data.response,
//     sources: formattedSources,
//   };
// }

import { RagChunk } from "../models/RagChunk.js";
import { createEmbedding } from "./openai.service.js";
import { generateAnswer } from "./groq.service.js";
import ChatHistory from "../models/ChatHistory.js";

export async function askQuestion(question, userId) {
  if (!userId) {
    throw new Error("User ID is missing");
  }

  const questionEmbedding = await createEmbedding(question);

  const chunks = await RagChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: questionEmbedding,
        numCandidates: 20,
        limit: 2,
        filter: {
          userId: userId,
        },
      },
    },
    {
      $project: {
        text: 1,
        source: 1,
        chunkIndex: 1,
        documentName: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  const context = chunks.map((chunk) => chunk.text).join("\n");

  const prompt = `
Answer using only this context.
If not found, say "I could not find that information."

Context:
${context}

Question:
${question}
`;

  const answer = await generateAnswer(prompt);

  const formattedSources = chunks.map((chunk) => ({
    id: chunk._id.toString(),
    source: chunk.source,
    chunkIndex: chunk.chunkIndex,
    score: chunk.score,
    documentId: chunk._id.toString(),
    text: chunk.text,
  }));

  await ChatHistory.create({
    userId,
    question,
    answer,
    sources: formattedSources.map((source) => ({
      source: source.source,
      chunkIndex: source.chunkIndex,
      text: source.text,
    })),
  });

  return {
    answer,
    sources: formattedSources,
  };
}