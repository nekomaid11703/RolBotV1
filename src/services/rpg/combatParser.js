const { getAllEnemies } = require('./enemies');

const VALID_ZONES = [
  'cabeza', 'cuello', 'pecho', 'abdomen',
  'brazo_izq', 'brazo_der', 'mano_izq', 'mano_der',
  'pierna_izq', 'pierna_der', 'pie_izq', 'pie_der',
];

const ZONE_ALIASES = {
  brazo: 'brazo_der', pierna: 'pierna_der', mano: 'mano_der', pie: 'pie_der',
  cabeza: 'cabeza', cuello: 'cuello', pecho: 'pecho', abdomen: 'abdomen',
  estomago: 'abdomen', torso: 'pecho', espalda: 'pecho',
};

const ATTACK_SYNONYMS = ['atacar', 'ataco', 'golpear', 'golpeo', 'pegar', 'pego', 'atake',
  'cortar', 'corto', 'apunalar', 'apunalo', 'disparar', 'disparo', 'lanzar', 'lanzo',
  'hechizar', 'hechizo', 'magia', 'uso', 'atk'];

const TRANSITION_SYNONYMS = ['tomar', 'tomo', 'sacar', 'saco', 'guardar', 'guardo',
  'cambiar', 'cambio', 'retroceder', 'retrocedo', 'agacharse', 'me agacho',
  'levantarse', 'me levanto', 'recoger', 'recojo', 'beber', 'bebo'];

const OBSERVATION_SYNONYMS = ['miro', 'mira', 'observo', 'observa', 'examino', 'examina',
  'analizo', 'analiza', 'reviso', 'revisa', 'inspecciono', 'inspecciona',
  'reconozco', 'reconoce', 'exploro', 'explora', 'evalúo', 'evalua',
  'estudio', 'estudia', 'contemplo', 'contempla', 'atisbo', 'atisba',
  'escudriño', 'escudriña', 'vigilo', 'vigila', 'acecho', 'acecha',
  'preparo', 'prepara', 'prepararme', 'espero', 'espera', 'pienso',
  'piensa', 'medito', 'medita', 'planeo', 'planea', 'considero',
  'considera', 'busco', 'busca'];

const ATTEMPT_MARKERS = ['intento', 'trato de', 'trate de', 'busco', 'busqué',
  'procuro', 'procuré', 'voy a intentar'];

function normalizeText(text) {
  return text.toLowerCase()
    .replace(/[áéíóúüñ]/g, c => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' })[c])
    .replace(/[^a-z0-9@_\s]/g, '')
    .trim();
}

function detectMoveNumber(text, isAttempt) {
  if (isAttempt) return 2;
  return 1;
}

function extractZone(text) {
  for (const zone of VALID_ZONES) {
    if (text.includes(zone)) return zone;
  }
  for (const [alias, zone] of Object.entries(ZONE_ALIASES)) {
    if (text.includes(alias)) return zone;
  }
  return null;
}

function extractWeapon(text) {
  const weapons = ['espada', 'daga', 'hacha', 'lanza', 'arco', 'ballesta',
    'baston', 'vara', 'escudo', 'puñal', 'maza', 'martillo', 'hoz',
    'pocion', 'venda', 'hierba'];
  for (const w of weapons) {
    if (text.includes(w)) return w;
  }
  return null;
}

function extractTarget(text, mentions, room) {
  if (mentions && mentions.length > 0) return mentions[0];

  const enemies = getAllEnemies();
  for (const e of enemies) {
    if (text.includes(e.id) || text.includes(e.name.toLowerCase())) {
      return `enemy:${e.id}_0`;
    }
  }

  if (room) {
    for (const p of room.participants) {
      const name = p.name.toLowerCase();
      if (text.includes(name)) return p.id;
    }
  }

  return null;
}

function isAttempt(text) {
  return ATTEMPT_MARKERS.some(m => text.includes(m));
}

function isAccion(text) {
  return ATTACK_SYNONYMS.some(s => text.includes(s)) ||
    text.startsWith('/atacar') || text.startsWith('/a');
}

function isTransicion(text) {
  return TRANSITION_SYNONYMS.some(s => text.includes(s));
}

function isObservacion(text) {
  return OBSERVATION_SYNONYMS.some(s => text.includes(s));
}

function parse(text, opts = {}) {
  const { mentions, room, sender } = opts;
  const raw = text.toLowerCase();
  const normalized = normalizeText(text);
  const attempt = isAttempt(normalized);
  const moveNumber = detectMoveNumber(normalized, attempt);

  let type = 'accion';
  let intent = 'ofensivo';

  if (normalized.includes('esquivar') || normalized.includes('esquivo')) {
    type = 'accion';
    intent = 'defensivo';
  }

  if (normalized.includes('huir') || normalized.includes('escapar') ||
      normalized.includes('flee') || normalized.includes('retir')) {
    type = 'accion';
    intent = 'retirada';
  }

  if (isTransicion(normalized) && !isAccion(normalized)) {
    type = 'transicion';
    intent = 'auxiliar';
  }

  if (normalized.includes('defender') || normalized.includes('defensa') ||
      normalized.includes('bloquear') || normalized.includes('proteg') ||
      normalized.includes('cubrir') || normalized.includes('guardia') ||
      normalized.includes('cubrirme') || normalized.includes('cubro')) {
    type = 'accion';
    intent = 'defensivo';
  }

  if (!intent || intent === 'ofensivo') {
    if (isObservacion(normalized) && !isAccion(normalized)) {
      type = 'accion';
      intent = 'interact';
    }
  }

  const zone = extractZone(normalized);
  const weapon = extractWeapon(normalized);
  const target = extractTarget(normalized, mentions, room);

  return {
    type,
    intent,
    target,
    zone: zone || 'pecho',
    weapon,
    moveNumber,
    isAttempt: attempt,
    raw: text,
  };
}

function formatParsed(parsed) {
  const parts = [];
  if (parsed.isAttempt) parts.push('intento de');
  parts.push(parsed.type === 'accion' ? 'acción' : 'transición');
  parts.push(parsed.intent);
  if (parsed.target) parts.push(`→ ${parsed.target}`);
  if (parsed.zone) parts.push(`(zona: ${parsed.zone})`);
  if (parsed.weapon) parts.push(`con ${parsed.weapon}`);
  parts.push(`#${parsed.moveNumber}`);
  return parts.join(' ');
}

module.exports = {
  parse,
  formatParsed,
  VALID_ZONES,
  ZONE_ALIASES,
  ATTACK_SYNONYMS,
  TRANSITION_SYNONYMS,
  OBSERVATION_SYNONYMS,
  ATTEMPT_MARKERS,
  isObservacion,
  extractZone,
  extractWeapon,
};
