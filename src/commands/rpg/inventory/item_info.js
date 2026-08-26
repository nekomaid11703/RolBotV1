// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { getInventoryList } = require("../../../services/rpg/inventoryService");
const { getEquippedSlots } = require("../../../services/rpg/equipmentService");
const { getItem } = require("../../../data/items");
const { MATERIALS } = require("../../../data/materialData");
const { ARMOR_SETS } = require("../../../data/armorSets");
const { TIERS, normalizeTier } = require("../../../config/tierConfig");
const { getWeaponStats, getArmorStats, getSpellStats, getArtifactStats } = require("../../../services/rpg/itemStatService");
const { CONTAINER_CAPACITIES } = require("../../../services/rpg/spellContainerService");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");
const { box } = require("../../../utils/boxUtils");

const usageMessage = formatCommandUsage({
  icon: "🔍",
  title: "Inspeccionar Ítem",
  description: "Muestra la información y ficha técnica de un ítem de tu inventario.",
  usage: "/item_info <nº_posición|id_item>",
  example: "/item_info 2 | /inspeccionar amuleto_de_hierro",
  notes: [
    "Usa el número de posición en tu /inventario (ej: /inspeccionar 1)",
    "Muestra stats, tier, material, efectos de artefactos y bonos de conjunto de armaduras.",
  ],
});

