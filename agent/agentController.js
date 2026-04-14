const { preprocessTranscript } = require("./inputProcessor");
const { callGemini } = require("./geminiService");

function buildMedicalExtractionPrompt(cleanedTranscript) {
  return [
    "You are a clinical documentation reasoning agent.",
    "Analyze the transcript and return ONLY valid JSON with this schema:",
    "{",
    '  "patient_info": { "name": string|null, "age": string|null, "gender": string|null },',
    '  "symptoms": string[],',
    '  "duration": string|null,',
    '  "suggested_diagnosis": string[],',
    '  "medicines": string[],',
    '  "follow_up": string|null,',
    '  "soap": {',
    '    "subjective": string,',
    '    "objective": string,',
    '    "assessment": string,',
    '    "plan": string',
    "  },",
    '  "confidence": {',
    '    "overall": number,',
    '    "symptoms": number,',
    '    "diagnosis": number,',
    '    "medicines": number',
    "  },",
    '  "review_flags": string[]',
    "}",
    "Use null for unknown scalar fields and [] for unknown list fields.",
    "Confidence scores must be between 0 and 1.",
    "review_flags should include items requiring doctor verification.",
    `Transcript: ${cleanedTranscript}`
  ].join("\n");
}

async function processTranscript(req, res, next) {
  try {
    const { transcript } = req.body || {};

    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({
        success: false,
        message: "Field 'transcript' is required and must be a non-empty string."
      });
    }

    const { cleaned, original } = preprocessTranscript(transcript);
    const prompt = buildMedicalExtractionPrompt(cleaned);
    const extraction = await callGemini(prompt);

    return res.status(200).json({
      success: true,
      input: {
        original,
        cleaned
      },
      output: extraction
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  processTranscript
};
