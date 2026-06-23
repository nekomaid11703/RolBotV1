/**
 * tokenSavingDelegationManager.js
 * Automatic delegation policy for token savings and quality-focused assembly.
 *
 * This service decides when external agent delegation is worth it. If the
 * expected saving or quality gain is low, the caller should keep the work in
 * Codex/Antigravity through the provided local handler.
 */

const {
  PROVIDER_CAPABILITIES,
  TASK_PROFILES,
  TASK_TIERS,
  TOKEN_SAVING_POLICY,
} = require("./aiConfig");

function estimateChars(value) {
  if (!value) return 0;
  if (typeof value === "string") return value.length;
  return JSON.stringify(value).length;
}

function normalizeTask(task, index) {
  return {
    id: task.id || `task_${index + 1}`,
    taskType: task.taskType || "implementFeature",
    prompt: task.prompt || "",
    overrides: task.overrides || {},
    useMemory: task.useMemory,
    memoryTags: task.memoryTags,
  };
}

function getTaskTier(taskType) {
  const profile = TASK_PROFILES[taskType] || TASK_PROFILES.implementFeature;
  return TASK_TIERS[profile.tier] || TASK_TIERS.MEDIUM;
}

function getProviderScore(providerName, tierDef) {
  const caps = PROVIDER_CAPABILITIES[providerName];
  if (!caps) return 0;

  const qualityWeight = tierDef.tier <= 2 ? 0.72 : 0.42;
  const freeWeight = 1 - qualityWeight;
  return caps.quality * qualityWeight + caps.freePriority * freeWeight;
}

function compactResult(result) {
  return {
    id: result.id,
    status: result.status,
    provider: result.provider,
    model: result.model,
    tierLabel: result.tierLabel,
    durationMs: result.durationMs,
    result: result.result,
    error: result.error,
  };
}

class TokenSavingDelegationManager {
  constructor(orchestrator, policy = TOKEN_SAVING_POLICY) {
    this.orchestrator = orchestrator;
    this.policy = policy;
  }

  buildPlan({ goal = "", tasks = [], forceDelegate = false } = {}) {
    const normalizedTasks = tasks.map(normalizeTask);
    const availableProviders = Object.keys(this.orchestrator.providers || {});
    const originalChars = estimateChars(goal) + estimateChars(normalizedTasks);
    const delegatedPromptChars = normalizedTasks.reduce(
      (sum, task) => sum + estimateChars(task.prompt),
      0,
    );
    const coordinatorChars = Math.min(
      this.policy.maxCoordinatorPromptChars,
      estimateChars(goal) + Math.ceil(delegatedPromptChars * 0.25),
    );

    const estimatedSavingsRatio =
      originalChars > 0
        ? Math.max(0, (originalChars - coordinatorChars) / originalChars)
        : 0;

    const maxTier = normalizedTasks.reduce((max, task) => {
      return Math.min(max, getTaskTier(task.taskType).tier);
    }, 4);
    const qualityGainRatio = normalizedTasks.length >= 2
      ? maxTier <= 2
        ? 0.16
        : 0.1
      : 0;

    const hasEnoughProviders = availableProviders.length > 0;
    const hasEnoughTasks =
      normalizedTasks.length >= this.policy.minDelegationTasks;
    const worthwhileSavings =
      estimatedSavingsRatio >= this.policy.minEstimatedSavingsRatio;
    const worthwhileQuality =
      qualityGainRatio >= this.policy.minQualityGainRatio;
    const shouldDelegate =
      hasEnoughProviders &&
      (forceDelegate ||
        (hasEnoughTasks && (worthwhileSavings || worthwhileQuality)));

    const reason = shouldDelegate
      ? "delegation_worthwhile"
      : !hasEnoughProviders
        ? "no_external_providers"
        : !hasEnoughTasks
          ? "too_few_subtasks"
          : "low_savings_or_quality_gain";

    return {
      shouldDelegate,
      reason,
      goal,
      tasks: normalizedTasks,
      availableProviders,
      estimatedSavingsRatio,
      qualityGainRatio,
      coordinatorChars,
      originalChars,
    };
  }

  chooseBestProvider(taskType, availableProviders, requireHighestQuality = false) {
    if (availableProviders.length === 0) return null;

    const tierDef = getTaskTier(taskType);
    if (requireHighestQuality) {
      return availableProviders
        .slice()
        .sort((a, b) => {
          return (
            (PROVIDER_CAPABILITIES[b]?.quality || 0) -
            (PROVIDER_CAPABILITIES[a]?.quality || 0)
          );
        })[0];
    }

    return availableProviders
      .slice()
      .sort((a, b) => getProviderScore(b, tierDef) - getProviderScore(a, tierDef))[0];
  }

  assignProviders(plan) {
    return plan.tasks.map((task) => {
      if (task.overrides?.provider) return task;

      const provider = this.chooseBestProvider(
        task.taskType,
        plan.availableProviders,
        false,
      );

      return {
        ...task,
        overrides: {
          ...task.overrides,
          provider,
        },
      };
    });
  }

