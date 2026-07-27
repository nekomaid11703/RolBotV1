// @ts-nocheck
const { getReport, getUserReports } = require("../../services/bugReportService");
const { box } = require("../../utils/boxUtils");
const { formatError } = require("../../utils/formatErrorUtils");

module.exports = {
  name: "bugstatus",
  description: "Ver estado de tus reportes. Uso: /bugstatus [id]",
  category: "info",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant id
     */
    const id = ctx.args[0];

    if (id) {
      /**
       * @constant report
       */
      const report = await getReport(id);
      if (!report || report.userId !== ctx.sender) {
        return ctx.reply(formatError("Reporte no encontrado"));
      }

      /**
       * @constant lines
       * @type {*[]}
       */
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
      /**
       * @constant reports
       */
      const reports = await getUserReports(ctx.sender);
      if (reports.length === 0) {
        return ctx.reply(box("📭 Reportes", ["", "No tienes reportes."]));
      }

      /**
       * @constant lines
       */
      const lines = reports
        .slice(0, 10)
        .map((r) => `• #${r.id.slice(0, 8)} [${r.priority}] ${r.status} — ${r.description.slice(0, 50)}`);
      await ctx.reply(box("📋 Tus reportes", ["", ...lines]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
