// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { createSession, createDummySession, findSessionByCharacter } = require("../../../services/rpg/combatState");
const { ensureTempTestKit } = require("../../../services/rpg/inventoryService");
const { formatCombatOpen } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "retar",
  aliases: ["challenge", "pelear"],
  description: "Retar a duelo a otro usuario o a un dummy de prueba (/retar dummy).",
  category: "rpg",

  async execute(ctx) {
    const isDummy = ctx.args.length > 0 && ctx.args[0].toLowerCase() === "dummy";
    const mentioned = Array.isArray(ctx.mentionedJid) ? ctx.mentionedJid.filter(Boolean) : [];

    if (!isDummy && mentioned.length === 0) {
      return ctx.reply(
        "❌ Debes mencionar al usuario que quieres retar o escribir `/retar dummy` para entrenar.\n\nUso: /retar @usuario | /retar dummy",
      );
    }

    try {
      const challengerChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!challengerChar) {
        return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj`.");
      }

      const existingSession = findSessionByCharacter(challengerChar.id);
      if (existingSession) {
        return ctx.reply(
          `❌ Tu personaje activo **${challengerChar.name}** ya está en un combate activo. Usa \`/estado\` para ver el avance.`,
        );
      }

      if (isDummy) {
        const added = await ensureTempTestKit(challengerChar.id, challengerChar.creator_id);
        const session = await createDummySession(ctx.sender, challengerChar);
        let msg = formatCombatOpen(session, true);
        if (added.length > 0) {
          msg += `\n\n🎒 Se añadieron items de prueba: ${added.join(", ")}.`;
        }
        return ctx.reply(msg);
      }

      const targetId = mentioned[0];
      if (targetId === ctx.sender) {
        return ctx.reply("❌ No puedes retarte a ti mismo.");
      }

      const defenderChar = await getActiveCharacter({ creatorId: targetId });
      if (!defenderChar) {
        return ctx.reply("❌ Ese usuario no tiene un personaje activo.");
      }

      const existingDefenderSession = findSessionByCharacter(defenderChar.id);
      if (existingDefenderSession) {
        return ctx.reply(
          `❌ El personaje activo de ese usuario (**${defenderChar.name}**) ya está librando un combate.`,
        );
      }

      const session = await createSession(ctx.sender, targetId, challengerChar, defenderChar);
      return ctx.reply(formatCombatOpen(session, false));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
