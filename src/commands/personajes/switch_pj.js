const { setActiveCharacter } = require("../../services/characterService");
const { isAdmin } = require("../../utils/groupUtils");
const {
  formatCommandUsage,
  formatError,
} = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "🔁",
  title: "Activar personaje",
  description: "Selecciona el personaje que quedara activo para tus escenas.",
  usage: "/switch_pj Nombre",
  example: "/switch_pj Kael",
  notes: ["Admin en grupo: `/switch_pj @usuario | Nombre`."],
});

module.exports = {
  name: "switch_pj",
  aliases: ["spj", "usar_pj"],
  description: "Activa un personaje para usarlo en tus campañas o historias. Si eres admin, puedes activar el personaje de otro usuario mencionándolo.",
  category: "personajes",
 

  async execute(ctx) {
    const payload = ctx.args.join(" ").trim();

    if (!payload) {
      return ctx.reply(usageMessage);
    }

    const parts = payload
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

    const mentioned = ctx.mentionedJid || [];

    const admin = await isAdmin(
      ctx.sock,
      ctx.from,
      ctx.sender,
    );

    let targetCreatorId = ctx.sender;
    let targetCreatorName = ctx.userName;
    let characterName = parts[0];

    if (mentioned.length > 0 && parts.length >= 2) {
      if (!admin) {
        return ctx.reply(formatError("Solo un administrador puede cambiar el personaje de otro usuario."));
      }

      targetCreatorId = mentioned[0];
      targetCreatorName = "usuario";
      characterName = parts[1];
    }

    try {
      const character = await setActiveCharacter({
        targetCreatorId,
        targetCreatorName,
        characterName,
        requesterId: ctx.sender,
        requesterIsAdmin: admin,
      });

      await ctx.react("🔁");

      await ctx.reply(
        `✅ Ahora el personaje activo es *${character.name}*`,
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
