const assert = require("assert");
const aiOrchestrator = require("../src/services/ai/aiOrchestrator");

async function run() {
  console.log("Ejecutando pruebas de delegacion automatica para ahorro de tokens...");

  aiOrchestrator.init();
  const originalProviders = { ...aiOrchestrator.providers };

  const calls = [];
  aiOrchestrator.providers = {
    gemini: {
      name: "gemini",
      generateText: async ({ prompt, systemInstruction }) => {
        calls.push({ provider: "gemini", prompt, systemInstruction });
        if (systemInstruction && systemInstruction.includes("gestor de calidad")) {
          return "VEREDICTO: APROBADO. Sin riesgos bloqueantes.";
        }
        if (systemInstruction && systemInstruction.includes("integrador tecnico")) {
          return "RESULTADO FINAL ENSAMBLADO";
        }
        return "gemini delegated result";
      },
      classifyText: async () => ({ intent: "implementFeature", confidence: 0.9 }),
    },
    openrouter: {
      name: "openrouter",
      generateText: async ({ prompt }) => {
        calls.push({ provider: "openrouter", prompt });
        return "openrouter delegated result";
      },
      classifyText: async () => ({ intent: "writeDocumentation", confidence: 0.9 }),
    },
  };

  const delegated = await aiOrchestrator.runTokenSavingWorkflow({
    goal: "Implementar una mejora dividida en documentacion, codigo y pruebas.",
    tasks: [
      {
        id: "docs",
        taskType: "writeDocumentation",
        prompt: "Documenta el flujo nuevo con JSDoc y notas de uso.",
      },
      {
        id: "code",
        taskType: "implementFeature",
        prompt: "Propone el codigo CommonJS para una funcion robusta.",
      },
      {
        id: "tests",
        taskType: "writeTests",
        prompt: "Genera pruebas unitarias sin frameworks externos.",
      },
    ],
    verbose: false,
  });

  assert.strictEqual(delegated.mode, "delegated");
  assert.strictEqual(delegated.results.length, 3);
  assert.ok(delegated.qualityReview.includes("APROBADO"));
  assert.strictEqual(delegated.result, "RESULTADO FINAL ENSAMBLADO");
  assert.ok(
    delegated.tasks.some((task) => task.overrides.provider === "openrouter"),
    "Las tareas simples deben poder priorizar proveedores gratuitos.",
  );
  assert.ok(
    calls.some((call) => call.provider === "gemini"),
    "La revision/ensamblaje de maxima calidad debe usar el mejor proveedor disponible.",
  );

  let localCalled = false;
  const local = await aiOrchestrator.runTokenSavingWorkflow({
    goal: "Cambio pequeno de una sola linea.",
    tasks: [
      {
        id: "tiny",
        taskType: "formatCode",
        prompt: "Formatea una linea.",
      },
    ],
    localHandler: async () => {
      localCalled = true;
      return "handled locally";
    },
    verbose: false,
  });

  assert.strictEqual(local.mode, "local");
  assert.strictEqual(local.result, "handled locally");
  assert.strictEqual(localCalled, true);
  assert.strictEqual(local.plan.reason, "too_few_subtasks");

  aiOrchestrator.providers = {
    gemini: {
      name: "gemini",
      generateText: async () => {
        throw new Error("quota exhausted");
      },
      classifyText: async () => ({ intent: "implementFeature", confidence: 0.9 }),
    },
  };

  const quotaFallback = await aiOrchestrator.runTokenSavingWorkflow({
    goal: "Validar que la falta de tokens no rompa el flujo.",
    tasks: [
      { id: "one", taskType: "implementFeature", prompt: "Subtarea 1" },
      { id: "two", taskType: "writeTests", prompt: "Subtarea 2" },
    ],
    forceDelegate: true,
    verbose: false,
  });

  assert.strictEqual(quotaFallback.mode, "delegated");
  assert.ok(quotaFallback.fallback.qualityError || quotaFallback.fallback.assemblyError);
  assert.ok(
    typeof quotaFallback.result === "object" ||
      String(quotaFallback.qualityReview).includes("QUALITY_GATE_FALLBACK"),
    "El flujo debe devolver fallback estructurado sin lanzar excepcion.",
  );

  aiOrchestrator.providers = originalProviders;
  console.log("Delegacion automatica OK.");
}

run().catch((error) => {
  console.error("Fallo test_token_saving_delegation:", error);
  process.exit(1);
});
