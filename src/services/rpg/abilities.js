// @ts-nocheck
const ABILITIES_REGISTRY = [
  {
    id: "golpe_poderoso",
    name: "Golpe Poderoso",
    description: "Golpe lento pero devastador que sacrifica precisión por daño bruto.",
    tier: 1,
    cost: { fatigue: 2, fulgor: 0 },
    cooldown: 2,
    effects: [
      { type: "damage_multiplier", value: 1.5 },
      { type: "stat_debuff_self", stat: "precision", value: -2, duration: 1 },
    ],
    requirements: { fuerza: 5 },
    conditions: {},
    narrative: "Reúne toda su fuerza en un golpe devastador.",
  },
  {
    id: "defensa_total",
    name: "Defensa Total",
    description: "Se cubre por completo, reduciendo drásticamente el daño recibido este turno.",
    tier: 1,
    cost: { fatigue: 2, fulgor: 0 },
    cooldown: 3,
    effects: [{ type: "defense_multiplier", value: 2.5 }],
    requirements: { resistencia_fisica: 4 },
    conditions: {},
    narrative: "Se cubre con todo su equipo, ofreciendo la menor superficie posible al ataque.",
  },
  {
    id: "ataque_rapido",
    name: "Ataque Rápido",
    description: "Dos golpes rápidos con daño reducido en cada uno.",
    tier: 1,
    cost: { fatigue: 3, fulgor: 0 },
    cooldown: 2,
    effects: [
      { type: "multi_attack", value: 2 },
      { type: "damage_multiplier", value: 0.7 },
    ],
    requirements: { velocidad_ataque: 5 },
    conditions: {},
    narrative: "Se lanza en una ráfaga de golpes veloces.",
  },
  {
    id: "finta",
    name: "Finta",
    description: "Ataque que busca un hueco en la defensa, ignorando armadura.",
    tier: 1,
    cost: { fatigue: 2, fulgor: 0 },
    cooldown: 3,
    effects: [{ type: "ignore_armor", value: true }],
    requirements: { precision: 5 },
    conditions: {},
    narrative: "Ejecuta una finta calculada para burlar la defensa enemiga.",
  },
  {
    id: "racha_de_golpes",
    name: "Racha de Golpes",
    description: "Tres golpes consecutivos con daño progresivo.",
    tier: 2,
    cost: { fatigue: 0, fulgor: 20 },
    cooldown: 4,
    effects: [
      { type: "multi_attack", value: 3 },
      { type: "damage_progression", values: [1.0, 0.8, 0.6] },
    ],
    requirements: { velocidad_ataque: 6, fuerza: 4 },
    conditions: {},
    narrative: "Desata una ráfaga de golpes en progresión imparable.",
  },
  {
    id: "curarse",
    name: "Curarse",
    description: "Canaliza fulgor para regenerar heridas.",
    tier: 2,
    cost: { fatigue: 0, fulgor: 25 },
    cooldown: 5,
    effects: [{ type: "heal_percent", value: 0.3 }],
    requirements: { dominio_fulgor: 3 },
    conditions: {},
    narrative: "Concentra su fulgor y cierra sus heridas.",
  },
  {
    id: "impulso",
    name: "Impulso",
    description: "Aumenta reflejos y velocidad de ataque durante 2 turnos.",
    tier: 2,
    cost: { fatigue: 0, fulgor: 15 },
    cooldown: 4,
    effects: [
      { type: "buff", stat: "reflejos", value: 3, duration: 2 },
      { type: "buff", stat: "velocidad_ataque", value: 2, duration: 2 },
    ],
    requirements: { dominio_fulgor: 2 },
    conditions: {},
    narrative: "Una aura de fulgor lo envuelve, agudizando sus sentidos.",
  },
  {
    id: "onda_de_choque",
    name: "Onda de Choque",
    description: "Emite una onda de energía que daña a todos los enemigos.",
    tier: 2,
    cost: { fatigue: 0, fulgor: 30 },
    cooldown: 5,
    effects: [{ type: "aoe_damage", value: 1.0, stat: "dominio_fulgor" }],
    requirements: { dominio_fulgor: 5 },
    conditions: {},
    narrative: "Golpea el suelo o el aire, liberando una onda expansiva de fulgor.",
  },
  {
    id: "golpe_de_gracia",
    name: "Golpe de Gracia",
    description: "Ataque letal contra un objetivo herido. Solo funciona si el enemigo tiene menos de 25% de HP.",
    tier: 3,
    cost: { fatigue: 0, fulgor: 50 },
    cooldown: 6,
    effects: [
      { type: "damage_multiplier", value: 3.0 },
      { type: "crit_guaranteed", value: true },
    ],
    requirements: { fuerza: 7, precision: 5 },
    conditions: { target_hp_under: 0.25 },
    narrative: "Ve la oportunidad y lanza un golpe letal contra el punto más débil.",
  },
  {
    id: "barrera_de_fulgor",
    name: "Barrera de Fulgor",
    description: "Crea un escudo de energía que absorbe daño durante 3 turnos.",
    tier: 3,
    cost: { fatigue: 0, fulgor: 40 },
    cooldown: 6,
    effects: [{ type: "shield", value: 0.4, duration: 3, stat: "dominio_fulgor" }],
    requirements: { dominio_fulgor: 6, resistencia_fisica: 4 },
    conditions: {},
    narrative: "El fulgor brota de su cuerpo formando una barrera protectora.",
  },
];

