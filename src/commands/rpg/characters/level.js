const characterService = require("../../../services/characterService");
const { xpForNextLevel, LEVEL_MAX } = require("../../../config/characterConfig");
const { composeMessage } = require("../../../ui/sectionBuilder");
const { box } = require("../../../utils/boxUtils");

/**
 * Genera la barra visual de progreso de XP.
 * @param {number} currentXp
 * @param {number} neededXp
 * @returns {string}
 */
function buildXpBar(currentXp = 0, neededXp = 100) {
  const totalBlocks = 10;
  const ratio = Math.min(1, Math.max(0, currentXp / Math.max(1, neededXp)));
  const filled = Math.round(ratio * totalBlocks);
  const empty = totalBlocks - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  const percent = Math.floor(ratio * 100);
  return `[${bar}] ${currentXp}/${neededXp} XP (${percent}%)`;
}

module.exports = {
  name: "level",
  aliases: ["xp", "progreso", "nivel"],
  description: "Muestra tu nivel actual, experiencia (XP) y puntos de atributo disponibles para asignar.",
  /**
   * @param {*} ctx
   */
  async execute(ctx) {
    const activeChar = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const info = await characterService.getXpInfo({
      creatorId: ctx.sender,
      characterName: activeChar.name,
    });

    const level = info.nivel || activeChar.nivel || 20;
    const currentXp = info.xp || 0;
    const totalXp = info.xp_total || 0;
    const neededXp = info.xp_para_siguiente || xpForNextLevel(level);

    const stats = activeChar.stats || {};
    const pointsAvailable = Number(stats.puntos_disponibles) || 0;

    const lines = [
      `👤 *Personaje:* ${activeChar.name} (${activeChar.clase || "aventurero"})`,
      `📖 *Nivel:* ${level} / ${LEVEL_MAX}`,
      `✨ *Experiencia:* ${buildXpBar(currentXp, neededXp)}`,
      `🏆 *XP Total Acumulada:* ${totalXp.toLocaleString()} XP`,
    ];

    if (pointsAvailable > 0) {
      lines.push("");
      lines.push(`⭐ *PUNTOS DISPONIBLES:* ${pointsAvailable} ${pointsAvailable === 1 ? "punto" : "puntos"}`);
      lines.push(`💡 Usa \`/subir_stat <stat> [cantidad]\` para asignarlos.`);
    } else {
      lines.push("");
      lines.push(`💡 Gana combates PvE o PvP para obtener XP y subir tu nivel.`);
    }

    return ctx.reply(box("📊 PROGRESO Y EXPERIENCIA", lines));
  },
};
