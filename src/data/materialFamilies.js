// @ts-nocheck
const itemCatalog = require("./itemCatalog");
const { MATERIALS } = require("./materialData");
const { createItemDefinition } = require("../services/rpg/itemFactory");

/**
 * Mapeo de multiplicadores de precio base según la rareza del material.
 */
const RARITY_PRICE_MULT = {
  comun: 1,
  poco_comun: 2,
  raro: 4,
  epico: 8,
  legendario: 16,
  mitico: 32,
};

/**
 * Grados de cobertura de armadura soportados por el motor (armorSetService).
 * El grado indicado en `base` se sirve con el ítem existente (compat), el resto
 * se genera como variante `${slot}_${grade}_de_${matId}`.
 * @constant ARMOR_COVERAGE
 * @type {Record<string, {slot: string, base: string, bonusDef: number, basePrice: number, name: string}>}
 */
const ARMOR_COVERAGE = {
  casco: { slot: "cabeza", base: "media", bonusDef: 4, basePrice: 120, name: "Casco" },
  pechera: { slot: "pecho", base: "alta", bonusDef: 7, basePrice: 220, name: "Pechera" },
  grebas: { slot: "pantalones", base: "media", bonusDef: 5, basePrice: 140, name: "Grebas" },
  botas: { slot: "botas", base: "ligera", bonusDef: 3, basePrice: 100, name: "Botas" },
  escudo: { slot: "mano_izq", base: "media", bonusDef: 6, basePrice: 180, name: "Escudo" },
};

/**
 * @constant COVERAGE_GRADES
 * @type {string[]}
 */
const COVERAGE_GRADES = ["ligera", "media", "alta", "total"];
/**
 * @constant COVERAGE_NAME
 * @type {Record<string, string>}
 */
const COVERAGE_NAME = { ligera: "Ligera", media: "Media", alta: "Alta", total: "Total" };

/**
 * Genera y registra dinámicamente el catálogo completo de familias de ítems
 * para todos los materiales del juego (armas, armaduras, artefactos y escudos).
 */
