// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { unequipItem, unequipAllItems, normalizeSlot, EQUIPMENT_SLOTS } = require("../../../services/rpg/equipmentService");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");
const { box } = require("../../../utils/boxUtils");
const { getItem } = require("../../../data/items");

const SLOTS_LIST = Object.keys(EQUIPMENT_SLOTS).join(", ");

const usageMessage = formatCommandUsage({
  icon: "🗑️",
  title: "Desequipar",
  description: "Desequipa uno, varios o todos los ítems equipados y los devuelve a tu inventario.",
  usage: "/desequipar <slot1|todo|all> [slot2...]",
  example: "/desequipar todo | /desequipar casco pechera",
  notes: [
    `Slots disponibles: ${SLOTS_LIST}`,
    "Usa `/desequipar todo` para vaciar todo el equipamiento de un solo golpe.",
  ],
});

module.exports = {
  name: "desequipar",
  aliases: ["des_equipar", "unequip", "remove_gear"],
  description: "Desequipa ítems de equipamiento uno a uno o en lote.",
  category: "rpg",

  async execute(ctx) {
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    if (ctx.args.length === 0) {
      return ctx.reply(usageMessage);
    }

    const firstArg = ctx.args[0].toLowerCase();

    // ── Modo Masivo: /desequipar todo | /unequip all ────────────────────────
    if (firstArg === "todo" || firstArg === "all") {
      const res = await unequipAllItems({
        characterId: activeChar.id,
        creatorId: ctx.sender,
      });

      if (res.totalUnequipped === 0) {
        return ctx.reply("ℹ️ Tu personaje no tenía ningún ítem equipado.");
      }

      const itemLines = res.unequippedList.map((entry) => {
        const def = getItem(entry.itemId);
        const name = def?.name || entry.itemId;
        return `  • [${entry.slot}] → *${name}*`;
      });

      const lines = [
        `✅ *${activeChar.name}* desequipó todo su equipamiento:`,
        "",
        ...itemLines,
        "",
        `📦 Los ${res.totalUnequipped} ítems se devolvieron a tu inventario.`,
      ];

      return ctx.reply(box("🗑️ UNEQUIP ALL", lines));
    }

    // ── Modo Múltiple / Individual: /desequipar casco pechera botas ──────────
    const rawSlots = ctx.args.flatMap((arg) => arg.split(",")).filter(Boolean);
    const unequippedResults = [];
    const errors = [];

    for (const raw of rawSlots) {
      const slot = normalizeSlot(raw);
      try {
        const result = await unequipItem({
          characterId: activeChar.id,
          creatorId: ctx.sender,
          slot,
        });
        const def = getItem(result.unequipped);
        const name = def?.name || result.unequipped;
        unequippedResults.push(`  • [${result.slot}] → *${name}*`);
      } catch (err) {
        errors.push(`  • [${raw}]: ${err.message}`);
      }
    }

    const lines = [`👤 *Personaje:* ${activeChar.name}`, ""];

    if (unequippedResults.length > 0) {
      lines.push("✅ *Desequipados:*");
      lines.push(...unequippedResults);
      lines.push("");
    }

    if (errors.length > 0) {
      lines.push("⚠️ *No se pudieron desequipar:*");
      lines.push(...errors);
    }

    return ctx.reply(box("🗑️ UNEQUIP", lines));
  },
};
