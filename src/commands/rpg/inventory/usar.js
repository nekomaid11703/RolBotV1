// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { useItem, getInventoryList } = require("../../../services/rpg/inventoryService");
const { findSessionByCharacter } = require("../../../services/rpg/combatState");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");

async function showInventoryList(ctx) {
  const character = await getActiveCharacter({ creatorId: ctx.sender });
  if (!character) {
    return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
  }

  const inv = await getInventoryList(character.id);
  const lines = [];
  lines.push("");
  lines.push("Uso: `/usar <nº_ítem>`");
  lines.push("");

  if (inv.length === 0) {
    lines.push("📭 No tienes ítems consumibles en tu inventario.");
  } else {
    lines.push("📋 Tus ítems disponibles:");
    for (const entry of inv) {
      lines.push(`   · ${entry.index}. ${entry.name} (${entry.itemId}) x${entry.quantity}`);
    }
  }

  lines.push("");
  lines.push("Número de tu listado de /inventario. Solo funcionan ítems consumibles.");

  return ctx.reply(box("📦 Usar ítem", lines));
}

/**
 * Resuelve el itemId a partir del argumento del usuario (número o id directo).
 * @param {string} arg - Input del usuario
 * @param {object} character - Personaje activo
 * @returns {Promise<{itemId: string}|{error: string}>}
 */
async function resolveUseTarget(arg, character) {
  if (arg && /^\d+$/.test(arg)) {
    const list = await getInventoryList(character.id);
    const entry = list.find((e) => e.index === Number(arg));
    if (!entry) {
      return { error: `❌ No existe ningún ítem en la posición ${arg}. Usa /inventario para ver tu listado.` };
    }
    return { itemId: entry.itemId };
  }
  return { itemId: String(arg || "").toLowerCase() };
}

function updateSessionHp(session, characterId, hpAfter) {
  if (session.challenger.characterId === characterId) {
    session.challenger.hp = hpAfter;
  } else {
    session.defender.hp = hpAfter;
  }
}

module.exports = {
  name: "usar",
  aliases: ["use", "consumir"],
  description: "Usa un ítem consumible de tu inventario activo.",
  category: "rpg",

  async execute(ctx) {
    if (ctx.args.length === 0) {
      return showInventoryList(ctx);
    }

    const character = await getActiveCharacter({ creatorId: ctx.sender });
    if (!character) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const resolved = await resolveUseTarget(ctx.args[0], character);
    if (resolved.error) return ctx.reply(resolved.error);

    try {
      const result = await useItem(ctx.sender, resolved.itemId);

      const session = findSessionByCharacter(result.characterId);
      if (session) {
        updateSessionHp(session, result.characterId, result.hpAfter);
      }

      const lines = [];
      lines.push("");
      lines.push(`📦  ${result.itemName} usado`);
      lines.push(`❤️  HP: ${result.hpBefore} → ${result.hpAfter}`);

      return ctx.reply(box("✅ ITEM USADO", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
