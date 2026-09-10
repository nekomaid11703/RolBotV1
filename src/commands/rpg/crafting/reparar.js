// @ts-nocheck
const { box } = require("../../../utils/boxUtils");
const { repairEquipped } = require("../../../services/rpg/repairService");
const { getActiveCharacter } = require("../../../services/characterService");
const { formatStelas } = require("../../../utils/economyUtils");

module.exports = {
  name: "reparar",
  aliases: ["repair", "arreglar"],
  description: "Repara el equipo dañado de tu personaje activo pagando stelas.",
  category: "rpg",

  async execute(ctx) {
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj`.");
    }

    const slot = ctx.args && ctx.args[0] ? String(ctx.args[0]).toLowerCase() : null;
    const result = await repairEquipped({ userId: ctx.sender, characterId: activeChar.id, slot });
    if (!result.success) {
      return ctx.reply(`❌ ${result.error}`);
    }

    const lines = [`🔧 *Equipo reparado (${activeChar.name})*`, ""];
    for (const piece of result.repaired) {
      lines.push(`  • ${piece.itemId} (${piece.slot}): +${piece.missing} resist. — ${formatStelas(piece.cost)}`);
    }
    lines.push("");
    lines.push(`💵 Total pagado: ${formatStelas(result.totalCost)}`);
    lines.push(`🏦 Saldo restante: ${formatStelas(result.newBalance)}`);
    return ctx.reply(box("🔧 REPARACIÓN", lines));
  },
};
