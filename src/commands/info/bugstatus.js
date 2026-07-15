// @ts-nocheck
const { getReport, getUserReports } = require("../../services/bugReportService");
const { box, formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "bugstatus",
  description: "Ver estado de tus reportes. Uso: /bugstatus [id]",
  category: "utilidades",

  async execute(ctx) {
    const id = ctx.args[0];

    if (id) {
      const report = await getReport(id);
      if (!report || report.userId !== ctx.sender) {
        return ctx.reply(formatError("Reporte no encontrado"));
      }

      const lines = [];
      lines.push("");
      lines.push(`📝 ${report.description.slice(0, 200)}`);
      lines.push(`🏷 Prioridad: ${report.priority}`);
      lines.push(`📊 Estado: ${report.status}`);
      if (report.status === "resolved" && report.resolution) {
        lines.push(`✅ Resuelto: ${report.resolution.summary || "N/A"}`);
      }
      if (report.mediaUrl) lines.push("🖼 Incluye imagen");

      return ctx.reply(box(`📋 Bug #${report.id.slice(0, 8)}`, lines));
    }

    try {
      const reports = await getUserReports(ctx.sender);
      if (reports.length === 0) {
        return ctx.reply(box("📭 Reportes", ["", "No tienes reportes."]));
      }

      const lines = reports
        .slice(0, 10)
        .map((r) => `• #${r.id.slice(0, 8)} [${r.priority}] ${r.status} — ${r.description.slice(0, 50)}`);
      await ctx.reply(box("📋 Tus reportes", ["", ...lines]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
