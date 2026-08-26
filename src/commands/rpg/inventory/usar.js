const characterService = require("../../../services/characterService");
const { useItem, getInventoryList } = require("../../../services/rpg/inventoryService");
const { findSessionByCharacter, advanceTurn } = require("../../../services/rpg/combatState");
const { formatActionMenu, buildSituationalCtx } = require("../../../services/rpg/combatMessages");
const { runDummyTurn } = require("../../../services/rpg/dummyTurnService");
const { box } = require("../../../utils/boxUtils");

async function showInventoryList(ctx) {
  const character = await characterService.getActiveCharacter({ creatorId: ctx.sender });
  if (!character) {
    return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
  }

  const inv = await getInventoryList(character.id);
  const lines = [];
  lines.push("");
  lines.push("Uso: `/usar <nº_ítem | nombre>`");
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
  lines.push("Número de tu listado de /inventario o nombre del ítem.");

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
  if (String(session.challenger.characterId) === String(characterId)) {
    session.challenger.hp = hpAfter;
  } else {
    session.defender.hp = hpAfter;
  }
}

module.exports = {
  name: "usar",
  aliases: ["use", "consumir", "tomar"],
  description: "Usa un ítem consumible de tu inventario activo (vendas, pociones, etc.).",
  category: "rpg",

  async execute(ctx) {
    if (ctx.args.length === 0) {
      return showInventoryList(ctx);
    }

    const character = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!character) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const session = findSessionByCharacter(character.id);
    if (session) {
      if (session.status === "waiting_reaction") {
        return ctx.reply("❌ Hay una reacción pendiente. Usa `/esquivar` o `/bloquear` primero.");
      }
      if (String(session.currentTurnCharId) !== String(character.id)) {
        return ctx.reply("❌ No es tu turno.");
      }
    }

    const resolved = await resolveUseTarget(ctx.args[0], character);
    if (resolved.error) return ctx.reply(resolved.error);

    let result;
    try {
      result = await useItem(ctx.sender, resolved.itemId);
    } catch (err) {
      return ctx.reply(`❌ ${err.message || String(err)}`);
    }

    const lines = [];
    lines.push("");
    lines.push(`📦 *${result.itemName}* usado`);
    lines.push(`❤️ HP: ${result.hpBefore} → ${result.hpAfter}`);

    // Si no está en combate: responder directamente
    if (!session) {
      return ctx.reply(box("✅ ITEM USADO", lines));
    }

    // Si está en combate: actualizar HP del slot y avanzar turno
    updateSessionHp(session, result.characterId, result.hpAfter);
    const isChallenger = String(session.challenger.characterId) === String(character.id);

    await advanceTurn(session.id, session.challenger.hp, session.defender.hp, session.isPvE);

    if (session.isPvE) {
      return runDummyTurn(ctx, session, isChallenger, lines);
    }

    // PvP: mostrar menú del siguiente turno con contexto
    const nextIsChallenger = String(session.currentTurnCharId) === String(session.challenger.characterId);
    const nextSlot = nextIsChallenger ? session.challenger : session.defender;
    const nextOpp = nextIsChallenger ? session.defender : session.challenger;
    const situCtx = buildSituationalCtx(nextSlot, nextOpp, session.distance);

    lines.push("");
    lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
    lines.push(formatActionMenu(nextSlot.character.name, session, situCtx));

    return ctx.reply(box("🧪 CONSUMIBLE", lines));
  },
};

