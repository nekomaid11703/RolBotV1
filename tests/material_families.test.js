import { describe, it, expect } from "vitest";
const { getItem, getAllItems, getItemsByCategory } = require("../src/data/items");
const { MATERIALS } = require("../src/data/materialData");

describe("Familias de Materiales en Catálogo", () => {
  it("debe registrar ítems para todos los materiales físicos de materialData", () => {
    const materials = Object.keys(MATERIALS).filter((m) => m !== "etereo");
    expect(materials.length).toBeGreaterThan(15);

    for (const matId of materials) {
      const sword = getItem(`espada_de_${matId}`);
      expect(sword).not.toBeNull();
      expect(sword.material).toBe(matId);
      expect(sword.type).toBe("weapon");
      expect(sword.metadata).toBeDefined();
      expect(sword.metadata.materialStats).toBeDefined();

      const chest = getItem(`pechera_de_${matId}`);
      expect(chest).not.toBeNull();
      expect(chest.type).toBe("armor");
      expect(chest.setId).toBe(`set_${matId}`);

      const staff = getItem(`baculo_de_${matId}`);
      expect(staff).not.toBeNull();
      expect(staff.type).toBe("weapon");
    }
  });

  it("getAllItems debe retornar la colección completa de ítems estáticos e inyectados", () => {
    const all = getAllItems();
    expect(all.length).toBeGreaterThan(200);
  });

  it("getItemsByCategory debe filtrar correctamente armas y armaduras de todos los materiales", () => {
    const weapons = getItemsByCategory("weapon");
    expect(weapons.length).toBeGreaterThan(50);
    const armors = getItemsByCategory("armor");
    expect(armors.length).toBeGreaterThan(50);
  });
});
