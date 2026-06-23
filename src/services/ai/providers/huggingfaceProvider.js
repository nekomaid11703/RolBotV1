/**
 * huggingfaceProvider.js
 * Adaptador HTTP nativo para Hugging Face Serverless Inference API.
 */

const { DEFAULT_MODELS } = require("../aiConfig");

class HuggingFaceProvider {
  constructor(token) {
    this.token = token;
    this.name = "huggingface";
  }

  async generateText({ prompt, systemInstruction, temperature = 0.7, model }) {
    const selectedModel = model || DEFAULT_MODELS.huggingface.textGeneration;
    const url = `https://api-inference.huggingface.co/models/${selectedModel}`;

    // Construimos el formato Chat/Prompt para Zephyr o modelos similares
    let formattedPrompt = "";
    if (systemInstruction) {
      formattedPrompt += `<|system|>\n${systemInstruction}</s>\n`;
    }
    formattedPrompt += `<|user|>\n${prompt}</s>\n<|assistant|>\n`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`
      },
      body: JSON.stringify({
        inputs: formattedPrompt,
        parameters: {
          max_new_tokens: 250,
          temperature: temperature,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    try {
      // HF retorna un array de objetos con generated_text
      if (Array.isArray(data)) {
        return data[0].generated_text.trim();
      }
      return data.generated_text.trim();
    } catch (e) {
      throw new Error("Respuesta inválida recibida de Hugging Face: " + JSON.stringify(data));
    }
  }

  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.huggingface.classification;
    const url = `https://api-inference.huggingface.co/models/${selectedModel}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: candidateLabels
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face Classification error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    try {
      // Retorna la etiqueta con el puntaje más alto
      return {
        intent: data.labels[0],
        confidence: data.scores[0]
      };
    } catch (e) {
      throw new Error("Respuesta de clasificación inválida de HF: " + JSON.stringify(data));
    }
  }
}

module.exports = HuggingFaceProvider;
