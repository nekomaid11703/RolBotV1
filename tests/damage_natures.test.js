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

  it("Contundente: materialDamage > bodyDamage (multiplicador fijo 1.5x)", () => {
    const weaponInfo = { damageNature: "contundente", tier: "C", baseDamage: 0 };
    const { bodyDamage, materialDamage, nature } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo);
    expect(materialDamage).toBeGreaterThan(bodyDamage);
    expect(nature).toBe("contundente");
    // Multiplicador material fijo = 1.5x del cuerpo (rompe armadura sin destruir en 1 golpe)
    expect(materialDamage).toBe(Math.max(1, Math.floor(bodyDamage * 1.5)));
  });

  it("Perforante melee: PIERCE_ATK_SCALE*ATK + base completo, material = mitad", () => {
    const weaponInfo = { damageNature: "perforante", tier: "E", baseDamage: 40, ranged: false };
    const { bodyDamage, materialDamage, nature, ranged } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo);
    const expected = Math.max(1, Math.floor(0.6 * 100)) + Math.floor(40 * 1.0); // 60 + 40 = 100
    expect(bodyDamage).toBe(expected);
    expect(materialDamage).toBe(Math.max(1, Math.floor(expected * 0.5)));
    expect(nature).toBe("perforante");
    expect(ranged).toBe(false);
  });

  it("Proyectil (arco): arrow.baseDamage * BOW_DAMAGE_MULT * falloff + atk*PROJECTILE_ATK_SCALE, ignora DEF", () => {
    const weaponInfo = {
      damageNature: "proyectil",
      tier: "C",
      baseDamage: 0,
      ranged: true,
      weaponRange: 20,
      arrow: { tier: "C", baseDamage: 30 },
    };
    const { bodyDamage, materialDamage, nature, ranged } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo, 10);
    // Alcance efectivo (atk 100 → 25 + BOW_SPEED_BASE C 14 = 39; × AERO C 1.2 = 46.8 → 47)
    // scale = 1 - (10/47)^2 ≈ 0.9547; tier C = 2.6x → floor((30*2.6 + 100*0.5)*0.9547) = 122
    const expected = Math.max(1, Math.floor((30 * 2.6 + 100 * 0.5) * (1 - Math.pow(10 / 47, 2))));
    expect(bodyDamage).toBe(expected);
    expect(materialDamage).toBe(Math.max(1, Math.floor(expected * 0.5)));
    expect(nature).toBe("proyectil");
    expect(ranged).toBe(true);
  });

  it("Proyectil: el daño decae con la distancia y llega a 0 en el borde", () => {
    const weaponInfo = {
      damageNature: "proyectil",
      tier: "B",
      baseDamage: 0,
      ranged: true,
      weaponRange: 20,
      arrow: { tier: "B", baseDamage: 50 },
    };
    const { bodyDamage: dmgNear } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo, 0);
    const { bodyDamage: dmgMid } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo, 20);
    // Alcance efectivo (atk 100 → 25 + BOW_SPEED_BASE B 19 = 44; × AERO B 1.45 = 63.8 → 64)
    const { bodyDamage: dmgBorde } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo, 64);
    expect(dmgNear).toBeGreaterThan(dmgMid);
    // FALLOFF_K=2: scale = 1 - (20/64)^2 ≈ 0.9023; tier B = 3.5x → floor((50*3.5 + 100*0.5)*0.9023) = 203
    expect(dmgMid).toBe(Math.max(1, Math.floor((50 * 3.5 + 100 * 0.5) * (1 - Math.pow(20 / 64, 2)))));
    // En el borde el falloff llega a 0 (sin piso mínimo).
    expect(dmgBorde).toBe(1);
  });

  it("Proyectil sin flecha: vuelve a daño desarmado (no hace daño propio)", () => {
    const weaponInfo = {
      damageNature: "proyectil",
      tier: "B",
      baseDamage: 0,
      ranged: true,
      weaponRange: 20,
      arrow: null,
    };
    const { bodyDamage, nature, ranged } = calculateWeaponDamage(ATK_STATS, DEF_STATS, weaponInfo, 10);
    expect(nature).toBe("desarmado");
    expect(ranged).toBe(false);
    expect(bodyDamage).toBe(Math.max(1, Math.floor(ATK_STATS.atk * (100 / (100 + DEF_STATS.def)))));
  });

  it("Perforante melee: daño corporal es independiente de la DEF del defensor", () => {
    const weakDef = { ...DEF_STATS, def: 1 };
    const strongDef = { ...DEF_STATS, def: 999 };
    const weaponInfo = { damageNature: "perforante", tier: "B", baseDamage: 50, ranged: false };
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

  it("Perforante melee usa ASPD (velocidad natural)", () => {
    expect(resolveAttackerSpeed(atkPenalized, "perforante", { ranged: false })).toBe(60);
  });

  it("Proyectil (arco) usa ATK + BOW_ASPD_BASE (tier E por defecto)", () => {
    // 90 (ATK) + BOW_ASPD_BASE E = 5 → 95
    expect(resolveAttackerSpeed(atkPenalized, "proyectil", { ranged: true })).toBe(95);
  });
});

describe("applyMaterialAbsorption — Durabilidad de armadura", () => {
  const { applyMaterialAbsorption } = require("../src/services/rpg/combatEngine");

  it("Sin armadura: todo el daño material es overflow al HP", () => {
    const result = applyMaterialAbsorption(50, null);
    expect(result.absorbed).toBe(0);
    expect(result.overflow).toBe(50);
    expect(result.isBroken).toBe(false);
    expect(result.isDestroyed).toBe(false);
  });

  it("Con armadura reparable: absorbe daño y rompe al llegar a 0", () => {
    const armor = new DurabilityModule({ maxResist: 30, isRepairable: true });
    const result = applyMaterialAbsorption(50, armor);
    expect(result.absorbed).toBe(30);
    expect(result.overflow).toBe(20);
    expect(result.isBroken).toBe(true);
    expect(result.isDestroyed).toBe(false);
  });

  it("Con armadura no reparable: se destruye al llegar a 0", () => {
    const armor = new DurabilityModule({ maxResist: 20, isRepairable: false });
    const result = applyMaterialAbsorption(40, armor);
    expect(result.absorbed).toBe(20);
    expect(result.overflow).toBe(20);
    expect(result.isDestroyed).toBe(true);
    expect(result.isBroken).toBe(false);
  });

  it("Con armadura con durabilidad suficiente: absorbe todo sin romperse", () => {
    const armor = new DurabilityModule({ maxResist: 100, isRepairable: true });
    const result = applyMaterialAbsorption(40, armor);
    expect(result.absorbed).toBe(40);
    expect(result.overflow).toBe(0);
    expect(result.isBroken).toBe(false);
    expect(result.isDestroyed).toBe(false);
  });
});
