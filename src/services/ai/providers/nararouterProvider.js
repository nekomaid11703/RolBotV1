const BASE_URL = "https://router.naraya.ai/v1/chat/completions";
const DEFAULT_MODEL = "deepseek-3.2";

class NaraRouterProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = "nararouter";
  }

  async generateText({ prompt, systemInstruction, model, temperature, maxTokens, jsonMode }) {
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const body = {
      model: model || DEFAULT_MODEL,
      messages,
      temperature: temperature ?? 0.7,
    };
    if (maxTokens) body.max_tokens = maxTokens;
    if (jsonMode) {
      body.response_format = { type: "json_object" };
    }

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NaraRouter API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  async classifyText(text, categories) {
    const systemInstruction = `Eres un clasificador de texto preciso. Clasifica el texto en una de las siguientes categorías exactas: ${categories.join(", ")}. Responde ÚNICAMENTE con el nombre exacto de la categoría en minúsculas. Sin puntuación ni texto adicional.`;
    const result = await this.generateText({
      prompt: text,
      systemInstruction,
      model: DEFAULT_MODEL,
      temperature: 0.1,
    });
    const normalized = result.toLowerCase().trim();
    return categories.find((c) => normalized.includes(c.toLowerCase())) || null;
  }
}

module.exports = NaraRouterProvider;
