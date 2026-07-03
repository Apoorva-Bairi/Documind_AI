import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    sources: [
      {
        source: String,
        chunkIndex: Number,
        text: String,
      }
    ]
  },
  { timestamps: true }
);

const ChatHistory = mongoose.model(
  "ChatHistory",
  chatHistorySchema
);

export default ChatHistory;