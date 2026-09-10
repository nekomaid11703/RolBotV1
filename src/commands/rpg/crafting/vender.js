// @ts-nocheck
const { box } = require("../../../utils/boxUtils");
const { executeSale } = require("../../../services/rpg/shopEngineService");
const { getActiveCharacter } = require("../../../services/characterService");
const inventoryService = require("../../../services/rpg/inventoryService");
const { getItem } = require("../../../data/items");
const pricingService = require("../../../services/rpg/pricingService");
const { formatStelas } = require("../../../utils/economyUtils");
const { SELL_RATIO } = require("../../../config/economyConfig");

module.exports = {
  name: "vender",
  aliases: ["sell", "vende"],
  description: "Vende materiales o ítems de tu inventario por stelas (60% de su precio de compra).",
  category: "rpg",

  async execute(ctx) {
    // Sin argumentos: mostrar lista de vendibles con su precio.
    if (!ctx.args || ctx.args.length === 0) {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj`.");
      }
      const list = await inventoryService.getInventoryList(activeChar.id);
      if (!list || list.length === 0) {
        return ctx.reply("🎒 Tu inventario está vacío.");
      }
      const lines = [`💱 *VENTA* — ${activeChar.name}`, ""];
      list.slice(0, 20).forEach((entry, index) => {
        const def = getItem(entry.itemId);
        const tier = entry.metadata?.tier || "E";
        const buyPrice = pricingService.itemBasePrice(entry.itemId, tier) ?? def?.basePrice ?? 0;
        const unit = buyPrice > 0 ? Math.max(1, Math.round(buyPrice * SELL_RATIO)) : null;
        const priceText = unit ? `✧ ${unit.toLocaleString()}/u` : "no vendible";
        lines.push(`  ${index + 1}. \`${entry.itemId}\` x${entry.quantity} — ${priceText}`);
      });
      if (list.length > 20) lines.push(`  _...y ${list.length - 20} más._`);
      lines.push("");
      lines.push("💡 *Uso:* `/vender <nº|itemId> [cantidad]`");
      return ctx.reply(box("💱 VENDER ÍTEMS", lines));
    }

    const itemKey = ctx.args[0];
    const quantity = ctx.args[1] ? parseInt(ctx.args[1], 10) : 1;
    if (Number.isNaN(quantity) || quantity <= 0) {
      return ctx.reply("❌ La cantidad debe ser un número entero positivo.");
    }

    const result = await executeSale({ userId: ctx.sender, itemKey, quantity });
    if (!result.success) {
      return ctx.reply(result.error);
    }

    return ctx.reply(
      box("💱 VENTA COMPLETADA", [
        `📦 Vendido: ${result.quantity}x ${result.item.name}`,
        `💵 Precio unitario: ${formatStelas(result.unitPrice)}`,
        `💰 Total recibido: ${formatStelas(result.totalGained)}`,
        `🏦 Saldo restante: ${formatStelas(result.newBalance)}`,
      ]),
    );
  },
};
