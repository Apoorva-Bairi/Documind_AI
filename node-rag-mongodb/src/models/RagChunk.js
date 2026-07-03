import mongoose from "mongoose";

const ragChunkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    documentName: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export const RagChunk = mongoose.model("RagChunk", ragChunkSchema);