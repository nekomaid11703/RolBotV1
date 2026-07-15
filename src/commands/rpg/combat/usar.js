// @ts-nocheck
/**
 * usar.js — Comando de uso de ítems en combate D20
 *
 * Aliases: .u, /use, /consumir
 * Permite usar un consumible del inventario tanto fuera como dentro de combate.
 * En combate: resuelve con D20 (crit duplica efecto, pifia desperdicia).
 */

const { getActiveCharacter, updateCharacterStats } = require("../../../services/characterService");
const invService = require("../../../services/rpg/inventoryService");
const itemsData = require("../../../services/rpg/items");
const turnManager = require("../../../services/rpg/combatTurnManager");
const stateManager = require("../../../services/rpg/combatStateManager");
const combatEngine = require("../../../services/rpg/combatEngine");
const { formatError, box } = require("../../../utils/messageFormatUtils");
const { logError } = require("../../../services/loggerService");
const { RPG_CONFIG } = require("../../../config/rpg.config");

module.exports = {
  name: "usar",
  aliases: ["use", "consumir", "drink", "eat", "u"],
  description: "Usa un item consumible. Usa: .u <item>",
  category: "rpg",

  async execute(ctx) {
    try {
      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno."));
      }

      const raw = ctx.args.join(" ").trim().toLowerCase();
      if (!raw) {
        const consumibles = itemsData.ITEMS.filter((i) => i.type === "consumible");
        const list = consumibles.map((i) => `• ${i.name} — ${i.desc}`).join("\n");
        return ctx.reply(box("❓ ¿Qué item usar?", ["", ...list.split("\n")]));
      }

      const item = itemsData.findItemByName(raw);
      if (!item) return ctx.reply(`❌ No se encontró el item "${raw}".`);
      if (item.type !== "consumible") return ctx.reply(`❌ "${item.name}" no es un item consumible.`);

      const inv = await invService.getInventory(ctx.sender);
      const stack = inv.items.find((i) => i.itemId === item.id);
      if (!stack || stack.quantity < 1) return ctx.reply(`❌ No tienes "${item.name}".`);

      // ── En combate: resolver con D20 ────────────────────────────
      const room = stateManager.getRoomByGroup(ctx.from);
      const inCombat = room && room.status === "active" && turnManager.getParticipantByJid(room, ctx.sender);

      if (inCombat) {
        return await useItemInCombat(ctx, room, item);
      }

      // ── Fuera de combate: efecto directo ────────────────────────
      return await useItemOutsideCombat(ctx, character, item);
    } catch (error) {
      logError({ source: "usar", error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};

async function useItemInCombat(ctx, room, item) {
  const validation = turnManager.validateTurn(room, ctx.sender);
  if (!validation.valid) {
    if (validation.autoSkip) {
      turnManager.advanceTurn(room);
      await stateManager.updateRoom(room.id, {});
    }
    return ctx.reply(validation.message);
  }

  const participant = validation.participant;

  // Resolver uso con D20
  const result = combatEngine.resolveUseItem(participant, item);

  // Consumir el ítem si fue usado
  if (result.consumed) {
    await invService.removeItem(ctx.sender, item.id, 1);
  }

  // Reacción WhatsApp
  const reaction = result.isCrit
    ? RPG_CONFIG.reactions.critSuccess
    : result.isPifia
      ? RPG_CONFIG.reactions.critFail
      : RPG_CONFIG.reactions.use;
  await ctx.react(reaction);

  // Reset skips consecutivos
  participant.consecutiveSkips = 0;

  // Avanzar turno
  turnManager.advanceTurn(room);

  // Resolver turnos NPC
  const enemyResults = turnManager.resolveConsecutiveEnemyTurns(room);

  // Respuesta agrupada
  const response = turnManager.buildTurnResponse(room, result.details, enemyResults);

  await stateManager.updateRoom(room.id, {});
  return ctx.reply(response.text, { mentions: response.mentions });
}

async function useItemOutsideCombat(ctx, character, item) {
  if (item.efecto === "cura" && item.potencia) {
    const currentHp = character.stats?.vida || 100;
    const newHp = Math.min(currentHp + item.potencia, character.maxVida || 200);
    await invService.removeItem(ctx.sender, item.id, 1);
    const patch = {};
    if (character.stats) {
      patch.stats = { ...character.stats, vida: newHp };
    } else {
      patch.vida = newHp;
    }
    await updateCharacterStats({
      creatorId: ctx.sender,
      characterName: character.slug || character.name,
      patch,
    });
    await ctx.react("💚");
    return ctx.reply(box("💚 Item usado", ["", `${item.name}`, "", `Vida: ${currentHp} → ${newHp}`]));
  }

  return ctx.reply(`❌ No se puede usar "${item.name}" fuera de combate.`);
}
