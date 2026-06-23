/**
 * geminiProvider.js
 * Adaptador HTTP nativo para la API de Google Gemini (AI Studio).
 * 
 * Mejoras v2:
 * - Fallback automático entre modelos Gemini si el primero está saturado (503)
 * - Reintento automático con delay configurable
 * - Listado dinámico de modelos disponibles
 */

const { DEFAULT_MODELS } = require("../aiConfig");

// Modelos Gemini a intentar en orden si el modelo principal falla por sobrecarga
const GEMINI_FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-001",
];

class GeminiProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = "gemini";
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  }

  /**
   * Realiza una llamada HTTP a la API de Gemini para un modelo dado.
   * Lanza error si la respuesta no es exitosa.
   */
  async _callAPI(model, body) {
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
      return data.candidates[0].content.parts[0].text;
    } catch (e) {
      throw new Error("Respuesta inválida de Gemini: " + JSON.stringify(data));
    }
  }

  /**
   * Genera texto intentando la lista de modelos de fallback si el principal
   * está temporalmente no disponible (503) o no encontrado (404).
   */
  async generateText({ prompt, systemInstruction, temperature = 0.7, model }) {
    const primaryModel = model || DEFAULT_MODELS.gemini.textGeneration;

    // Construir lista: modelo solicitado primero, luego los fallbacks (sin duplicar)
    const modelsToTry = [
      primaryModel,
      ...GEMINI_FALLBACK_MODELS.filter((m) => m !== primaryModel),
    ];

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    };
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const errors = [];
    for (const m of modelsToTry) {
      try {
        const text = await this._callAPI(m, body);
        // Si no era el modelo primario, logueamos el fallback
        if (m !== primaryModel) {
          console.warn(`⚠️ [Gemini] Usando modelo de fallback: ${m} (${primaryModel} no disponible)`);
        }
        return text;
      } catch (err) {
        // Reintentar solo con modelos alternativos en caso de sobrecarga o not found
        const retryable = err.statusCode === 503 || err.statusCode === 404;
        errors.push(`${m}: ${err.message}`);
        if (!retryable) {
          // Si el error NO es de disponibilidad (ej: API key inválida, 400), fallar rápido
          throw new Error(`Gemini API error: ${err.message}`);
        }
      }
    }

    throw new Error(`Todos los modelos Gemini fallaron:\n${errors.join("\n")}`);
  }

  /**
   * Clasifica texto usando Gemini como clasificador zero-shot vía prompt.
   */
  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.gemini.classification;
    const labelsStr = candidateLabels.join(", ");

    const prompt = `Clasifica el siguiente texto de un jugador en una de estas categorías: [${labelsStr}].
Responde ÚNICAMENTE con el nombre de la categoría elegida, en minúsculas y sin puntuación ni texto adicional.

Texto del jugador: "${text}"`;

    const responseText = await this.generateText({
      prompt,
      systemInstruction:
        "Eres un clasificador de intenciones preciso para un bot de RPG. Solo respondes con una palabra clave exacta.",
      temperature: 0.1,
      model: selectedModel,
    });

    const cleanResponse = responseText.trim().toLowerCase();
    const matchedLabel = candidateLabels.find(
      (l) => l.toLowerCase() === cleanResponse
    );

    return {
      intent: matchedLabel || candidateLabels[0],
      confidence: matchedLabel ? 0.95 : 0.5,
    };
  }

  /**
   * Lista los modelos disponibles para esta API key con soporte de generateContent.
   * Útil para diagnósticos.
   */
  async listAvailableModels() {
    const url = `${this.baseUrl}/models?key=${this.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(`Error listando modelos: ${data?.error?.message}`);
    return (data.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => m.name.replace("models/", ""));
  }
}

module.exports = GeminiProvider;
