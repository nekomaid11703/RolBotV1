// @ts-nocheck
/**
 * itemFactory unit tests: validación de tipos, normalización de tier y
 * derivación de metadata (durabilidad, materialStats).
 */

const itemFactory = require("../src/services/rpg/itemFactory");

describe("validateDefinition", () => {
  it("Acepta tipos válidos", () => {
    for (const type of ["weapon", "armor", "artifact", "consumable", "material", "special"]) {
      expect(itemFactory.validateDefinition({ id: "x", type })).toBe(type);
    }
  });

  it("Rechaza tipo inválido", () => {
    expect(() => itemFactory.validateDefinition({ id: "x", type: "mascota" })).toThrow(/Tipo de ítem inválido/);
  });

  it("Rechaza faltar id", () => {
    expect(() => itemFactory.validateDefinition({ type: "weapon" })).toThrow(/sin 'id'/);
  });
});

describe("createItemDefinition", () => {
  it("Normaliza tier a una clave válida (E-N)", () => {
    const def = itemFactory.createItemDefinition({ id: "espada", type: "weapon", tier: "z" });
    expect(def.tier).toBe("E");
    expect(def.metadata.tier).toBe("E");
  });

  it("Deriva durabilidad para ítems equipables", () => {
    const def = itemFactory.createItemDefinition({ id: "pechera", type: "armor", material: "hierro", tier: "C" });
    expect(def.metadata.durability.maxResist).toBeGreaterThan(0);
    expect(def.metadata.durability.currentResist).toBe(def.metadata.durability.maxResist);
    expect(def.metadata.durability.isRepairable).toBe(true);
  });

  it("No crea durabilidad en consumibles", () => {
    const def = itemFactory.createItemDefinition({ id: "pocion", type: "consumable" });
    expect(def.metadata.durability).toBeUndefined();
  });

  it("Añade materialStats derivadas del material y tier", () => {
    const def = itemFactory.createItemDefinition({ id: "arco", type: "weapon", material: "madera_caoba", tier: "A" });
    expect(def.metadata.materialStats.afilabilidad).toBeGreaterThan(0);
    expect(def.metadata.materialStats.conduccion_magica).toBeGreaterThan(0);
  });

  it("default maxStack = 99 para consumibles, 1 para el resto", () => {
    expect(itemFactory.createItemDefinition({ id: "p", type: "consumable" }).maxStack).toBe(99);
    expect(itemFactory.createItemDefinition({ id: "w", type: "weapon" }).maxStack).toBe(1);
  });
});

describe("buildItem (catálogo vacío)", () => {
  it("Devuelve null si el ítem no está registrado", () => {
    expect(itemFactory.buildItem("no_existe")).toBeNull();
  });
});