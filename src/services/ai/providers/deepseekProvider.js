const { DEFAULT_MODELS } = require("../aiConfig");

class DeepSeekProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = "deepseek";
    this.baseUrl = "https://api.deepseek.com/v1";
  }

  async _callAPI(model, body) {
    const url = `${this.baseUrl}/chat/completions`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ model, ...body }),
        signal: controller.signal,
      });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const code = response.status;
      const msg = errorData?.error?.message || response.statusText;
      const err = new Error(`[${code}] ${msg}`);
      err.statusCode = code;
      throw err;
    }

    const data = await response.json();
    return data.choices[0].message.content;
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('DeepSeek API timeout after 30s');
      throw new Error(`Respuesta inválida de DeepSeek: ${e.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateText({ prompt, systemInstruction, temperature = 0.7, model, jsonMode }) {
    const selectedModel = model || DEFAULT_MODELS.deepseek.textGeneration;

    const body = {
      messages: [],
      temperature,
      max_tokens: jsonMode ? 800 : 300,
    };
    if (jsonMode) {
      body.response_format = { type: "json_object" };
    }

    if (systemInstruction) {
      body.messages.push({ role: "system", content: systemInstruction });
    }

    body.messages.push({ role: "user", content: prompt });

    return this._callAPI(selectedModel, body);
  }

  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.deepseek.classification;
    const { buildClassificationMessages, parseClassificationResponse } = require('../../../utils/classifyUtils');
    const messages = buildClassificationMessages(text, candidateLabels);
    const responseText = await this._callAPI(selectedModel, { messages, temperature: 0.1, max_tokens: 10 });
    return parseClassificationResponse(responseText, candidateLabels);
  }
}

module.exports = DeepSeekProvider;
