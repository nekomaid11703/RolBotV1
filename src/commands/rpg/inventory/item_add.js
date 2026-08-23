// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { addItem } = require("../../../services/rpg/inventoryService");
const { getItem, getAllItems } = require("../../../data/items");
const { MATERIALS } = require("../../../data/materialData");
const { box } = require("../../../utils/boxUtils");
const { parseQuantity } = require("../../../utils/quantityUtils");

/**
 * Busca ítems en el catálogo completo por coincidencia de id, nombre, material o categoría.
 * @param {string} query - Término de búsqueda
 * @returns {Array<object>} Ítems coincidentes
 */
function searchItems(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();

  const all = getAllItems();
  return all.filter((item) => {
    const idMatch = item.id.toLowerCase().includes(q);
    const nameMatch = (item.name || "").toLowerCase().includes(q);
    const matMatch = (item.material || "").toLowerCase().includes(q);
    const catMatch = (item.categories || []).some((c) => c.toLowerCase().includes(q)) || (item.type || "").toLowerCase().includes(q);
    const rarityMatch = (item.rarity || "").toLowerCase().includes(q);
    return idMatch || nameMatch || matMatch || catMatch || rarityMatch;
  });
}

module.exports = {
  name: "item_add",
  aliases: ["dar_item", "giveitem", "give_item", "additem"],
  description: "Agrega un ítem al inventario de tu personaje. Soporta búsqueda por nombre o material.",
  category: "rpg",
  adminPerm: "items",

  async execute(ctx) {
    // Caso 1: Sin argumentos → Mostrar ayuda y lista de materiales/categorías
    if (ctx.args.length === 0) {
      const matList = Object.values(MATERIALS)
        .filter((m) => m.id !== "etereo")
        .map((m) => `\`${m.id}\``)
        .join(", ");

      return ctx.reply(
        box("📦 AGREGAR ÍTEM", [
          "",
          "📌 *Formas de Uso:*",
          "  • `/item_add <id_exacto> [cantidad]` — Otorga un ítem directo",
          "  • `/item_add <búsqueda>` — Busca por nombre o material (ej: `/item_add mitril`)",
          "  • `/item_add buscar <término>` — Muestra lista de coincidencias",
          "",
          "🏷️ *Categorías:* `weapon`, `armor`, `artifact`, `consumable`, `spell_container`",
          "",
          "🔨 *Materiales disponibles:*",
          `  ${matList}`,
          "",
          "💡 *Ejemplo:* `/item_add espada_de_mitril 1` | `/item_add pocion 5`",
        ]),
      );
    }

    // Determinar si el primer argumento es "buscar"
    let isSearchCommand = false;
    let queryArg = ctx.args[0];
    let qtyArg = ctx.args[1];

    if (queryArg.toLowerCase() === "buscar" && ctx.args.length > 1) {
      isSearchCommand = true;
      queryArg = ctx.args[1];
      qtyArg = ctx.args[2];
    }

    const queryInput = queryArg.toLowerCase().trim();
    const quantity = parseQuantity(qtyArg);

    // Intentar primero coincidencia exacta de ID
    let exactItem = getItem(queryInput);

    if (exactItem && !isSearchCommand) {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj`.");
      }

      const result = await addItem(activeChar.id, activeChar.creator_id, exactItem.id, quantity);
      const lines = [
        "",
        `👤 Personaje: *${activeChar.name}*`,
        `📦 Ítem añadido: *${exactItem.name}* (\`${exactItem.id}\`)`,
        `🔢 Cantidad añadida: +${quantity}`,
        `📊 Total en inventario: ${result.total}`,
      ];
      return ctx.reply(box("✅ ÍTEM AGREGADO", lines));
    }

    // Si no es un ID exacto o el usuario pidió "buscar", realizar búsqueda parcial
    const matches = searchItems(queryInput);

    if (matches.length === 0) {
      return ctx.reply(
        `❌ No se encontraron ítems que coincidan con "${queryInput}".\n\nPrueba buscar por material (ej: \`/item_add mitril\`) o tipo (ej: \`/item_add armor\`).`,
      );
    }

    // Si la búsqueda arrojó exactamente 1 resultado y NO es comando explícito "buscar"
    if (matches.length === 1 && !isSearchCommand) {
      const target = matches[0];
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj`.");
      }

      const result = await addItem(activeChar.id, activeChar.creator_id, target.id, quantity);
      const lines = [
        "",
        `👤 Personaje: *${activeChar.name}*`,
        `📦 Ítem añadido: *${target.name}* (\`${target.id}\`)`,
        `🔢 Cantidad añadida: +${quantity}`,
        `📊 Total en inventario: ${result.total}`,
      ];
      return ctx.reply(box("✅ ÍTEM AGREGADO", lines));
    }

    // Si arrojó múltiples resultados o se solicitó "buscar": mostrar lista estructurada
    const maxResults = 25;
    const displayed = matches.slice(0, maxResults);
    const overflow = matches.length - displayed.length;

    const resultLines = [
      "",
      `🔍 Coincidencias para "${queryInput}" (Total: ${matches.length}):`,
      "",
    ];

    for (const item of displayed) {
      const typeLabel = item.type || (item.categories ? item.categories[0] : "item");
      const matLabel = item.material ? ` | ${item.material}` : "";
      resultLines.push(`  • \`${item.id}\` — *${item.name}* (${typeLabel}${matLabel})`);
    }

    if (overflow > 0) {
      resultLines.push("");
      resultLines.push(`  _...y ${overflow} más. Sé más específico en tu búsqueda._`);
    }

    resultLines.push("");
    resultLines.push("💡 *Para agregar:* `/item_add <id_exacto> [cantidad]`");

    return ctx.reply(box("🔎 BÚSQUEDA DE ÍTEMS", resultLines));
  },
};
