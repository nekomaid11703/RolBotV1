const { midnightReview } = require('../../scripts/midnight_review');
const { logSystem, logError } = require('./loggerService');

let midnightTimer = null;

function startMidnightReview(sock) {
  scheduleNext(sock);
}

function stopMidnightReview() {
  if (midnightTimer) {
    clearTimeout(midnightTimer);
    midnightTimer = null;
  }
}

function scheduleNext(sock) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow - now;

  if (msUntilMidnight <= 0) {
    setImmediate(() => scheduleNext(sock));
    return;
  }

  midnightTimer = setTimeout(async () => {
    try {
      await midnightReview(sock);
    } catch (err) {
      logError({ source: 'schedulerService', error: err instanceof Error ? err : new Error(String(err)) });
    }
    scheduleNext(sock);
  }, msUntilMidnight);
}

module.exports = { startMidnightReview, stopMidnightReview };
