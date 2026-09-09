// @ts-nocheck
const { box } = require("../../../utils/boxUtils");
const { getActiveCharacter } = require("../../../services/characterService");
const { getCharacterTools, upgradeTool } = require("../../../services/rpg/toolService");
const { TOOL_UPGRADE_COSTS } = require("../../../config/toolsConfig");
const { formatStelas } = require("../../../utils/economyUtils");
const { getItem } = require("../../../data/items");

module.exports = {
  name: "herramientas",
  aliases: ["herramienta", "tools", "tool"],
  description: "Consulta el nivel de tus herramientas de farmeo y mejóralas de nivel 1 al 10.",
  category: "rpg",

  /**
   * Ejecuta el comando de herramientas.
   * @param {*} ctx
   */
  async execute(ctx) {
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo.");
    }

    const subCommand = (ctx.args[0] || "").toLowerCase();

    // ── SUBCOMANDO: MEJORAR <TIPO> ──
    if (subCommand === "mejorar" || subCommand === "upgrade" || subCommand === "subir") {
      const toolArg = (ctx.args[1] || "").toLowerCase();
      if (!toolArg) {
        return ctx.reply(
          "❌ Especifica qué herramienta deseas mejorar. Ejemplo: `/herramienta mejorar pico` o `/herramienta mejorar mochila`.",
        );
      }

      const result = await upgradeTool({
        userId: ctx.sender,
        characterId: activeChar.id,
        toolId: toolArg,
      });

      if (!result.success) {
        return ctx.reply(`❌ ${result.error}`);
      }

      const lines = [];
      lines.push("✨ **¡Herramienta Mejorada con Éxito!**");
      lines.push("");
      lines.push(`🔧 **Herramienta:** ${result.toolName}`);
      lines.push(`⭐ **Nivel:** ${result.oldLevel} ➔ **Nivel ${result.newLevel}** / 10`);
      lines.push(`💵 **Costo pagado:** ${formatStelas(result.costPaid.stelas)}`);
      if (result.toolId === "mochila") {
        const { getInventorySlotsByMochilaLevel } = require("../../../config/toolsConfig");
        const newSlots = getInventorySlotsByMochilaLevel(result.newLevel);
        lines.push(`🎒 **Nueva capacidad de mochila:** ${newSlots} ranuras de inventario.`);
      } else {
        lines.push(
          `📈 **Bono de rendimiento:** +${Math.round((result.costPaid.lootBonus || 0) * 100)}% en extracciones.`,
        );
      }

      return ctx.reply(box("⚒️ MEJORA DE HERRAMIENTA", lines));
    }

    // ── MENÚ PRINCIPAL: LISTA DE HERRAMIENTAS Y REQUISITOS DE MEJORA ──
    const tools = await getCharacterTools(activeChar.id);
    const lines = [];
    lines.push(`🛠️ **Herramientas de ${activeChar.name}**`);
    lines.push("Progresión estricta de Niveles 1 a 10.");
    lines.push("");

    for (const [id, tool] of Object.entries(tools)) {
      const nextLevel = tool.level < 10 ? tool.level + 1 : null;
      const nextCost = nextLevel ? TOOL_UPGRADE_COSTS[nextLevel] : null;

      lines.push(`${tool.icon} **${tool.name}**`);
      lines.push(`  Nivel: ${tool.level}/10`);
      if (id === "mochila") {
        const { getInventorySlotsByMochilaLevel } = require("../../../config/toolsConfig");
        lines.push(`  Slots: **${getInventorySlotsByMochilaLevel(tool.level)}**`);
      }

      if (nextLevel && nextCost) {
        lines.push(`  🔼 A Nv.${nextLevel}: ✧ ${nextCost.stelas.toLocaleString()}`);
        for (const m of nextCost.materials) {
          const mName = getItem(m.itemId)?.name || m.itemId;
          lines.push(`    • ${m.quantity}x ${mName}`);
        }
      } else {
        lines.push("  👑 Nivel Máximo");
      }
      lines.push("");
    }

    lines.push("💡 **Mejorar:**");
    lines.push("`/herramienta mejorar <tipo>`");
    lines.push("Tipos: pico, hacha, cana,");
    lines.push("bolsa, mochila");

    return ctx.reply(box("🧰 HERRAMIENTAS", lines));
  },
};
