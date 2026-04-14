const FILLER_WORDS = [
  "um",
  "uh",
  "hmm",
  "like",
  "you know",
  "sort of",
  "kind of",
  "actually",
  "basically"
];

function removeFillerWords(text) {
  let cleaned = text;

  for (const filler of FILLER_WORDS) {
    const pattern = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "gi");
    cleaned = cleaned.replace(pattern, " ");
  }

  return cleaned;
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeSentence(text) {
  if (!text) return "";
  const normalized = text.charAt(0).toUpperCase() + text.slice(1);
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function preprocessTranscript(rawTranscript = "") {
  if (typeof rawTranscript !== "string") {
    throw new Error("Transcript must be a string.");
  }

  const noFillers = removeFillerWords(rawTranscript);
  const compact = normalizeWhitespace(noFillers);
  const normalized = normalizeSentence(compact);

  return {
    original: rawTranscript,
    cleaned: normalized
  };
}

module.exports = {
  preprocessTranscript
};
