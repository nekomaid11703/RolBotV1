// @ts-nocheck
/**
 * rpg.config.js — Configuración central del sistema RPG táctico (D20)
 *
 * Escalado de estadísticas: Nivel 1 = ×1.0, Nivel 20 = ×5.0
 * Fórmula del multiplicador: M(L) = 1 + (L - 1) * (4 / 19)
 */

const RPG_CONFIG = {
  version: "2.0.0",

  // ── Progresión General ─────────────────────────────────────────────
  maxLevel: 100,
  baseXP: 100,
  xpScaleFactor: 1.5,
  maxCharactersPerUser: 5,

  // ── Sistema de Estadísticas (1-20, escalado 500%) ──────────────────
  stats: {
    /** Las 6 stats del sistema táctico, cada una en rango [1, 20] */
    all: ["fuerza", "velocidad", "reflejos", "resistencia_fisica", "resistencia_magica", "dominio_magico"],
    min: 1,
    max: 20,
    /** Multiplicador: M(L) = 1 + (L-1) * scaleFactor */
    scaleFactor: 4 / 19,
    defaultValue: 5,
  },

  defaultStats: {
    fuerza: 5,
    velocidad: 5,
    reflejos: 5,
    resistencia_fisica: 5,
    resistencia_magica: 3,
    dominio_magico: 1,
  },

  // ── D20 — Resolución de Acciones ──────────────────────────────────
  d20: {
    critSuccess: 20,
    critFail: 1,
    /** Multiplicador de daño en crítico (aplicado DESPUÉS del multiplicador de stat) */
    critDamageMultiplier: 1.5,
    /** Daño extra recibido al fallar pifia en esquiva */
    pifiaReceivedMultiplier: 1.5,
    /** Daño adicional plano al colapsar bloqueo (pifia) */
    blockCollapseExtraDamage: 10,
    /** Multiplicador de daño al estar vulnerable (pifia de ataque del turno anterior) */
    vulnerableMultiplier: 1.2,
    /** Contraataque plano al esquivar críticamente */
    critDodgeCounterDamage: 15,
  },

  // ── Combate: Fórmulas Base ────────────────────────────────────────
  combat: {
    /** Dado de daño base (D10): rango [1, 10] */
    baseDamageMin: 1,
    baseDamageMax: 10,
    /** Defensa pasiva base (antes de multiplicador de Reflejos) */
    passiveDefenseBase: 10,
    /** Mínimo de daño después de reducciones */
    minDamage: 1,
    /** Reducción de defensa base (antes de multiplicador de res_fisica) */
    defenseReductionBase: 5,
    /** Multiplicador de XP de recompensa */
    xpRewardMultiplier: 1.0,
    /** Probabilidad de loot al ganar */
    lootDropChance: 0.6,
  },

  // ── Sala de Combate / Turnos ──────────────────────────────────────
  combatRoom: {
    /** Timeout de turno por defecto (24 horas en ms) */
    turnTimeoutMs: 86400000,
    /** Timeout rápido (1 hora) */
    fastTurnTimeoutMs: 3600000,
    /** Saltos máximos antes de expulsión */
    maxConsecutiveSkips: 3,
    /** Penalización de fatiga por skip (usada como advertencia, no afecta stats) */
    skipFatiguePenalty: 5,
    /** ¿Expulsar automáticamente tras max skips? */
    autoExpelAfterSkips: true,
    /** Máximo de participantes por equipo */
    maxParticipantsPerTeam: 8,
  },

  // ── Inventario ────────────────────────────────────────────────────
  inventory: {
    defaultCapacity: 30,
    baseWeight: 50,
    strengthWeightBonus: 5,
    maxStackSize: 99,
  },

  // ── WhatsApp: Reacciones Emoji por Acción ─────────────────────────
  reactions: {
    attack: "⚔️",
    dodge: "💨",
    block: "🛡️",
    use: "🧪",
    critSuccess: "💥",
    critFail: "💀",
    victory: "🏆",
    defeat: "☠️",
    flee: "🏃",
  },

  // ── Miscelánea ────────────────────────────────────────────────────
  affinityLevels: ["S", "A", "B", "C", "D", "E", "F"],
  rarityScale: ["comun", "avanzado", "elite", "legendario", "mitologico"],
};

module.exports = { RPG_CONFIG };
