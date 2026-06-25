const ITEMS = [
  {
    id: 'espada_corta',
    name: 'Espada Corta',
    type: 'arma',
    damageType: 'cortadura',
    baseDamage: 8,
    peso: 3,
    rareza: 'comun',
    resistencia: 20,
    equipoSlot: 'arma',
    stats: { fuerza: 2 },
    desc: 'Hoja de acero básica pero funcional.',
  },
  {
    id: 'hacha_mano',
    name: 'Hacha de Mano',
    type: 'arma',
    damageType: 'cortadura',
    baseDamage: 10,
    peso: 4,
    rareza: 'comun',
    resistencia: 18,
    stats: { fuerza: 3 },
    desc: 'Hacha ligera de una mano. Golpes potentes pero lentos.',
  },
  {
    id: 'daga',
    name: 'Daga',
    type: 'arma',
    damageType: 'perforacion',
    baseDamage: 5,
    peso: 1,
    rareza: 'comun',
    resistencia: 15,
    stats: { reflejos: 2, precision: 2 },
    desc: 'Hoja corta y afilada. Rápida y precisa, poco daño base.',
  },
  {
    id: 'lanza',
    name: 'Lanza',
    type: 'arma',
    damageType: 'perforacion',
    baseDamage: 9,
    peso: 4,
    rareza: 'comun',
    resistencia: 16,
    stats: { fuerza: 1, reflejos: 1 },
    desc: 'Vara larga con punta de hierro. Buen alcance.',
  },
  {
    id: 'maza',
    name: 'Maza',
    type: 'arma',
    damageType: 'contundente',
    baseDamage: 11,
    peso: 5,
    rareza: 'comun',
    resistencia: 22,
    stats: { fuerza: 4 },
    desc: 'Maza de hierro macizo. Destructiva contra armaduras pesadas.',
  },
  {
    id: 'escudo_madera',
    name: 'Escudo de Madera',
    type: 'armadura',
    armorType: 'escudo',
    coverage: 'escudo',
    defensaBonus: 3,
    peso: 4,
    rareza: 'comun',
    resistencia: 15,
    equipoSlot: 'brazo_izq',
    stats: { defensa: 2 },
    desc: 'Tablas de roble con refuerzos de cuero.',
  },
  {
    id: 'armadura_cuero',
    name: 'Armadura de Cuero',
    type: 'armadura',
    armorType: 'cuero',
    coverage: 'pectoral',
    defensaBonus: 2,
    peso: 5,
    rareza: 'comun',
    resistencia: 12,
    equipoSlot: 'pecho',
    stats: { defensa: 1, resistencia_fisica: 1 },
    desc: 'Chaleco de cuero tratado. Protección ligera.',
  },
  {
    id: 'cota_malla',
    name: 'Cota de Malla',
    type: 'armadura',
    armorType: 'malla',
    coverage: 'pectoral',
    defensaBonus: 5,
    peso: 10,
    rareza: 'avanzado',
    resistencia: 25,
    equipoSlot: 'pecho',
    stats: { resistencia_fisica: 3, fuerza: -1 },
    desc: 'Anillos de acero entrelazados. Gran defensa, pesada y restrictiva.',
  },
  {
    id: 'yelmo_acero',
    name: 'Yelmo de Acero',
    type: 'armadura',
    armorType: 'placa',
    coverage: 'casco',
    defensaBonus: 4,
    peso: 3,
    rareza: 'avanzado',
    resistencia: 20,
    equipoSlot: 'cabeza',
    stats: { resistencia_fisica: 2, percepcion: -1 },
    desc: 'Casco de acero forjado. Protege la cabeza pero reduce visión periférica.',
  },
  {
    id: 'peto_placas',
    name: 'Peto de Placas',
    type: 'armadura',
    armorType: 'placa',
    coverage: 'pectoral',
    defensaBonus: 8,
    peso: 14,
    rareza: 'elite',
    resistencia: 35,
    equipoSlot: 'pecho',
    stats: { resistencia_fisica: 5, fuerza: -2, reflejos: -2 },
    desc: 'Coraza completa de acero templado. Protección máxima, movilidad mínima.',
  },
  {
    id: 'escudo_acero',
    name: 'Escudo de Acero',
    type: 'armadura',
    armorType: 'escudo',
    coverage: 'escudo',
    defensaBonus: 6,
    peso: 7,
    rareza: 'avanzado',
    resistencia: 30,
    equipoSlot: 'brazo_izq',
    stats: { defensa: 3, resistencia_fisica: 1 },
    desc: 'Escudo de acero con borde reforzado. Resistente y fiable.',
  },
  {
    id: 'armadura_escamas',
    name: 'Armadura de Escamas',
    type: 'armadura',
    armorType: 'escamas',
    coverage: 'pectoral',
    defensaBonus: 6,
    peso: 8,
    rareza: 'elite',
    resistencia: 28,
    equipoSlot: 'pecho',
    stats: { resistencia_fisica: 3, resistencia_magica: 2 },
    desc: 'Escamas de dragón superpuestas. Flexible y resistente a magia.',
  },
  {
    id: 'pocion_vida',
    name: 'Poción de Vida',
    type: 'consumible',
    efecto: 'cura',
    potencia: 25,
    peso: 0.5,
    rareza: 'comun',
    desc: 'Líquido rojo humeante. Restaura 25 de vida.',
  },
  {
    id: 'venda',
    name: 'Venda',
    type: 'consumible',
    efecto: 'estabiliza',
    peso: 0.3,
    rareza: 'comun',
    desc: 'Gasas limpias. Estabiliza zonas heridas sin regenerar.',
  },
  {
    id: 'kit_reparacion',
    name: 'Kit de Reparación',
    type: 'consumible',
    efecto: 'repara',
    potencia: 10,
    peso: 0.8,
    rareza: 'avanzado',
    desc: 'Herramientas y materiales para reparar equipo. Restaura 10 puntos de resistencia al item equipado que elijas.',
  },
  {
    id: 'pocion_fulgor',
    name: 'Poción de Fulgor',
    type: 'consumible',
    efecto: 'fulgor',
    potencia: 20,
    peso: 0.5,
    rareza: 'avanzado',
    desc: 'Líquido azul brillante. Restaura 20 de fulgor.',
  },
];

