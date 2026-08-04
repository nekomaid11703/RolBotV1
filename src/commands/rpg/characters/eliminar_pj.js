// @ts-nocheck
const { listCharacters, deleteCharacter } = require("../../../services/characterService");
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

/** @type {Map<string, { characterName: string, creatorId: string, timestamp: number }>} */
const pendingConfirmations = new Map();

module.exports = {
  name: "eliminar_pj",
  aliases: ["epj", "borrar_pj"],
  description: "Elimina un personaje de tu lista (con confirmación).",
  category: "rpg",

  async execute(ctx) {
    const raw = ctx.args.join(" ").trim();

    if (!raw) {
      return ctx.reply(usageMessage);
    }

    const pendingKey = `${ctx.from}:${ctx.senderJid || ctx.sender}`;

    // --- If user confirms with "si" or "sí" ---
    if (raw.toLowerCase() === "si" || raw.toLowerCase() === "sí") {
      const pending = pendingConfirmations.get(pendingKey);
      if (!pending) {
        return ctx.reply(
          formatError("No hay ninguna eliminación pendiente.", "Usa /eliminar_pj <nombre> para empezar."),
        );
      }

      if (Date.now() - pending.timestamp > CONFIRM_TIMEOUT_MS) {
        pendingConfirmations.delete(pendingKey);
        return ctx.reply("⌛ Tiempo de confirmación agotado. Operación cancelada.");
      }

      pendingConfirmations.delete(pendingKey);

      return executeDeletion(ctx, pending.characterName, pending.creatorId);
    }

    // --- Step 1: find character case-insensitively ---
    const name = raw.toLowerCase();

    const characters = await listCharacters({ creatorId: ctx.sender, bypassCache: true });
    const character = characters.find((c) => c.name.toLowerCase() === name);

    if (!character) {
      return ctx.reply(formatError(`No tienes un personaje llamado "${raw}".`, `Usa /mis_pj para ver tu lista.`));
    }

    const storedName = character.name;

    pendingConfirmations.set(pendingKey, {
      characterName: storedName,
      creatorId: ctx.sender,
      timestamp: Date.now(),
    });

    const confirmMsg = [
      `╭─  ¿Eliminar «${storedName}»?  ─╮`,
      `│                                │`,
      `│   ⚠️  Acción irreversible       │`,
      `│                                │`,
      `│   Escribe /eliminar_pj si      │`,
      `│   para confirmar               │`,
      `│                                │`,
      `╰────────────────────────────────╯`,
    ].join("\n");

    return ctx.reply(confirmMsg);
  },
};

/**
 * @param {object} ctx
 * @param {string} characterName
 * @param {string} creatorId
 */
async function executeDeletion(ctx, characterName, creatorId) {
  await deleteCharacter({
    characterName,
    creatorId,
  });

  await ctx.react("🗑️");

  await ctx.reply(
    box("🗑️ Personaje eliminado", ["", `👤  ${characterName.toUpperCase()}`, "", `Ha sido eliminado permanentemente.`]),
  );
}
