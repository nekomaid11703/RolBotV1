/**
 * openrouterProvider.js
 * Adaptador HTTP nativo para OpenRouter (API compatible con OpenAI).
 */

const { DEFAULT_MODELS } = require("../aiConfig");

class OpenRouterProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = "openrouter";
  }

  async generateText({ prompt, systemInstruction, temperature = 0.7, model, jsonMode }) {
    const selectedModel = model || DEFAULT_MODELS.openrouter.textGeneration;
    const url = "https://openrouter.ai/api/v1/chat/completions";

    const messages = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const requestBody = {
      model: selectedModel,
      messages: messages,
      temperature: temperature
    };
    if (jsonMode) {
      requestBody.response_format = { type: "json_object" };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://github.com/Usuario/IA_rolbot",
        "X-Title": "IA RolBot"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    try {
      return data.choices[0].message.content.trim();
    } catch (e) {
      throw new Error("Respuesta inválida de OpenRouter: " + JSON.stringify(data));
    }
  }

  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.openrouter.classification;
    const labelsStr = candidateLabels.join(", ");
    
    const prompt = `Clasifica este mensaje de chat en una sola de las siguientes intenciones: [${labelsStr}].
Responde únicamente con el nombre exacto de la categoría seleccionada en minúsculas.

Texto a clasificar: "${text}"`;

    const responseText = await this.generateText({
      prompt,
      systemInstruction: "Eres un clasificador preciso. Solo devuelves la etiqueta de la categoría y nada más.",
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

module.exports = OpenRouterProvider;
