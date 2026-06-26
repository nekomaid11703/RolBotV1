const EFFECTS_REGISTRY = [
  {
    id: 'viento_fuerte',
    name: 'Viento Fuerte',
    desc: 'Ráfagas de viento dificultan ataques a distancia y precisión.',
    conditions: { outdoor: true },
    rules: { precision: -2, reflejos: -1, velocidad_ataque: -1 },
    duration: 5,
  },
  {
    id: 'lluvia_torrencial',
    name: 'Lluvia Torrencial',
    desc: 'El suelo resbaladizo y la lluvia densa reducen visibilidad y tracción.',
    conditions: { outdoor: true },
    rules: { precision: -3, reflejos: -2, velocidad_desplazamiento: -2 },
    sceneEffect: 'El suelo está empapado, el barro salpica con cada pisada.',
    duration: 5,
  },
  {
    id: 'oscuridad',
    name: 'Oscuridad',
    desc: 'Sin luz apenas se ve. Los ataques son más imprecisos y es fácil ocultarse.',
    conditions: { indoor: true, night: true },
    rules: { precision: -4, reflejos: -2, dominio_fulgor: -2 },
    sceneEffect: 'Las sombras se alargan, apenas distingues siluetas.',
    duration: 5,
  },
  {
    id: 'fuego_activo',
    name: 'Fuego Activo',
    desc: 'Llamas abrasadoras en el entorno. Daño continuo por calor y humo.',
    conditions: { hazard: true },
    rules: {},
    damagePerTurn: 5,
    sceneEffect: 'El fuego crepita, el humo asciende en espirales negras.',
    duration: 4,
  },
  {
    id: 'terreno_pantanoso',
    name: 'Terreno Pantanoso',
    desc: 'El barro y el agua entorpecen el movimiento. Es difícil esquivar.',
    conditions: { outdoor: true, wet: true },
    rules: { velocidad_desplazamiento: -3, reflejos: -2, fuerza: -1 },
    sceneEffect: 'El lodo burbujea, cada paso se hunde varios centímetros.',
    duration: 5,
  },
  {
    id: 'terreno_elevado',
    name: 'Terreno Elevado',
    desc: 'Ventaja de altura. El atacante desde arriba tiene mejor alcance.',
    conditions: { elevated: true },
    rules: { precision: +2, fuerza: +1 },
    sceneEffect: 'La altura domina el campo de batalla, el viento azota con fuerza.',
    duration: 5,
  },
  {
    id: 'nubes_denso',
    name: 'Nubes de Polvo',
    desc: 'Polvo denso en el aire. Tos y visión reducida.',
    conditions: { indoor: true, dry: true },
    rules: { precision: -3, reflejos: -1, resistencia_fisica: -1 },
    damagePerTurn: 3,
    sceneEffect: 'Partículas flotan en el aire, una capa grisácea cubre todo.',
    duration: 4,
  },
  {
    id: 'campo_protegido',
    name: 'Campo Protegido',
    desc: 'Un campo de energía o barrera mágica protege una zona.',
    conditions: { magical: true },
    rules: { resistencia_fisica: +3, resistencia_magica: +5 },
    sceneEffect: 'Un brillo tenue parpadea en el aire, deformando la luz.',
    duration: 6,
  },
];

const COMBINED_EFFECTS = {
  'lluvia_torrencial:fuego_activo': {
    id: 'vapor_ardiente',
    name: 'Vapor Ardiente',
    desc: 'El agua al contacto con el fuego genera vapor a presión. Quemaduras por vapor y visibilidad casi nula.',
    rules: { precision: -5, reflejos: -3, resistencia_fisica: -2 },
    damagePerTurn: 4,
    sceneEffect: 'Nubes de vapor silbante envuelven el campo de batalla.',
    duration: 4,
  },
  'oscuridad:terreno_pantanoso': {
    id: 'cienaga_cegadora',
    name: 'Ciénaga Cegadora',
    desc: 'La oscuridad y el pantano se combinan. Es imposible ver dónde pisas.',
    rules: { precision: -6, reflejos: -4, velocidad_desplazamiento: -4 },
    damagePerTurn: 2,
    sceneEffect: 'La negrura del pantano oculta trampas mortales bajo la superficie.',
    duration: 4,
  },
  'fuego_activo:nubes_denso': {
    id: 'humo_toxico',
    name: 'Humo Tóxico',
    desc: 'El polvo y el fuego generan humo venenoso. Tos asfixiante y ojos llorosos.',
    rules: { precision: -5, reflejos: -3, resistencia_fisica: -4 },
    damagePerTurn: 5,
    sceneEffect: 'Una cortina de humo espeso y picante cubre el área.',
    duration: 4,
  },
  'viento_fuerte:fuego_activo': {
    id: 'tormenta_fuego',
    name: 'Tormenta de Fuego',
    desc: 'El viento aviva las llamas creando una tormenta ígnea. El fuego se extiende rápidamente.',
    rules: { precision: -4, dominio_fulgor: +3 },
    damagePerTurn: 8,
    sceneEffect: 'El viento arrastra brasas y cenizas, el fuego baila salvajemente.',
    duration: 4,
  },
};

function getEffect(effectId) {
  return EFFECTS_REGISTRY.find(e => e.id === effectId) || null;
}

function getCombinedEffect(effectId1, effectId2) {
  const key1 = `${effectId1}:${effectId2}`;
  const key2 = `${effectId2}:${effectId1}`;
  return COMBINED_EFFECTS[key1] || COMBINED_EFFECTS[key2] || null;
}