  buildAssemblyPrompt(goal, results, qualityReview = "") {
    const compactResults = results.map(compactResult);
    return [
      `Goal:\n${goal}`,
      "Delegated results:",
      JSON.stringify(compactResults, null, 2),
      qualityReview ? `Quality review:\n${qualityReview}` : "",
      "Return the final coherent result. If code changes are implied, include the exact files and final patch-ready content or instructions.",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  buildFallbackAssembly(goal, workerResults, qualityReview = "", reason = "") {
    const fulfilled = workerResults.filter((result) => result.status === "fulfilled");
    const rejected = workerResults.filter((result) => result.status === "rejected");

    return {
      goal,
      status: fulfilled.length > 0 ? "partial_assembled" : "fallback_local_required",
      reason,
      qualityReview,
      results: fulfilled.map(compactResult),
      rejected: rejected.map(compactResult),
      note:
        "External delegation could not complete cleanly. The coordinator must continue locally without discarding completed safe outputs.",
    };
  }

  buildQualityPrompt(goal, results) {
    return [
      `Goal:\n${goal}`,
      "Review these delegated outputs before final assembly:",
      JSON.stringify(results.map(compactResult), null, 2),
    ].join("\n\n");
  }

  async runLocal(plan, localHandler) {
    if (typeof localHandler !== "function") {
      return {
        mode: "local",
        plan,
        result: null,
        qualityReview: null,
        persisted: false,
        reason:
          "Delegation was not worthwhile. Continue this task in Codex/Antigravity.",
      };
    }

    const result = await localHandler(plan);
    return {
      mode: "local",
      plan,
      result,
      qualityReview: null,
      persisted: false,
      reason: plan.reason,
    };
  }

  async execute({
    goal = "",
    tasks = [],
    mode = "parallel",
    forceDelegate = false,
    localHandler,
    assembleFn,
    persistFn,
    maxRetries = 1,
    verbose = true,
  } = {}) {
    this.orchestrator.init();
    const plan = this.buildPlan({ goal, tasks, forceDelegate });

    if (!plan.shouldDelegate) {
      return this.runLocal(plan, localHandler);
    }

    const delegatedTasks = this.assignProviders(plan);
    let workerResults = [];
    try {
      workerResults = await this.orchestrator.dispatchTasks(delegatedTasks, {
        mode,
        maxRetries,
        verbose,
        printReport: verbose,
      });
    } catch (error) {
      return {
        mode: "fallback",
        plan,
        tasks: delegatedTasks,
        results: [],
        qualityReview: null,
        result: this.buildFallbackAssembly(goal, [], "", error.message),
        persisted: false,
        reason: "delegated_dispatch_failed",
      };
    }

    const qualityProvider = this.chooseBestProvider(
      this.policy.qualityTaskType,
      plan.availableProviders,
      true,
    );
    let qualityReview = "";
    let qualityError = null;
    if (this.policy.requireQualityReview) {
      try {
        qualityReview = await this.orchestrator.generateText({
            prompt: this.buildQualityPrompt(goal, workerResults),
            systemInstruction: TASK_PROFILES.qualityGate.systemInstruction,
            temperature: 0.2,
            providerPreference: qualityProvider,
            useMemory: true,
            memoryTags: ["quality", "review", "ai", "delegation"],
          });
      } catch (error) {
        qualityError = error;
        qualityReview =
          `QUALITY_GATE_FALLBACK: external review unavailable (${error.message}). ` +
          "Coordinator must review locally before applying changes.";
      }
    }

    const assemblyPrompt = this.buildAssemblyPrompt(
      goal,
      workerResults,
      qualityReview,
    );

    let assembled;
    let assemblyError = null;
    try {
      assembled =
        typeof assembleFn === "function"
          ? await assembleFn({ goal, plan, workerResults, qualityReview })
          : await this.orchestrator.generateText({
              prompt: assemblyPrompt,
              systemInstruction: TASK_PROFILES.assembleResults.systemInstruction,
              temperature: 0.25,
              providerPreference: qualityProvider,
              useMemory: true,
              memoryTags: ["assembly", "ai", "delegation"],
            });
    } catch (error) {
      assemblyError = error;
      assembled = this.buildFallbackAssembly(
        goal,
        workerResults,
        qualityReview,
        error.message,
      );
    }

    let persisted = false;
    if (typeof persistFn === "function") {
      await persistFn({ goal, plan, workerResults, qualityReview, assembled });
      persisted = true;
    }

    return {
      mode: "delegated",
      plan,
      tasks: delegatedTasks,
      results: workerResults,
      qualityReview,
      result: assembled,
      persisted,
      fallback: {
        qualityError: qualityError?.message || null,
        assemblyError: assemblyError?.message || null,
      },
    };
  }
}

module.exports = TokenSavingDelegationManager;
