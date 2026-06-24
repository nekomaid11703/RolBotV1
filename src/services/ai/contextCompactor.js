const { COMPACTION_POLICY } = require("./aiConfig");

function estimateTokens(text) {
  const str = String(text || "");
  return Math.ceil(str.length / 4);
}

function stripExcessWhitespace(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function truncatePreservingHeadTail(text, maxChars, headRatio = 0.3) {
  const str = String(text || "");
  if (str.length <= maxChars) return str;
  const headLen = Math.floor(maxChars * headRatio);
  const tailLen = maxChars - headLen - 3;
  return str.slice(0, headLen) + "..." + str.slice(-tailLen);
}

function compactMemoryEntries(entries, maxTokens) {
  if (!Array.isArray(entries) || entries.length === 0) return [];
  const maxChars = maxTokens * 4;
  let charsUsed = 0;
  const result = [];
  for (const entry of entries) {
    const entryText = `- [${entry.type}] ${entry.summary} ${(entry.details || "").slice(0, 200)}`;
    const entryChars = entryText.length + 2;
    if (charsUsed + entryChars > maxChars && result.length > 0) break;
    result.push(entry);
    charsUsed += entryChars;
  }
  return result;
}

function minifyClassificationPrompt(taskDescription, candidateLabels) {
  const desc = String(taskDescription || "").trim();
  if (desc.length > 120) {
    return `Classify: "${desc.slice(0, 120)}..."`;
  }
  return `Classify: "${desc}"`;
}

function compactPrompt({ prompt, systemInstruction, memoryContext, taskType, maxTokens }) {
  const budget = maxTokens || COMPACTION_POLICY.maxPromptTokens;
  let result = {
    prompt: String(prompt || ""),
    systemInstruction: String(systemInstruction || ""),
    memoryContext: String(memoryContext || ""),
  };

  result.prompt = stripExcessWhitespace(result.prompt);
  result.systemInstruction = stripExcessWhitespace(result.systemInstruction);

  const memTokens = estimateTokens(result.memoryContext);
  const sysTokens = estimateTokens(result.systemInstruction);
  const promptTokens = estimateTokens(result.prompt);
  const total = memTokens + sysTokens + promptTokens;

  if (total <= budget) return result;

  let deficit = total - budget;

  if (result.memoryContext && deficit > 0) {
    const memChars = result.memoryContext.length;
    const targetMemChars = Math.max(0, Math.floor(memChars * (1 - deficit / total)));
    result.memoryContext = truncatePreservingHeadTail(
      result.memoryContext,
      targetMemChars,
      COMPACTION_POLICY.preserveHeadTailRatio,
    );
    deficit -= memChars - result.memoryContext.length;
  }

  if (result.systemInstruction && deficit > 0) {
    const sysChars = result.systemInstruction.length;
    const targetSysChars = Math.max(100, sysChars - deficit * 4);
    result.systemInstruction = result.systemInstruction.slice(0, targetSysChars).trim();
  }

  return result;
}

module.exports = {
  estimateTokens,
  stripExcessWhitespace,
  truncatePreservingHeadTail,
  compactMemoryEntries,
  minifyClassificationPrompt,
  compactPrompt,
};
