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

  async generateText({ prompt, systemInstruction, temperature = 0.7, model, maxTokens }) {
    const selectedModel = model || DEFAULT_MODELS.huggingface.textGeneration;
    const url = `https://api-inference.huggingface.co/models/${selectedModel}`;

    let formattedPrompt = buildChatTemplate(selectedModel, systemInstruction, prompt);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        },
        body: JSON.stringify({
          inputs: formattedPrompt,
          parameters: {
            max_new_tokens: maxTokens || 512,
            temperature: temperature,
            return_full_text: false
          }
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hugging Face API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data[0].generated_text.trim();
      }
      return data.generated_text.trim();
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('Hugging Face API timeout after 30s');
      throw new Error(`Respuesta inválida recibida de Hugging Face: ${e.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async classifyText({ text, candidateLabels, model }) {
    const selectedModel = model || DEFAULT_MODELS.huggingface.classification;
    const url = `https://api-inference.huggingface.co/models/${selectedModel}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
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
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hugging Face Classification error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      return {
        intent: data.labels[0],
        confidence: data.scores[0]
      };
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('Hugging Face Classification timeout after 30s');
      throw new Error(`Respuesta de clasificación inválida de HF: ${e.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

function buildChatTemplate(model, systemInstruction, prompt) {
  const modelLower = model.toLowerCase();
  if (modelLower.includes('llama-3') || modelLower.includes('llama3')) {
    let result = '<|begin_of_text|>';
    if (systemInstruction) {
      result += `<|start_header_id|>system<|end_header_id|>\n\n${systemInstruction}<|eot_id|>`;
    }
    result += `<|start_header_id|>user<|end_header_id|>\n\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;
    return result;
  }
  if (modelLower.includes('llama-2') || modelLower.includes('llama2')) {
    let result = '<s>[INST] ';
    if (systemInstruction) {
      result += `<<SYS>>\n${systemInstruction}\n<</SYS>>\n\n`;
    }
    result += `${prompt} [/INST]`;
    return result;
  }
  if (modelLower.includes('falcon')) {
    let result = '';
    if (systemInstruction) {
      result += `${systemInstruction}\n\n`;
    }
    result += `${prompt}`;
    return result;
  }
  let result = '';
  if (systemInstruction) {
    result += `<|system|>\n${systemInstruction}</s>\n`;
  }
  result += `<|user|>\n${prompt}</s>\n<|assistant|>\n`;
  return result;
}

module.exports = HuggingFaceProvider;
