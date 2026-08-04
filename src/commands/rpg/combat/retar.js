// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { createSession, createDummySession, findSessionByCharacter } = require("../../../services/rpg/combatState");
const { ensureTempTestKit, ensureIronFamilyKit } = require("../../../services/rpg/inventoryService");
const { resolveCharacterEquipment } = require("../../../services/rpg/equipmentResolverService");
const { formatCombatOpen } = require("../../../services/rpg/combatMessages");

/**
 * Resuelve el equipo de ambos bandos para la apertura del combate.
 * Fallback defensivo: si falla, la UI sigue mostrando el resto sin equipo.
 * @param {object} session - Sesión de combate
 * @returns {Promise<{challenger: object|null, defender: object|null}>}
 */
async function resolveOpenEquipment(session) {
  try {
    const [challenger, defender] = await Promise.all([
      resolveCharacterEquipment(session.challenger.character).catch(() => null),
      resolveCharacterEquipment(session.defender.character).catch(() => null),
    ]);
    return { challenger, defender };
  } catch {
    return { challenger: null, defender: null };
  }
}

module.exports = {
  name: "retar",
  aliases: ["challenge", "pelear"],
  description: "Retar a duelo a otro usuario o a un dummy de prueba (/retar dummy).",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant isDummy
     */
    const isDummy = ctx.args.length > 0 && ctx.args[0].toLowerCase() === "dummy";
    /**
     * @constant mentioned
     */
    const mentioned = Array.isArray(ctx.mentionedJid) ? ctx.mentionedJid.filter(Boolean) : [];

    if (!isDummy && mentioned.length === 0) {
      return ctx.reply(
        "❌ Debes mencionar al usuario que quieres retar o escribir `/retar dummy` para entrenar.\n\nUso: /retar @usuario | /retar dummy",
      );
    }

    /**
     * @constant challengerChar
     */
    const challengerChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!challengerChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj`.");
    }

    /**
     * @constant existingSession
     */
    const existingSession = findSessionByCharacter(challengerChar.id);
    if (existingSession) {
      return ctx.reply(
        `❌ Tu personaje activo **${challengerChar.name}** ya está en un combate activo. Usa \`/estado\` para ver el avance.`,
      );
    }

    if (isDummy) {
      /**
       * @constant added
       */
      const added = await ensureTempTestKit(challengerChar.id, challengerChar.creator_id);
      /**
       * @constant ironAdded
       */
      const ironAdded = await ensureIronFamilyKit(challengerChar.id, challengerChar.creator_id);
      /**
       * @constant session
       */
      const session = await createDummySession(ctx.sender, challengerChar);
      /**
       * @constant equipmentMap
       */
      const equipmentMap = await resolveOpenEquipment(session);
      let msg = formatCombatOpen(session, true, equipmentMap);
      if (added.length > 0) {
        msg += `\n\n🎒 Se añadieron items de prueba: ${added.join(", ")}.`;
      }
      if (ironAdded.length > 0) {
        msg += `\n\n⚙️ Set de hierro añadido al inventario: ${ironAdded.join(", ")}. Equipa con \`/equipar\`.`;
      }
      return ctx.reply(msg);
    }

    /**
     * @constant targetId
     */
    const targetId = mentioned[0];
    if (targetId === ctx.sender) {
      return ctx.reply("❌ No puedes retarte a ti mismo.");
    }

    /**
     * @constant defenderChar
     */
    const defenderChar = await getActiveCharacter({ creatorId: targetId });
    if (!defenderChar) {
      return ctx.reply("❌ Ese usuario no tiene un personaje activo.");
    }

    /**
     * @constant existingDefenderSession
     */
    const existingDefenderSession = findSessionByCharacter(defenderChar.id);
    if (existingDefenderSession) {
      return ctx.reply(`❌ El personaje activo de ese usuario (**${defenderChar.name}**) ya está librando un combate.`);
    }

    /**
     * @constant session
     */
    const session = await createSession(ctx.sender, targetId, challengerChar, defenderChar);
    const equipmentMap = await resolveOpenEquipment(session);
    return ctx.reply(formatCombatOpen(session, false, equipmentMap));
  },
};
