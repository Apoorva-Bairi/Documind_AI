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