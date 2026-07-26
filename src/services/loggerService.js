/**
 * @constant fsp
 */
const fsp = require("fs/promises");
/**
 * @constant path
 */
const path = require("path");

/**
 * @constant LOGS_DIR
 */
const LOGS_DIR = path.join(__dirname, "../../logs");

/**
 * @constant LOG_PREFIX
 * @type {object}
 */
const LOG_PREFIX = {
  system: "system",
  command: "command",
  error: "error",
};

/**
 * @constant writeQueues
 * @type {Map}
 */
const writeQueues = new Map();
/**
 * @constant MAX_LOG_DAYS
 * @type {number}
 */
const MAX_LOG_DAYS = 30;

/**
 * @param {keyof typeof LOG_PREFIX | string} type - - Key or event type.
 * @returns {string} - Formatted value.
 */
function getLogFileName(type) {
  /**
   * @constant date
   */
  const date = new Date().toISOString().slice(0, 10);
  return `${LOG_PREFIX[/** @type {keyof typeof LOG_PREFIX} */ (type)] || type}-${date}.log`;
}

/**
 * Get a formatted timestamp string.
 * @param {Date} date - Date to format
 * @returns {string} - Result value
 */
function timestamp(date = new Date()) {
  return date.toISOString().replace("T", " ").replace("Z", " UTC");
}

/**
 * @param {unknown} value - - Value to process.
 * @returns {string} - Formatted value.
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
 * @param {string[]} lines - - Lines of content.
 * @returns {string} - Formatted value.
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
 * TODO: describe what this does.
 */
async function cleanOldLogs() {
  try {
    /**
     * @constant files
     */
    const files = await fsp.readdir(LOGS_DIR);
    /**
     * @constant cutoff
     */
    const cutoff = Date.now() - MAX_LOG_DAYS * 86400000;
    for (const file of files) {
      /**
       * @constant filePath
       */
      const filePath = path.join(LOGS_DIR, file);
      try {
        /**
         * @constant stat
         */
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
 * @param {string} fileName - - File name.
 * @param {string} content - - Content to write.
 * @returns {Promise<unknown>} - Promise resolving to the result.
 */
async function appendToLog(fileName, content) {
  /**
   * @constant filePath
   */
  const filePath = path.join(LOGS_DIR, fileName);
  /**
   * @constant previous
   */
  const previous = writeQueues.get(filePath) || Promise.resolve();
  /**
   * @constant next
   */
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
 * @param {string} type - - Key or event type.
 * @param {string} title - - Log title.
 * @param {string[]} lines - - Lines of content.
 */
async function writeLog(type, title, lines) {
  /**
   * @constant content
   */
  const content = `[${timestamp()}] ${title}\n${section(lines)}\n\n`;
  await appendToLog(getLogFileName(type), content);
}

/**
 * @param {string} message - - Message to process.
 * @param {object} [details] - - Additional details.
 */
async function logSystem(message, details = {}) {
  await writeLog("system", "SYSTEM", [
    `MESSAGE: ${safeStringify(message)}`,
    Object.keys(details).length ? `DETAILS: ${safeStringify(details)}` : "",
  ]);
}

/**
 * @param {object} options
@param {object} options
  userId,
  userName,
  userPhone = null,
  groupId,
  inputCommand,
  resolvedCommand,
  args = [],
  status = "success",
  reason = "",
}".
 */
async function logCommand({
  userId,
  userName,
  userPhone = null,
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
    userPhone ? `USER_PHONE: ${safeStringify(userPhone)}` : "",
    `GROUP_ID: ${safeStringify(groupId)}`,
    `INPUT_COMMAND: ${safeStringify(inputCommand)}`,
    `RESOLVED_COMMAND: ${safeStringify(resolvedCommand)}`,
    `ARGS: ${safeStringify(args)}`,
    reason ? `REASON: ${safeStringify(reason)}` : "",
  ]);
}

/**
 * @param {object} options
 * @param {object} options
 */
async function logError({ source = "unknown", userId = null, userName = null, groupId = null, error, context = {} }) {
  /**
   * @constant normalizedError
   */
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

/**
 * Parse error entries from log content.
 * @param {object} options
 * @param {object} options
 * @param content
 * @param limit
 * @returns {Array<{time: string, source: string, message: string}>}
 */
function parseErrorEntries(content, limit = 5) {
  /**
   * @constant entries
   * @type {Array}
   */
  const entries = [];
  /**
   * @constant blocks
   */
  const blocks = content.split(/\n\n+/);

  for (const block of blocks) {
    if (!block.includes("] ERROR")) continue;

    /**
     * @constant timeMatch
     */
    const timeMatch = block.match(/^\[(.+?)\]/);
    /**
     * @constant sourceMatch
     */
    const sourceMatch = block.match(/SOURCE:\s*(.+)/);
    /**
     * @constant messageMatch
     */
    const messageMatch = block.match(/MESSAGE:\s*(.+)/);

    if (timeMatch) {
      entries.push({
        time: timeMatch[1],
        source: sourceMatch ? sourceMatch[1].trim() : "unknown",
        message: messageMatch ? messageMatch[1].trim().slice(0, 80) : "(sin mensaje)",
      });
    }

    if (entries.length >= limit) break;
  }

  return entries;
}

/**
 * Get recent errors from today's error log.
 * @param {object} options
 * @param limit
 * @returns {Promise<Array<{time: string, source: string, message: string}>>}
 */
async function getRecentErrors(limit = 5) {
  try {
    /**
     * @constant fileName
     */
    const fileName = getLogFileName("error");
    /**
     * @constant filePath
     */
    const filePath = path.join(LOGS_DIR, fileName);
    /**
     * @constant content
     */
    const content = await fsp.readFile(filePath, "utf8");
    return parseErrorEntries(content, limit);
  } catch {
    return [];
  }
}

/**
 * Get recent errors from a specific date's log.
 * @param {object} options
 * @param {object} options
 * @param dateStr
 * @param limit
 * @returns {Promise<Array<{time: string, source: string, message: string}>>}
 */
async function getErrorsByDate(dateStr, limit = 10) {
  try {
    /**
     * @constant fileName
     */
    const fileName = `error-${dateStr}.log`;
    /**
     * @constant filePath
     */
    const filePath = path.join(LOGS_DIR, fileName);
    /**
     * @constant content
     */
    const content = await fsp.readFile(filePath, "utf8");
    return parseErrorEntries(content, limit);
  } catch {
    return [];
  }
}

module.exports = {
  logSystem,
  logCommand,
  logError,
  cleanOldLogs,
  getRecentErrors,
  getErrorsByDate,
};
