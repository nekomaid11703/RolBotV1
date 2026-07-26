// @ts-nocheck
const { midnightReview } = require("../../scripts/midnight_review");
const { logError } = require("./loggerService");

/** @type {ReturnType<typeof setTimeout>|null} */
let pendingTimer = null;
/** @type {object|null} */
let currentSock = null;

/**
 * TODO: describe what this does.
 */
function stopMidnightReview() {
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  currentSock = null;
}

/**
 * @param sock
 */
function startMidnightReview(sock) {
  stopMidnightReview();
  currentSock = sock;
  scheduleNext(sock);
}

/**
 * @param sock
 */
function scheduleNext(sock) {
  /**
   * @constant now
   * @type {Date}
   */
  const now = new Date();
  /**
   * @constant tomorrow
   * @type {Date}
   */
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  /**
   * @constant msUntilMidnight
   */
  const msUntilMidnight = tomorrow - now;

  if (msUntilMidnight <= 0) {
    setImmediate(() => scheduleNext(sock));
    return;
  }

  pendingTimer = setTimeout(async () => {
    pendingTimer = null;
    if (sock !== currentSock) return;
    try {
      await midnightReview(sock);
    } catch (err) {
      logError({ source: "schedulerService", error: err instanceof Error ? err : new Error(String(err)) });
    }
    if (sock === currentSock) {
      scheduleNext(sock);
    }
  }, msUntilMidnight);
}

module.exports = { startMidnightReview, stopMidnightReview };
