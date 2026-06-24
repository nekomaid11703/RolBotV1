const { createReport } = require('../../services/bugReportService');

module.exports = {
  name: 'bugreport',
  description: 'Reportar un bug. Uso: /bugreport <descripción> [+imagen]',
  category: 'utilidades',

  async execute(ctx) {
    const description = ctx.args.join(' ').trim();
    if (!description && !ctx.msg?.message?.imageMessage) {
      return ctx.social('❌ Usa: /bugreport <descripción del bug>\n\nPuedes adjuntar una imagen.');
    }

    try {
      const report = await createReport({
        sock: ctx.sock,
        groupId: ctx.isGroup ? ctx.from : null,
        userId: ctx.sender,
        userName: ctx.userName,
        description: description || '(solo imagen)',
        msg: ctx.msg,
      });

      const lines = [
        `✅ Bug #${report.id.slice(0, 8)} reportado`,
        `📋 Categoría: ${report.category}`,
        `🏷 Prioridad: ${report.priority}`,
        `📊 Estado: ${report.status}`,
      ];
      if (report.mediaUrl) lines.push('🖼 Imagen adjunta guardada');
      await ctx.social(lines.join('\n'));
    } catch (error) {
      await ctx.social(`❌ ${error.message}`);
    }
  },
};
