// @ts-nocheck
const { box } = require("../../../utils/boxUtils");
const {
  getDailyCatalog,
  getShopDefinition,
  getRemainingStock,
  listShops,
} = require("../../../services/rpg/shopEngineService");
const { getBalance } = require("../../../services/economyService");
const { getActiveCharacter } = require("../../../services/characterService");
const { formatStelas } = require("../../../utils/economyUtils");

module.exports = {
  name: "tienda",
  aliases: ["shop", "bazar", "mercado", "tiendas"],
  description: "Consulta los comercios activos o el catálogo de una tienda específica.",
  category: "rpg",

  /**
   * Ejecuta el comando de consulta de tienda.
   * @param {*} ctx
   */
  async execute(ctx) {
    const arg = ctx.args[0]?.toLowerCase();

    // Si el usuario pone `/tienda` o `/tiendas` o `/tienda lista`, mostramos el directorio general
    if (!arg || arg === "lista" || arg === "todas" || arg === "directorio") {
      const allShops = listShops();
      const userMoney = await getBalance(ctx.sender);
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });

      const lines = [];
      lines.push("📍 **Distrito Comercial y Puestos de Viajeros**");
      lines.push("Selecciona un comercio para ver su catálogo del día:");
      lines.push("");

      allShops.forEach((s) => {
        lines.push(`\`[${s.index}]\` **${s.name}**`);
        lines.push(`    └ 👤 *${s.npcName}* (${s.npcTitle})`);
        lines.push(`    └ 💡 Abrir: \`/tienda ${s.id.replace("bazar_", "").replace("tienda_", "")}\``);
      });

      lines.push("");
      lines.push(`💵 **Tus Fondos:** ${formatStelas(userMoney)}`);
      if (activeChar) {
        lines.push(`🎒 **Mochila:** ${activeChar.name}`);
      }
      lines.push("");
      lines.push("💡 *Ejemplo:* `/tienda magia`, `/tienda herreria` o `/tienda nixia`");

      return ctx.reply(box("🏪 COMERCIOS DISPONIBLES", lines));
    }

    const shop = getShopDefinition(arg);

    if (!shop) {
      return ctx.reply(
        "❌ Tienda no encontrada.\nUsa `/tienda` para ver todos los comercios (`nixia`, `magia`, `herreria`).",
      );
    }

    const catalog = getDailyCatalog(shop.id);
    const userMoney = await getBalance(ctx.sender);
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });

    const lines = [];
    lines.push(`🏪 **${shop.name}**`);
    lines.push(`👤 *Encargado:* ${shop.npcName}`);
    lines.push(`✨ *${shop.npcTitle}*`);
    lines.push("");
    lines.push(`💬 *"${shop.greeting}"*`);
    lines.push("");
    lines.push("📜 **Catálogo Disponible:**");

    catalog.forEach((item) => {
      const remainingStock = getRemainingStock(ctx.sender, shop.id, item.itemId, item.maxDailyStock);
      const stockText = remainingStock > 0 ? `📦 ${remainingStock} disp.` : "❌ Agotado";
      const tierText = item.metadata?.tier ? ` · T${item.metadata.tier}` : "";
      const specialBadge = item.isSpecial ? " ⭐ *[Oferta del Día]*" : "";

      // Línea 1: Identificador y nombre del ítem
      lines.push(`\`[${item.index}]\` **${item.name}**${tierText}${specialBadge}`);
      // Línea 2: Precio y stock con sangría usando el glifo oficial de stelas (✧)
      lines.push(`    └ ✧ ${item.price.toLocaleString()} stelas (${stockText})`);
    });

    lines.push("");
    lines.push(`💵 **Tus Fondos:** ${formatStelas(userMoney)}`);
    if (activeChar) {
      lines.push(`🎒 **Mochila:** ${activeChar.name}`);
    } else {
      lines.push("⚠️ *Sin personaje activo.*");
    }
    lines.push("");
    const shopSlug = shop.id.replace("bazar_", "").replace("tienda_", "");
    lines.push(`💡 \`/comprar ${shopSlug} <# o id> [cantidad]\``);
    lines.push(`🗣️ \`/hablar ${shopSlug}\` para conversar`);

    return ctx.reply(box("🛒 COMERCIO", lines));
  },
};
