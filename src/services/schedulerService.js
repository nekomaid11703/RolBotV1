// @ts-nocheck
const { midnightReview } = require("../../scripts/midnight_review");
const { logError } = require("./loggerService");

/** @type {ReturnType<typeof setTimeout>|null} */
let schedulerTimer = null;
let schedulerActive = false;
let schedulerGeneration = 0;
let currentSock = null;

function startMidnightReview(sock) {
  currentSock = sock;
  if (schedulerActive) return;
  schedulerActive = true;
  scheduleNext(++schedulerGeneration);
}

function scheduleNext(generation) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = Math.max(1, tomorrow - now);

  schedulerTimer = setTimeout(async () => {
    schedulerTimer = null;
    if (!schedulerActive || generation !== schedulerGeneration) return;
    const sock = currentSock;
    try {
      await midnightReview(sock);
    } catch (err) {
      logError({ source: "schedulerService", error: err instanceof Error ? err : new Error(String(err)) });
    }
    if (schedulerActive && generation === schedulerGeneration) scheduleNext(generation);
  }, msUntilMidnight);
}

function stopMidnightReview() {
  schedulerActive = false;
  schedulerGeneration++;
  currentSock = null;
  if (schedulerTimer) {
    clearTimeout(schedulerTimer);
    schedulerTimer = null;
  }
}

module.exports = { startMidnightReview, stopMidnightReview };
