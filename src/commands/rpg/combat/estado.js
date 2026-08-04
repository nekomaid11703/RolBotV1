// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { findSessionByCharacter, findSessionByUser } = require("../../../services/rpg/combatState");
const { resolveCharacterEquipment } = require("../../../services/rpg/equipmentResolverService");
const { formatCombatStatus } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "estado",
  aliases: ["status", "combate_estado"],
  description: "Muestra el estado del combate activo del personaje.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    try {
      /**
       * @constant activeChar
       */
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo.");
      }

      /**
       * @constant session
       */
      const session = findSessionByCharacter(activeChar.id);
      if (!session) {
        /**
         * @constant userSession
         */
        const userSession = findSessionByUser(ctx.sender);
        if (userSession) {
          /**
           * @constant charInCombatName
           */
          const charInCombatName =
            userSession.challenger.userId === ctx.sender
              ? userSession.challenger.character.name
              : userSession.defender.character.name;

          return ctx.reply(
            `📊 Tu personaje activo (**${activeChar.name}**) no está en combate.\n\n` +
              `💡 Tu personaje **${charInCombatName}** tiene un combate activo.\n` +
              `Usa \`/switch_pj ${charInCombatName}\` para ver su combate.`,
          );
        }
        return ctx.reply("❌ Tu personaje activo no está en un combate activo.");
      }

      /**
       * Resuelve el equipo de ambos bandos para mostrarlo en el estado
       * (la UI nunca debe romperse: fallback a null).
       */
      const equipmentMap = await Promise.all([
        resolveCharacterEquipment(session.challenger.character).catch(() => null),
        resolveCharacterEquipment(session.defender.character).catch(() => null),
      ]).then(([challenger, defender]) => ({ challenger, defender }));

      return ctx.reply(formatCombatStatus(session, equipmentMap));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
