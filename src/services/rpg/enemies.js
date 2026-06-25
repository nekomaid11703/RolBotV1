const ENEMIES = [
  {
    id: 'slime',
    name: 'Slime',
    description: 'Un bicho gelatinoso que apenas se mueve.',
    level: 1,
    hp: 25,
    mp: 3,
    stats: { fuerza: 2, defensa: 1, agilidad: 1, magia: 1, percepcion: 1, carisma: 1 },
    reward: { stelasMin: 3, stelasMax: 10, xp: 15 },
    loot: [{ itemId: 'venda', chance: 0.3, min: 1, max: 2 }],
  },
  {
    id: 'goblin',
    name: 'Goblin',
    description: 'Una criatura pequeña, verde y malhumorada.',
    level: 2,
    hp: 40,
    mp: 5,
    stats: { fuerza: 5, defensa: 3, agilidad: 4, magia: 2, percepcion: 3, carisma: 2 },
    reward: { stelasMin: 8, stelasMax: 20, xp: 30 },
    loot: [
      { itemId: 'venda', chance: 0.5, min: 1, max: 2 },
      { itemId: 'pocion_vida', chance: 0.2, min: 1, max: 1 },
    ],
  },
  {
    id: 'wolf',
    name: 'Lobo Salvaje',
    description: 'Un lobo de mirada hambrienta que viaja en manada.',
    level: 3,
    hp: 55,
    mp: 5,
    stats: { fuerza: 7, defensa: 4, agilidad: 6, magia: 1, percepcion: 5, carisma: 1 },
    reward: { stelasMin: 12, stelasMax: 28, xp: 45 },
    loot: [{ itemId: 'venda', chance: 0.6, min: 1, max: 3 }],
  },
  {
    id: 'bandit',
    name: 'Bandido',
    description: 'Un forajido que asalta caminos buscando peleas.',
    level: 4,
    hp: 65,
    mp: 8,
    stats: { fuerza: 8, defensa: 5, agilidad: 5, magia: 3, percepcion: 4, carisma: 3 },
    reward: { stelasMin: 15, stelasMax: 35, xp: 60 },
    loot: [
      { itemId: 'venda', chance: 0.4, min: 1, max: 2 },
      { itemId: 'pocion_vida', chance: 0.3, min: 1, max: 1 },
      { itemId: 'espada_corta', chance: 0.05, min: 1, max: 1 },
    ],
  },
  {
    id: 'skeleton',
    name: 'Esqueleto',
    description: 'Los restos animados de un guerrero caído.',
    level: 5,
    hp: 75,
    mp: 10,
    stats: { fuerza: 9, defensa: 7, agilidad: 3, magia: 4, percepcion: 3, carisma: 1 },
    reward: { stelasMin: 20, stelasMax: 45, xp: 80 },
    loot: [
      { itemId: 'venda', chance: 0.3, min: 1, max: 2 },
      { itemId: 'escudo_madera', chance: 0.1, min: 1, max: 1 },
      { itemId: 'espada_corta', chance: 0.08, min: 1, max: 1 },
    ],
  },
  {
    id: 'shadow',
    name: 'Sombra',
    description: 'Una masa oscura que se mueve entre las tinieblas.',
    level: 7,
    hp: 85,
    mp: 20,
    stats: { fuerza: 6, defensa: 4, agilidad: 9, magia: 8, percepcion: 7, carisma: 4 },
    reward: { stelasMin: 30, stelasMax: 60, xp: 120 },
    loot: [
      { itemId: 'pocion_vida', chance: 0.4, min: 1, max: 2 },
      { itemId: 'venda', chance: 0.3, min: 1, max: 2 },
    ],
  },
  {
    id: 'orc',
    name: 'Orco',
    description: 'Una bestia corpulenta con sed de sangre.',
    level: 8,
    hp: 120,
    mp: 8,
    stats: { fuerza: 14, defensa: 10, agilidad: 4, magia: 2, percepcion: 5, carisma: 2 },
    reward: { stelasMin: 35, stelasMax: 70, xp: 150 },
    loot: [
      { itemId: 'armadura_cuero', chance: 0.15, min: 1, max: 1 },
      { itemId: 'espada_corta', chance: 0.1, min: 1, max: 1 },
      { itemId: 'pocion_vida', chance: 0.3, min: 1, max: 2 },
    ],
  },
  {
    id: 'troll',
    name: 'Troll',
    description: 'Una criatura enorme y regenerativa que vive bajo puentes.',
    level: 10,
    hp: 180,
    mp: 15,
    stats: { fuerza: 16, defensa: 14, agilidad: 3, magia: 5, percepcion: 4, carisma: 2 },
    reward: { stelasMin: 50, stelasMax: 100, xp: 200 },
    loot: [
      { itemId: 'armadura_cuero', chance: 0.25, min: 1, max: 1 },
      { itemId: 'pocion_vida', chance: 0.5, min: 1, max: 3 },
      { itemId: 'espada_corta', chance: 0.15, min: 1, max: 1 },
    ],
  },
];

function getEnemy(id) {
  return ENEMIES.find(e => e.id === id.toLowerCase()) || null;
}

function getAllEnemies() {
  return ENEMIES;
}

function getEnemyByLevel(level) {
  const candidates = ENEMIES.filter(e => Math.abs(e.level - level) <= 2);
  if (candidates.length === 0) return ENEMIES[0];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function generateLoot(enemyId) {
  const enemy = getEnemy(enemyId);
  if (!enemy || !enemy.loot || enemy.loot.length === 0) return [];

  const drops = [];
  for (const entry of enemy.loot) {
    if (Math.random() < entry.chance) {
      const qty = entry.min + Math.floor(Math.random() * (entry.max - entry.min + 1));
      drops.push({ itemId: entry.itemId, quantity: qty });
    }
  }
  return drops;
}

function generateLootForEnemies(enemyIds) {
  const all = [];
  for (const eid of enemyIds) {
    all.push(...generateLoot(eid));
  }

  const merged = {};
  for (const d of all) {
    merged[d.itemId] = (merged[d.itemId] || 0) + d.quantity;
  }

  return Object.entries(merged).map(([itemId, quantity]) => ({ itemId, quantity }));
}

module.exports = { ENEMIES, getEnemy, getAllEnemies, getEnemyByLevel, generateLoot, generateLootForEnemies };
