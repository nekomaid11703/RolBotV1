// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { removeItem, clearInventory, getInventoryList } = require("../../../services/rpg/inventoryService");
const { getItem, ITEMS } = require("../../../data/items");
const { box } = require("../../../utils/boxUtils");
const { parseQuantity } = require("../../../utils/quantityUtils");

module.exports = {
  name: "item_rem",
  aliases: ["quitar_item", "removeitem", "remove_item", "tirar", "descartar"],
  description: "Quita uno, varios o todos los ítems del inventario de tu personaje.",
  category: "rpg",
  adminPerm: "items",

  async execute(ctx) {
    if (ctx.args.length === 0) {
      return ctx.reply(
        box("📦 Quitar / Vaciar Ítems", [
          "💡 *Uso del Comando:*",
          "  • `/item_rem todo` | `/item_rem all` — Vacía todo tu inventario",
          "  • `/item_rem <pos1> [pos2]...` — Elimina los ítems en esas posiciones de tu inventario",
          "  • `/item_rem <id_item> [cantidad]` — Elimina una cantidad específica",
          "",
          "📌 *Ejemplos:*",
          "  • `/item_rem todo`",
          "  • `/item_rem 1 2 5`",
          "  • `/item_rem pocion 2`",
        ]),
      );
    }

    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj`.");
    }

    const firstArg = ctx.args[0].toLowerCase();

    // ── Modo Vaciar Todo: /item_rem todo | /item_rem all ─────────────────────
    if (firstArg === "todo" || firstArg === "all") {
      const res = await clearInventory(activeChar.id, activeChar.creator_id);
      if (res.deletedCount === 0) {
        return ctx.reply("ℹ️ Tu inventario ya estaba completamente vacío.");
      }
      const lines = [
        `🗑️ *Inventario de ${activeChar.name} vaciado!*`,
        `📉 Se eliminaron ${res.deletedCount} unidad(es) de ítems en total.`,
      ];
      return ctx.reply(box("📦 INVENTARIO VACÍO", lines));
    }

    const inventoryList = await getInventoryList(activeChar.id);
    const removedSuccess = [];
    const removedErrors = [];

    // Si los argumentos parecen una lista de números (posiciones en inventario: /item_rem 1 2 5)
    const isNumberList = ctx.args.every((arg) => /^\d+$/.test(arg.replace(/,/g, "")));

    if (isNumberList) {
      const positions = ctx.args.flatMap((arg) => arg.split(",")).map(Number).filter(Boolean);

      for (const pos of positions) {
        const entry = inventoryList.find((e) => e.index === pos);
        if (!entry) {
          removedErrors.push(`  • Posición ${pos}: No encontrada`);
          continue;
        }

        try {
          await removeItem(activeChar.id, activeChar.creator_id, entry.itemId, entry.quantity);
          removedSuccess.push(`  • *${entry.name}* (x${entry.quantity})`);
        } catch (err) {
          removedErrors.push(`  • *${entry.name}*: ${err.message}`);
        }
      }
    } else {
      // Formato tradicional por ID: /item_rem pocion 2
      const itemIdInput = firstArg;
      const quantity = parseQuantity(ctx.args[1]);
      const item = getItem(itemIdInput);

      if (!item) {
        return ctx.reply(`❌ No existe ningún ítem con ID \`${itemIdInput}\`.`);
      }

      try {
        const result = await removeItem(activeChar.id, activeChar.creator_id, item.id, quantity);
        removedSuccess.push(`  • *${item.name}* (-${quantity}, restante: ${result.remaining})`);
      } catch (err) {
        removedErrors.push(`  • *${item.name}*: ${err.message}`);
      }
    }

    const lines = [`👤 *Personaje:* ${activeChar.name}`, ""];

    if (removedSuccess.length > 0) {
      lines.push("✅ *Ítems Eliminados:*");
      lines.push(...removedSuccess);
      lines.push("");
    }

    if (removedErrors.length > 0) {
      lines.push("⚠️ *No se pudieron eliminar:*");
      lines.push(...removedErrors);
    }

    return ctx.reply(box("📦 QUITAR ÍTEMS", lines));
  },
};
