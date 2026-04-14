const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

function buildMockExtraction() {
  return {
    patient_info: {
      name: null,
      age: null,
      gender: null
    },
    symptoms: [],
    duration: null,
    suggested_diagnosis: [],
    medicines: [],
    follow_up: null,
    soap: {
      subjective: "Insufficient data from transcript.",
      objective: "No measurable clinical observations provided.",
      assessment: "Preliminary information only.",
      plan: "Doctor review required."
    },
    confidence: {
      overall: 0.2,
      symptoms: 0.2,
      diagnosis: 0.1,
      medicines: 0.1
    },
    review_flags: ["Gemini API key missing: mock response used"]
  };
}

function extractJsonFromText(text = "") {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Gemini response did not contain valid JSON content.");
  }

  const jsonCandidate = text.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonCandidate);
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const rawModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const model = rawModel.replace(/^models\//, "");
  const allowMockGemini = String(process.env.ALLOW_MOCK_GEMINI || "false").toLowerCase() === "true";

  if (!apiKey) {
    if (allowMockGemini) {
      return buildMockExtraction(prompt);
    }

    throw new Error("Missing GEMINI_API_KEY in environment.");
  }

  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("Gemini returned an empty response.");
  }

  return extractJsonFromText(content);
}

module.exports = {
  callGemini
};
