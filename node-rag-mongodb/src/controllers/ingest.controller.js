import { ingestFile }
  from "../services/ingest.service.js";

export async function ingestController(
  req,
  res
) {
  try {

    await ingestFile();

    res.json({
      success: true,
      message:
        "Data ingested successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}