function buildMaterialFamilies() {
  const catalog = {};

  for (const [matId, matDef] of Object.entries(MATERIALS)) {
    if (matId === "etereo") continue;

    const name = matDef.name;
    const rarity = matDef.rarity || "comun";
    const priceMult = RARITY_PRICE_MULT[rarity] || 1;
    const setId = `set_${matId}`;

    const items = [
      // ── Trozo de material (recurso base para forja) ──
      {
        id: `trozo_de_${matId}`,
        type: "material",
        name: `Trozo de ${name}`,
        description: `Trozo de ${name.toLowerCase()} para forja.`,
        rarity,
        basePrice: Math.round(80 * priceMult),
        categories: ["material"],
        material: matId,
        tier: "E",
        modules: {},
      },
      // ── Armas ──
      {
        id: `espada_de_${matId}`,
        type: "weapon",
        name: `Espada de ${name}`,
        description: `Espada cortante forjada en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(150 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { damageNature: "cortante", hands: 1, baseDamage: 20, weaponRange: 1 } },
      },
      {
        id: `espada_larga_de_${matId}`,
        type: "weapon",
        name: `Espada Larga de ${name}`,
        description: `Mandoble cortante de gran alcance forjado en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(190 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { damageNature: "cortante", hands: 2, baseDamage: 28, weaponRange: 2 } },
      },
      {
        id: `maza_de_${matId}`,
        type: "weapon",
        name: `Maza de ${name}`,
        description: `Maza contundente forjada en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(140 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { damageNature: "contundente", hands: 1, baseDamage: 22, weaponRange: 1 } },
      },
      {
        id: `lanza_de_${matId}`,
        type: "weapon",
        name: `Lanza de ${name}`,
        description: `Lanza perforante con punta de ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(160 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { damageNature: "perforante", hands: 2, baseDamage: 24, weaponRange: 2 } },
      },
      {
        id: `daga_de_${matId}`,
        type: "weapon",
        name: `Daga de ${name}`,
        description: `Daga ágil y afilada de ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(100 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { damageNature: "perforante", hands: 1, baseDamage: 14, weaponRange: 1 } },
      },
      {
        id: `baculo_de_${matId}`,
        type: "weapon",
        name: `Báculo de ${name}`,
        description: `Báculo mágico de gran conducción canalizado en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(200 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { damageNature: "magico", hands: 2, baseDamage: 18, weaponRange: 3 } },
      },
      {
        id: `varita_de_${matId}`,
        type: "focus",
        name: `Varita de ${name}`,
        description: `Varita mágica de una mano forjada en ${name.toLowerCase()}. Deja la otra mano libre para escudo o segundo foco.`,
        rarity,
        basePrice: Math.round(170 * priceMult),
        categories: ["focus"],
        material: matId,
        tier: "E",
        modules: { focus: { slotHeld: "1h", spellIds: [], canalizeScale: 1 } },
      },

      // ── Armadura (Set) ──
      {
        id: `casco_de_${matId}`,
        type: "armor",
        name: `Casco de ${name}`,
        description: `Casco protector fabricado en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(120 * priceMult),
        categories: ["armor"],
        material: matId,
        tier: "E",
        setId,
        modules: { armor: { slot: "cabeza", coverage: "media", bonusDef: 4 } },
      },
      {
        id: `pechera_de_${matId}`,
        type: "armor",
        name: `Pechera de ${name}`,
        description: `Coraza protectora reforzada en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(220 * priceMult),
        categories: ["armor"],
        material: matId,
        tier: "E",
        setId,
        modules: { armor: { slot: "pecho", coverage: "alta", bonusDef: 7 } },
      },
      {
        id: `grebas_de_${matId}`,
        type: "armor",
        name: `Grebas de ${name}`,
        description: `Grebas de protección para piernas hechas de ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(140 * priceMult),
        categories: ["armor"],
        material: matId,
        tier: "E",
        setId,
        modules: { armor: { slot: "pantalones", coverage: "media", bonusDef: 5 } },
      },
      {
        id: `botas_de_${matId}`,
        type: "armor",
        name: `Botas de ${name}`,
        description: `Botas resistentes reforzadas en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(100 * priceMult),
        categories: ["armor"],
        material: matId,
        tier: "E",
        setId,
        modules: { armor: { slot: "botas", coverage: "ligera", bonusDef: 3 } },
      },

      // ── Túnica de Mago (capa: cobertura ligera, bonificación de mago) ──
      // Lore: la capa es de tela (cobertura mínima); el material del broche
      // aplica la bonificación arcana. No forma parte del set de armadura.
      {
        id: `tunica_de_${matId}`,
        type: "armor",
        name: `Túnica de ${name}`,
        description: `Túnica de mago con broche de ${name.toLowerCase()}. Tela ligera, pero canaliza el dominio arcano.`,
        rarity,
        basePrice: Math.round(210 * priceMult),
        categories: ["armor"],
        material: matId,
        tier: "E",
        setId: null,
        modules: {
          armor: { slot: "pecho", coverage: "ligera", bonusDef: 3 },
          buff: { stats: { d_fulgor: 10 } },
        },
      },

      // ── Escudo y Artefacto ──
      {
        id: `escudo_de_${matId}`,
        type: "armor",
        name: `Escudo de ${name}`,
        description: `Escudo defensivo forjado en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(180 * priceMult),
        categories: ["armor"],
        material: matId,
        tier: "E",
        modules: { armor: { slot: "mano_izq", coverage: "media", bonusDef: 6 } },
      },
      {
        id: `amuleto_de_${matId}`,
        type: "artifact",
        name: `Amuleto de ${name}`,
        description: `Amuleto místico engastado en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(250 * priceMult),
        categories: ["artifact"],
        material: matId,
        tier: "E",
        modules: { buff: { stats: {} } },
      },

      // ── Armas a Distancia y Municiones ──
      {
        id: `arco_de_${matId}`,
        type: "weapon",
        name: `Arco de ${name}`,
        description: `Arco estilizado para combate a distancia en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(200 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { ranged: true, hands: 2, weaponRange: 5, baseDamage: 0 } },
      },
      {
        id: `ballesta_de_${matId}`,
        type: "weapon",
        name: `Ballesta de ${name}`,
        description: `Mecanismo pesado de disparo a distancia en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(300 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { ranged: true, hands: 2, weaponRange: 6, baseDamage: 0 } },
      },
      {
        id: `resortera_de_${matId}`,
        type: "weapon",
        name: `Resortera de ${name}`,
        description: `Arma a distancia ligera e impulsiva en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(90 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { ranged: true, hands: 1, weaponRange: 3, baseDamage: 0 } },
      },
      {
        id: `cerbatana_de_${matId}`,
        type: "weapon",
        name: `Cerbatana de ${name}`,
        description: `Arma sigilosa de proyección en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(110 * priceMult),
        categories: ["weapon"],
        material: matId,
        tier: "E",
        modules: { weapon: { ranged: true, hands: 1, weaponRange: 4, baseDamage: 0 } },
      },
      {
        id: `flechas_de_${matId}`,
        type: "weapon",
        name: `Flechas de ${name}`,
        description: `Set de flechas afiladas en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(50 * priceMult),
        categories: ["projectile", "ammo"],
        material: matId,
        tier: "E",
        modules: { weapon: { ranged: false, damageNature: "proyectil", baseDamage: 12 } },
      },
      {
        id: `virotes_de_${matId}`,
        type: "weapon",
        name: `Virotes de ${name}`,
        description: `Set de virotes penetrantes de ballesta en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(70 * priceMult),
        categories: ["projectile", "ammo"],
        material: matId,
        tier: "E",
        modules: { weapon: { ranged: false, damageNature: "perforante", baseDamage: 18 } },
      },
      {
        id: `balines_de_${matId}`,
        type: "weapon",
        name: `Balines de ${name}`,
        description: `Munición contundente para resortera en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(30 * priceMult),
        categories: ["projectile", "ammo"],
        material: matId,
        tier: "E",
        modules: { weapon: { ranged: false, damageNature: "contundente", baseDamage: 8 } },
      },
      {
        id: `dardos_de_${matId}`,
        type: "weapon",
        name: `Dardos de ${name}`,
        description: `Dardos ligeros y precisos de cerbatana en ${name.toLowerCase()}.`,
        rarity,
        basePrice: Math.round(40 * priceMult),
        categories: ["projectile", "ammo"],
        material: matId,
        tier: "E",
        modules: { weapon: { ranged: false, damageNature: "perforante", baseDamage: 10 } },
      },
    ];

    // ── Grados de cobertura de armadura (variantes ligera/media/alta/total) ────
    for (const [slotKey, cfg] of Object.entries(ARMOR_COVERAGE)) {
      for (const grade of COVERAGE_GRADES) {
        if (grade === cfg.base) continue; // el grado base se cubre con el ítem existente
        items.push({
          id: `${slotKey}_${grade}_de_${matId}`,
          type: "armor",
          name: `${cfg.name} ${COVERAGE_NAME[grade]} de ${name}`,
          description: `${cfg.name} de cobertura ${COVERAGE_NAME[grade].toLowerCase()} forjado en ${name.toLowerCase()}.`,
          rarity,
          basePrice: Math.round(cfg.basePrice * priceMult),
          categories: ["armor"],
          material: matId,
          tier: "E",
          setId,
          modules: { armor: { slot: cfg.slot, coverage: grade, bonusDef: cfg.bonusDef } },
        });
      }
    }

    for (const rawDef of items) {
      const def = createItemDefinition(rawDef);
      catalog[def.id] = def;

      // Registrar en el catálogo inyectable si no está previamente registrado
      if (!itemCatalog.load(def.id)) {
        itemCatalog.register(def.id, () => def);
      }
    }
  }

  return catalog;
}

const MATERIAL_ITEMS = buildMaterialFamilies();

module.exports = {
  MATERIAL_ITEMS,
  buildMaterialFamilies,
};
