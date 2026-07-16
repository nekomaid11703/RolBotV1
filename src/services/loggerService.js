const fsp = require("fs/promises");
const path = require("path");

const LOGS_DIR = process.env.LOGS_DIR || path.join(__dirname, "../../logs");
const DISABLE_FILE_LOGGING = process.env.DISABLE_FILE_LOGGING === "true" || process.env.NODE_ENV === "production";

const LOG_PREFIX = {
  system: "system",
  command: "command",
  error: "error",
};

const writeQueues = new Map();
const MAX_LOG_DAYS = 30;

/**
 * @param {keyof typeof LOG_PREFIX | string} type - Key or event type
 * @returns {string} - Formatted value
 */
function getLogFileName(type) {
  const date = new Date().toISOString().slice(0, 10);
  return `${LOG_PREFIX[/** @type {keyof typeof LOG_PREFIX} */ (type)] || type}-${date}.log`;
}

/**
 * Get a formatted timestamp string.
 * @param {Date} [date] - Date to format
 * @returns {string} - Result value
 */
function timestamp(date = new Date()) {
  return date.toISOString().replace("T", " ").replace("Z", " UTC");
}

/**
 * @param {unknown} value - Value to process
 * @returns {string} - Formatted value
 */
function safeStringify(value) {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (value instanceof Error) {
    return JSON.stringify({ name: value.name, message: value.message, stack: value.stack }, null, 2);
  }
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * @param {string[]} lines - Lines of content
 * @returns {string} - Formatted value
 */
function section(lines) {
  return lines.filter((l) => l !== undefined && l !== null && l !== "").join("\n");
}

/**
 * Ensure the logs directory exists.
 */
async function ensureLogsDir() {
  await fsp.mkdir(LOGS_DIR, { recursive: true });
}

/**
 * Clean log files older than MAX_LOG_DAYS (30).
 * Called once at bot startup.
 */
async function cleanOldLogs() {
  if (DISABLE_FILE_LOGGING) return;
  try {
    const files = await fsp.readdir(LOGS_DIR);
    const cutoff = Date.now() - MAX_LOG_DAYS * 86400000;
    for (const file of files) {
      const filePath = path.join(LOGS_DIR, file);
      try {
        const stat = await fsp.stat(filePath);
        if (stat.mtimeMs < cutoff) await fsp.unlink(filePath);
      } catch {
        /* file may not exist */
      }
    }
  } catch {
    /* dir may not exist */
  }
}

/**
 * @param {string} fileName - File name
 * @param {string} content - Content to write
 * @returns {Promise<unknown>} - Promise resolving to the result
 */
async function appendToLog(fileName, content) {
  if (DISABLE_FILE_LOGGING) return;
  const filePath = path.join(LOGS_DIR, fileName);
  const previous = writeQueues.get(filePath) || Promise.resolve();
  const next = previous
    .then(async () => {
      await ensureLogsDir();
      await fsp.appendFile(filePath, content, "utf8");
    })
    .catch((/** @type {Error} */ error) => {
      // eslint-disable-next-line no-console
      console.error(`No se pudo escribir en ${fileName}:`, error);
    });
  writeQueues.set(filePath, next);
  return next;
}

/**
 * @param {string} type - Key or event type
 * @param {string} title - Log title
 * @param {string[]} lines - Lines of content
 */
async function writeLog(type, title, lines) {
  const content = `[${timestamp()}] ${title}\n${section(lines)}\n\n`;
  if (process.env.NODE_ENV === "production") {
    const dest = type === "error" ? console.error : console.log;
    dest(content.trim());
  }
  await appendToLog(getLogFileName(type), content);
}

/**
 * @param {string} message - Message to process
 * @param {object} [details] - Additional details
 */
async function logSystem(message, details = {}) {
  await writeLog("system", "SYSTEM", [
    `MESSAGE: ${safeStringify(message)}`,
    Object.keys(details).length ? `DETAILS: ${safeStringify(details)}` : "",
  ]);
}

/** @param {{ userId: string, userName: string, groupId: string, inputCommand: string, resolvedCommand: string, args?: string[], status?: string, reason?: string }} opts - Options object */
async function logCommand({
  userId,
  userName,
  groupId,
  inputCommand,
  resolvedCommand,
  args = [],
  status = "success",
  reason = "",
}) {
  await writeLog("command", "COMMAND", [
    `STATUS: ${String(status).toUpperCase()}`,
    `USER_ID: ${safeStringify(userId)}`,
    `USER_NAME: ${safeStringify(userName)}`,
    `GROUP_ID: ${safeStringify(groupId)}`,
    `INPUT_COMMAND: ${safeStringify(inputCommand)}`,
    `RESOLVED_COMMAND: ${safeStringify(resolvedCommand)}`,
    `ARGS: ${safeStringify(args)}`,
    reason ? `REASON: ${safeStringify(reason)}` : "",
  ]);
}

/** @param {{ source?: string, userId?: string|null, userName?: string|null, groupId?: string|null, error: unknown, context?: object }} opts - Options object */
async function logError({ source = "unknown", userId = null, userName = null, groupId = null, error, context = {} }) {
  const normalizedError = error instanceof Error ? error : new Error(safeStringify(error));
  await writeLog("error", "ERROR", [
    `SOURCE: ${safeStringify(source)}`,
    `USER_ID: ${safeStringify(userId)}`,
    `USER_NAME: ${safeStringify(userName)}`,
    `GROUP_ID: ${safeStringify(groupId)}`,
    `MESSAGE: ${safeStringify(normalizedError.message)}`,
    `STACK:`,
    normalizedError.stack || "(sin stack)",
    Object.keys(context).length ? `CONTEXT: ${safeStringify(context)}` : "",
  ]);
}

module.exports = {
  logSystem,
  logCommand,
  logError,
  cleanOldLogs,
};
