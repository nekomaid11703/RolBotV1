// @ts-nocheck
const characterService = require("../../../services/characterService");
const craftingService = require("../../../services/rpg/craftingService");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "forjar",
  aliases: ["craftear", "crear_item", "forja", "craft"],
  description:
    "Forja armas, armaduras y accesorios consumiendo unidades de un material del Tier indicado.",

  async execute(ctx) {
    const activeChar = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const [recipeArg, materialArg, tierArg] = ctx.args;

    // ── Mostrar tabla de recetas si no hay argumentos ─────────────────────────
    if (!recipeArg || !materialArg) {
      const byCategory = {
        "⚔️ Armas Cuerpo a Cuerpo": ["daga", "espada", "espada_larga", "lanza", "maza"],
        "🏹 Armas a Distancia":    ["arco", "ballesta", "resortera", "cerbatana"],
        "💥 Munición (1 mat → 16x)": ["flechas", "virotes", "balines", "dardos"],
        "🔮 Armas Mágicas":         ["varita", "baculo"],
        "🛡️ Armaduras":              ["casco", "botas", "grebas", "pechera"],
        "🧥 Equipo de Mago":         ["tunica", "grimorio"],
        "🛡️ Escudos y Accesorios":   ["escudo", "amuleto"],
      };

      const lines = ["🔨 *RECETAS DE FORJA*", ""];
      for (const [catLabel, keys] of Object.entries(byCategory)) {
        lines.push(`*${catLabel}*`);
        for (const k of keys) {
          const r = craftingService.CRAFTING_RECIPES[k];
          if (!r) continue;
          const prodLabel = r.producedQuantity && r.producedQuantity > 1 ? ` → x${r.producedQuantity}` : "";
          lines.push(`  • \`${k}\` — ${r.name}${prodLabel} *(${r.materialCost} ${r.materialCost === 1 ? "unidad" : "unidades"})*`);
        }
        lines.push("");
      }
      lines.push("💡 *Uso:* `/forjar <receta> <material> [tier]`");
      lines.push("  • Ej: `/forjar flechas hierro E` | `/forjar ballesta mitril A`");

      return ctx.reply(box("🔨 HERRERÍA & FORJA", lines));
    }

    const tier = tierArg ? String(tierArg).toUpperCase() : "E";

    try {
      const res = await craftingService.craftEquipment({
        characterId: activeChar.id,
        creatorId: ctx.sender,
        recipeType: recipeArg,
        materialId: materialArg,
        tier,
      });

      const tierLabels = { E: "Escaso", D: "Distinguido", C: "Notable", B: "Bueno", A: "Alto", S: "Supremo", N: "Nirvana" };
      const tierLabel = tierLabels[res.tier] || res.tier;
      const isAmmo = res.producedQuantity > 1;

      const lines = [
        `✅ *¡${activeChar.name} forjó: ${res.craftedItem.name}!*`,
        `🏷️ Calidad: Tier ${res.tier} (${tierLabel})`,
        `🪨 Material: ${res.materialName} (Tier ${res.tier})`,
        `📦 Consumido: ${res.materialCost}× ${res.materialName}`,
        isAmmo ? `🎥 Producido: *${res.producedQuantity} unidades* de ${res.craftedItem.name}` : "",
        "",
        `💡 Usa \`/inventario\` para verlo o \`/equipar\` para usarlo.`,
      ].filter((l) => l !== null && l !== undefined);

      return ctx.reply(box("🔨 FORJA EXITOSA", lines));
    } catch (err) {
      return ctx.reply(formatError(err));
    }
  },
};
