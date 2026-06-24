const { getFirstMentionedJid } = require("../../utils/commandParseUtils");
const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

function extractPhoneFromArgs(args) {
  for (const arg of args) {
    const cleaned = arg.replace(/[^0-9]/g, "");
    if (cleaned.length >= 7 && cleaned.length <= 15) {
      return cleaned + "@s.whatsapp.net";
    }
  }
  return null;
}

const usageMessage = formatCommandUsage({
  icon: "➕",
  title: "Añadir miembro",
  description: "Añade un miembro al grupo por número de teléfono.",
  usage: "/add 573156602784",
  example: "/add 573156602784",
  notes: [
    "Solo administradores del grupo.",
    "El usuario debe tener el número guardado en contactos o la privacidad abierta.",
  ],
});

module.exports = {
  name: "add",
  aliases: ["agregar", "invitar", "invite"],
  description: "Añade un miembro al grupo por número.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx) || extractPhoneFromArgs(ctx.args || []);

    if (!targetId) {
      return ctx.reply(usageMessage);
    }

    try {
      await ctx.sock.groupParticipantsUpdate(ctx.from, [targetId], 'add');
      const phoneDisplay = targetId.split("@")[0];
      await ctx.reply(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "➕ Miembro añadido",
          "",
          `📱 @${phoneDisplay}`,
          "",
          "Si el usuario no aparece, debe guardar el contacto o abrir su privacidad.",
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(formatError(`No se pudo añadir. El usuario debe tener el bot en contactos o abrir privacidad de grupos.`));
    }
  },
};
