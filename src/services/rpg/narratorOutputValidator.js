const VALID_ZONES = [
  'cabeza', 'cuello', 'pecho', 'abdomen', 'espalda',
  'brazo_izq', 'brazo_der', 'mano_izq', 'mano_der',
  'pierna_izq', 'pierna_der', 'pie_izq', 'pie_der',
];

const VALID_ACTION_TYPES = ['attack', 'defend', 'flee', 'use_item', 'interact', 'transition'];
const VALID_DAMAGE_TYPES = ['cortadura', 'impacto', 'magico', 'perforacion', 'contundente'];
const VALID_INFRACTION_TYPES = ['mano_blanca', 'mano_negra'];

const LLM_OUTPUT_SCHEMA = {
  layers: { membrete: 'string', accion: 'string', dialogo: 'string' },
  infractions: [{
    type: 'string (mano_blanca|mano_negra)',
    severity: 'string (critica|alta|media|baja)',
    description: 'string',
    text: 'string',
  }],
  coherent: 'boolean',
  coherence_issues: ['string'],
  environmental_effect: 'string|null',
  mechanics: {
    action_type: 'string (attack|defend|flee|use_item|interact|transition)',
    target_id: 'string|null',
    zone: 'string|null',
    weapon: 'string|null',
    move_number: 'number (1|2)',
    is_attempt: 'boolean',
  },
  damage_type: 'string|null',
  dialogue_count: 'number',
  dialogue_as_action: 'boolean',
  narrative: 'string',
};

function fuzzyParseJSON(raw) {
  if (!raw || typeof raw !== 'string') return null;

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  let text = jsonMatch[0];

  text = text.replace(/'/g, '"');

  text = text.replace(/(\w+):/g, '"$1":');

  text = text.replace(/,\s*([}\]])/g, '$1');

  text = text.replace(/\s+/g, ' ').trim();

  try {
    return JSON.parse(text);
  } catch (e) {
    return attemptPartialRepair(text);
  }
}

function attemptPartialRepair(text) {
  let cleaned = text
    .replace(/"[^"]*"[^:]*:\s*"[^"]*"/g, m => m.replace(/\n/g, '\\n').replace(/\t/g, '\\t'))
    .replace(/:\s*'([^']*)'/g, ':"$1"');

  try { return JSON.parse(cleaned); } catch {}

  const closeBrace = cleaned.lastIndexOf('}');
  const closeBracket = cleaned.lastIndexOf(']');
  if (closeBrace !== -1) {
    try { return JSON.parse(cleaned.slice(0, closeBrace + 1)); } catch {}
  }
  if (closeBracket !== -1) {
    const upToBracket = cleaned.slice(0, closeBracket + 1);
    const lastBrace = upToBracket.lastIndexOf('}');
    if (lastBrace !== -1) {
      try { return JSON.parse(upToBracket.slice(0, lastBrace + 1)); } catch {}
    }
  }

  const incompleteMatch = cleaned.match(/\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/);
  if (incompleteMatch) {
    try { return JSON.parse(incompleteMatch[0]); } catch {}
  }

  return null;
}

function validateOutput(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['La salida no es un objeto JSON válido.'], data: null };
  }

  if (!data.layers || typeof data.layers !== 'object') {
    errors.push('Falta "layers" o no es objeto.');
  } else {
    for (const key of ['membrete', 'accion', 'dialogo']) {
      if (typeof data.layers[key] !== 'string') {
        errors.push(`layers.${key} debe ser string.`);
      }
    }
  }

  if (data.infractions && Array.isArray(data.infractions)) {
    for (let i = 0; i < data.infractions.length; i++) {
      const inf = data.infractions[i];
      if (!VALID_INFRACTION_TYPES.includes(inf.type)) {
        errors.push(`infractions[${i}].type inválido: "${inf.type}".`);
      }
    }
  }

  if (data.coherent !== undefined && typeof data.coherent !== 'boolean') {
    errors.push('"coherent" debe ser boolean.');
  }

  if (data.environmental_effect !== undefined && data.environmental_effect !== null && typeof data.environmental_effect !== 'string') {
    errors.push('"environmental_effect" debe ser string o null.');
  }

  if (data.mechanics && typeof data.mechanics === 'object') {
    const m = data.mechanics;
    if (m.action_type && !VALID_ACTION_TYPES.includes(m.action_type)) {
      errors.push(`mechanics.action_type "${m.action_type}" no válido.`);
    }
    if (m.zone && !VALID_ZONES.includes(m.zone)) {
      errors.push(`mechanics.zone "${m.zone}" no válida.`);
    }
    if (m.move_number !== undefined && ![1, 2].includes(m.move_number)) {
      errors.push('mechanics.move_number debe ser 1 o 2.');
    }
    if (m.is_attempt !== undefined && typeof m.is_attempt !== 'boolean') {
      errors.push('mechanics.is_attempt debe ser boolean.');
    }
  } else {
    errors.push('Falta "mechanics" o no es objeto.');
  }

  if (data.damage_type && data.damage_type !== null && !VALID_DAMAGE_TYPES.includes(data.damage_type)) {
    errors.push(`damage_type "${data.damage_type}" no válido.`);
  }

  if (typeof data.narrative !== 'string' || data.narrative.length < 1) {
    errors.push('"narrative" debe ser string no vacío.');
  }

  return { valid: errors.length === 0, errors, data };
}

function buildDefaultInfractionOutput(infractions) {
  return {
    layers: { membrete: '', accion: '', dialogo: '' },
    infractions: infractions.map(i => ({
      type: i.type || 'mano_negra',
      severity: i.severity || 'critica',
      description: i.description || 'infraccion detectada',
      text: i.text || '',
    })),
    coherent: false,
    coherence_issues: infractions.map(i => i.description),
    environmental_effect: null,
    mechanics: {
      action_type: 'attack',
      target_id: null,
      zone: null,
      weapon: null,
      move_number: 1,
      is_attempt: false,
    },
    damage_type: null,
    dialogue_count: 0,
    dialogue_as_action: false,
    narrative: 'Acción invalidada por infracción.',
  };
}

module.exports = {
  fuzzyParseJSON,
  validateOutput,
  buildDefaultInfractionOutput,
  LLM_OUTPUT_SCHEMA,
  VALID_ZONES,
  VALID_ACTION_TYPES,
  VALID_INFRACTION_TYPES,
};
