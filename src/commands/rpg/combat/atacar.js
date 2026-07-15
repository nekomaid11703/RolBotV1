// @ts-nocheck
/**
 * atacar.js — Comando de ataque táctico D20
 *
 * Inicia un combate PvE/PvP o ejecuta un ataque durante un combate activo.
 * Aliases: .a, /attack, /pelear
 *
 * Flujo:
 * 1. Si no hay combate → Inicia uno (PvE con enemigo, PvP con @mención)
 * 2. Si hay combate → Valida turno, resuelve ataque D20, resuelve NPCs, responde
 */

const { getActiveCharacter } = require("../../../services/characterService");
const stateManager = require("../../../services/rpg/combatStateManager");
const turnManager = require("../../../services/rpg/combatTurnManager");
const combatEngine = require("../../../services/rpg/combatEngine");
const { getAllEnemies } = require("../../../services/rpg/enemies");
const { formatError } = require("../../../utils/messageFormatUtils");
const { logError } = require("../../../services/loggerService");
const { RPG_CONFIG } = require("../../../config/rpg.config");

module.exports = {
  name: "atacar",
  aliases: ["attack", "pelear", "a"],
  description: "Ataca en combate o inicia uno. Usa: .a | /atacar <enemigo> | /atacar @usuario",
  category: "rpg",

  async execute(ctx) {
    const groupId = ctx.from;
    const raw = ctx.args.join(" ").trim();

    try {
      const room = stateManager.getRoomByGroup(groupId);

      // ── Si hay combate activo: Ejecutar ataque D20 ──────────────
      if (room && room.status === "active") {
        return await executeAttackInCombat(ctx, room);
      }

      // ── Si no hay combate: Iniciar uno ──────────────────────────
      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno."));
      }

      // PvP: mención a otro jugador
      const mentions = ctx.mentions || [];
      if (mentions.length > 0) {
        return await startPvPCombat(ctx, character, mentions[0], raw);
      }

      // PvE: seleccionar enemigo
      if (!raw) {
        return showEnemyList(ctx);
      }

      return await startPvECombat(ctx, character, raw);
    } catch (error) {
      logError({ source: "atacar", error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════
//  EJECUTAR ATAQUE EN COMBATE ACTIVO
// ═══════════════════════════════════════════════════════════════════════

async function executeAttackInCombat(ctx, room) {
  const validation = turnManager.validateTurn(room, ctx.sender);
  if (!validation.valid) {
    if (validation.autoSkip) {
      turnManager.advanceTurn(room);
      await stateManager.updateRoom(room.id, {});
    }
    return ctx.reply(validation.message);
  }

  const attacker = validation.participant;

  // Seleccionar objetivo: primer enemigo vivo (o primer jugador rival en PvP)
  const targetTeam =
    room.startedVia === "pvp"
      ? room.participants.filter((p) => !p.ko && p.id !== ctx.sender)
      : room.participants.filter((p) => !p.ko && p.team === "enemies");

  if (targetTeam.length === 0) {
    return ctx.reply("❌ No hay objetivos vivos.");
  }
  const target = targetTeam[0];

  // Resolver ataque D20
  const result = combatEngine.resolveAttack(attacker, target);

  // Reacción WhatsApp
  const reaction = result.isCrit
    ? RPG_CONFIG.reactions.critSuccess
    : result.isPifia
      ? RPG_CONFIG.reactions.critFail
      : RPG_CONFIG.reactions.attack;
  await ctx.react(reaction);

  // Reset skips consecutivos
  attacker.consecutiveSkips = 0;

  // Verificar victoria post-ataque
  const victory = turnManager.checkVictoryConditions(room);
  if (victory.finished) {
    room.status = "finished";
    await stateManager.updateRoom(room.id, {});
    const rewardMsg = await handleRewards(room, victory);
    return ctx.reply(`${result.details}\n\n${victory.message}${rewardMsg}`, { mentions: [] });
  }

  // Avanzar turno del jugador
  turnManager.advanceTurn(room);

  // Resolver turnos de NPCs consecutivos
  const enemyResults = turnManager.resolveConsecutiveEnemyTurns(room);

  // Construir respuesta agrupada
  const response = turnManager.buildTurnResponse(room, result.details, enemyResults);

  await stateManager.updateRoom(room.id, {});
  return ctx.reply(response.text, { mentions: response.mentions });
}

// ═══════════════════════════════════════════════════════════════════════
//  INICIAR COMBATES
// ═══════════════════════════════════════════════════════════════════════

async function startPvPCombat(ctx, character, targetJid, raw) {
  const targetName = raw.replace(/@\S+/g, "").trim() || targetJid.split("@")[0];

  const targetChar = await getActiveCharacter({ creatorId: targetJid });
  const targetData = targetChar || { stats: RPG_CONFIG.defaultStats, name: targetName };

  const newRoom = stateManager.createRoom(
    ctx.from,
    [
      stateManager.makeParticipant(ctx.sender, character.name, "players", character, "challenger"),
      stateManager.makeParticipant(targetJid, targetData.name, "players", targetData, "target"),
    ],
    { startedVia: "pvp", challengerId: ctx.sender, targetId: targetJid },
  );

  await stateManager.updateRoom(newRoom.id, {});
  await ctx.react(RPG_CONFIG.reactions.attack);

  const status = turnManager.formatStatus(newRoom);
  const mention = turnManager.formatNextTurnMention(newRoom);

  return ctx.reply(`⚔️ *¡Duelo PvP iniciado!*\n\n${status}${mention.text}`, {
    mentions: [targetJid, ...mention.mentions],
  });
}

async function startPvECombat(ctx, character, raw) {
  const targetEnemy = raw
    .toLowerCase()
    .replace(/[0-9]+$/, "")
    .trim();
  const quantityMatch = raw.match(/(\d+)\s*$/);
  const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;

  const enemyData = getAllEnemies().find((e) => e.id === targetEnemy);
  if (!enemyData) {
    return ctx.reply(formatError("Enemigo no encontrado.", "Usa /atacar para ver la lista."));
  }

  const newRoom = await stateManager.createCombatRoom(
    ctx.from,
    ctx.sender,
    character,
    [enemyData.id],
    Math.min(quantity, 8),
  );

  await ctx.react(RPG_CONFIG.reactions.attack);

  const status = turnManager.formatStatus(newRoom);
  const mention = turnManager.formatNextTurnMention(newRoom);

  return ctx.reply(`${status}${mention.text}`, { mentions: mention.mentions });
}

function showEnemyList(ctx) {
  const available = getAllEnemies()
    .map((e) => `• *${e.name}* (nvl ${e.level}) — ${e.description}`)
    .join("\n");

  return ctx.reply(
    [
      "✦ ━━━━━━━━━━━━━━ ✦",
      "⚔️ *SELECCIONA UN ENEMIGO*",
      "✦ ━━━━━━━━━━━━━━ ✦",
      "",
      "Usa: `.a <enemigo>` o `.a @usuario` para PvP",
      "",
      available,
      "",
      "✦ ━━━━━━━━━━━━━━ ✦",
    ].join("\n"),
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  RECOMPENSAS POST-VICTORIA
// ═══════════════════════════════════════════════════════════════════════

async function handleRewards(room, victory) {
  if (victory.winner !== "players") return "";

  try {
    const { addMoney } = require("../../../services/economyService");
    const { updateCharacterStats } = require("../../../services/characterService");
    const enemiesLib = require("../../../services/rpg/enemies");

    const reward = combatEngine.generateReward(room);
    const enemyIds = room.participants
      .filter((p) => p.team === "enemies")
      .map((p) => p.id.replace(/^enemy:/, "").replace(/_\d+$/, ""));
    const loot = enemiesLib.generateLootForEnemies(enemyIds);

    const alivePlayers = turnManager.getAliveParticipants(room, "players");
    for (const p of alivePlayers) {
      try {
        await addMoney(p.id, reward.stelas, {
          userName: p.name,
          registration: { source: "combat", scope: "self", createdBy: p.id },
        });
      } catch {}
      try {
        await updateCharacterStats({ creatorId: p.id, characterName: p.name, patch: { exp: reward.xp } });
      } catch {}
    }

    let rewardMsg = `\n\n💰 *${reward.stelas}* estelas | ✨ *${reward.xp}* XP`;
    if (loot.length > 0) {
      const itemsData = require("../../../services/rpg/items");
      rewardMsg += `\n🎒 Botín: ${loot.map((l) => `${l.quantity}x ${itemsData.getItem(l.itemId)?.name || l.itemId}`).join(", ")}`;
    }
    return rewardMsg;
  } catch {
    return "";
  }
}
