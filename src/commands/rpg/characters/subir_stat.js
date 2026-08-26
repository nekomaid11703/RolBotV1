const characterService = require("../../../services/characterService");
const experienceService = require("../../../services/rpg/experienceService");
const { LEVELABLE_STATS } = require("../../../config/characterConfig");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "subir_stat",
  aliases: ["subir", "stat", "distribuir_stat", "asignar_stat"],
  description: "Asigna puntos de atributo disponibles a una estadística de tu personaje.",
  /**
   * @param {*} ctx
   */
  async execute(ctx) {
    const activeChar = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const [statArg, pointsArg] = ctx.args;
    if (!statArg) {
      const statsList = Object.entries(LEVELABLE_STATS)
        .map(([k, v]) => `  • \`${k}\` (${v.name})`)
        .join("\n");
      const available = Number(activeChar.stats?.puntos_disponibles) || 0;

      const lines = [
        `⭐ *Puntos Disponibles:* ${available}`,
        "",
        "📌 *Estadísticas Asignables:*",
        statsList,
        "",
        "💡 *Uso:* `/subir_stat <stat> [cantidad]`",
        "  • Ej: `/subir_stat fuerza 1` | `/subir_stat fulgor 3`",
      ];
      return ctx.reply(box("📊 ASIGNAR PUNTOS DE ATRIBUTO", lines));
    }

    const points = pointsArg ? parseInt(pointsArg, 10) : 1;
    if (isNaN(points) || points <= 0) {
      return ctx.reply("❌ La cantidad de puntos debe ser un número mayor a 0.");
    }

    try {
      const res = await experienceService.allocateStatPoints({
        characterId: activeChar.id,
        creatorId: ctx.sender,
        stat: statArg,
        points,
      });

      const lines = [
        `✅ *${activeChar.name}* subió *${res.statName}*!`,
        `📈 Valor actual: ${res.newValue} (+${res.pointsAssigned})`,
        `📖 Nivel del personaje: ${res.newLevel}`,
        `⭐ Puntos restantes: ${res.remainingPoints}`,
      ];

      return ctx.reply(box("✨ ATRIBUTO INCREMENTADO", lines));
    } catch (err) {
      return ctx.reply(formatError(err));
    }
  },
};
