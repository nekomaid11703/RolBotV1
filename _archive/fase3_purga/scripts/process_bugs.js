const { getOpenReports, getReport, resolveReport, getStats } = require('../src/services/bugReportService');

const args = process.argv.slice(2);

async function main() {
  const command = args[0];

  if (!command || command === '--list' || command === '-l') {
    const reports = await getOpenReports();
    if (reports.length === 0) {
      console.log('📭 No hay bugs abiertos.');
      return;
    }
    console.log(`📋 Bugs abiertos (${reports.length}):`);
    for (const r of reports) {
      const age = Math.round((Date.now() - new Date(r.timestamp).getTime()) / 86400000);
      console.log(`  #${r.id.slice(0, 8)} [${r.priority}] ${r.description.slice(0, 60)} (${age}d)`);
    }
    return;
  }

  if (command === '--view' || command === '-v') {
    const id = args[1];
    if (!id) { console.log('Usa: --view <id>'); return; }
    const fullId = id.startsWith('bug_') ? id : null;
    const report = fullId ? await getReport(fullId) : null;
    if (!report) {
      const all = await getOpenReports();
      const match = all.find(r => r.id.startsWith(id) || r.id.slice(0, 8) === id);
      if (!match) { console.log('❌ Reporte no encontrado'); return; }
      printReport(match);
    } else {
      printReport(report);
    }
    return;
  }

  if (command === '--resolve' || command === '-r') {
    const id = args[1];
    const summaryIdx = args.indexOf('--summary') !== -1 ? args.indexOf('--summary') : args.indexOf('-s');
    const commitIdx = args.indexOf('--commit') !== -1 ? args.indexOf('--commit') : args.indexOf('-c');
    const summary = summaryIdx !== -1 ? args[summaryIdx + 1] : 'Corregido';
    const commit = commitIdx !== -1 ? args[commitIdx + 1] : null;
    if (!id) { console.log('Usa: --resolve <id> --summary "fix" --commit abc123'); return; }
    const resolved = await resolveReport(id, { summary, commit, resolvedBy: 'opencode' });
    console.log(`✅ Bug #${resolved.id.slice(0, 8)} resuelto: ${summary}`);
    return;
  }

  if (command === '--stats' || command === '-s') {
    const stats = await getStats();
    console.log('📊 Estadísticas de bugs:');
    console.log(`  Total abiertos: ${stats.total}`);
    for (const [p, c] of Object.entries(stats.byPriority)) {
      console.log(`  ${p}: ${c}`);
    }
    return;
  }

  console.log(`Uso:
  node scripts/process_bugs.js --list        Listar bugs abiertos
  node scripts/process_bugs.js --view <id>   Ver detalle de bug
  node scripts/process_bugs.js --resolve <id> --summary "fix" [--commit abc123]  Resolver bug
  node scripts/process_bugs.js --stats       Ver estadísticas`);
}

function printReport(report) {
  console.log(`ID:         ${report.id}`);
  console.log(`Usuario:    ${report.userName} (${report.userId})`);
  console.log(`Desc:       ${report.description}`);
  console.log(`Prioridad:  ${report.priority}`);
  console.log(`Categoría:  ${report.category}`);
  console.log(`Estado:     ${report.status}`);
  console.log(`Fecha:      ${report.timestamp}`);
  if (report.mediaUrl) console.log(`Media:      ${report.mediaUrl}`);
  if (report.resolution) {
    console.log(`Resuelto:   ${report.resolution.summary}`);
    if (report.resolution.commit) console.log(`Commit:     ${report.resolution.commit}`);
  }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
