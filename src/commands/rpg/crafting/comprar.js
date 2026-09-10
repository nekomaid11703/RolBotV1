// @ts-nocheck
const { box } = require("../../../utils/boxUtils");
const { executePurchase, getShopDefinition } = require("../../../services/rpg/shopEngineService");
const { formatStelas } = require("../../../utils/economyUtils");

module.exports = {
  name: "comprar",
  aliases: ["buy", "adquirir"],
  description: "Compra un artículo o material de una tienda para tu personaje activo.",
  category: "rpg",

  /**
   * Ejecuta la compra de un ítem de la tienda.
   * Sintaxis soportada:
   *  - `/comprar <item> [cantidad]` (tienda por defecto: bazar_nixia)
   *  - `/comprar <tienda> <item> [cantidad]` (ej: `/comprar herreria 1 2`)
   * @param {*} ctx
   */
  async execute(ctx) {
    if (!ctx.args || ctx.args.length === 0) {
      return ctx.reply(
        "❌ Uso incorrecto.\n" +
          "Ejemplo: `/comprar 1` o `/comprar herreria 1 2`.\n" +
          "Consulta las tiendas con `/tienda`.",
      );
    }

    let shopId = "bazar_nixia";
    let itemKey = ctx.args[0];
    let qtyIndex = 1;

    // Detectar si el primer argumento es un nombre/alias de tienda válido
    const possibleShop = getShopDefinition(ctx.args[0]);
    if (possibleShop && ctx.args.length > 1) {
      shopId = possibleShop.id;
      itemKey = ctx.args[1];
      qtyIndex = 2;
    }

    const quantity = ctx.args[qtyIndex] ? parseInt(ctx.args[qtyIndex], 10) : 1;

    if (Number.isNaN(quantity) || quantity <= 0) {
      return ctx.reply("❌ La cantidad debe ser un número entero positivo mayor a 0.");
    }

    const result = await executePurchase({
      userId: ctx.sender,
      shopId,
      itemKey,
      quantity,
    });

    if (!result.success) {
      return ctx.reply(result.error);
    }

    const shop = getShopDefinition(shopId);
    const lines = [];
    lines.push("✨ **¡Compra Exitosa!**");
    lines.push("");
    lines.push(`🏪 **Comercio:** ${shop?.name || shopId}`);
    lines.push(`📦 **Artículo:** ${result.quantity}x ${result.item.name}`);
    lines.push(`💵 **Total pagado:** ${formatStelas(result.totalCost)}`);
    lines.push(`💰 **Saldo restante:** ${formatStelas(result.newBalance)}`);
    lines.push(`🎒 **Guardado en:** ${result.characterName}`);
    lines.push("");

    if (shopId === "bazar_nixia") {
      lines.push("💬 *Nixia guarda las stelas en su mochila con una risita felina.*");
    } else if (shopId === "tienda_magia") {
      lines.push("💬 *El Maestro Elidyr anota la transacción en su libro de cuentas y asiente.*");
    } else if (shopId === "herreria") {
      lines.push("💬 *Borin hace tintinear las stelas en su delantal de cuero y vuelve al yunque.*");
    }

    return ctx.reply(box("🛒 COMPRA COMPLETADA", lines));
  },
};
