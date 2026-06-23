require("dotenv").config();
const aiOrchestrator = require("../src/services/ai/aiOrchestrator");

async function runTests() {
  console.log("🧪 Iniciando pruebas del Orquestador de IA...");
  
  // 1. Inicialización básica
  console.log("\n1. Probando inicialización de proveedores...");
  aiOrchestrator.init();
  const activeProviders = Object.keys(aiOrchestrator.providers);
  console.log(`Proveedores activos cargados del .env: [${activeProviders.join(", ")}]`);

  // 2. Simulación de fallback automático
  console.log("\n2. Probando mecanismo de fallback simulando fallos...");
  
  // Creamos dos proveedores de mentira para el test de fallback
  const dummyFailingProvider = {
    name: "dummy_failing",
    generateText: async () => {
      throw new Error("API Limit reached / Network timeout");
    }
  };

  const dummyWorkingProvider = {
    name: "dummy_working",
    generateText: async ({ prompt }) => {
      return `[Respuesta exitosa simulada para: ${prompt}]`;
    }
  };

  // Guardamos temporalmente los proveedores originales
  const originalProviders = { ...aiOrchestrator.providers };
  
  // Seteamos los dummies
  aiOrchestrator.providers = {
    dummy_failing: dummyFailingProvider,
    dummy_working: dummyWorkingProvider
  };

  // Configuramos la lista de prioridades de prueba
  const originalPriorities = require("../src/services/ai/aiConfig").PROVIDER_PRIORITIES;
  originalPriorities.textGeneration = ["dummy_failing", "dummy_working"];

  try {
    const result = await aiOrchestrator.generateText({
      prompt: "Hola bot",
      systemInstruction: "Sé cortés"
    });
    
    if (result.includes("[Respuesta exitosa simulada")) {
      console.log("✅ Fallback funcionando con éxito: El primer proveedor falló y el orquestador conmutó al segundo automáticamente.");
    } else {
      console.error("❌ Fallback fallido: Se obtuvo una respuesta inesperada.");
    }
  } catch (err) {
    console.error("❌ Fallback fallido: Se arrojó un error en lugar de conmutar al proveedor secundario.", err.message);
  }

  // Restauramos los proveedores y prioridades originales
  aiOrchestrator.providers = originalProviders;
  originalPriorities.textGeneration = ["gemini", "openrouter", "ollama", "huggingface"];

  // 3. Prueba de inferencia real (con el primer proveedor configurado disponible)
  console.log("\n3. Probando inferencia real de generación con proveedores disponibles...");
  if (activeProviders.length > 0) {
    try {
      const response = await aiOrchestrator.generateText({
        prompt: "Dime una palabra sobre fantasía medieval.",
        temperature: 0.7
      });
      console.log(`✅ Inferencia de generación real exitosa. Respuesta: "${response}"`);
    } catch (err) {
      console.warn(`⚠️ Inferencia real de generación falló: ${err.message}. (Esto es normal si tus claves del .env no están configuradas o tienen cuota agotada)`);
    }

    try {
      const classification = await aiOrchestrator.classifyText({
        text: "ver mi inventario por favor",
        candidateLabels: ["inventario", "perfil", "atacar", "ayuda"]
      });
      console.log(`✅ Inferencia de clasificación real exitosa. Resultado: ${JSON.stringify(classification)}`);
    } catch (err) {
      console.warn(`⚠️ Inferencia real de clasificación falló: ${err.message}. (Esto es normal si tus claves del .env no están configuradas o tienen cuota agotada)`);
    }
  } else {
    console.log("⚠️ No hay proveedores de IA configurados en tu .env, omitiendo pruebas de inferencia real.");
  }
  
  console.log("\n🏁 Pruebas finalizadas.");
}

runTests();
