// @ts-nocheck
/**
 * combatTurnManager.js — Gestión de Turnos y Formato de Mensajes
 *
 * Maneja el flujo de turnos, resolución de NPCs, formato de barras HP,
 * menciones @JID para WhatsApp, y condiciones de victoria.
 *
 * Diseñado para agrupar toda la respuesta de una ronda en un solo
 * mensaje de WhatsApp, mencionando al siguiente jugador activo.
 */

const { RPG_CONFIG } = require("../../config/rpg.config");
const combatEngine = require("./combatEngine");

const CR = RPG_CONFIG.combatRoom;

// ═══════════════════════════════════════════════════════════════════════
//  NAVEGACIÓN DE TURNOS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Encuentra el siguiente índice de turno con un participante vivo.
 * @param {object} room
 * @param {number} fromIndex
 * @returns {number} Índice del siguiente vivo, o -1 si no hay
 */
function getNextAliveIndex(room, fromIndex) {
  const total = room.turnQueue.length;
  for (let i = 0; i < total; i++) {
    const idx = (fromIndex + i) % total;
    const entry = room.turnQueue[idx];
    const p = room.participants.find((pp) => pp.id === entry.participantId);
    if (p && !p.ko) return idx;
  }
  return -1;
}

/**
 * Obtiene el participante del turno actual.
 */
function getCurrentParticipant(room) {
  const entry = room.turnQueue[room.currentTurnIndex];
  if (!entry) return null;
  return room.participants.find((p) => p.id === entry.participantId) || null;
}

/**
 * Valida si un JID puede actuar en el turno actual.
 * @returns {{ valid: boolean, reason: string, message: string, participant?: object }}
 */
function validateTurn(room, jid) {
  if (room.status !== "active") {
    return { valid: false, reason: "finished", message: "🏁 Este combate ya terminó." };
  }

  const participant = room.participants.find((p) => p.id === jid);
  if (!participant) {
    return { valid: false, reason: "not_participant", message: "❌ No formas parte de este combate." };
  }

  if (participant.ko) {
    return { valid: false, reason: "ko", message: "💀 Estás K.O. No puedes actuar." };
  }

  if (participant.stunned) {
    participant.stunned = false;
    return {
      valid: false,
      reason: "stunned",
      message: `⛔ @${participant.name} está aturdido. Turno saltado.`,
      autoSkip: true,
    };
  }

  const current = getCurrentParticipant(room);
  if (!current) {
    return { valid: false, reason: "no_turn", message: "❌ No hay turno activo." };
  }

  if (current.id !== jid) {
    return { valid: false, reason: "wrong_turn", message: `⛔ No es tu turno. Le toca a *${current.name}*.` };
  }

  return { valid: true, reason: "ok", message: "", participant, current };
}

/**
 * Avanza al siguiente turno vivo.
 * @returns {boolean} true si el combate continúa, false si terminó.
 */
function advanceTurn(room) {
  room.turnCount++;

  const nextIdx = getNextAliveIndex(room, room.currentTurnIndex + 1);
  if (nextIdx === -1) {
    room.currentTurnIndex = 0;
    room.status = "finished";
    return false;
  }

  if (nextIdx <= room.currentTurnIndex) {
    room.round++;
    // Tick de efectos activos al inicio de nueva ronda
    for (const p of room.participants) {
      combatEngine.tickEffects(p);
    }
  }

  room.currentTurnIndex = nextIdx;
  room.lastActionAt = Date.now();

  const nextEntry = room.turnQueue[nextIdx];
  if (nextEntry) {
    const nextP = room.participants.find((p) => p.id === nextEntry.participantId);
    if (nextP) nextP.lastActionAt = Date.now();
  }

  return true;
}

/**
 * Procesa los turnos de todos los enemigos (NPCs) consecutivos
 * después del turno de un jugador. Agrupa los resultados en un array.
 *
 * @param {object} room
 * @returns {object[]} Array de resultados de turnos NPC
 */
