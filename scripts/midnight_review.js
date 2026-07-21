// @ts-nocheck
const { getOpenReports, getStats, markStale } = require('../src/services/reportMaintenanceService');
const { getOwnerJids } = require('../src/utils/permissionUtils');
const { logSystem, logError } = require('../src/services/loggerService');

async function midnightReview(sock) {
  console.log('🌙 Ejecutando midnight review...');
  await logSystem('Midnight review iniciada');

  const staleCount = await markStale(7);
  const stats = await getStats();
  const criticalHigh = await getOpenReports().then(all => all.filter(r => r.priority === 'critical' || r.priority === 'high'));

  const summaryLines = [
    '🌙 *Midnight Review — Resumen de Bugs*',
    '',
    `📊 Total abiertos: ${stats.total}`,
    `🔴 Críticos: ${stats.byPriority.critical || 0}`,
    `🟠 Altos: ${stats.byPriority.high || 0}`,
    `🟡 Medios: ${stats.byPriority.medium || 0}`,
    `🟢 Bajos: ${stats.byPriority.low || 0}`,
    `⏳ Marcados stale (>7d): ${staleCount}`,
  ];

  if (criticalHigh.length > 0) {
    summaryLines.push('', '⚠️ Bugs críticos/altos pendientes:');
    for (const r of criticalHigh) {
      const age = Math.round((Date.now() - new Date(r.timestamp).getTime()) / 86400000);
      summaryLines.push(`  #${r.id.slice(0, 8)} [${r.priority}] ${r.description.slice(0, 50)} (${age}d)`);
    }
  }

  const summary = summaryLines.join('\n');
  console.log(summary);

  if (sock) {
    try {
      const ownerJids = getOwnerJids();
      for (const jid of ownerJids) {
        await sock.sendMessage(jid, { text: summary });
      }
    } catch (err) {
      await logError({ source: 'midnightReview.notify', error: err });
    }
  }

  await logSystem('Midnight review completada', { total: stats.total, staleCount });
}

module.exports = { midnightReview };
