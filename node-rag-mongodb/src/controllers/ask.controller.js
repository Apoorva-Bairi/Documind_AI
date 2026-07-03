// import { askQuestion }
//   from "../services/rag.service.js";

// export async function askController(
//   req,
//   res
// ) {
//   try {

//     const { question } = req.body;

//     if (!question) {
//       return res.status(400).json({
//         success: false,
//         error: "Question is required",
//       });
//     }

//     const result =
//       await askQuestion(question);

//     res.json(result);

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// }

import {
  askQuestion
} from "../services/rag.service.js";

export async function askController(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    const result = await askQuestion(
      question,
      req.user._id
    );

    res.json(result);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}