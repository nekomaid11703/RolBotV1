/**
 * aiOrchestrator.js
 * Core del Orquestador de IA v2.
 *
 * Nuevo en v2:
 * - Integración con AiDispatcher (clasificación automática de tareas)
 * - Integración con AiWorkerPool (ejecución paralela/secuencial)
 * - Método dispatchTasks() para despachar múltiples subtareas a modelos externos
 */

const { PROVIDER_PRIORITIES } = require("./aiConfig");
const GeminiProvider = require("./providers/geminiProvider");
const HuggingFaceProvider = require("./providers/huggingfaceProvider");
const OllamaProvider = require("./providers/ollamaProvider");
const OpenRouterProvider = require("./providers/openrouterProvider");
const AiDispatcher = require("./aiDispatcher");
const { workerPool, AiWorkerPool } = require("./aiWorkerPool");
const memoryContextService = require("./memoryContextService");
const TokenSavingDelegationManager = require("./tokenSavingDelegationManager");

class AiOrchestrator {
  constructor() {
    this.providers = {};
    this.initialized = false;
    this.dispatcher = null;
    this.memoryContextService = memoryContextService;
    this.delegationManager = new TokenSavingDelegationManager(this);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Inicialización
  // ──────────────────────────────────────────────────────────────────────────

  init() {
    if (this.initialized) return;

    const geminiKey = process.env.GEMINI_API_KEY;
    const hfToken = process.env.HUGGINGFACE_TOKEN;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";

    if (geminiKey && geminiKey !== "tu_api_key_de_google_ai_studio") {
      this.providers.gemini = new GeminiProvider(geminiKey);
      console.log("🧠 Orquestador de IA: Proveedor 'gemini' registrado con éxito.");
    }

    if (hfToken && hfToken !== "tu_token_de_hugging_face") {
      this.providers.huggingface = new HuggingFaceProvider(hfToken);
      console.log("🧠 Orquestador de IA: Proveedor 'huggingface' registrado con éxito.");
    }

    if (openrouterKey && openrouterKey !== "tu_api_key_de_openrouter") {
      this.providers.openrouter = new OpenRouterProvider(openrouterKey);
      console.log("🧠 Orquestador de IA: Proveedor 'openrouter' registrado con éxito.");
    }

    if (ollamaHost) {
      this.providers.ollama = new OllamaProvider(ollamaHost);
      console.log(`🧠 Orquestador de IA: Proveedor 'ollama' registrado en ${ollamaHost}.`);
    }

    const registeredNames = Object.keys(this.providers);
    if (registeredNames.length === 0) {
      console.warn("⚠️ Advertencia: No se detectaron APIs de IA en el .env. El orquestador operará sin proveedores.");
    } else {
      console.log(`✅ Orquestador de IA inicializado. Proveedores disponibles: [${registeredNames.join(", ")}]`);
    }

    // Inicializar el Dispatcher con referencia a este orquestador
    this.dispatcher = new AiDispatcher(this);
    this.initialized = true;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Operaciones Básicas (compatibilidad hacia atrás)
  // ──────────────────────────────────────────────────────────────────────────

  getAvailableProvidersForTask(task) {
    this.init();
    const priorities = PROVIDER_PRIORITIES[task] || [];
    return priorities.filter((name) => this.providers[name]);
  }

  async buildMemoryContext(options = {}) {
    return this.memoryContextService.retrieveMemoryContext(options);
  }

  planTokenSavingDelegation(options = {}) {
    this.init();
    return this.delegationManager.buildPlan(options);
  }

  async runTokenSavingWorkflow(options = {}) {
    this.init();
    return this.delegationManager.execute(options);
  }

  async generateText({
    prompt,
    systemInstruction,
    temperature = 0.7,
    providerPreference,
    model,
    useMemory = false,
    memoryTags = [],
    memoryLimit = 4,
  }) {
    this.init();

    let providersToTry = [];
    if (providerPreference && this.providers[providerPreference]) {
      providersToTry = [providerPreference];
    } else {
      providersToTry = this.getAvailableProvidersForTask("textGeneration");
    }

    if (providersToTry.length === 0) {
      throw new Error("No hay proveedores de IA configurados o disponibles para la generación de texto.");
    }

    const memoryContext = useMemory
      ? await this.buildMemoryContext({
          prompt,
          systemInstruction,
          tags: memoryTags,
          limit: memoryLimit,
        })
      : { text: "", entries: [], boardIncluded: false };

    const promptWithMemory = this.memoryContextService.withMemoryContext(
      prompt,
      memoryContext,
    );

    const errors = [];
    for (const providerName of providersToTry) {
      const provider = this.providers[providerName];
      try {
        return await provider.generateText({
          prompt: promptWithMemory,
          systemInstruction,
          temperature,
          model,
        });
      } catch (error) {
        const errorMsg = `Error en proveedor '${providerName}': ${error.message}`;
        console.warn(`⚠️ [AI Orchestrator Fallback] ${errorMsg}. Probando siguiente proveedor...`);
        errors.push(errorMsg);
      }
    }

    throw new Error(`Todos los proveedores de IA fallaron al generar texto. Detalles:\n- ${errors.join("\n- ")}`);
  }

  async classifyText({ text, candidateLabels, providerPreference, model }) {
    this.init();

    let providersToTry = [];
    if (providerPreference && this.providers[providerPreference]) {
      providersToTry = [providerPreference];
    } else {
      providersToTry = this.getAvailableProvidersForTask("classification");
    }

    if (providersToTry.length === 0) {
      throw new Error("No hay proveedores de IA configurados o disponibles para clasificar texto.");
    }

    const errors = [];
    for (const providerName of providersToTry) {
      const provider = this.providers[providerName];
      try {
        return await provider.classifyText({ text, candidateLabels, model });
      } catch (error) {
        const errorMsg = `Error en proveedor de clasificación '${providerName}': ${error.message}`;
        console.warn(`⚠️ [AI Orchestrator Fallback] ${errorMsg}. Probando siguiente clasificador...`);
        errors.push(errorMsg);
      }
    }

    throw new Error(`Todos los clasificadores de IA fallaron. Detalles:\n- ${errors.join("\n- ")}`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Sistema Multi-Agente: Despacho de Tareas (NUEVO en v2)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Despacha múltiples subtareas a modelos externos y las ejecuta en paralelo.
   * Cada tarea es asignada automáticamente al modelo y proveedor más adecuado
   * según su tipo y el tier de complejidad.
   *
   * @param {Array<{ id, taskType, prompt, overrides? }>} tasks
   *   - id:        Identificador único de la subtarea (para el reporte)
   *   - taskType:  Tipo de tarea (clave de TASK_PROFILES) o descripción libre
   *   - prompt:    El prompt concreto de trabajo
   *   - overrides: (opcional) { provider, model } para forzar un proveedor
   *
   * @param {object} [options]
   *   - mode:       'parallel' (default) | 'sequential'
   *   - maxRetries: Reintentos por tarea (default 1)
   *   - verbose:    Mostrar logs de progreso (default true)
   *   - chainFn:    (solo sequential) Función para encadenar resultados
   *   - printReport: Imprimir reporte al finalizar (default true)
   *
   * @returns {Array<{ id, status, result, error, durationMs, provider, tierLabel }>}
   *
   * @example
   * const results = await aiOrchestrator.dispatchTasks([
   *   { id: 'cmd_help',    taskType: 'generateBoilerplate', prompt: 'Comando /ayuda RPG' },
   *   { id: 'cmd_battle',  taskType: 'implementFeature',    prompt: 'Sistema de combate con turnos' },
   *   { id: 'review',      taskType: 'reviewCode',          prompt: `Revisa este código: ${code}` }
   * ]);
   */
  async dispatchTasks(tasks, options = {}) {
    this.init();

    const {
      mode = "parallel",
      maxRetries = 1,
      verbose = true,
      chainFn = null,
      printReport = true,
    } = options;

    if (!this.dispatcher) {
      throw new Error("El Dispatcher no está inicializado. Llama a init() primero.");
    }

    if (verbose) {
      console.log(`\n🎯 [dispatchTasks] Clasificando ${tasks.length} tarea(s)...`);
    }

    // Fase 1: Dispatcher prepara todas las tareas (clasifica tipo y asigna modelo)
    const preparedTasks = await this.dispatcher.prepareMany(tasks);

    // Fase 2: WorkerPool ejecuta las tareas
    let results;
    if (mode === "sequential") {
      results = await workerPool.runSequential(preparedTasks, this, {
        chainFn,
        maxRetries,
        verbose,
      });
    } else {
      results = await workerPool.runParallel(preparedTasks, this, {
        maxRetries,
        verbose,
      });
    }

    // Fase 3: Imprimir reporte
    if (printReport) {
      console.log("\n" + AiWorkerPool.generateReport(results));
    }

    return results;
  }

  /**
   * Despacho automático: infiere el tipo de tarea a partir de una descripción libre.
   * Útil cuando no sabes exactamente qué perfil de TASK_PROFILES usar.
   *
   * @param {string} taskDescription - Descripción libre de la subtarea
   * @param {string} prompt          - El prompt de trabajo
   * @param {object} [overrides]     - { provider, model }
   * @returns {{ result, inferredTaskType, tierLabel, provider, durationMs }}
   */
  async autoDispatchSingle(taskDescription, prompt, overrides = {}) {
    this.init();
    const dispatched = await this.dispatcher.autoDispatch(
      taskDescription,
      prompt,
      overrides
    );

    const startTime = Date.now();
    const result = await this.generateText({
      prompt: dispatched.prompt,
      systemInstruction: dispatched.systemInstruction,
      temperature: 0.4,
      providerPreference: dispatched.provider,
      model: dispatched.model,
      useMemory: true,
      memoryTags: ["ai", "memory", dispatched.inferredTaskType],
    });

    return {
      result,
      inferredTaskType: dispatched.inferredTaskType,
      tierLabel: dispatched.tierLabel,
      provider: dispatched.provider,
      durationMs: Date.now() - startTime,
    };
  }
}

// Singleton del orquestador
const orchestrator = new AiOrchestrator();
module.exports = orchestrator;
