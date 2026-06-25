const { DEFAULT_MODELS } = require("../aiConfig");

class DeepSeekProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = "deepseek";
    this.baseUrl = "https://api.deepseek.com/v1";
  }

  async _callAPI(model, body) {
    const url = `${this.baseUrl}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model, ...body }),
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
    try {
      return data.choices[0].message.content;
    } catch (e) {
      throw new Error("Respuesta inválida de DeepSeek: " + JSON.stringify(data));
    }
  }

  async generateText({ prompt, systemInstruction, temperature = 0.7, model }) {
    const selectedModel = model || DEFAULT_MODELS.deepseek.textGeneration;

    const body = {
      messages: [],
      temperature,
      max_tokens: 300,
    };

    if (systemInstruction) {
      body.messages.push({ role: "system", content: systemInstruction });
    }

    body.messages.push({ role: "user", content: prompt });

    return this._callAPI(selectedModel, body);
  }

  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.deepseek.classification;
    const labelsStr = candidateLabels.join(", ");

    const prompt = `Clasifica el siguiente texto en una de estas categorías: [${labelsStr}].
Responde ÚNICAMENTE con el nombre exacto de la categoría, en minúsculas, sin puntuación ni texto adicional.

Texto: "${text}"`;

    const body = {
      messages: [
        {
          role: "system",
          content: "Eres un clasificador de texto preciso. Solo respondes con una palabra clave exacta.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 10,
    };

    const responseText = await this._callAPI(selectedModel, body);
    const cleanResponse = responseText.trim().toLowerCase();
    const matchedLabel = candidateLabels.find(l => l.toLowerCase() === cleanResponse);

    return {
      intent: matchedLabel || candidateLabels[0],
      confidence: matchedLabel ? 0.95 : 0.5,
    };
  }
}

module.exports = DeepSeekProvider;
