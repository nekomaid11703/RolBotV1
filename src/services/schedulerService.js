// @ts-nocheck
const { logError, logSystem } = require("./loggerService");
const { getOpenReports, getStats, markStale } = require("./bugReportService");
const { getOwnerJids } = require("../utils/permissionUtils");

async function midnightReview(sock) {
  await logSystem("Midnight review iniciada");

  const staleCount = await markStale(7);
  const stats = await getStats();
  const allOpen = await getOpenReports();
  const criticalHigh = allOpen.filter((r) => r.priority === "critical" || r.priority === "high");

  const summaryLines = [
    "🌙 *Midnight Review — Resumen de Bugs*",
    "",
    `📊 Total abiertos: ${stats.total}`,
    `🔴 Críticos: ${stats.byPriority.critical || 0}`,
    `🟠 Altos: ${stats.byPriority.high || 0}`,
    `🟡 Medios: ${stats.byPriority.medium || 0}`,
    `🟢 Bajos: ${stats.byPriority.low || 0}`,
    `⏳ Marcados stale (>7d): ${staleCount}`,
  ];

  if (criticalHigh.length > 0) {
    summaryLines.push("", "⚠️ Bugs críticos/altos pendientes:");
    for (const r of criticalHigh) {
      const age = Math.round((Date.now() - new Date(r.timestamp).getTime()) / 86400000);
      summaryLines.push(`  #${r.id.slice(0, 8)} [${r.priority}] ${r.description.slice(0, 50)} (${age}d)`);
    }
  }

  const summary = summaryLines.join("\n");

  if (sock) {
    try {
      const ownerJids = getOwnerJids();
      for (const jid of ownerJids) {
        await sock.sendMessage(jid, { text: summary });
      }
    } catch (err) {
      await logError({ source: "midnightReview.notify", error: err });
    }
  }

  await logSystem("Midnight review completada", { total: stats.total, staleCount });
}

function startMidnightReview(sock) {
  scheduleNext(sock);
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

  setTimeout(async () => {
    try {
      await midnightReview(sock);
    } catch (err) {
      logError({ source: "schedulerService", error: err instanceof Error ? err : new Error(String(err)) });
    }
    scheduleNext(sock);
  }, msUntilMidnight);
}

module.exports = { startMidnightReview };