module.exports = {
  name: "item_info",
  aliases: ["inspeccionar", "iteminfo", "info_item", "inspect"],
  description: "Muestra la ficha técnica detallada de un ítem de tu inventario.",
  category: "rpg",

  async execute(ctx) {
    if (ctx.args.length === 0) {
      return ctx.reply(usageMessage);
    }

    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const target = ctx.args.join(" ").trim();
    const inventoryList = await getInventoryList(activeChar.id);
    const equippedSlots = await getEquippedSlots(activeChar.id);

    let foundEntry = null;

    // Buscar por número 1-based si es dígito
    if (/^\d+$/.test(target)) {
      foundEntry = inventoryList.find((e) => e.index === Number(target));
    }

    // Si no se halló por número, buscar por ID exacto o parcial en inventario
    if (!foundEntry) {
      const lower = target.toLowerCase();
      foundEntry = inventoryList.find(
        (e) => e.itemId.toLowerCase() === lower || e.name.toLowerCase() === lower || e.itemId.toLowerCase().includes(lower),
      );
    }

    // Definición de ítem desde el catálogo
    const itemId = foundEntry ? foundEntry.itemId : target.toLowerCase();
    const itemDef = getItem(itemId);

    if (!itemDef && !foundEntry) {
      return ctx.reply(`❌ No se encontró ningún ítem en tu inventario ni en el catálogo para "${target}".`);
    }

    const name = itemDef?.name || foundEntry?.name || itemId;
    const categories = itemDef?.categories || foundEntry?.categories || [];
    const tierKey = normalizeTier(foundEntry?.metadata?.tier || itemDef?.tier || "E");
    const tierInfo = TIERS[tierKey] || { name: tierKey, label: "Escaso" };
    const matKey = itemDef?.material || "madera";
    const matInfo = MATERIALS[matKey] || null;

    // Comprobar si está equipado y en qué slot
    const equippedInSlot = Object.entries(equippedSlots).find(
      ([slot, id]) => id === itemId && !String(id).startsWith("__2h:"),
    );

    const lines = [
      `📦 *${name}* (\`${itemId}\`)`,
      `🏷️ *Categoría:* ${categories.join(", ") || "General"}`,
      `⭐ *Calidad / Tier:* Tier ${tierKey} — *${tierInfo.label}*`,
      "",
    ];

    // Mostrar estado en inventario y equipamiento
    if (foundEntry) {
      lines.push(`🔢 *En Inventario:* Posición #${foundEntry.index} (Cantidad: x${foundEntry.quantity})`);
    }

    if (equippedInSlot) {
      lines.push(`⚔️ *Estado:* Equipado en [${equippedInSlot[0]}]`);
    } else if (foundEntry) {
      lines.push(`🎒 *Estado:* En el inventario (Sin equipar)`);
    }
    lines.push("");

    // Estadísticas detalladas por categoría

    // 1. Armas
    if (categories.includes("weapon")) {
      const wStats = getWeaponStats(itemDef);
      lines.push("⚔️ *ESTADÍSTICAS DE ARMA:*");
      lines.push(`  • Daño Base: ${wStats.baseDamage} (${wStats.damageNature})`);
      lines.push(`  • Manos: ${wStats.hands} ${wStats.hands === 2 ? "(Arma de 2 Manos)" : "(1 Mano)"}`);
      lines.push(`  • Alcance: ${wStats.weaponRange} casilla(s)`);
      if (wStats.magicConduction > 0) {
        lines.push(`  • Conducción Mágica: +${wStats.magicConduction}`);
      }
      lines.push("");
    }

    // 2. Armaduras y Conjuntos (Set Bonus)
    if (categories.includes("armor")) {
      const aStats = getArmorStats(itemDef);
      lines.push("🛡️ *ESTADÍSTICAS DE ARMADURA:*");
      lines.push(`  • Defensa Otorgada: +${aStats.bonusDef}`);
      lines.push(`  • Dureza Máxima: ${aStats.maxResist}`);
      lines.push(`  • Slot Destino: [${aStats.slot}]`);

      // Resolver bono del conjunto (Set Bonus)
      const setId = aStats.setId || `set_${matKey}`;
      const setDef = ARMOR_SETS[setId];
      if (setDef) {
        const setName = setDef.name || matInfo?.name || setId;
        const bonusFormatted = Object.entries(setDef.bonus || {})
          .map(([stat, val]) => `+${val} ${stat.toUpperCase()}`)
          .join(", ");
        lines.push(`  • Conjunto: *Set de ${setName}*`);
        lines.push(`  • ✨ *Bono de Conjunto (3+ piezas):* ${bonusFormatted || "Activo"}`);
      }
      lines.push("");
    }

    // 3. Artefactos y Efectos Pasivos
    if (categories.includes("artifact")) {
      const artStats = getArtifactStats(itemDef);
      const buffStats = artStats.buffs || {};
      const effects = artStats.effects || [];

      lines.push("🔮 *EFECTOS DE ARTEFACTO:*");

      const buffEntries = Object.entries(buffStats);
      if (buffEntries.length > 0) {
        const formattedBuffs = buffEntries.map(([stat, val]) => `+${val} ${stat.toUpperCase()}`).join(", ");
        lines.push(`  • Bonificaciones de Atributos: ${formattedBuffs}`);
      } else {
        lines.push(`  • Místico: Potencia el flujo de Fulgor y sintonía del portador`);
      }

      if (effects.length > 0) {
        lines.push(`  • Efectos Pasivos: ${effects.join(", ")}`);
      }
      lines.push("");
    }

    // 4. Contenedores de Hechizos
    if (categories.includes("spell_container")) {
      const baseType = itemDef.modules?.spell_container?.containerType || "grimorio";
      const maxSlots = CONTAINER_CAPACITIES[baseType] || 12;
      lines.push("📖 *CONTENEDOR DE HECHIZOS:*");
      lines.push(`  • Capacidad Máxima: ${maxSlots} slots de magia`);
      lines.push("");
    }

    // 5. Focos Mágicos
    if (categories.includes("focus")) {
      const fStats = getSpellStats(itemDef);
      lines.push("🔮 *FOCO MÁGICO / CANALIZACIÓN:*");
      lines.push(`  • Potencia de Canalización: +${fStats.canalizeBase}`);
      lines.push(`  • Conducción Mágica: +${fStats.magicConduction}`);
      lines.push("");
    }

    // Detalles del material base
    if (matInfo) {
      lines.push(`🪨 *MATERIAL BASE (${matInfo.name}):*`);
      lines.push(`  • Filo / Afilabilidad: ${matInfo.baseStats?.afilabilidad || 0}`);
      lines.push(`  • Resistencia Material: ${matInfo.baseStats?.resistencia_material || 0}`);
      lines.push(`  • Conducción Mágica: ${matInfo.baseStats?.conduccion_magica || 0}`);
      lines.push("");
    }

    if (itemDef?.description) {
      lines.push(`📖 *Descripción:* _${itemDef.description}_`);
    }

    return ctx.reply(box("🔍 FICHA TÉCNICA DE ÍTEM", lines));
  },
};