const COBERTURA_MAP = {
  casco:        ['cabeza'],
  pectoral:     ['pecho', 'abdomen'],
  espalda:      ['espalda'],
  hombreras:    ['brazo_izq', 'brazo_der'],
  guantes:      ['mano_izq', 'mano_der'],
  grebas:       ['pierna_izq', 'pierna_der'],
  botas:        ['pie_izq', 'pie_der'],
  escudo:       ['brazo_izq'],
  cinturon:     ['abdomen'],
};

const DAMAGE_EFFECTIVENESS = {
  cortadura:     { cuero: 1.0, malla: 0.6, placa: 0.4, escamas: 0.8, escudo: 0.5 },
  impacto:       { cuero: 0.8, malla: 1.0, placa: 1.3, escamas: 1.0, escudo: 0.4 },
  perforacion:   { cuero: 1.4, malla: 0.7, placa: 0.5, escamas: 1.1, escudo: 0.6 },
  contundente:   { cuero: 0.9, malla: 1.2, placa: 1.5, escamas: 1.2, escudo: 0.3 },
  magico:        { cuero: 1.0, malla: 1.0, placa: 1.0, escamas: 0.7, escudo: 1.0 },
};

const DAMAGE_ICONS = {
  cortadura: '⚔️',
  impacto: '🛡️',
  perforacion: '🗡️',
  contundente: '🔨',
  magico: '✨',
};

const ARMOR_TYPE_LABELS = {
  cuero: 'cuero',
  malla: 'malla',
  placa: 'placas',
  escamas: 'escamas',
  escudo: 'escudo',
};

function getItem(itemId) {
  return ITEMS.find(i => i.id === itemId) || null;
}

function findItemByName(text) {
  const lower = text.toLowerCase();
  return ITEMS.find(i =>
    i.id.includes(lower) || i.name.toLowerCase().includes(lower)
  ) || null;
}

function getCoverageZones(item) {
  if (!item || !item.coverage) return [];
  if (COBERTURA_MAP[item.coverage]) return COBERTURA_MAP[item.coverage];
  return Array.isArray(item.coverage) ? item.coverage : [item.coverage];
}

function getDamageEffectiveness(damageType, armorType) {
  const byDamage = DAMAGE_EFFECTIVENESS[damageType];
  if (!byDamage) return 1.0;
  return byDamage[armorType] || 1.0;
}

function getDamageIcon(damageType) {
  return DAMAGE_ICONS[damageType] || '⚔️';
}

function getArmorTypeLabel(armorType) {
  return ARMOR_TYPE_LABELS[armorType] || armorType || 'desconocido';
}

function getMaxWeight(character) {
  const base = 50;
  const fuerza = character?.stats?.fuerza || 5;
  return base + fuerza * 5;
}

function isEquippable(item) {
  return item.type === 'arma' || item.type === 'armadura';
}

function getEquipSlot(item) {
  return item.equipoSlot || (item.type === 'arma' ? 'arma' : item.type);
}

function getArmorByCoverage(participant, targetZone) {
  if (!participant.equipped) return null;
  for (const itemId of Object.values(participant.equipped)) {
    if (!itemId) continue;
    const item = getItem(itemId);
    if (item && item.type === 'armadura') {
      const zones = getCoverageZones(item);
      if (zones.includes(targetZone)) return item;
    }
  }
  return null;
}

module.exports = {
  ITEMS,
  COBERTURA_MAP,
  DAMAGE_EFFECTIVENESS,
  DAMAGE_ICONS,
  ARMOR_TYPE_LABELS,
  getItem,
  findItemByName,
  getCoverageZones,
  getDamageEffectiveness,
  getDamageIcon,
  getArmorTypeLabel,
  getMaxWeight,
  isEquippable,
  getEquipSlot,
  getArmorByCoverage,
};
