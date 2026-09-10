// @ts-nocheck
/**
 * Guarda de integridad de referencias (P0 — canon completo):
 * todo itemId usado en configs de juego (expediciones, tiendas, mejoras de
 * herramienta) debe existir en el catálogo y apuntar a un material del canon.
 * Además, toda receta de forja debe poder forjarse para cada material del canon.
 */

const { EXPEDITION_ZONES } = require("../src/config/expeditionConfig");
const { SHOPS } = require("../src/config/shopConfig");
const { TOOL_UPGRADE_COSTS } = require("../src/config/toolsConfig");
const { getItem } = require("../src/data/items");
const { MATERIALS } = require("../src/data/materialData");
const { getSet } = require("../src/data/armorSets");
const { CRAFTING_RECIPES } = require("../src/services/rpg/craftingService");

const CANON_MATERIALS = Object.keys(MATERIALS).filter((id) => id !== "etereo");

function collectReferencedItemIds() {
  const ids = new Set();
  for (const zone of Object.values(EXPEDITION_ZONES)) {
    for (const entry of zone.lootTable || []) {
      if (entry.itemId) ids.add(entry.itemId);
    }
  }
  for (const shop of Object.values(SHOPS)) {
    for (const entry of [...(shop.items || []), ...(shop.rotatingPool || [])]) {
      if (entry.itemId) ids.add(entry.itemId);
    }
  }
  for (const cost of Object.values(TOOL_UPGRADE_COSTS)) {
    for (const mat of cost.materials || []) {
      if (mat.itemId) ids.add(mat.itemId);
    }
  }
  return Array.from(ids);
}

describe("Integridad de referencias de ítems (P0)", () => {
  it("Todo itemId de configs (expedición, tienda, herramientas) existe en el catálogo", () => {
    const missing = collectReferencedItemIds().filter((id) => !getItem(id));
    expect(missing).toEqual([]);
  });

  it("Ningún item referenciado usa un material fuera del canon", () => {
    const nonCanon = [];
    for (const id of collectReferencedItemIds()) {
      const def = getItem(id);
      if (def && def.material && !MATERIALS[def.material]) nonCanon.push(`${id} → ${def.material}`);
    }
    expect(nonCanon).toEqual([]);
  });

  it("Toda receta de forja produce un ítem real para cada material del canon", () => {
    const broken = [];
    for (const [recipeKey, recipe] of Object.entries(CRAFTING_RECIPES)) {
      for (const matId of CANON_MATERIALS) {
        const target = `${recipe.baseType}_de_${matId}`;
        if (!getItem(target)) broken.push(`${recipeKey} → ${target}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("cada material del canon tiene un set de armadura con bono (B6)", () => {
    const missing = [];
    for (const matId of CANON_MATERIALS) {
      const set = getSet(`set_${matId}`);
      if (!set || !set.bonus || Object.keys(set.bonus).length === 0) missing.push(matId);
    }
    expect(missing).toEqual([]);
  });
});
