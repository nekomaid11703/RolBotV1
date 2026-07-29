// @ts-nocheck
const { getTierMultiplier, getSpecialTierMult, getTierPenaltyBonus } = require("../src/config/tierConfig");
const { getMaterialStats } = require("../src/data/materialData");
const WeaponModule = require("../src/data/itemCategories/weapon");
const ArmorModule = require("../src/data/itemCategories/armor");
const DurabilityModule = require("../src/data/itemCategories/durability");

describe("Sistema de Tiers", () => {
  it("getTierMultiplier: E=1.12 a N=1.84", () => {
    expect(getTierMultiplier("E")).toBe(1.12);
    expect(getTierMultiplier("D")).toBe(1.24);
    expect(getTierMultiplier("C")).toBe(1.36);
    expect(getTierMultiplier("B")).toBe(1.48);
    expect(getTierMultiplier("A")).toBe(1.6);
    expect(getTierMultiplier("S")).toBe(1.72);
    expect(getTierMultiplier("N")).toBe(1.84);
  });

  it("getSpecialTierMult: E=1.2 a N=6.0", () => {
    expect(getSpecialTierMult("E")).toBe(1.2);
    expect(getSpecialTierMult("D")).toBe(1.5);
    expect(getSpecialTierMult("C")).toBe(2.0);
    expect(getSpecialTierMult("B")).toBe(3.0);
    expect(getSpecialTierMult("A")).toBe(4.0);
    expect(getSpecialTierMult("S")).toBe(5.0);
    expect(getSpecialTierMult("N")).toBe(6.0);
  });

  it("getTierPenaltyBonus: E=0.12 a N=0.84 (Cortante)", () => {
    expect(getTierPenaltyBonus("E")).toBe(0.12);
    expect(getTierPenaltyBonus("N")).toBe(0.84);
  });

  it("tier inválido normaliza a E por defecto", () => {
    expect(getTierMultiplier("X")).toBe(1.12);
    expect(getTierMultiplier(null)).toBe(1.12);
    expect(getTierMultiplier(undefined)).toBe(1.12);
  });
});

describe("Sistema de Materiales", () => {
  it("Calcula atributos de material escalados por Tier", () => {
    const maderaE = getMaterialStats("madera", "E");
    const maderaN = getMaterialStats("madera", "N");
    // Resistencia base 20, Tier E = 20 * 1.12 = 22.4 -> 22
    expect(maderaE.resistencia_material).toBe(Math.round(20 * 1.12));
    // Resistencia base 20, Tier N = 20 * 1.84 = 36.8 -> 37
    expect(maderaN.resistencia_material).toBe(Math.round(20 * 1.84));
  });

  it("Material mítico supera en su stat principal a cualquier legendario al mismo tier", () => {
    // Afilabilidad: Filo Estelar (mítico, base 100) vs Luminita (legendario, base 80)
    const filoE = getMaterialStats("filo_estelar", "E");
    const luminitaE = getMaterialStats("luminita", "E");
    expect(filoE.afilabilidad).toBeGreaterThan(luminitaE.afilabilidad);
  });

  it("Material desconocido devuelve stats de madera (fallback)", () => {
    const unknown = getMaterialStats("no_existe", "E");
    const madera = getMaterialStats("madera", "E");
    expect(unknown).toEqual(madera);
  });
});

describe("Módulo WeaponModule", () => {
  it("Instancia con naturaleza cortante por defecto", () => {
    const weapon = new WeaponModule({});
    const res = weapon.onAttack({});
    expect(res.damageNature).toBe("cortante");
    expect(res.hands).toBe(1);
    expect(res.tier).toBe("E");
  });

  it("Instancia arma a dos manos perforante tier A", () => {
    const weapon = new WeaponModule({ damageNature: "perforante", hands: 2, tier: "A", baseDamage: 50 });
    const res = weapon.onAttack({});
    expect(res.damageNature).toBe("perforante");
    expect(res.hands).toBe(2);
    expect(res.tier).toBe("A");
    expect(res.baseDamage).toBe(50);
  });

  it("Trigger debe ser Attack", () => {
    expect(WeaponModule.triggers).toContain("Attack");
  });
});

describe("Módulo ArmorModule", () => {
  it("Instancia con slot y cobertura correctos", () => {
    const armor = new ArmorModule({ slot: "pecho", coverage: "total", bonusDef: 20 });
    const equip = armor.onEquip({});
    expect(equip.slot).toBe("pecho");
    expect(equip.coverage).toBe("total");
    expect(equip.bonusDef).toBe(20);
  });

  it("onUnequip devuelve el slot del que fue retirada", () => {
    const armor = new ArmorModule({ slot: "cabeza" });
    const unequip = armor.onUnequip({});
    expect(unequip.slot).toBe("cabeza");
  });

  it("Triggers deben incluir Equip y Unequip", () => {
    expect(ArmorModule.triggers).toContain("Equip");
    expect(ArmorModule.triggers).toContain("Unequip");
  });
});

describe("Módulo DurabilityModule (Rotura y Reparación)", () => {
  it("Absorbe daño parcial sin romperse", () => {
    const dur = new DurabilityModule({ maxResist: 100, isRepairable: false });
    const result = dur.absorbDamage(40);
    expect(result.absorbed).toBe(40);
    expect(result.overflow).toBe(0);
    expect(result.isBroken).toBe(false);
    expect(result.isDestroyed).toBe(false);
    expect(dur.currentResist).toBe(60);
  });

  it("Item NO reparable se destruye al llegar a 0 durabilidad", () => {
    const dur = new DurabilityModule({ maxResist: 50, isRepairable: false });
    const result = dur.absorbDamage(70);
    expect(result.absorbed).toBe(50);
    expect(result.overflow).toBe(20);
    expect(result.isDestroyed).toBe(true);
    expect(result.isBroken).toBe(false);
  });

  it("Item reparable adquiere propiedad broken sin destruirse", () => {
    const dur = new DurabilityModule({ maxResist: 50, isRepairable: true });
    const result = dur.absorbDamage(70);
    expect(result.absorbed).toBe(50);
    expect(result.overflow).toBe(20);
    expect(result.isBroken).toBe(true);
    expect(result.isDestroyed).toBe(false);
  });

  it("Item ya roto devuelve 0 absorción y todo como overflow", () => {
    const dur = new DurabilityModule({ maxResist: 50, isRepairable: true, isBroken: true });
    const result = dur.absorbDamage(30);
    expect(result.absorbed).toBe(0);
    expect(result.overflow).toBe(30);
    expect(result.isBroken).toBe(true);
  });

  it("Trigger debe ser Hit", () => {
    expect(DurabilityModule.triggers).toContain("Hit");
  });
});
