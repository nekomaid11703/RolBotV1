const CLASSIFY_SYSTEM = 'Eres un clasificador de texto preciso. Solo respondes con una palabra clave exacta.';

function buildClassificationPrompt(text, candidateLabels) {
  const labelsStr = candidateLabels.join(', ');
  return `Clasifica el siguiente texto en una de estas categorías: [${labelsStr}].\nResponde ÚNICAMENTE con el nombre exacto de la categoría, en minúsculas, sin puntuación ni texto adicional.\n\nTexto: "${text}"`;
}

function parseClassificationResponse(responseText, candidateLabels) {
  const cleanResponse = responseText.trim().toLowerCase();
  const matchedLabel = candidateLabels.find(l => l.toLowerCase() === cleanResponse);
  return {
    intent: matchedLabel || candidateLabels[0],
    confidence: matchedLabel ? 0.95 : 0.5,
  };
}

function buildClassificationMessages(text, candidateLabels) {
  const prompt = buildClassificationPrompt(text, candidateLabels);
  return [
    { role: 'system', content: CLASSIFY_SYSTEM },
    { role: 'user', content: prompt },
  ];
}

module.exports = {
  CLASSIFY_SYSTEM,
  buildClassificationPrompt,
  parseClassificationResponse,
  buildClassificationMessages,
};
