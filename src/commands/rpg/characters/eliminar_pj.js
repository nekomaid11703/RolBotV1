// @ts-nocheck
const { deleteCharacter } = require("../../../services/characterService");
const { getCharacterNames } = require("../../../services/characterService");
const { isAdmin } = require("../../../utils/groupUtils");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");

const usageMessage = formatCommandUsage({
  icon: "🗑️",
  title: "Eliminar personaje",
  description: "Elimina permanentemente un personaje (requiere confirmación).",
  usage: "/eliminar_pj NombreDelPersonaje",
  example: "/eliminar_pj Kael",
  notes: ["Acción irreversible. Se pedirá confirmación."],
});

const CONFIRM_TIMEOUT_MS = 30 * 1000;

module.exports = {
  name: "eliminar_pj",
  aliases: ["epj", "borrar_pj"],
  description: "Elimina un personaje de tu lista (con confirmación).",
  category: "personajes",

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

    // --- Step 1: ask for confirmation ---
    const confirmMsg = `╭─  ¿Eliminar «${name}»?  ─╮\n│                           │\n│   ⚠️  Acción irreversible  │\n│                           │\n│   Responde "sí" o "si"    │\n│   para confirmar          │\n│                           │\n╰───────────────────────────╯`;

    const confirmation = await ctx.ask(confirmMsg, {
      timeout: CONFIRM_TIMEOUT_MS,
    });

    if (!confirmation) {
      return ctx.reply("⌛ Tiempo de confirmación agotado. Operación cancelada.");
    }

    const answer = confirmation.trim().toLowerCase();
    if (answer !== "sí" && answer !== "si") {
      return ctx.reply("❌ Confirmación cancelada.");
    }

    // --- Step 2: execute ---
    let admin = false;
    if (ctx.isGroup) {
      admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
    }

    try {
      await deleteCharacter({
        characterName: name,
        creatorId: ctx.sender,
        requesterId: ctx.sender,
        requesterIsAdmin: admin,
      });

      await ctx.react("🗑️");

      await ctx.reply(
        box("🗑️ Personaje eliminado", ["", `👤  ${name.toUpperCase()}`, "", `Ha sido eliminado permanentemente.`]),
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
