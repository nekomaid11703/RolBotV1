const { MATERIALS } = require("../src/data/materialData");

const BUDGET_BY_RARITY = {
  comun: 50,
  poco_comun: 69,
  raro: 95,
  epico: 132,
  legendario: 184,
  mitico: 258,
};

const RARITY_ORDER = ["comun", "poco_comun", "raro", "epico", "legendario", "mitico"];

const KEYS = ["afilabilidad", "conduccion_magica", "resistencia_material", "flexibilidad"];

function sumStats(material) {
  return KEYS.reduce((total, key) => total + material.baseStats[key], 0);
}

describe("B8 — canon de materiales", () => {
  it("respeta el presupuesto de puntos de cada rareza", () => {
    for (const [id, material] of Object.entries(MATERIALS)) {
      if (id === "etereo") continue;
      expect(sumStats(material), `${id} debe sumar ${BUDGET_BY_RARITY[material.rarity]}`).toBe(
        BUDGET_BY_RARITY[material.rarity],
      );
    }
  });

  it("tiene exactamente 4 materiales por rareza (uno por arquetipo)", () => {
    const byRarity = {};
    for (const [id, material] of Object.entries(MATERIALS)) {
      if (id === "etereo") continue;
      byRarity[material.rarity] = byRarity[material.rarity] || [];
      byRarity[material.rarity].push(material.archetype);
    }
    for (const rarity of RARITY_ORDER) {
      expect(byRarity[rarity].sort()).toEqual(["cond", "filo", "flex", "res"]);
    }
  });

  it("las familias por eje mantienen la intuición del canon", () => {
    const families = {
      flex: ["madera", "madera_caoba", "madera_ebano", "madera_noble", "madera_tetrica", "madera_irminsul"],
      res: ["cuero", "coraza_desgastada", "coraza_robusta", "piel_bestial", "luminita", "piel_titan"],
      filo: ["piedra", "acero", "obsidiana", "titanio", "mineral_palido", "filo_estelar"],
      cond: ["cuarzo", "plata", "oro", "mitril", "obsidiana_azul", "fulgorita"],
    };
    for (const [archetype, ids] of Object.entries(families)) {
      for (const id of ids) {
        expect(MATERIALS[id].archetype, `${id} debería ser ${archetype}`).toBe(archetype);
      }
    }
  });

  it("la serie ×1.4 define las primarias por rareza (19→26→36→51→71→100)", () => {
    const focusKey = {
      filo: "afilabilidad",
      cond: "conduccion_magica",
      res: "resistencia_material",
      flex: "flexibilidad",
    };
    for (const archetype of ["filo", "cond", "res", "flex"]) {
      const values = RARITY_ORDER.map((rarity) => {
        const material = Object.values(MATERIALS).find(
          (candidate) => candidate.id !== "etereo" && candidate.rarity === rarity && candidate.archetype === archetype,
        );
        return material.baseStats[focusKey[archetype]];
      });
      expect(values).toEqual([19, 26, 36, 51, 71, 100]);
    }
  });

  it("las rarezas inferiores no compiten con el mítico de su eje", () => {
    const focusKey = {
      filo: "afilabilidad",
      cond: "conduccion_magica",
      res: "resistencia_material",
      flex: "flexibilidad",
    };
    for (const archetype of ["filo", "cond", "res", "flex"]) {
      const epic = Object.values(MATERIALS).find(
        (material) => material.rarity === "epico" && material.archetype === archetype,
      );
      const mythic = Object.values(MATERIALS).find(
        (material) => material.rarity === "mitico" && material.archetype === archetype,
      );
      expect(mythic.baseStats[focusKey[archetype]] - epic.baseStats[focusKey[archetype]]).toBeGreaterThanOrEqual(30);
    }
  });
});
