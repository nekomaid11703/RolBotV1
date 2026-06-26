/**
 * aiConfig.js
 * Configuración central del sistema multi-agente:
 * - Proveedores y sus modelos por defecto
 * - Tiers de complejidad de tareas
 * - Perfiles de tarea con instrucciones de sistema
 * - Límites de concurrencia por proveedor
 */

// ─────────────────────────────────────────────────────────────────────────────
// Prioridades de proveedor por tipo de operación
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_POLICY = {
  maxSize: 100,
  defaultTTL: 300000,
  classificationTTL: 3600000,
  delegationPlanTTL: 600000,
  memoryContextTTL: 30000,
  bypassOnTemperatureAbove: 0.7,
};

const COMPACTION_POLICY = {
  maxPromptTokens: 2048,
  maxMemoryContextTokens: 500,
  minClassificationPromptChars: 100,
  preserveHeadTailRatio: 0.3,
};

const PROVIDER_PRIORITIES = {
  textGeneration: ["deepseek", "nararouter", "gemini", "openrouter", "ollama", "huggingface"],
  classification: ["deepseek", "nararouter", "gemini", "openrouter", "huggingface", "ollama"],
  narration: ["deepseek", "nararouter", "gemini", "openrouter", "ollama"],
};

const PROVIDER_CAPABILITIES = {
  deepseek: {
    quality: 0.85,
    freePriority: 0.98,
    strengths: ["narration", "classification", "simpleTasks", "boilerplate"],
  },
  nararouter: {
    quality: 0.88,
    freePriority: 0.96,
    strengths: ["narration", "classification", "simpleTasks", "boilerplate", "documentation"],
  },
  gemini: {
    quality: 0.92,
    freePriority: 0.78,
    strengths: ["architecture", "implementation", "qualityReview", "assembly"],
  },
  openrouter: {
    quality: 0.78,
    freePriority: 0.95,
    strengths: ["classification", "boilerplate", "documentation", "simpleTasks"],
  },
  ollama: {
    quality: 0.7,
    freePriority: 1,
    strengths: ["localDrafts", "privacy", "offline"],
  },
  huggingface: {
    quality: 0.62,
    freePriority: 0.82,
    strengths: ["classification", "simpleNlp"],
  },
};

const TOKEN_SAVING_POLICY = {
  minDelegationTasks: 2,
  minEstimatedSavingsRatio: 0.18,
  minQualityGainRatio: 0.08,
  maxCoordinatorPromptChars: 2200,
  requireQualityReview: true,
  qualityTaskType: "qualityGate",
  assemblyTaskType: "assembleResults",
};