function resolveConsecutiveEnemyTurns(room) {
  const enemyResults = [];

  while (true) {
    const current = getCurrentParticipant(room);
    if (!current) break;

    // Si es un jugador, detenerse (le toca actuar)
    if (current.team !== "enemies") break;

    // Si está KO, avanzar
    if (current.ko) {
      const alive = advanceTurn(room);
      if (!alive) break;
      continue;
    }

    // Si está stunned, saltar
    if (current.stunned) {
      current.stunned = false;
      enemyResults.push({
        enemy: current,
        action: "stunned",
        result: null,
        details: `⏭️ *${current.name}* está aturdido y pierde el turno.`,
      });
      const alive = advanceTurn(room);
      if (!alive) break;
      continue;
    }

    // Resolver turno del enemigo
    const alivePlayers = room.participants.filter((p) => p.team === "players" && !p.ko);
    if (alivePlayers.length === 0) break;

    const turnResult = combatEngine.resolveEnemyTurn(room, current, alivePlayers);
    if (turnResult) {
      enemyResults.push(turnResult);
    }

    // Verificar victoria
    const victory = checkVictoryConditions(room);
    if (victory.finished) {
      room.status = "finished";
      break;
    }

    const alive = advanceTurn(room);
    if (!alive) break;
  }

  return enemyResults;
}

/**
 * Verifica la timeout del turno actual.
 * @returns {object|null} Participante si ha expirado, null si no.
 */
function checkTimeout(room) {
  const current = getCurrentParticipant(room);
  if (!current || current.ko) return null;
  const timeout = room.turnTimeoutMs || CR.turnTimeoutMs;
  const lastAction = current.lastActionAt || 0;
  if (Date.now() - lastAction > timeout) {
    return current;
  }
  return null;
}

/**
 * Aplica un skip de turno por timeout.
 */
async function applySkip(room, _reason = "timeout") {
  const current = getCurrentParticipant(room);
  if (!current) return null;

  current.consecutiveSkips++;
  current.lastActionAt = Date.now();

  const skipCount = current.consecutiveSkips;
  const maxSkips = CR.maxConsecutiveSkips;

  let message;
  if (skipCount >= maxSkips && CR.autoExpelAfterSkips) {
    message = `💀 *${current.name}* ha sido expulsado del combate por inactividad.`;
    current.ko = true;
    current.hp = 0;
  } else if (skipCount === maxSkips - 1) {
    message = `⚠️ *${current.name}* perdió su turno. ¡PRÓXIMO SKIP = EXPULSIÓN!`;
  } else {
    message = `⏰ *${current.name}* perdió su turno por inactividad.`;
  }

  advanceTurn(room);
  return { participant: current, message, skipCount };
}

// ═══════════════════════════════════════════════════════════════════════
//  CONSULTAS DE PARTICIPANTES
// ═══════════════════════════════════════════════════════════════════════

function getParticipantByJid(room, jid) {
  return room.participants.find((p) => p.id === jid) || null;
}

function getAliveParticipants(room, team) {
  return room.participants.filter((p) => !p.ko && (!team || p.team === team));
}

function getNextActiveJid(room) {
  const idx = getNextAliveIndex(room, room.currentTurnIndex);
  if (idx === -1) return null;
  const entry = room.turnQueue[idx];
  return entry ? entry.participantId : null;
}

function getNextActiveParticipant(room) {
  const jid = getNextActiveJid(room);
  if (!jid) return null;
  return room.participants.find((p) => p.id === jid) || null;
}

// ═══════════════════════════════════════════════════════════════════════
//  CONDICIONES DE VICTORIA
// ═══════════════════════════════════════════════════════════════════════

function checkVictoryConditions(room) {
  if (room.startedVia === "pvp") {
    const challengerAlive = room.participants.filter((p) => !p.ko && p.bando === "challenger").length;
    const targetAlive = room.participants.filter((p) => !p.ko && p.bando === "target").length;
    if (challengerAlive === 0) return { finished: true, winner: "target", message: "🏆 El defensor gana el duelo!" };
    if (targetAlive === 0) return { finished: true, winner: "challenger", message: "🏆 El retador gana el duelo!" };
    return { finished: false, winner: null, message: "" };
  }

  const alivePlayers = getAliveParticipants(room, "players").length;
  const aliveEnemies = getAliveParticipants(room, "enemies").length;

  if (alivePlayers === 0)
    return { finished: true, winner: "enemies", message: "☠️ Todos los jugadores han caído. *Derrota.*" };
  if (aliveEnemies === 0)
    return { finished: true, winner: "players", message: "🏆 Todos los enemigos derrotados. *¡Victoria!*" };
  return { finished: false, winner: null, message: "" };
}

// ═══════════════════════════════════════════════════════════════════════
//  FORMATEO DE MENSAJES (WhatsApp Optimizado)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Genera una barra de HP visual en formato unicode.
 * @param {number} current - HP actual
 * @param {number} max - HP máximo
 * @param {number} segments - Número de segmentos (default 8)
 * @returns {string} Barra visual ej: [████░░░░]
 */
