/** @type {{ startTime: number, messagesReceived: number, commandsExecuted: number, errors: number, lastMessageTime: number|null, lastEvents: Array<{time: Date, type: string, text: string}>, groupsCount: number, isConnected: boolean, lastConnectionTime: number|null }} */
const stats = {
  startTime: Date.now(),
  messagesReceived: 0,
  commandsExecuted: 0,
  errors: 0,
  lastMessageTime: null,
  lastEvents: [],
  groupsCount: 0,
  isConnected: false,
  lastConnectionTime: null,
};

/**
 * Increment the message counter.
 */
function incrementMessages() {
  stats.messagesReceived++;
  stats.lastMessageTime = Date.now();
}

/**
 * Increment the command counter.
 */
function incrementCommands() {
  stats.commandsExecuted++;
}

/**
 * Increment the error counter.
 */
function incrementErrors() {
  stats.errors++;
}

/**
 * @param {string} type - - Key or event type.
 * @param {string} text - - Text content.
 */
function addEvent(type, text) {
  stats.lastEvents.unshift({ time: new Date(), type, text });
  if (stats.lastEvents.length > 6) stats.lastEvents.pop();
}

/**
 * Get the bot uptime in milliseconds.
 * @returns {number} - Result value
 */
function getUptime() {
  return Date.now() - stats.startTime;
}

/**
 * Get the current memory usage in MB.
 * @returns {number} - Result value
 */
function getMemory() {
  /**
   * @constant usage
   */
  const usage = process.memoryUsage();
  return Math.round((usage.rss / 1024 / 1024) * 10) / 10;
}

/**
 * @param {number} ms - - Duration in milliseconds.
 * @returns {string} Formatted time string.
 */
function formatDuration(ms) {
  /**
   * @constant s
   */
  const s = Math.floor(ms / 1000);
  /**
   * @constant h
   */
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  /**
   * @constant m
   */
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  /**
   * @constant sec
   */
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

module.exports = {
  stats,
  incrementMessages,
  incrementCommands,
  incrementErrors,
  addEvent,
  getUptime,
  getMemory,
  formatDuration,
};
