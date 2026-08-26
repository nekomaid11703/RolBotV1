// @ts-nocheck
/**
 * itemFactory unit tests: validación de tipos, normalización de tier y
 * derivación de metadata (durabilidad, materialStats).
 */

const { buildItem, createItemDefinition, validateDefinition } = require("../src/services/rpg/itemFactory");

describe("validateDefinition", () => {
  it("Acepta tipos válidos", () => {
    for (const type of ["weapon", "armor", "artifact", "consumable", "material", "special"]) {
      expect(validateDefinition({ id: "x", type })).toBe(type);
    }
  });

  it("Rechaza tipo inválido", () => {
    expect(() => validateDefinition({ id: "x", type: "mascota" })).toThrow(/Tipo de ítem inválido/);
  });

  it("Rechaza faltar id", () => {
    expect(() => validateDefinition({ type: "weapon" })).toThrow(/sin 'id'/);
  });
});

describe("createItemDefinition", () => {
  it("Normaliza tier a una clave válida (E-N)", () => {
    const def = createItemDefinition({ id: "espada", type: "weapon", tier: "z" });
    expect(def.tier).toBe("E");
    expect(def.metadata.tier).toBe("E");
  });

  it("Deriva durabilidad para ítems equipables", () => {
    const def = createItemDefinition({ id: "pechera", type: "armor", material: "hierro", tier: "C" });
    expect(def.metadata.durability.maxResist).toBeGreaterThan(0);
    expect(def.metadata.durability.currentResist).toBe(def.metadata.durability.maxResist);
    expect(def.metadata.durability.isRepairable).toBe(true);
  });

  it("No crea durabilidad en consumibles", () => {
    const def = createItemDefinition({ id: "pocion", type: "consumable" });
    expect(def.metadata.durability).toBeUndefined();
  });

  it("Añade materialStats derivadas del material y tier", () => {
    const def = createItemDefinition({ id: "arco", type: "weapon", material: "madera_caoba", tier: "A" });
    expect(def.metadata.materialStats.afilabilidad).toBeGreaterThan(0);
    expect(def.metadata.materialStats.conduccion_magica).toBeGreaterThan(0);
  });

  it("default maxStack = 99 para consumibles, 1 para el resto", () => {
    expect(createItemDefinition({ id: "p", type: "consumable" }).maxStack).toBe(99);
    expect(createItemDefinition({ id: "w", type: "weapon" }).maxStack).toBe(1);
  });
});

describe("buildItem (catálogo vacío)", () => {
  it("Devuelve null si el ítem no está registrado", () => {
    expect(buildItem("no_existe")).toBeNull();
  });
});
