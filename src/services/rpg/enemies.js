// @ts-nocheck
const ENEMIES = [
  {
    id: "slime",
    name: "Slime",
    description: "Un bicho gelatinoso que apenas se mueve.",
    level: 1,
    hp: 25,
    stats: { fuerza: 2, velocidad: 1, reflejos: 1, resistencia_fisica: 1, resistencia_magica: 1, dominio_magico: 1 },
    reward: { stelasMin: 3, stelasMax: 10, xp: 15 },
    loot: [{ itemId: "venda", chance: 0.3, min: 1, max: 2 }],
  },
  {
    id: "goblin",
    name: "Goblin",
    description: "Una criatura pequeña, verde y malhumorada.",
    level: 2,
    hp: 40,
    stats: { fuerza: 5, velocidad: 4, reflejos: 4, resistencia_fisica: 3, resistencia_magica: 2, dominio_magico: 2 },
    reward: { stelasMin: 8, stelasMax: 20, xp: 30 },
    loot: [
      { itemId: "venda", chance: 0.5, min: 1, max: 2 },
      { itemId: "pocion_vida", chance: 0.2, min: 1, max: 1 },
    ],
  },
  {
    id: "wolf",
    name: "Lobo Salvaje",
    description: "Un lobo de mirada hambrienta que viaja en manada.",
    level: 3,
    hp: 55,
    stats: { fuerza: 7, velocidad: 6, reflejos: 6, resistencia_fisica: 4, resistencia_magica: 1, dominio_magico: 1 },
    reward: { stelasMin: 12, stelasMax: 28, xp: 45 },
    loot: [{ itemId: "venda", chance: 0.6, min: 1, max: 3 }],
  },
  {
    id: "bandit",
    name: "Bandido",
    description: "Un forajido que asalta caminos buscando peleas.",
    level: 4,
    hp: 65,
    stats: { fuerza: 8, velocidad: 5, reflejos: 5, resistencia_fisica: 5, resistencia_magica: 3, dominio_magico: 3 },
    reward: { stelasMin: 15, stelasMax: 35, xp: 60 },
    loot: [
      { itemId: "venda", chance: 0.4, min: 1, max: 2 },
      { itemId: "pocion_vida", chance: 0.3, min: 1, max: 1 },
      { itemId: "espada_corta", chance: 0.05, min: 1, max: 1 },
    ],
  },
  {
    id: "skeleton",
    name: "Esqueleto",
    description: "Los restos animados de un guerrero caído.",
    level: 5,
    hp: 75,
    stats: { fuerza: 9, velocidad: 3, reflejos: 4, resistencia_fisica: 7, resistencia_magica: 4, dominio_magico: 4 },
    reward: { stelasMin: 20, stelasMax: 45, xp: 80 },
    loot: [
      { itemId: "venda", chance: 0.3, min: 1, max: 2 },
      { itemId: "escudo_madera", chance: 0.1, min: 1, max: 1 },
      { itemId: "espada_corta", chance: 0.08, min: 1, max: 1 },
    ],
  },
  {
    id: "shadow",
    name: "Sombra",
    description: "Una masa oscura que se mueve entre las tinieblas.",
    level: 7,
    hp: 85,
    stats: { fuerza: 6, velocidad: 9, reflejos: 9, resistencia_fisica: 4, resistencia_magica: 8, dominio_magico: 8 },
    reward: { stelasMin: 30, stelasMax: 60, xp: 120 },
    loot: [
      { itemId: "pocion_vida", chance: 0.4, min: 1, max: 2 },
      { itemId: "venda", chance: 0.3, min: 1, max: 2 },
    ],
  },
  {
    id: "orc",
    name: "Orco",
    description: "Una bestia corpulenta con sed de sangre.",
    level: 8,
    hp: 120,
    stats: { fuerza: 14, velocidad: 4, reflejos: 5, resistencia_fisica: 10, resistencia_magica: 4, dominio_magico: 2 },
    reward: { stelasMin: 35, stelasMax: 70, xp: 150 },
    loot: [
      { itemId: "armadura_cuero", chance: 0.15, min: 1, max: 1 },
      { itemId: "espada_corta", chance: 0.1, min: 1, max: 1 },
      { itemId: "pocion_vida", chance: 0.3, min: 1, max: 2 },
    ],
  },
  {
    id: "troll",
    name: "Troll",
    description: "Una criatura enorme y regenerativa que vive bajo puentes.",
    level: 10,
    hp: 180,
    stats: { fuerza: 16, velocidad: 3, reflejos: 4, resistencia_fisica: 14, resistencia_magica: 6, dominio_magico: 5 },
    reward: { stelasMin: 50, stelasMax: 100, xp: 200 },
    loot: [
      { itemId: "armadura_cuero", chance: 0.25, min: 1, max: 1 },
      { itemId: "pocion_vida", chance: 0.5, min: 1, max: 3 },
      { itemId: "espada_corta", chance: 0.15, min: 1, max: 1 },
    ],
  },
];

function getEnemy(id) {
  return ENEMIES.find((e) => e.id === id.toLowerCase()) || null;
}

function getAllEnemies() {
  return ENEMIES;
}

function getEnemyByLevel(level) {
  const candidates = ENEMIES.filter((e) => Math.abs(e.level - level) <= 2);
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
