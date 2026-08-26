// @ts-nocheck
const characterService = require("../../../services/characterService");
const craftingService = require("../../../services/rpg/craftingService");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "refinar",
  aliases: ["refine", "refinamiento", "combinar_material"],
  description:
    "Transforma 2 unidades de un material del mismo Tier en 1 del Tier superior (E → D → C → B → A → S → N).",

  async execute(ctx) {
    const activeChar = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const [materialArg, tierArg, amountArg] = ctx.args;

    if (!materialArg) {
      const lines = [
        "🔥 *REFINAMIENTO DE MATERIALES*",
        "Combina 2 unidades del mismo Tier para obtener 1 del Tier superior:",
        "  • 2× Tier E → 1× Tier D",
        "  • 2× Tier D → 1× Tier C",
        "  • 2× Tier C → 1× Tier B",
        "  • 2× Tier B → 1× Tier A",
        "  • 2× Tier A → 1× Tier S",
        "  • 2× Tier S → 1× Tier N *(Nirvana)*",
        "",
        "💡 *Uso:* `/refinar <material> [tier] [cantidad]`",
        "  • Ej: `/refinar hierro E` → sube 1 lingote de Hierro E a D",
        "  • Ej: `/refinar mitril A 2` → sube 2 lotes de Mitril A a S",
      ];
      return ctx.reply(box("🔥 ALQUIMIA & REFINAMIENTO", lines));
    }

    const tier = tierArg ? String(tierArg).toUpperCase() : "E";
    const amount = Math.max(1, parseInt(amountArg, 10) || 1);

    try {
      const res = await craftingService.refineMaterial({
        characterId: activeChar.id,
        creatorId: ctx.sender,
        materialId: materialArg,
        tier,
        amount,
      });

      const lines = [
        `✅ *¡Refinamiento exitoso de ${res.materialName}!*`,
        `📉 Consumido: ${res.consumedAmount}× ${res.materialName} (Tier ${res.sourceTier})`,
        `✨ Producido: ${res.producedAmount}× ${res.materialName} (Tier ${res.targetTier})`,
        "",
        `💡 Usa \`/inventario\` para ver tus materiales actualizados.`,
      ];

      return ctx.reply(box("✨ MATERIAL REFINADO", lines));
    } catch (err) {
      return ctx.reply(formatError(err));
    }
  },
};
