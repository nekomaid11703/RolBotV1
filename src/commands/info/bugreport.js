// @ts-nocheck
const { createReport } = require("../../services/bugReportService");
const { box } = require("../../utils/boxUtils");

/**
 * @constant reportCooldowns
 * @type {Map<*, *>}
 */
const reportCooldowns = new Map();
/**
 * @constant REPORT_COOLDOWN_MS
 */
const REPORT_COOLDOWN_MS = 5 * 60 * 1000;

module.exports = {
  name: "bugreport",
  description: "Reportar un bug. Uso: /bugreport <descripción> [+imagen]",
  category: "info",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant now
     */
    const now = Date.now();
    /**
     * @constant lastReport
     */
    const lastReport = reportCooldowns.get(ctx.sender);
    if (lastReport && now - lastReport < REPORT_COOLDOWN_MS) {
      /**
       * @constant remaining
       */
      const remaining = Math.ceil((REPORT_COOLDOWN_MS - (now - lastReport)) / 1000);
      return ctx.reply(`⏳ Puedes reportar otro bug en ${remaining} segundos.`);
    }

    /**
     * @constant description
     */
    const description = ctx.args.join(" ").trim();
    if (!description && !ctx.msg?.message?.imageMessage) {
      return ctx.reply("❌ Usa: /bugreport <descripción del bug>\n\nPuedes adjuntar una imagen.");
    }

    reportCooldowns.set(ctx.sender, now);
    let report;
    try {
      /**
       * @constant report
       */
      report = await createReport({
        sock: ctx.sock,
        groupId: ctx.isGroup ? ctx.from : null,
        userId: ctx.sender,
        userName: ctx.userName,
        description: description || "(solo imagen)",
        msg: ctx.msg,
      });
    } catch (error) {
      if (reportCooldowns.get(ctx.sender) === now) reportCooldowns.delete(ctx.sender);
      throw error;
    }

    const lines = [];
    lines.push("");
    lines.push(`ID: #${report.id.slice(0, 8)}`);
    lines.push(`📋 Categoría: ${report.category}`);
    lines.push(`🏷 Prioridad: ${report.priority}`);
    lines.push(`📊 Estado: ${report.status}`);
    if (report.mediaUrl) lines.push("🖼 Imagen adjunta guardada");

    await ctx.reply(box("✅ Bug reportado", lines));
  },
};
