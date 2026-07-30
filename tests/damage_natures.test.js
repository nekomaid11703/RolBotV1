// @ts-nocheck
const { getTierMultiplier, getSpecialTierMult, getTierPenaltyBonus } = require("../src/config/tierConfig");
const { getMaterialStats } = require("../src/data/materialData");
const WeaponModule = require("../src/data/itemCategories/weapon");
const ArmorModule = require("../src/data/itemCategories/armor");
const DurabilityModule = require("../src/data/itemCategories/durability");
const { calculateWeaponDamage, resolveAttackerSpeed } = require("../src/services/rpg/combatEngine");

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

// ─── Stats penalizadas de referencia para los tests de daño ───────────────────
const ATK_STATS = { atk: 100, def: 20, aspd: 80, ref: 60 };
const DEF_STATS = { atk: 50, def: 40, aspd: 60, ref: 50 };

describe("calculateWeaponDamage — Naturalezas de daño", () => {
  it("Desarmado: usa fórmula base atk/(100+def)", () => {
    const { bodyDamage, nature } = calculateWeaponDamage(ATK_STATS, DEF_STATS, null);
    const expected = Math.floor(100 * (100 / (100 + 40)));
    expect(bodyDamage).toBe(Math.max(1, expected));
    expect(nature).toBe("desarmado");
  });

  it("Cortante tier E: penetra 12% de la defensa, daño = 80% ATK + base", () => {
    const weaponInfo = { damageNature: "cortante", tier: "E", baseDamage: 10 };
    const { bodyDamage, nature } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo);
    const effectiveDef = Math.floor(40 * (1 - 0.12)); // 35
    const rawDamage = Math.floor(0.8 * 100) + 10; // 90
    const expected = Math.max(1, Math.floor(rawDamage * (100 / (100 + effectiveDef))));
    expect(bodyDamage).toBe(expected);
    expect(nature).toBe("cortante");
  });

  it("Cortante tier N: penetra 84% de la defensa", () => {
    const weaponInfo = { damageNature: "cortante", tier: "N", baseDamage: 10 };
    const { bodyDamage } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo);
    const effectiveDef = Math.floor(40 * (1 - 0.84)); // 6
    const rawDamage = Math.floor(0.8 * 100) + 10; // 90
    const expected = Math.max(1, Math.floor(rawDamage * (100 / (100 + effectiveDef))));
    expect(bodyDamage).toBe(expected);
  });

  it("Cortante con alta penetración (tier S) supera a desarmado vs mismo defensor", () => {
    // Tier S = 72% penetración: effectiveDef = floor(40 * 0.28) = 11
    // Cortante: floor(0.8*100 + 0) = 80 vs effectiveDef 11 → ~72
    // Desarmado: floor(100 * 100/140) = 71
    const weaponInfo = { damageNature: "cortante", tier: "S", baseDamage: 0 };
    const { bodyDamage: cortanteDmg } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo);
    const { bodyDamage: desarmadoDmg } = calculateWeaponDamage(ATK_STATS, DEF_STATS, null);
    expect(cortanteDmg).toBeGreaterThan(desarmadoDmg);
  });

  it("Contundente: materialDamage > bodyDamage (multiplicador tier)", () => {
    const weaponInfo = { damageNature: "contundente", tier: "C", baseDamage: 0 };
    const { bodyDamage, materialDamage, nature } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo);
    expect(materialDamage).toBeGreaterThan(bodyDamage);
    expect(nature).toBe("contundente");
    // tier C = 2.0x
    expect(materialDamage).toBe(Math.max(1, Math.floor(bodyDamage * 2.0)));
  });

  it("Perforante: ignora defensa, baseDamage * tierMult, material = mitad", () => {
    const weaponInfo = { damageNature: "perforante", tier: "E", baseDamage: 40 };
    const { bodyDamage, materialDamage, nature } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo);
    const expected = Math.max(1, Math.floor(40 * 1.2)); // tier E = 1.2x
    expect(bodyDamage).toBe(expected);
    expect(materialDamage).toBe(Math.max(1, Math.floor(expected * 0.5)));
    expect(nature).toBe("perforante");
  });

  it("Perforante: daño corporal es independiente de la DEF del defensor", () => {
    const weakDef = { ...DEF_STATS, def: 1 };
    const strongDef = { ...DEF_STATS, def: 999 };
    const weaponInfo = { damageNature: "perforante", tier: "B", baseDamage: 50 };
    const { bodyDamage: dmgWeak } = calculateWeaponDamage(ATK_STATS, weakDef, weaponInfo);
    const { bodyDamage: dmgStrong } = calculateWeaponDamage(ATK_STATS, strongDef, weaponInfo);
    expect(dmgWeak).toBe(dmgStrong);
  });
});

describe("resolveAttackerSpeed — Velocidad de ataque según naturaleza", () => {
  const atkPenalized = { atk: 90, aspd: 60, ref: 40 };

  it("Desarmado usa ASPD", () => {
    expect(resolveAttackerSpeed(atkPenalized, "desarmado")).toBe(60);
  });

  it("Cortante usa ASPD", () => {
    expect(resolveAttackerSpeed(atkPenalized, "cortante")).toBe(60);
  });

  it("Contundente usa ASPD", () => {
    expect(resolveAttackerSpeed(atkPenalized, "contundente")).toBe(60);
  });

  it("Perforante usa ATK en lugar de ASPD", () => {
    expect(resolveAttackerSpeed(atkPenalized, "perforante")).toBe(90);
  });
});
