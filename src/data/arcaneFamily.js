const itemCatalog = require("./itemCatalog");
const { buildSpellDefinition } = require("../services/rpg/skillForgeService");
const { createItemDefinition } = require("../services/rpg/itemFactory");

/**
 * Familia Arcanos — catálogo del canal mágico (Fases B/C).
 *
 * Se registra en `itemCatalog` (registro inyectable) y es visible para el sistema
 * real vía `getItem` de `src/data/items.js`. Cubre el caso de prueba del plan
 * (hechizo "Doom" construido por forja) y el equipamiento de mago (focos, túnica,
 * artefacto y grimorio). Los focos canalizan los hechizos cargados (spellIds) y su
 * `canalizeBase` (derivado de `conduccion_magica` del material) es el término plano
 * del canal → obsolescencia programada (P2).
 */

/**
 * Compone una definición de ítem arcanos normalizando material/tier/metadata vía factory.
 * @param {object} input
 * @returns {object} ItemDefinition con metadata derivada
 */
function define(input) {
  return createItemDefinition({
    material: "madera",
    tier: "D",
    setId: null,
    ...input,
  });
}

/**
 * @constant ARCANE_SPELLS
 * @type {Record<string, object>}
 */
const ARCANE_SPELLS = {
  // Caso de prueba "Doom" (1 hit cryo + 5 hits pyro): el orden dispara la
  // reacción hielo+fuego (derretido ×1.5) en la fase de reacciones (Fase D).
  // Migrado al árbol de forja (Fase D): naturaleza elemental + rol ataque.
  hechizo_doom: buildSpellDefinition({
    id: "hechizo_doom",
    name: "Doom",
    description: "Trae a la tierra un infierno carmesí a través de una explosión de llamas.",
    rarity: "raro",
    basePrice: 1200,
    material: "cuarzo",
    tier: "D",
    naturaleza: "elemental",
    subtype: "pyro",
    role: "ataque",
    activation: "activa",
    moment: "combate",
    effects: [
      { tipo: "dano", target: "enemigo", element: "cryo", magnitude: 1 },
      { tipo: "dano", target: "enemigo", element: "pyro", magnitude: 5 },
    ],
    fulgorCost: 10,
    spellNature: "mágico",
    baseDamage: 0,
    range: 3,
    cooldown: 12,
    castTime: 4,
  }),
};

/**
 * @constant ARCANE_GEAR
 * @type {Record<string, object>}
 */
const ARCANE_GEAR = {
  // ---- Foco 2h (báculo): canaliza el hechizo Doom. Ocupa mano_der + mano_izq.
  baculo_de_roble: define({
    id: "baculo_de_roble",
    type: "focus",
    name: "Báculo de Roble",
    description:
      "Báculo de roble que canaliza el hechizo Doom. Conducción básica, pero suficiente para la arcana menor.",
    rarity: "poco_comun",
    basePrice: 480,
    material: "madera",
    tier: "D",
    categories: ["focus"],
    modules: {
      focus: { slotHeld: "2h", spellIds: ["hechizo_doom"], canalizeScale: 1 },
    },
  }),

  // ---- Foco 1h (varita): deja la otra mano libre (permite escudo/segundo foco).
  varita_de_caoba: define({
    id: "varita_de_caoba",
    type: "focus",
    name: "Varita de Caoba",
    description: "Varita de caoba compacta, de una mano, para lanzar Doom con libertad de movimiento.",
    rarity: "poco_comun",
    basePrice: 420,
    material: "madera_caoba",
    tier: "D",
    categories: ["focus"],
    modules: {
      focus: { slotHeld: "1h", spellIds: ["hechizo_doom"], canalizeScale: 1 },
    },
  }),

  // ---- Túnica (armor pecho): DEF plana + buff mágico de dominio (d_fulgor).
  // Regla C.2: una pieza aporta DEF o buffs mágicos, nunca ambos a la vez —
  // aquí DEF por resistencia material + buff de eficiencia (no daño directo, P3).
  tunica_de_mago: define({
    id: "tunica_de_mago",
    type: "armor",
    name: "Túnica de Mago",
    description: "Túnica con hilos de oro que canalizan el fulgor: refuerza la voluntad del mago (dominio).",
    rarity: "raro",
    basePrice: 640,
    material: "oro",
    tier: "D",
    categories: ["armor"],
    modules: {
      armor: { slot: "pecho", coverage: "media" },
      buff: { stats: { d_fulgor: 10 } },
    },
  }),

  // ---- Artefacto: buff pasivo de fulgor (batería base, P3/P4).
  amuleto_de_fulgor: define({
    id: "amuleto_de_fulgor",
    type: "artifact",
    name: "Amuleto de Fulgor",
    description: "Amuleto de oro con una gema de cuarzo que amplía la reserva de fulgor del portador.",
    rarity: "raro",
    basePrice: 520,
    material: "oro",
    tier: "D",
    categories: ["artifact"],
    modules: {
      buff: { stats: { fulgor: 15 } },
    },
  }),

  // ---- Grimorio (special): almacenamiento de hechizos, NO equipable (C.5).
  grimorio_de_tapa_negra: define({
    id: "grimorio_de_tapa_negra",
    type: "special",
    name: "Grimorio de Tapa Negra",
    description: "Libro de conjuros de tapa negra. Almacena hechizos forjados; no se equipa en combate.",
    rarity: "poco_comun",
    basePrice: 380,
    material: "eterio",
    tier: "D",
    categories: ["special"],
    modules: {},
  }),
};

// Registra cada definición en el catálogo inyectable.
for (const [id, def] of Object.entries(ARCANE_SPELLS)) {
  itemCatalog.register(id, () => def);
}
for (const [id, def] of Object.entries(ARCANE_GEAR)) {
  itemCatalog.register(id, () => def);
}

module.exports = { ARCANE_SPELLS, ARCANE_GEAR };
