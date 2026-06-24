const { getReport, getUserReports } = require('../../services/bugReportService');

module.exports = {
  name: 'bugstatus',
  description: 'Ver estado de tus reportes. Uso: /bugstatus [id]',
  category: 'utilidades',

  async execute(ctx) {
    const id = ctx.args[0];

    if (id) {
      const report = await getReport(id);
      if (!report || report.userId !== ctx.sender) {
        return ctx.social('❌ Reporte no encontrado');
      }
      const lines = [
        `📋 Bug #${report.id.slice(0, 8)}`,
        `📝 ${report.description.slice(0, 200)}`,
        `🏷 Prioridad: ${report.priority}`,
        `📊 Estado: ${report.status}`,
      ];
      if (report.status === 'resolved' && report.resolution) {
        lines.push(`✅ Resuelto: ${report.resolution.summary || 'N/A'}`);
      }
      if (report.mediaUrl) lines.push('🖼 Incluye imagen');
      return ctx.social(lines.join('\n'));
    }

    try {
      const reports = await getUserReports(ctx.sender);
      if (reports.length === 0) {
        return ctx.social('📭 No tienes reportes.');
      }
      const lines = reports.slice(0, 10).map(r =>
        `• #${r.id.slice(0, 8)} [${r.priority}] ${r.status} — ${r.description.slice(0, 50)}`
      );
      await ctx.social(`📋 Tus últimos reportes:\n${lines.join('\n')}`);
    } catch (error) {
      await ctx.social(`❌ ${error.message}`);
    }
  },
};