function getActiveCombinedEffects(activeEffects) {
  if (!activeEffects || activeEffects.length < 2) return [];
  const combined = [];
  for (let i = 0; i < activeEffects.length; i++) {
    for (let j = i + 1; j < activeEffects.length; j++) {
      const ce = getCombinedEffect(activeEffects[i], activeEffects[j]);
      if (ce) combined.push(ce);
    }
  }
  return combined;
}

function validateEffectSelection(effectId, location) {
  if (!effectId) return true;
  const effect = getEffect(effectId);
  if (!effect) return false;
  if (!effect.conditions) return true;
  const loc = location || {};
  for (const [key, val] of Object.entries(effect.conditions)) {
    if (loc[key] !== val) return false;
  }
  return true;
}

function getEffectiveRules(activeEffects) {
  const rules = {};
  if (!activeEffects) return rules;

  for (const eid of activeEffects) {
    const effect = getEffect(eid);
    if (effect && effect.rules) {
      for (const [stat, delta] of Object.entries(effect.rules)) {
        rules[stat] = (rules[stat] || 0) + delta;
      }
    }
  }

  const combined = getActiveCombinedEffects(activeEffects);
  for (const ce of combined) {
    if (ce.rules) {
      for (const [stat, delta] of Object.entries(ce.rules)) {
        rules[stat] = (rules[stat] || 0) + delta;
      }
    }
  }

  return rules;
}

function applyEffectRules(participantStats, effectId) {
  const effect = getEffect(effectId);
  if (!effect || !effect.rules) return participantStats;
  const modified = { ...participantStats };
  for (const [stat, delta] of Object.entries(effect.rules)) {
    modified[stat] = Math.max(1, (modified[stat] || 5) + delta);
  }
  return modified;
}

function getEffectDuration(effectId) {
  const effect = getEffect(effectId);
  return effect?.duration || 0;
}

function reduceEffectDurations(room) {
  if (!room.effectDurations) return [];
  const expired = [];
  for (const [eid, turns] of Object.entries(room.effectDurations)) {
    room.effectDurations[eid] = turns - 1;
    if (room.effectDurations[eid] <= 0) {
      expired.push(eid);
    }
  }
  for (const eid of expired) {
    delete room.effectDurations[eid];
  }
  return expired;
}

function removeExpiredEffects(room) {
  if (!room.effectDurations || !room.activeEffects) return;
  const expired = Object.keys(room.effectDurations).filter(eid => room.effectDurations[eid] <= 0);
  if (expired.length > 0) {
    room.activeEffects = room.activeEffects.filter(eid => !expired.includes(eid));
    for (const eid of expired) {
      delete room.effectDurations[eid];
    }
  }
}

function getDamagePerTurn(effectId) {
  const effect = getEffect(effectId);
  return effect?.damagePerTurn || 0;
}

function applyDotToParticipants(room) {
  if (!room.activeEffects || room.activeEffects.length === 0) return false;
  let totalDamage = 0;

  for (const eid of room.activeEffects) {
    totalDamage += getDamagePerTurn(eid);
  }
  const combined = getActiveCombinedEffects(room.activeEffects);
  for (const ce of combined) {
    totalDamage += ce.damagePerTurn || 0;
  }

  if (totalDamage <= 0) return false;

  for (const p of room.participants) {
    if (p.ko) continue;
    p.hp = Math.max(1, (p.hp || 100) - totalDamage);
    if (p.hp <= (room.koThreshold || 30)) {
      p.ko = true;
    }
  }

  return true;
}

function getActiveEffectsDescription(activeEffects) {
  if (!activeEffects || activeEffects.length === 0) return 'Ninguno';
  const lines = activeEffects.map(eid => {
    const e = getEffect(eid);
    return e ? `- *${e.name}*: ${e.desc}${e.damagePerTurn ? ` (${e.damagePerTurn} daño/turno)` : ''}` : `- ${eid}: efecto desconocido`;
  });

  const combined = getActiveCombinedEffects(activeEffects);
  for (const ce of combined) {
    lines.push(`  ↳ *${ce.name}* (combinado): ${ce.desc}${ce.damagePerTurn ? ` (${ce.damagePerTurn} daño/turno)` : ''}`);
  }

  return lines.join('\n');
}

function getSceneEffectDescriptions(activeEffects) {
  if (!activeEffects || activeEffects.length === 0) return '';
  const lines = [];
  for (const eid of activeEffects) {
    const e = getEffect(eid);
    if (e?.sceneEffect) lines.push(e.sceneEffect);
  }
  const combined = getActiveCombinedEffects(activeEffects);
  for (const ce of combined) {
    if (ce.sceneEffect) lines.push(ce.sceneEffect);
  }
  return lines.join(' ');
}

function rankEffectsByLocation(activeEffects, location) {
  if (!activeEffects || !location) return activeEffects || [];
  const loc = location;
  return [...(activeEffects || [])].sort((a, b) => {
    const ea = getEffect(a);
    const eb = getEffect(b);
    const scoreA = scoreEffectForLocation(ea, loc);
    const scoreB = scoreEffectForLocation(eb, loc);
    return scoreB - scoreA;
  });
}

function scoreEffectForLocation(effect, location) {
  if (!effect || !effect.conditions) return 0;
  let score = 0;
  for (const [key, val] of Object.entries(effect.conditions)) {
    if (location[key] === val) score += 2;
  }
  return score;
}

module.exports = {
  EFFECTS_REGISTRY,
  COMBINED_EFFECTS,
  getEffect,
  getCombinedEffect,
  getActiveCombinedEffects,
  validateEffectSelection,
  getEffectiveRules,
  applyEffectRules,
  getEffectDuration,
  reduceEffectDurations,
  removeExpiredEffects,
  getDamagePerTurn,
  applyDotToParticipants,
  getActiveEffectsDescription,
  getSceneEffectDescriptions,
  rankEffectsByLocation,
};