function getAbility(abilityId) {
  return ABILITIES_REGISTRY.find((a) => a.id === abilityId) || null;
}

function getAbilitiesByTier(tier) {
  return ABILITIES_REGISTRY.filter((a) => a.tier === tier);
}

function canUseAbility(participant, abilityId) {
  const ability = getAbility(abilityId);
  if (!ability) return { canUse: false, reason: `Habilidad "${abilityId}" no encontrada.` };

  if (!participant.cooldowns) participant.cooldowns = {};
  if (participant.cooldowns[abilityId] && participant.cooldowns[abilityId] > 0) {
    return {
      canUse: false,
      reason: `${ability.name} está en enfriamiento (${participant.cooldowns[abilityId]} turnos restantes).`,
    };
  }

  if (ability.cost.fatigue > 0 && (participant.fatigue || 0) + ability.cost.fatigue > 10) {
    return {
      canUse: false,
      reason: `Demasiada fatiga para usar ${ability.name} (tendrías ${(participant.fatigue || 0) + ability.cost.fatigue}/10).`,
    };
  }

  if (ability.cost.fulgor > 0 && (participant.fulgor || 0) < ability.cost.fulgor) {
    return {
      canUse: false,
      reason: `Fulgor insuficiente. Necesitas ${ability.cost.fulgor}, tienes ${participant.fulgor || 0}.`,
    };
  }

  for (const [stat, min] of Object.entries(ability.requirements)) {
    if ((participant[stat] || 0) < min) {
      return {
        canUse: false,
        reason: `${stat} mínimo ${min} requerido para ${ability.name} (tienes ${participant[stat] || 0}).`,
      };
    }
  }

  if (ability.conditions.target_hp_under && ability.conditions.target_hp_under > 0) {
    return { canUse: true, reason: null, requiresTarget: true };
  }

  return { canUse: true, reason: null, requiresTarget: false };
}

function applyAbilityCosts(participant, abilityId) {
  const ability = getAbility(abilityId);
  if (!ability) return participant;

  if (ability.cost.fatigue > 0) {
    participant.fatigue = Math.min(10, (participant.fatigue || 0) + ability.cost.fatigue);
  }
  if (ability.cost.fulgor > 0) {
    participant.fulgor = Math.max(0, (participant.fulgor || 0) - ability.cost.fulgor);
  }

  if (!participant.cooldowns) participant.cooldowns = {};
  participant.cooldowns[abilityId] = ability.cooldown;

  return participant;
}

function reduceCooldowns(participant) {
  if (!participant.cooldowns) return participant;
  for (const abilityId of Object.keys(participant.cooldowns)) {
    if (participant.cooldowns[abilityId] > 0) {
      participant.cooldowns[abilityId]--;
    }
  }
  return participant;
}

function getAvailableAbilities(participant) {
  return ABILITIES_REGISTRY.filter((a) => {
    if (!participant.cooldowns) participant.cooldowns = {};
    if (participant.cooldowns[a.id] && participant.cooldowns[a.id] > 0) return false;
    if (a.cost.fulgor > 0 && (participant.fulgor || 0) < a.cost.fulgor) return false;
    if (a.cost.fatigue > 0 && (participant.fatigue || 0) + a.cost.fatigue > 10) return false;
    for (const [stat, min] of Object.entries(a.requirements)) {
      if ((participant[stat] || 0) < min) return false;
    }
    return true;
  }).map(
    (a) =>
      `- ${a.id} (${a.name}): ${a.description} [${a.cost.fulgor > 0 ? a.cost.fulgor + " fulgor" : ""}${a.cost.fatigue > 0 ? (a.cost.fulgor > 0 ? ", " : "") + a.cost.fatigue + " fatiga" : ""}${a.cooldown > 0 ? ", cd: " + a.cooldown + " turnos" : ""}]`,
  );
}

function getActiveBuffsDescription(participant) {
  if (!participant.buffs || participant.buffs.length === 0) return "Ninguno";
  return participant.buffs
    .map((b) => `${b.stat || "desconocido"} (${b.value > 0 ? "+" : ""}${b.value}, ${b.duration} turnos restantes)`)
    .join(", ");
}

function reduceBuffTimers(participant) {
  if (!participant.buffs) return participant;
  participant.buffs = participant.buffs.map((b) => ({ ...b, duration: b.duration - 1 })).filter((b) => b.duration > 0);
  return participant;
}

function findAbilityByName(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return ABILITIES_REGISTRY.find((a) => a.name.toLowerCase() === lower || a.id.toLowerCase() === lower) || null;
}

module.exports = {
  ABILITIES_REGISTRY,
  getAbility,
  getAbilitiesByTier,
  canUseAbility,
  applyAbilityCosts,
  reduceCooldowns,
  getAvailableAbilities,
  getActiveBuffsDescription,
  reduceBuffDurations: reduceBuffTimers,
  findAbilityByName,
};
