/**
 * plan_next_steps.js
 * Usa el sistema multi-agente para planificar los próximos pasos
 * del desarrollo del bot desde 4 perspectivas en paralelo.
 * 
 * Resultados son guardados en un JSON para que Antigravity los ensamble.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const aiOrchestrator = require("./src/services/ai/aiOrchestrator");

// ─── Contexto del estado actual del bot ──────────────────────────────────────
const BOT_CONTEXT = `
Estás ayudando a planificar el desarrollo de "NekoBot" — un bot de WhatsApp para Rol (RPG) de texto.
Stack: Node.js + Baileys (WhatsApp) + Supabase (base de datos).

MÓDULOS IMPLEMENTADOS:
- Personajes: crear_pj, ver_pj, mis_pj, switch_pj, editar nombre/descripción, eliminar_pj (8 comandos)
- Economía: balance, daily, add/rem/set stelas, dar_stelas, top_dinero (7 comandos)
- Grupo: actividad, actividad_global, top_activos (3 comandos)
- Utilidades: /dado (tirada de dados con fórmulas como 2d6+3) (1 comando)
- Información: /help, /hola (2 comandos)
- IA: Orquestador multi-agente con Gemini + OpenRouter + fallback automático

ESTADO TÉCNICO:
- Bot 100% stateless — Supabase como única fuente de verdad
- Sistema multi-agente con WorkerPool paralelo (máx 3 Gemini / 5 OpenRouter)
- MCP NekoMemori v2.0 (memoria compartida entre agentes) con 7 herramientas
- Sin sistema de combate implementado
- Sin inventario de objetos
- Sin sistema de habilidades/skills de personaje
- Sin integración de IA con comandos del bot (los comandos no usan IA aún)
- Sin sistema de misiones/quests
- Sin notificaciones o eventos automáticos
`;

async function planNextSteps() {
  console.log("🤖 Iniciando planificación multi-agente...\n");
  aiOrchestrator.init();

  const results = await aiOrchestrator.dispatchTasks(
    [
      {
        id: "feature_gaps",
        taskType: "designArchitecture",
        overrides: { provider: "openrouter" },
        prompt:
          BOT_CONTEXT +
          "\nTarea: Identifica las 5 funcionalidades más críticas que le faltan al bot para ser " +
          "un RPG de WhatsApp completo y jugable. Para cada una describe: nombre, qué problema resuelve, " +
          "qué comandos necesitaría y su complejidad técnica (ALTA/MEDIA/BAJA). Sé conciso y técnico.",
      },
      {
        id: "tech_debt",
        taskType: "reviewCode",
        overrides: { provider: "openrouter" },
        prompt:
          BOT_CONTEXT +
          "\nTarea: Analiza el estado técnico del bot e identifica las 4 áreas de deuda técnica " +
          "más urgentes a resolver. Para cada una: nombre del área, riesgo actual, y acción correctiva recomendada. " +
          "Enfócate en escalabilidad, mantenibilidad y robustez del sistema.",
      },
      {
        id: "ai_integration",
        taskType: "implementFeature",
        overrides: { provider: "openrouter" },
        prompt:
          BOT_CONTEXT +
          "\nTarea: Diseña cómo integrar la IA (orquestador multi-agente existente) con los comandos del bot. " +
          "Propón 3 casos de uso concretos donde la IA añade valor real al gameplay de RPG " +
          "(ej: generar descripciones de escenas, narrar combates, crear NPCs dinámicos). " +
          "Para cada caso: nombre del feature, comando que lo dispara, y el prompt que se enviaría al modelo.",
      },
      {
        id: "quick_wins",
        taskType: "writeDocumentation",
        overrides: { provider: "openrouter" },
        prompt:
          BOT_CONTEXT +
          "\nTarea: Lista 5 mejoras pequeñas y rápidas (Quick Wins) que se pueden implementar en menos de 2 horas " +
          "cada una y que mejorarían significativamente la experiencia del usuario. " +
          "Para cada una: nombre, descripción en 1 línea, y el archivo que habría que modificar.",
      },
    ],

    {
      mode: "parallel",
      maxRetries: 1,
      verbose: true,
      printReport: false,
    }
  );

  // Guardar resultados en JSON para el ensamblaje
  const output = {};
  for (const r of results) {
    output[r.id] = {
      status: r.status,
      provider: r.provider,
      durationMs: r.durationMs,
      content: r.status === "fulfilled" ? r.result : `ERROR: ${r.error}`,
    };
  }

  const outPath = path.join(__dirname, "planning_results.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  const ok = results.filter((r) => r.status === "fulfilled").length;
  console.log(`\n✅ ${ok}/${results.length} perspectivas recopiladas. Resultados en: planning_results.json`);
}

planNextSteps().catch((err) => {
  console.error("💥 Error:", err.message);
  process.exit(1);
});
