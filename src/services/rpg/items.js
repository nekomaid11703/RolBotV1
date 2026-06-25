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
    filo: true,
    coverage: null,
    equipoSlot: 'arma',
    stats: { fuerza: 2 },
    desc: 'Hoja de acero básica pero funcional.',
  },
  {
    id: 'escudo_madera',
    name: 'Escudo de Madera',
    type: 'armadura',
    damageType: 'impacto',
    coverage: ['brazo_izq'],
    defensaBonus: 3,
    peso: 4,
    rareza: 'comun',
    resistencia: 15,
    filo: false,
    equipoSlot: 'brazo_izq',
    stats: { defensa: 2 },
    desc: 'Tablas de roble con refuerzos de cuero.',
  },
  {
    id: 'armadura_cuero',
    name: 'Armadura de Cuero',
    type: 'armadura',
    coverage: ['pecho', 'abdomen'],
    defensaBonus: 2,
    peso: 5,
    rareza: 'comun',
    resistencia: 12,
    filo: false,
    equipoSlot: 'pecho',
    stats: { defensa: 1, resistencia_fisica: 1 },
    desc: 'Chaleco de cuero tratado. Protección ligera.',
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
];

const COBERTURA_MAP = {
  casco:        ['cabeza'],
  pectoral:     ['pecho', 'espalda'],
  hombreras:    ['brazo_izq', 'brazo_der'],
  guantes:      ['mano_izq', 'mano_der'],
  grebas:       ['pierna_izq', 'pierna_der'],
  botas:        ['pie_izq', 'pie_der'],
  escudo:       ['brazo_izq'],
  cinturon:     ['abdomen'],
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

module.exports = {
  ITEMS,
  COBERTURA_MAP,
  getItem,
  findItemByName,
  getCoverageZones,
  getMaxWeight,
  isEquippable,
  getEquipSlot,
};
