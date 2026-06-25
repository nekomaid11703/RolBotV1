const { getActiveCharacter } = require("../../services/characterService");
const stateManager = require("../../services/rpg/combatStateManager");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "habilidad",
  aliases: ["skill", "skills", "hab"],
  description: "Muestra las habilidades de tu personaje activo.",
  category: "rpg",

  async execute(ctx) {
    try {
      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno."));
      }

      const h1 = character.slots?.habilidad_1 || null;
      const h2 = character.slots?.habilidad_2 || null;

      const lines = [
        "✦ ━━━━━━━━━━━━━━ ✦",
        `⚡ *HABILIDADES: ${character.name.toUpperCase()}*`,
        "✦ ━━━━━━━━━━━━━━ ✦",
        "",
      ];

      if (h1) lines.push(`🔹 *Habilidad 1:*\n   _${h1}_\n`);
      if (h2) lines.push(`🔹 *Habilidad 2:*\n   _${h2}_\n`);

      if (!h1 && !h2) {
        lines.push("_No tienes habilidades asignadas aún._");
        lines.push("");
        lines.push("Edítalas con /edit_pj_desc");
      }

      const room = stateManager.getRoomByGroup(ctx.from);
      if (room && room.status === 'active') {
        const participant = room.participants.find(p => p.id === ctx.sender);
        if (participant) {
          lines.push("", "⚔️ Estás en combate! Las habilidades especiales estarán disponibles pronto.");
        }
      }

      lines.push("", "✦ ━━━━━━━━━━━━━━ ✦");
      return ctx.reply(lines.join('\n'));

    } catch (error) {
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
