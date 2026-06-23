/**
 * aiWorkerPool.js
 * Pool de trabajadores asincrónicos con semáforo de concurrencia por proveedor.
 *
 * Características:
 * - Concurrencia configurable por proveedor (3 Gemini / 5 OpenRouter)
 * - Ejecución paralela con Promise.allSettled (nunca lanza error global)
 * - Ejecución secuencial cuando el output de una tarea alimenta la siguiente
 * - Reporte estructurado por tarea con tiempos de ejecución
 * - Reintentos automáticos por tarea con backoff exponencial
 */

const { CONCURRENCY_LIMITS } = require("./aiConfig");

// ─────────────────────────────────────────────────────────────────────────────
// Semáforo de concurrencia
// Limita cuántas promesas activas puede haber para un mismo proveedor
// ─────────────────────────────────────────────────────────────────────────────

class Semaphore {
  constructor(maxConcurrent) {
    this.max = maxConcurrent;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    // Esperar hasta que haya un slot disponible
    await new Promise((resolve) => this.queue.push(resolve));
    this.current++;
  }

  release() {
    this.current--;
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Worker Pool
// ─────────────────────────────────────────────────────────────────────────────

class AiWorkerPool {
  constructor() {
    // Un semáforo por proveedor, creado bajo demanda
    this._semaphores = {};
  }

  /**
   * Obtiene o crea el semáforo del proveedor dado.
   */
  _getSemaphore(provider) {
    if (!this._semaphores[provider]) {
      const limit =
        CONCURRENCY_LIMITS[provider] ?? CONCURRENCY_LIMITS.default;
      this._semaphores[provider] = new Semaphore(limit);
      console.log(
        `🔧 [WorkerPool] Semáforo creado para "${provider}": máx ${limit} tareas concurrentes.`
      );
    }
    return this._semaphores[provider];
  }

  /**
   * Ejecuta una sola tarea de IA con control de concurrencia y reintentos.
   *
   * @param {object} task - Tarea preparada por el Dispatcher
   * @param {string} task.id
   * @param {string} task.provider
   * @param {string} task.model
   * @param {string} task.prompt
   * @param {string} task.systemInstruction
   * @param {string} task.tierLabel
   * @param {object} orchestrator - Instancia del AiOrchestrator
   * @param {number} [maxRetries=1] - Reintentos en caso de fallo
   * @returns {{ id, status, result, error, durationMs, provider, tierLabel }}
   */
  async _runTask(task, orchestrator, maxRetries = 1) {
    const semaphore = this._getSemaphore(task.provider);
    await semaphore.acquire();

    const startTime = Date.now();
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // Backoff exponencial: 1s, 2s, 4s...
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(
            `🔄 [WorkerPool] Reintentando tarea "${task.id}" (intento ${attempt + 1}) en ${delay}ms...`
          );
          await new Promise((r) => setTimeout(r, delay));
        }

        const result = await orchestrator.generateText({
          prompt: task.prompt,
          systemInstruction: task.systemInstruction,
          temperature: task.temperature ?? 0.4,
          providerPreference: task.provider,
          model: task.model,
          useMemory: task.useMemory !== false,
          memoryTags: task.memoryTags || ["ai", task.taskType].filter(Boolean),
        });

        semaphore.release();
        return {
          id: task.id,
          status: "fulfilled",
          result,
          error: null,
          durationMs: Date.now() - startTime,
          provider: task.provider,
          model: task.model,
          tierLabel: task.tierLabel,
        };
      } catch (err) {
        lastError = err;
      }
    }