// ─────────────────────────────────────────────────────────────────────────────
// Modelos por defecto por proveedor
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MODELS = {
  deepseek: {
    textGeneration: "deepseek-chat",
    classification: "deepseek-chat",
  },
  nararouter: {
    textGeneration: "deepseek-3.2",
    classification: "deepseek-3.2",
  },
  gemini: {
    textGeneration: "gemini-2.5-flash",
    classification: "gemini-2.5-flash",
  },
  openrouter: {
    textGeneration: "google/gemma-4-31b-it:free",
    classification: "google/gemma-4-31b-it:free",
  },
  ollama: {
    textGeneration: "qwen2.5-coder:7b",
    classification: "qwen2.5-coder:7b",
  },
  huggingface: {
    // Reservado para implementación futura cuando HF esté disponible
    textGeneration: "HuggingFaceH4/zephyr-7b-beta",
    classification: "MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Límites de concurrencia por proveedor (semáforo del WorkerPool)
// ─────────────────────────────────────────────────────────────────────────────

const CONCURRENCY_LIMITS = {
  deepseek: 5,      // DeepSeek free tier generoso
  nararouter: 3,    // NaraRouter free: 10 req/min — 3 simultáneas es seguro
  gemini: 3,        // Plan gratuito: 15 RPM — máx 3 tareas simultáneas
  openrouter: 5,    // OpenRouter no tiene límite estricto en free tier
  ollama: 2,        // Limitado por los recursos locales del equipo
  huggingface: 2,   // Reservado — HF tiene rate limits estrictos en la API gratuita
  default: 2,       // Fallback si el proveedor no está en la lista
};

// ─────────────────────────────────────────────────────────────────────────────
// Tiers de dificultad de tareas
// Cada tier define el modelo preferido y el proveedor más adecuado
// ─────────────────────────────────────────────────────────────────────────────

const TASK_TIERS = {
  // Tier 1 — Tareas de alta complejidad: arquitectura, análisis multi-archivo, revisión crítica
  HARD: {
    tier: 1,
    label: "🟥 HARD",
    geminiModel: "gemini-2.5-flash",     // gemini-2.5-pro cuando esté disponible en free tier
    openrouterModel: "openrouter/auto",
    preferredProvider: "gemini",
  },
  // Tier 2 — Implementación: funciones nuevas, refactoring, tests
  MEDIUM: {
    tier: 2,
    label: "🟧 MEDIUM",
    geminiModel: "gemini-2.5-flash",
    openrouterModel: "openrouter/auto",
    preferredProvider: "gemini",
  },
  // Tier 3 — Tareas simples: documentación, boilerplate, código rutinario
  EASY: {
    tier: 3,
    label: "🟨 EASY",
    geminiModel: "gemini-2.5-flash",
    openrouterModel: "openrouter/auto",
    preferredProvider: "openrouter",    // Preferir OpenRouter para EASY (ahorra cuota de Gemini)
  },
  // Tier 4 — Tareas triviales: formateo, clasificación, validación, transformaciones simples
  TRIVIAL: {
    tier: 4,
    label: "🟩 TRIVIAL",
    geminiModel: "gemini-2.5-flash",
    openrouterModel: "openrouter/auto",
    preferredProvider: "openrouter",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Perfiles de tarea predefinidos
// Cada perfil define: tier de complejidad + prompt de sistema especializado
// ─────────────────────────────────────────────────────────────────────────────

const TASK_PROFILES = {
  // ── Complejidad Alta ──────────────────────────────────────────────────────
  designArchitecture: {
    tier: "HARD",
    description: "Diseño arquitectónico de sistemas o módulos complejos",
    systemInstruction:
      "Eres un arquitecto de software senior. Tu objetivo es diseñar sistemas modulares, escalables y mantenibles. " +
      "Responde con diagramas de flujo en texto, responsabilidades de cada componente y justificaciones técnicas. " +
      "Sé preciso y detallado. Usa nomenclatura JavaScript/Node.js.",
  },
  reviewCode: {
    tier: "HARD",
    description: "Revisión crítica de código: bugs, seguridad, performance",
    systemInstruction:
      "Eres un revisor de código experto. Analiza el código proporcionado en busca de: " +
      "bugs lógicos, vulnerabilidades de seguridad, memory leaks, y antipatrones. " +
      "Estructura tu respuesta como: PROBLEMAS ENCONTRADOS / SUGERENCIAS DE MEJORA / VEREDICTO FINAL.",
  },
  qualityGate: {
    tier: "HARD",
    description: "Control final de calidad sobre resultados delegados",
    systemInstruction:
      "Eres el gestor de calidad senior del proyecto. Revisa resultados delegados con prioridad maxima en calidad, seguridad, coherencia y mantenibilidad. " +
      "No reescribas todo si no hace falta. Devuelve: RIESGOS BLOQUEANTES / AJUSTES NECESARIOS / VEREDICTO. " +
      "Marca como BLOQUEADO cualquier cambio inseguro, incoherente o incompleto.",
  },
  assembleResults: {
    tier: "HARD",
    description: "Ensamblaje coherente de multiples resultados de agentes",
    systemInstruction:
      "Eres el integrador tecnico final. Combina resultados de agentes en una salida coherente, sin duplicados ni contradicciones. " +
      "Prioriza el objetivo original, las convenciones del repositorio y el veredicto de calidad. Devuelve una propuesta final lista para aplicar.",
  },
  // ── Complejidad Media ─────────────────────────────────────────────────────
  implementFeature: {
    tier: "MEDIUM",
    description: "Implementación de una función o módulo específico",
    systemInstruction:
      "Eres un desarrollador JavaScript/Node.js experto. Implementa el código solicitado de forma limpia, " +
      "modular y bien comentada. Incluye manejo de errores robusto (try/catch). " +
      "Exporta correctamente según CommonJS (module.exports). No incluyas texto explicativo, solo código.",
  },
  writeTests: {
    tier: "MEDIUM",
    description: "Escritura de pruebas unitarias o de integración",
    systemInstruction:
      "Eres un especialista en QA y testing. Escribe pruebas unitarias completas para el código proporcionado. " +
      "Usa Node.js nativo (sin frameworks externos a menos que se especifique). " +
      "Incluye casos de éxito, casos de error y casos límite (edge cases). Solo código, sin explicaciones.",
  },
  refactorCode: {
    tier: "MEDIUM",
    description: "Refactorización de código existente para mejorar legibilidad o performance",
    systemInstruction:
      "Eres un experto en refactorización de código. Mejora el código proporcionado manteniendo la funcionalidad intacta. " +
      "Prioriza: legibilidad, modularidad, reducción de duplicación y claridad de nombres. " +
      "Solo responde con el código refactorizado y comentarios breves de los cambios principales.",
  },
  // ── Complejidad Simple ────────────────────────────────────────────────────
  writeDocumentation: {
    tier: "EASY",
    description: "Generación de documentación técnica o docstrings",
    systemInstruction:
      "Eres un redactor técnico experto. Genera documentación clara y concisa para el código proporcionado. " +
      "Incluye: descripción del propósito, parámetros de entrada, valores de retorno y ejemplos de uso. " +
      "Usa formato JSDoc para comentarios de funciones.",
  },
  generateBoilerplate: {
    tier: "EASY",
    description: "Generación de código base o plantillas repetitivas",
    systemInstruction:
      "Eres un generador de código eficiente. Crea el código base solicitado siguiendo las convenciones de Node.js. " +
      "El código debe ser funcional, limpio y listo para usar. Sin explicaciones adicionales.",
  },
  explainCode: {
    tier: "EASY",
    description: "Explicación de código o conceptos técnicos",
    systemInstruction:
      "Eres un tutor técnico. Explica el código o concepto proporcionado de forma clara y concisa. " +
      "Usa analogías simples cuando sea útil. Adapta la profundidad técnica al contexto dado.",
  },
  // ── Complejidad Trivial ───────────────────────────────────────────────────
  formatCode: {
    tier: "TRIVIAL",
    description: "Formateo o limpieza superficial de código",
    systemInstruction:
      "Formatea el siguiente código JavaScript siguiendo las convenciones estándar: " +
      "2 espacios de indentación, punto y coma al final, comillas dobles para strings. " +
      "Solo devuelve el código formateado, sin explicaciones.",
  },
  classifyIntent: {
    tier: "TRIVIAL",
    description: "Clasificación de intención de texto (NLP)",
    systemInstruction:
      "Eres un clasificador de texto preciso. Clasifica el texto dado en una de las categorías proporcionadas. " +
      "Responde ÚNICAMENTE con el nombre exacto de la categoría en minúsculas. Sin puntuación ni texto adicional.",
  },
  translateText: {
    tier: "TRIVIAL",
    description: "Traducción de texto entre idiomas",
    systemInstruction:
      "Eres un traductor profesional. Traduce el texto proporcionado al idioma solicitado. " +
      "Mantén el tono y formato original. Solo responde con el texto traducido.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Etiquetas de tarea para auto-clasificación por el Dispatcher
// El Dispatcher usa estas descripciones para inferir el tier automáticamente
// ─────────────────────────────────────────────────────────────────────────────

const AUTO_CLASSIFY_LABELS = Object.keys(TASK_PROFILES);

module.exports = {
  CACHE_POLICY,
  COMPACTION_POLICY,
  PROVIDER_PRIORITIES,
  DEFAULT_MODELS,
  CONCURRENCY_LIMITS,
  TASK_TIERS,
  TASK_PROFILES,
  AUTO_CLASSIFY_LABELS,
  PROVIDER_CAPABILITIES,
  TOKEN_SAVING_POLICY,
};
