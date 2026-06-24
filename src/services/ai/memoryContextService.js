/**
 * memoryContextService.js
 * Recuperacion ligera de contexto desde la memoria compartida del proyecto.
 *
 * No usa embeddings ni bases vectoriales: trabaja sobre JSONL + busqueda textual
 * para mantener la integracion portable y alineada con el estado real del repo.
 */

const fs = require("fs/promises");
const path = require("path");
const { compactMemoryEntries } = require("./contextCompactor");
const { cache, memoryCacheKey, TTLS } = require("./promptCacheService");

const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const DEFAULT_MEMORY_FILE = path.join(
  PROJECT_ROOT,
  "ai-memory",
  "rolbot-memory.jsonl",
);
const DEFAULT_BOARD_FILE = path.join(
  PROJECT_ROOT,
  "ai-memory",
  "design_board.md",
);

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenize(value) {
  return Array.from(
    new Set(
      normalizeText(value)
        .split(/[^a-z0-9_@./-]+/i)
        .map((token) => token.trim())
        .filter((token) => token.length >= 3),
    ),
  );
}

function truncate(value, maxLength = 280) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

async function readTextFile(filePath, fallback = "") {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return fallback;
  }
}

async function readMemoryEntries(memoryFilePath = DEFAULT_MEMORY_FILE) {
  const raw = await readTextFile(memoryFilePath, "");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function extractActiveBoard(boardText) {
  const match = String(boardText || "").match(
    /### .*Tickets Activos([\s\S]*?)(?:\n### |$)/,
  );
  if (!match) return "";

  return match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .slice(0, 5)
    .join("\n");
}

function scoreEntry(entry, queryTokens, requestedTags) {
  const summary = normalizeText(entry.summary);
  const details = normalizeText(entry.details);
  const tags = Array.isArray(entry.tags)
    ? entry.tags.map((tag) => normalizeText(tag))
    : [];
  const files = Array.isArray(entry.relatedFiles)
    ? entry.relatedFiles.map((file) => normalizeText(file))
    : [];

  let score = 0;

  for (const tag of requestedTags) {
    const normalizedTag = normalizeText(tag);
    if (tags.includes(normalizedTag)) score += 6;
    if (tags.some((entryTag) => entryTag.includes(normalizedTag))) score += 3;
  }

  for (const token of queryTokens) {
    if (tags.includes(token)) score += 4;
    if (summary.includes(token)) score += 3;
    if (details.includes(token)) score += 1;
    if (files.some((file) => file.includes(token))) score += 2;
  }

  if (entry.status === "superseded") score -= 5;
  if (entry.status === "active") score += 1;

  return score;
}

function formatMemoryContext({ entries, boardText, maxChars }) {
  const lines = [];

  if (entries.length > 0) {
    lines.push("Shared project memory. Use this as context, do not repeat it verbatim:");

    for (const entry of entries) {
      const tags = Array.isArray(entry.tags) ? entry.tags.join(", ") : "";
      lines.push(
        `- [${entry.type || "memory"}] ${truncate(entry.summary, 160)} ` +
          `(tags: ${tags || "none"})`,
      );
      if (entry.details) {
        lines.push(`  ${truncate(entry.details, 260)}`);
      }
    }
  }

  const activeBoard = extractActiveBoard(boardText);
  if (activeBoard) {
    if (lines.length > 0) lines.push("");
    lines.push("Active design board tickets:");
    lines.push(activeBoard);
  }

  const text = lines.join("\n").trim();
  return text.length > maxChars ? `${text.slice(0, maxChars - 3).trim()}...` : text;
}

async function retrieveMemoryContext({
  prompt = "",
  systemInstruction = "",
  taskType = "",
  tags = [],
  limit = 4,
  maxChars = 1800,
  maxTokens = 500,
  includeBoard = true,
  memoryFilePath = DEFAULT_MEMORY_FILE,
  boardFilePath = DEFAULT_BOARD_FILE,
} = {}) {
  const cacheKey = memoryCacheKey({ prompt, tags, limit, includeBoard });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const entries = await readMemoryEntries(memoryFilePath);
  const queryTokens = tokenize(`${taskType} ${systemInstruction} ${prompt}`);
  const requestedTags = Array.isArray(tags) ? tags : [];

  const scored = entries
    .map((entry, index) => ({
      entry,
      index,
      score: scoreEntry(entry, queryTokens, requestedTags),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.index - a.index;
    })
    .slice(0, Math.max(0, Math.min(10, Number(limit) || 4)))
    .map(({ entry }) => entry);

  const compacted = compactMemoryEntries(scored, maxTokens);
  const boardText = includeBoard ? await readTextFile(boardFilePath, "") : "";
  const text = formatMemoryContext({
    entries: compacted,
    boardText,
    maxChars: Math.max(300, Number(maxChars) || 1800),
  });

  const result = {
    text,
    entries: compacted,
    boardIncluded: Boolean(extractActiveBoard(boardText)),
  };

  cache.set(cacheKey, result, TTLS.memoryContext);
  return result;
}

function withMemoryContext(prompt, memoryContext) {
  if (!memoryContext?.text) return prompt;
  return `${memoryContext.text}\n\nCurrent request:\n${prompt}`;
}

module.exports = {
  DEFAULT_MEMORY_FILE,
  DEFAULT_BOARD_FILE,
  extractActiveBoard,
  readMemoryEntries,
  retrieveMemoryContext,
  tokenize,
  withMemoryContext,
};
