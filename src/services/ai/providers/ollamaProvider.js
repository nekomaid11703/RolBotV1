/**
 * ollamaProvider.js
 * Adaptador HTTP nativo para Ollama (servidor local de IA).
 */

const { DEFAULT_MODELS } = require("../aiConfig");

class OllamaProvider {
  constructor(host = "http://localhost:11434") {
    this.host = host.replace(/\/$/, ""); // Quita barra diagonal final si existe
    this.name = "ollama";
  }

  async generateText({ prompt, systemInstruction, temperature = 0.7, model }) {
    const selectedModel = model || DEFAULT_MODELS.ollama.textGeneration;
    const url = `${this.host}/api/generate`;

    const body = {
      model: selectedModel,
      prompt: prompt,
      options: {
        temperature: temperature
      },
      stream: false
    };

    if (systemInstruction) {
      body.system = systemInstruction;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.response.trim();
  }

  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.ollama.classification;
    const labelsStr = candidateLabels.join(", ");
    
    const prompt = `Clasifica el siguiente texto en una de estas categorías: [${labelsStr}].
Responde ÚNICAMENTE con el nombre de la categoría elegida, en minúsculas y sin puntuación.

Texto: "${text}"`;

    const responseText = await this.generateText({
      prompt,
      systemInstruction: "Eres un clasificador rápido de texto. Solo respondes con una palabra clave exacta de la lista sugerida.",
      temperature: 0.1,
      model: selectedModel
    });

    const cleanResponse = responseText.trim().toLowerCase();
    const matchedLabel = candidateLabels.find(l => l.toLowerCase() === cleanResponse);

    return {
      intent: matchedLabel || candidateLabels[0],
      confidence: matchedLabel ? 0.9 : 0.5
    };
  }
}

module.exports = OllamaProvider;
