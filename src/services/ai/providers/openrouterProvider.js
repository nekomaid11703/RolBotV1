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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": process.env.APP_REFERER || "https://github.com/IA_rolbot",
          "X-Title": process.env.APP_TITLE || "IA RolBot"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      return data.choices[0].message.content.trim();
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('OpenRouter API timeout after 30s');
      throw new Error(`Respuesta inválida de OpenRouter: ${e.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.openrouter.classification;
    const { buildClassificationPrompt, CLASSIFY_SYSTEM, parseClassificationResponse } = require('../../../utils/classifyUtils');
    const prompt = buildClassificationPrompt(text, candidateLabels);
    const responseText = await this.generateText({
      prompt,
      systemInstruction: CLASSIFY_SYSTEM,
      temperature: 0.1,
      model: selectedModel
    });
    return parseClassificationResponse(responseText, candidateLabels);
  }
}

module.exports = OpenRouterProvider;
