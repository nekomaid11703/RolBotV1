// @ts-nocheck
const { setActiveCharacter } = require("../../../services/characterService");
const { getCharacterNames } = require("../../../services/characterService");
const { isAdmin } = require("../../../utils/groupUtils");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");

const usageMessage = formatCommandUsage({
  icon: "🔄",
  title: "Cambiar personaje activo",
  description: "Cambia tu personaje activo por otro de tu lista.",
  usage: "/switch_pj NombreDelPersonaje",
  example: "/switch_pj Kael",
  notes: ["El nombre debe coincidir exactamente (sensible a mayúsculas)."],
});

module.exports = {
  name: "switch_pj",
  aliases: ["activar_pj", "cambiar_pj"],
  description: "Cambia tu personaje activo.",
  category: "rpg",

  async execute(ctx) {
    const targetName = ctx.args.join(" ");

    if (!targetName || targetName.trim() === "") {
      return ctx.reply(usageMessage);
    }

    const name = targetName.trim();

    const names = await getCharacterNames({ creatorId: ctx.sender });

    if (!names.has(name)) {
      return ctx.reply(formatError(`No tienes un personaje llamado "${name}".`, `Usa /mis_pj para ver tu lista.`));
    }

    let admin = false;
    if (ctx.isGroup) {
      admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
    }

    await setActiveCharacter({
      targetCreatorId: ctx.sender,
      targetCreatorName: ctx.userName,
      characterName: name,
      requesterId: ctx.sender,
      requesterIsAdmin: admin,
    });

    await ctx.react("🔄");

    await ctx.reply(
      box("🔄 Personaje activo", ["", `👤  ${name.toUpperCase()}`, "", `💡 Usa /ver_pj para ver su perfil`]),
    );
  },
};
