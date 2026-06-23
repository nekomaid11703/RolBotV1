const assert = require("assert");
const memoryContextService = require("../src/services/ai/memoryContextService");

async function run() {
  console.log("Ejecutando pruebas de memoryContextService...");

  const result = await memoryContextService.retrieveMemoryContext({
    prompt: "Coordinar Codex Antigravity NekoMemori memoria compartida",
    tags: ["memory", "mcp"],
    limit: 5,
    maxChars: 1600,
  });

  assert.strictEqual(typeof result.text, "string");
  assert.ok(Array.isArray(result.entries));
  assert.ok(result.entries.length > 0, "Debe recuperar al menos una memoria relevante.");
  assert.ok(
    result.text.includes("Shared project memory") ||
      result.text.includes("Active design board tickets"),
    "Debe construir un bloque de contexto util.",
  );

  const prompt = memoryContextService.withMemoryContext("Tarea actual", result);
  assert.ok(prompt.includes("Tarea actual"));
  assert.ok(prompt.length >= "Tarea actual".length);

  const emptyPrompt = memoryContextService.withMemoryContext("Sin contexto", {
    text: "",
  });
  assert.strictEqual(emptyPrompt, "Sin contexto");

  console.log("memoryContextService OK.");
}

run().catch((error) => {
  console.error("Fallo test_memory_context:", error);
  process.exit(1);
});

