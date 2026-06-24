/**
 * aiDispatcher.js
 * Clasificador automático de tareas y asignador de modelos por tier.
 *
 * En modo automático: usa el orquestador para clasificar la descripción de la
 * tarea y determinar su tier (HARD/MEDIUM/EASY/TRIVIAL) sin intervención manual.
 * Una vez conocido el tier, selecciona el modelo y proveedor óptimos.
 */

const {
  TASK_TIERS,
  TASK_PROFILES,
  AUTO_CLASSIFY_LABELS,
  DEFAULT_MODELS,
} = require("./aiConfig");
const { cache, TTLS } = require("./promptCacheService");

class AiDispatcher {
  /**
   * @param {object} orchestrator - Instancia del AiOrchestrator (para auto-clasificar)
   */
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // API Pública
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Dado un taskType conocido (clave de TASK_PROFILES), retorna el payload
   * completo para ejecutar la tarea en el WorkerPool.
   *
   * @param {string} taskType     - Clave del perfil (ej: "implementFeature")
   * @param {string} userPrompt   - El prompt específico de la subtarea
   * @param {object} [overrides]  - Sobrescribir proveedor o modelo si se desea
   * @returns {{ provider, model, prompt, systemInstruction, tierLabel }}
   */
  async dispatch(taskType, userPrompt, overrides = {}) {
    const profile = TASK_PROFILES[taskType];
    if (!profile) {
      throw new Error(
        `Tipo de tarea desconocido: "${taskType}". Tipos válidos: ${AUTO_CLASSIFY_LABELS.join(", ")}`
      );
    }

    const tierDef = TASK_TIERS[profile.tier];
    const resolvedPayload = this._resolveModel(tierDef, profile, overrides);

    return {
      taskType,
      tierLabel: tierDef.label,
      prompt: userPrompt,
      systemInstruction: profile.systemInstruction,
      ...resolvedPayload,
    };
  }

  /**
   * Modo AUTOMÁTICO: dado solo una descripción libre de la tarea, llama a la IA
   * para inferir qué taskType y tier corresponde, luego despacha.
   *
   * @param {string} taskDescription  - Descripción libre de la tarea
   * @param {string} userPrompt       - El prompt de trabajo concreto
   * @param {object} [overrides]      - Sobrescribir proveedor o modelo
   * @returns {{ provider, model, prompt, systemInstruction, tierLabel, inferredTaskType }}
   */
  async autoDispatch(taskDescription, userPrompt, overrides = {}) {
    // Clasificamos la tarea usando un modelo rápido (TRIVIAL tier)
    const inferredTaskType = await this._inferTaskType(taskDescription);
    const result = await this.dispatch(inferredTaskType, userPrompt, overrides);
    return { ...result, inferredTaskType };
  }

  /**
   * Prepara una lista de tareas para el WorkerPool, resolviendo provider y
   * modelo de cada una (en serie, ya que la clasificación es rápida y barata).
   *
   * @param {Array<{ id, taskType, prompt, overrides? }>} tasks
   * @returns {Array<{ id, provider, model, prompt, systemInstruction, tierLabel }>}
   */
  async prepareMany(tasks) {
    const prepared = [];
    for (const task of tasks) {
      try {
        const dispatched = await this.dispatch(
          task.taskType,
          task.prompt,
          task.overrides || {}
        );
        prepared.push({
          id: task.id,
          ...dispatched,
          useMemory: task.useMemory,
          memoryTags: task.memoryTags,
        });
      } catch (err) {
        // Si el taskType no existe, intentar autoDispatch con el prompt como descripción
        console.warn(
          `⚠️ [Dispatcher] taskType "${task.taskType}" desconocido, usando autoDispatch...`
        );
        const dispatched = await this.autoDispatch(
          task.taskType,
          task.prompt,
          task.overrides || {}
        );
        prepared.push({
          id: task.id,
          ...dispatched,
          useMemory: task.useMemory,
          memoryTags: task.memoryTags,
        });
      }
    }
    return prepared;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Métodos Privados
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Infiere el tipo de tarea usando la IA (clasificación zero-shot).
   * Usa el proveedor de clasificación más barato disponible.
   */
  async _inferTaskType(taskDescription) {
    const cacheKey = `dispatch:infer:${taskDescription.trim().toLowerCase().slice(0, 200)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`💫 [Cache HIT] _inferTaskType: "${cached}"`);
      return cached;
    }

    try {
      const result = await this.orchestrator.classifyText({
        text: `Tarea de desarrollo: "${taskDescription}"`,
        candidateLabels: AUTO_CLASSIFY_LABELS,
        providerPreference: this.orchestrator.providers.openrouter
          ? "openrouter"
          : undefined,
      });

      const inferred = result.intent;

      if (TASK_PROFILES[inferred]) {
        console.log(
          `🧭 [Dispatcher] Tarea auto-clasificada como: "${inferred}" (confianza: ${(result.confidence * 100).toFixed(0)}%)`
        );
        cache.set(cacheKey, inferred, TTLS.classification);
        return inferred;
      }

      console.warn(
        `⚠️ [Dispatcher] Clasificación con baja confianza ("${inferred}"). Usando fallback: "implementFeature"`
      );
      return "implementFeature";
    } catch (err) {
      console.warn(
        `⚠️ [Dispatcher] Error al clasificar tarea automáticamente: ${err.message}. Usando fallback: "implementFeature"`
      );
      return "implementFeature";
    }
  }

  /**
   * Determina qué proveedor y modelo usar basándose en el tier y los overrides.
   * Prioriza el proveedor definido en el tier. Si no está disponible, cae al siguiente.
   */
  _resolveModel(tierDef, profile, overrides) {
    // Overrides manuales tienen prioridad absoluta
    if (overrides.provider && overrides.model) {
      return { provider: overrides.provider, model: overrides.model };
    }

    const preferredProvider = overrides.provider || tierDef.preferredProvider;
    const availableProviders = Object.keys(this.orchestrator.providers);

    // Intentar usar el proveedor preferido del tier
    if (availableProviders.includes(preferredProvider)) {
      const model =
        overrides.model ||
        (preferredProvider === "gemini"
          ? tierDef.geminiModel
          : tierDef.openrouterModel) ||
        DEFAULT_MODELS[preferredProvider]?.textGeneration;

      return { provider: preferredProvider, model };
    }

    // Si el preferido no está disponible, buscar el siguiente en la lista
    const fallbackProvider = availableProviders.find(
      (p) => p !== "ollama" && p !== "huggingface"
    ) || availableProviders[0];

    const fallbackModel =
      DEFAULT_MODELS[fallbackProvider]?.textGeneration || "openrouter/auto";

    console.warn(
      `⚠️ [Dispatcher] Proveedor preferido "${preferredProvider}" no disponible. ` +
        `Usando fallback: "${fallbackProvider}"`
    );

    return { provider: fallbackProvider, model: fallbackModel };
  }
}

module.exports = AiDispatcher;
