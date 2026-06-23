/**
 * test_multiagent.js
 * Prueba de integración del sistema multi-agente jerárquico.
 * Demuestra 3 IAs trabajando en paralelo y Antigravity ensamblando el resultado.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const aiOrchestrator = require("../src/services/ai/aiOrchestrator");
const { AiWorkerPool } = require("../src/services/ai/aiWorkerPool");


const SEPARATOR = "═".repeat(60);

async function testMultiAgent() {
  console.log(`${SEPARATOR}`);
  console.log("🤖 TEST: SISTEMA MULTI-AGENTE JERÁRQUICO");
  console.log(`${SEPARATOR}\n`);

  aiOrchestrator.init();

  // ─── TEST 1: dispatchTasks paralelo (el corazón del sistema) ───────────────
  console.log("📦 TEST 1: 3 Subtareas en paralelo — Nuevo comando RPG '/combate'\n");

  const startTotal = Date.now();

  const results = await aiOrchestrator.dispatchTasks(
    [
      {
        id: "doc_combate",
        taskType: "writeDocumentation",
        prompt:
          "Escribe el docstring JSDoc para una función llamada `iniciarCombate(atacante, defensor)` " +
          "que recibe dos objetos personaje y retorna un objeto con el ganador y el log de rondas.",
      },
      {
        id: "boilerplate_combate",
        taskType: "generateBoilerplate",
        prompt:
          "Genera el esqueleto (boilerplate) de una función JavaScript llamada `iniciarCombate(atacante, defensor)`. " +
          "Solo la estructura: función vacía con parámetros, bloque try/catch, y un return con { ganador: null, log: [] }. " +
          "CommonJS con module.exports.",
      },
      {
        id: "classify_intent",
        taskType: "classifyIntent",
        prompt:
          "El usuario escribió: 'quiero pelear contra el goblin'. " +
          "Clasifica en una de estas categorías: [combate, explorar, inventario, ayuda, otro]",
      },
    ],
    {
      mode: "parallel",
      maxRetries: 1,
      printReport: false, // Mostraremos el reporte manualmente
    }
  );

  const totalMs = Date.now() - startTotal;

  // ─── Mostrar resultados individuales ──────────────────────────────────────
  console.log(`${SEPARATOR}`);
  console.log("📋 RESULTADOS INDIVIDUALES");
  console.log(`${SEPARATOR}\n`);

  for (const r of results) {
    const icon = r.status === "fulfilled" ? "✅" : "❌";
    console.log(`${icon} [${r.id}] — ${r.tierLabel} | ${r.provider} | ${r.durationMs}ms`);
    if (r.status === "fulfilled") {
      const preview = r.result.slice(0, 300).trim();
      console.log(`\n${preview}${r.result.length > 300 ? "\n   [... truncado]" : ""}\n`);
    } else {
      console.log(`   ERROR: ${r.error}\n`);
    }
  }

  // ─── Fase de Ensamblaje (lo que haría Antigravity) ──────────────────────
  const fulfilledCount = results.filter((r) => r.status === "fulfilled").length;
  const failedCount = results.filter((r) => r.status === "rejected").length;

  console.log(`${SEPARATOR}`);
  console.log("🔧 FASE DE ENSAMBLAJE (Antigravity como Director Técnico)");
  console.log(`${SEPARATOR}\n`);
  console.log(`   Total de subtareas   : ${results.length}`);
  console.log(`   ✔ Completadas        : ${fulfilledCount}`);
  console.log(`   ✖ Fallidas           : ${failedCount}`);
  console.log(`   ⏱ Tiempo total       : ${totalMs}ms (paralelo)`);

  if (fulfilledCount > 0) {
    console.log("\n   📌 Antigravity ahora toma los resultados y:");
    console.log("      1. Combina el docstring con el boilerplate");
    console.log("      2. Usa la clasificación de intención para el handler del comando");
    console.log("      3. Aplica los cambios al archivo del bot");
    console.log("      4. Registra el resultado en NekoMemori");
  }

  // ─── TEST 2: autoDispatchSingle (descripción libre) ─────────────────────
  console.log(`\n${SEPARATOR}`);
  console.log("🧭 TEST 2: autoDispatchSingle — Descripción libre de tarea");
  console.log(`${SEPARATOR}\n`);

  try {
    const { result, inferredTaskType, tierLabel, provider, durationMs } =
      await aiOrchestrator.autoDispatchSingle(
        "necesito crear documentación para una función",
        "Escribe el JSDoc para: `getUserBalance(userId)` — retorna el dinero del jugador desde Supabase."
      );

    console.log(`✅ Auto-clasificada como: "${inferredTaskType}" ${tierLabel}`);
    console.log(`   Proveedor: ${provider} | Tiempo: ${durationMs}ms\n`);
    console.log(result.slice(0, 400).trim());
  } catch (err) {
    console.error(`❌ autoDispatchSingle falló: ${err.message}`);
  }

  // ─── Reporte final ────────────────────────────────────────────────────────
  console.log(`\n${SEPARATOR}`);
  console.log(AiWorkerPool.generateReport(results));
  console.log(`${SEPARATOR}`);
  console.log("\n🏁 TEST COMPLETADO\n");
}

testMultiAgent().catch((err) => {
  console.error("💥 Error fatal en test:", err);
  process.exit(1);
});
