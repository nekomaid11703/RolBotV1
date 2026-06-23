/**
 * aiService.js
 * Wrapper compatible hacia atrás que redirige las consultas del bot
 * al nuevo orquestador de IA (aiOrchestrator.js).
 */

const aiOrchestrator = require("./ai/aiOrchestrator");

/**
 * Clasifica una intención del jugador de forma natural (Zero-shot classification).
 * Mantiene la firma del método original.
 */
async function classifyIntent(text, candidateLabels) {
  try {
    const result = await aiOrchestrator.classifyText({
      text,
      candidateLabels
    });
    return result;
  } catch (error) {
    console.error("❌ Error en classifyIntent (aiService):", error.message);
    return { intent: null, confidence: 0 };
  }
}

/**
 * Genera la respuesta narrativa de un NPC en el juego.
 * Mantiene la firma del método original.
 */
async function generateNPCResponse(context, prompt) {
  try {
    const systemInstruction = `Eres un NPC en un juego de rol por WhatsApp. Sé breve, inmersivo y métete en tu personaje. Contexto del juego: ${context}`;
    
    const response = await aiOrchestrator.generateText({
      prompt,
      systemInstruction,
      temperature: 0.7
    });

    return response;
  } catch (error) {
    console.error("❌ Error en generateNPCResponse (aiService):", error.message);
    
    // Fallback pasivo en caso de que fallen todos los proveedores de IA
    const fallbacks = {
      greeting: "¡Hola! Estoy experimentando problemas de conexión neuronal, pero sigo aquí.",
      unknown: "Lo siento, mi núcleo de IA está en mantenimiento temporal.",
    };
    return fallbacks.unknown;
  }
}

/**
 * Comprueba si hay algún proveedor de IA disponible para su uso.
 */
function isAvailable() {
  aiOrchestrator.init();
  const activeProviders = Object.keys(aiOrchestrator.providers);
  return activeProviders.length > 0;
}

function planTokenSavingDelegation(options = {}) {
  return aiOrchestrator.planTokenSavingDelegation(options);
}

async function runTokenSavingWorkflow(options = {}) {
  return aiOrchestrator.runTokenSavingWorkflow(options);
}

module.exports = {
  classifyIntent,
  generateNPCResponse,
  isAvailable,
  planTokenSavingDelegation,
  runTokenSavingWorkflow
};
