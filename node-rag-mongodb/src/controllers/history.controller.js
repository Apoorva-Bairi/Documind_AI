import ChatHistory from "../models/ChatHistory.js";

export async function getHistory(req, res) {
  try {
    const userId = req.user.id;

    const history = await ChatHistory.find({ userId }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function clearHistory(req, res) {
  try {
    const userId = req.user.id;

    await ChatHistory.deleteMany({ userId });

    res.json({
      message: "History cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}