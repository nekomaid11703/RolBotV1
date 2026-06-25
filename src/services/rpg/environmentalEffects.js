const EFFECTS_REGISTRY = [
  {
    id: 'viento_fuerte',
    name: 'Viento Fuerte',
    desc: 'Ráfagas de viento dificultan ataques a distancia y precisión.',
    conditions: { outdoor: true },
    rules: { precision: -2, reflejos: -1, velocidad_ataque: -1 },
  },
  {
    id: 'lluvia_torrencial',
    name: 'Lluvia Torrencial',
    desc: 'El suelo resbaladizo y la lluvia densa reducen visibilidad y tracción.',
    conditions: { outdoor: true },
    rules: { precision: -3, reflejos: -2, velocidad_desplazamiento: -2 },
  },
  {
    id: 'oscuridad',
    name: 'Oscuridad',
    desc: 'Sin luz apenas se ve. Los ataques son más imprecisos y es fácil ocultarse.',
    conditions: { indoor: true, night: true },
    rules: { precision: -4, reflejos: -2, dominio_fulgor: -2 },
  },
  {
    id: 'fuego_activo',
    name: 'Fuego Activo',
    desc: 'Llamas abrasadoras en el entorno. Daño continuo por calor y humo.',
    conditions: { hazard: true },
    rules: {},
    damagePerTurn: 5,
  },
  {
    id: 'terreno_pantanoso',
    name: 'Terreno Pantanoso',
    desc: 'El barro y el agua entorpecen el movimiento. Es difícil esquivar.',
    conditions: { outdoor: true, wet: true },
    rules: { velocidad_desplazamiento: -3, reflejos: -2, fuerza: -1 },
  },
  {
    id: 'terreno_elevado',
    name: 'Terreno Elevado',
    desc: 'Ventaja de altura. El atacante desde arriba tiene mejor alcance.',
    conditions: { elevated: true },
    rules: { precision: +2, fuerza: +1 },
  },
  {
    id: 'nubes_denso',
    name: 'Nubes de Polvo',
    desc: 'Polvo denso en el aire. Tos y visión reducida.',
    conditions: { indoor: true, dry: true },
    rules: { precision: -3, reflejos: -1, resistencia_fisica: -1 },
    damagePerTurn: 3,
  },
  {
    id: 'campo_protegido',
    name: 'Campo Protegido',
    desc: 'Un campo de energía o barrera mágica protege una zona.',
    conditions: { magical: true },
    rules: { resistencia_fisica: +3, resistencia_magica: +5 },
  },
];

function getEffect(effectId) {
  return EFFECTS_REGISTRY.find(e => e.id === effectId) || null;
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

function applyEffectRules(participantStats, effectId) {
  const effect = getEffect(effectId);
  if (!effect || !effect.rules) return participantStats;
  const modified = { ...participantStats };
  for (const [stat, delta] of Object.entries(effect.rules)) {
    if (modified[stat] !== undefined) {
      modified[stat] = Math.max(1, modified[stat] + delta);
    } else {
      modified[stat] = Math.max(1, (modified[stat] || 5) + delta);
    }
  }
  return modified;
}

function getDamagePerTurn(effectId) {
  const effect = getEffect(effectId);
  return effect?.damagePerTurn || 0;
}

function getActiveEffectsDescription(activeEffects) {
  if (!activeEffects || activeEffects.length === 0) return '';
  return activeEffects.map(eid => {
    const e = getEffect(eid);
    return e ? `- *${e.name}*: ${e.desc}` : `- ${eid}: efecto desconocido`;
  }).join('\n');
}

module.exports = {
  EFFECTS_REGISTRY,
  getEffect,
  validateEffectSelection,
  applyEffectRules,
  getDamagePerTurn,
  getActiveEffectsDescription,
};
