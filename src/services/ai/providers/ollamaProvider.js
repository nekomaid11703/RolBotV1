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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.response.trim();
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('Ollama API timeout after 30s');
      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.ollama.classification;
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

module.exports = OllamaProvider;