    semaphore.release();
    return {
      id: task.id,
      status: "rejected",
      result: null,
      error: lastError?.message || "Error desconocido",
      durationMs: Date.now() - startTime,
      provider: task.provider,
      model: task.model,
      tierLabel: task.tierLabel,
    };
  }

  /**
   * Ejecuta N tareas en PARALELO respetando los semáforos por proveedor.
   * Nunca lanza una excepción global — los errores individuales están en el resultado.
   *
   * @param {Array<object>} tasks       - Tareas preparadas por el Dispatcher
   * @param {object}        orchestrator
   * @param {object}        [options]
   * @param {number}        [options.maxRetries=1]   - Reintentos por tarea
   * @param {boolean}       [options.verbose=true]   - Logs de progreso
   * @returns {Array<{ id, status, result, error, durationMs, provider, tierLabel }>}
   */
  async runParallel(tasks, orchestrator, { maxRetries = 1, verbose = true } = {}) {
    if (tasks.length === 0) return [];

    if (verbose) {
      console.log(
        `\n🚀 [WorkerPool] Iniciando ${tasks.length} tarea(s) en paralelo...`
      );
      tasks.forEach((t) =>
        console.log(
          `   📋 [${t.id}] ${t.tierLabel} → ${t.provider} (${t.model})`
        )
      );
      console.log("");
    }

    const globalStart = Date.now();
    const promises = tasks.map((task) =>
      this._runTask(task, orchestrator, maxRetries)
    );

    const results = await Promise.all(promises);

    if (verbose) {
      const totalMs = Date.now() - globalStart;
      const fulfilled = results.filter((r) => r.status === "fulfilled").length;
      const rejected = results.filter((r) => r.status === "rejected").length;

      console.log(
        `\n✅ [WorkerPool] Paralelo completado en ${totalMs}ms. ` +
          `✔ ${fulfilled} exitosas | ✖ ${rejected} fallidas\n`
      );
    }

    return results;
  }

  /**
   * Ejecuta N tareas en SERIE (una tras otra).
   * Útil cuando el output de una tarea es el input de la siguiente.
   *
   * @param {Array<object>} tasks
   * @param {object}        orchestrator
   * @param {object}        [options]
   * @param {Function}      [options.chainFn]   - (prevResult, nextTask) => nextTask modificado
   * @param {number}        [options.maxRetries=1]
   * @returns {Array<{ id, status, result, error, durationMs }>}
   */
  async runSequential(
    tasks,
    orchestrator,
    { chainFn = null, maxRetries = 1, verbose = true } = {}
  ) {
    if (tasks.length === 0) return [];

    if (verbose) {
      console.log(
        `\n📋 [WorkerPool] Iniciando ${tasks.length} tarea(s) en secuencia...`
      );
    }

    const results = [];
    let previousResult = null;

    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];

      // Si hay función de encadenamiento, modificar la tarea con el contexto previo
      if (chainFn && previousResult && i > 0) {
        task = chainFn(previousResult, task);
      }

      if (verbose) {
        console.log(
          `   ▶ [${i + 1}/${tasks.length}] Ejecutando tarea "${task.id}"...`
        );
      }

      const result = await this._runTask(task, orchestrator, maxRetries);
      results.push(result);
      previousResult = result.status === "fulfilled" ? result.result : null;

      if (verbose && result.status === "rejected") {
        console.warn(
          `   ⚠️ Tarea "${task.id}" falló: ${result.error}. Continuando...`
        );
      }
    }

    return results;
  }

  /**
   * Genera un reporte legible de los resultados del pool.
   * @param {Array} results - Resultado de runParallel o runSequential
   * @returns {string}
   */
  static generateReport(results) {
    const lines = ["━━━ 📊 REPORTE DE WORKER POOL ━━━"];

    results.forEach((r) => {
      const status = r.status === "fulfilled" ? "✅" : "❌";
      const preview =
        r.status === "fulfilled"
          ? (r.result || "").slice(0, 120).replace(/\n/g, " ") + "..."
          : `ERROR: ${r.error}`;

      lines.push(
        `${status} [${r.id}] ${r.tierLabel ?? ""} | ${r.provider} | ${r.durationMs}ms\n   ${preview}`
      );
    });

    const total = results.length;
    const ok = results.filter((r) => r.status === "fulfilled").length;
    lines.push(`\n📈 Total: ${total} | ✔ ${ok} | ✖ ${total - ok}`);

    return lines.join("\n");
  }
}

// Singleton del pool (compartido por todo el sistema)
const workerPool = new AiWorkerPool();
module.exports = { AiWorkerPool, workerPool };
