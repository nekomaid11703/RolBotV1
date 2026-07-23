// @ts-nocheck
const { createReport } = require("../../services/bugReportService");
const { box } = require("../../utils/boxUtils");
const { formatError } = require("../../utils/formatErrorUtils");

const reportCooldowns = new Map();
const REPORT_COOLDOWN_MS = 5 * 60 * 1000;

module.exports = {
  name: "bugreport",
  description: "Reportar un bug. Uso: /bugreport <descripción> [+imagen]",
  category: "info",

  async execute(ctx) {
    const now = Date.now();
    const lastReport = reportCooldowns.get(ctx.sender);
    if (lastReport && now - lastReport < REPORT_COOLDOWN_MS) {
      const remaining = Math.ceil((REPORT_COOLDOWN_MS - (now - lastReport)) / 1000);
      return ctx.reply(`⏳ Puedes reportar otro bug en ${remaining} segundos.`);
    }

    const description = ctx.args.join(" ").trim();
    if (!description && !ctx.msg?.message?.imageMessage) {
      return ctx.reply("❌ Usa: /bugreport <descripción del bug>\n\nPuedes adjuntar una imagen.");
    }

    try {
      const report = await createReport({
        sock: ctx.sock,
        groupId: ctx.isGroup ? ctx.from : null,
        userId: ctx.sender,
        userName: ctx.userName,
        description: description || "(solo imagen)",
        msg: ctx.msg,
      });

      reportCooldowns.set(ctx.sender, now);

      const lines = [];
      lines.push("");
      lines.push(`ID: #${report.id.slice(0, 8)}`);
      lines.push(`📋 Categoría: ${report.category}`);
      lines.push(`🏷 Prioridad: ${report.priority}`);
      lines.push(`📊 Estado: ${report.status}`);
      if (report.mediaUrl) lines.push("🖼 Imagen adjunta guardada");

      await ctx.reply(box("✅ Bug reportado", lines));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