function formatHPBar(current, max, segments = 8) {
  const ratio = Math.max(0, Math.min(1, (current || 0) / (max || 1)));
  const filled = Math.round(ratio * segments);
  const empty = segments - filled;
  return "[" + "█".repeat(filled) + "░".repeat(empty) + "]";
}

/**
 * Genera el bloque de estado completo del combate.
 * Diseñado para una sola burbuja de WhatsApp.
 *
 * @param {object} room
 * @returns {string} Mensaje formateado
 */
function formatStatus(room) {
  const lines = [];
  const currentP = getCurrentParticipant(room);

  lines.push("✦ ━━━━━━━━━━━━━━ ✦");
  lines.push(`⚔️ *COMBATE* — Ronda ${room.round}`);
  lines.push("✦ ━━━━━━━━━━━━━━ ✦");
  lines.push("");

  const players = room.participants.filter((p) => p.team === "players");
  const enemies = room.participants.filter((p) => p.team === "enemies");

  if (players.length > 0) {
    lines.push("*Jugadores:*");
    for (const p of players) {
      const bar = formatHPBar(p.hp, p.maxHp);
      const koTag = p.ko ? " 💀" : "";
      const arrow = currentP && currentP.id === p.id ? "► " : "  ";
      lines.push(`${arrow}${bar} ${p.name} (${p.hp}/${p.maxHp})${koTag}`);
    }
    lines.push("");
  }

  if (enemies.length > 0) {
    lines.push("*Enemigos:*");
    for (const p of enemies) {
      const bar = formatHPBar(p.hp, p.maxHp);
      const koTag = p.ko ? " 💀" : "";
      const arrow = currentP && currentP.id === p.id ? "► " : "  ";
      lines.push(`${arrow}${bar} ${p.name} (${p.hp}/${p.maxHp})${koTag}`);
    }
    lines.push("");
  }

  lines.push("✦ ━━━━━━━━━━━━━━ ✦");
  lines.push("");
  lines.push("`.a` atacar · `.e` esquivar · `.b` bloquear");
  lines.push("`.u <item>` usar · `.h <id>` habilidad");

  return lines.join("\n");
}

/**
 * Genera el tag de mención para el siguiente turno.
 * Devuelve una mención @JID de WhatsApp para push notification.
 *
 * @param {object} room
 * @returns {{ text: string, mentions: string[] }}
 */
function formatNextTurnMention(room) {
  const next = getCurrentParticipant(room);
  if (!next || next.team === "enemies") return { text: "", mentions: [] };

  next.lastActionAt = Date.now();

  // Extraer número de teléfono del JID para la mención
  const jid = next.id;

  return {
    text: `\n► @${jid} — ¡Es tu turno!`,
    mentions: [jid],
  };
}

/**
 * Construye el mensaje completo de respuesta de turno.
 * Agrupa: resultado del jugador + turnos NPC + status + mención siguiente.
 *
 * @param {object} room
 * @param {string} playerActionDetails - Texto del resultado de la acción del jugador
 * @param {object[]} enemyResults - Array de resultados de turnos NPC
 * @returns {{ text: string, mentions: string[] }}
 */
function buildTurnResponse(room, playerActionDetails, enemyResults = []) {
  const lines = [];

  // 1. Resultado de la acción del jugador
  lines.push(playerActionDetails);

  // 2. Resultados de los turnos NPC
  if (enemyResults.length > 0) {
    lines.push("");
    lines.push("─── *Turno de enemigos* ───");
    for (const er of enemyResults) {
      if (er.details) {
        lines.push(er.details);
      } else if (er.result && er.result.details) {
        lines.push(er.result.details);
      }
    }
  }

  // 3. Verificar victoria
  const victory = checkVictoryConditions(room);
  if (victory.finished) {
    room.status = "finished";
    lines.push("");
    lines.push(victory.message);
    return { text: lines.join("\n"), mentions: [] };
  }

  // 4. Status del combate
  lines.push("");
  lines.push(formatStatus(room));

  // 5. Mención del siguiente jugador
  const mention = formatNextTurnMention(room);
  if (mention.text) {
    lines.push(mention.text);
  }

  return { text: lines.join("\n"), mentions: mention.mentions };
}

// ═══════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
  // Navegación de turnos
  getCurrentParticipant,
  getNextActiveParticipant,
  getNextActiveJid,
  validateTurn,
  advanceTurn,
  resolveConsecutiveEnemyTurns,
  checkTimeout,
  applySkip,

  // Consultas
  getParticipantByJid,
  getAliveParticipants,

  // Victoria
  checkVictoryConditions,

  // Formato de mensajes
  formatHPBar,
  formatStatus,
  formatNextTurnMention,
  buildTurnResponse,
};
