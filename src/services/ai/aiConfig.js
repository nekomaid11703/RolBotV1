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

const PROVIDER_PRIORITIES = {
  textGeneration: ["gemini", "openrouter", "ollama", "huggingface"],
  classification: ["gemini", "openrouter", "huggingface", "ollama"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Modelos por defecto por proveedor
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MODELS = {
  gemini: {
    textGeneration: "gemini-2.5-flash",
    classification: "gemini-2.0-flash",
  },
  openrouter: {
    // openrouter/auto selecciona el mejor modelo gratuito disponible automáticamente
    textGeneration: "openrouter/auto",
    classification: "openrouter/auto",
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
    geminiModel: "gemini-2.0-flash",
    openrouterModel: "openrouter/auto",
    preferredProvider: "openrouter",    // Preferir OpenRouter para EASY (ahorra cuota de Gemini)
  },
  // Tier 4 — Tareas triviales: formateo, clasificación, validación, transformaciones simples
  TRIVIAL: {
    tier: 4,
    label: "🟩 TRIVIAL",
    geminiModel: "gemini-2.0-flash",
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
  PROVIDER_PRIORITIES,
  DEFAULT_MODELS,
  CONCURRENCY_LIMITS,
  TASK_TIERS,
  TASK_PROFILES,
  AUTO_CLASSIFY_LABELS,
};
