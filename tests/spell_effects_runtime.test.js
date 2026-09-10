// @ts-nocheck
const { EFFECT_DEFS } = require("../src/config/spellTree");
const {
  getDefenseReduction,
  getReflexReduction,
  applyBarrierDamage,
  applyEffects,
  isActionBlocked,
} = require("../src/services/rpg/combatState");

describe("spellEffectsRuntime — Paso 2 Runtime de Efectos", () => {
  it("congelado de base solo bloquea movimiento cuando daño <= R_FULGOR", () => {
    const handler = EFFECT_DEFS.congelado.handler;
    const resLight = handler({ magnitude: 1 }, { objetivo: { stats: { r_fulgor: 20 } }, danoBase: 15 });

    expect(resLight.blockedActions).toEqual(["move"]);
    expect(resLight.severe).toBe(false);
  });

  it("congelado severo bloquea movimiento y ataque cuando daño > R_FULGOR", () => {
    const handler = EFFECT_DEFS.congelado.handler;
    const resHeavy = handler({ magnitude: 1 }, { objetivo: { stats: { r_fulgor: 20 } }, danoBase: 25 });

    expect(resHeavy.blockedActions).toEqual(["move", "attack"]);
    expect(resHeavy.severe).toBe(true);
  });

  it("cegadura reduce Reflejos (REF) mediante getReflexReduction", () => {
    const slot = {
      activeEffects: [{ tipo: "cegadura", turnos: 2, refReduction: 6 }],
    };

    expect(getReflexReduction(slot)).toBe(6);
  });

  it("rompe_armaduras reduce la defensa (DEF) mediante getDefenseReduction", () => {
    const slot = {
      activeEffects: [{ tipo: "rompe_armaduras", turnos: 3, defenseReduction: 10 }],
    };

    expect(getDefenseReduction(slot)).toBe(10);
  });

  it("applyBarrierDamage absorbe daño de barrera defensiva antes del HP", () => {
    const slot = { barrierHp: 30, hp: 100 };

    const remainingDamage1 = applyBarrierDamage(slot, 20);
    expect(remainingDamage1).toBe(0);
    expect(slot.barrierHp).toBe(10);
    expect(slot.hp).toBe(100);

    const remainingDamage2 = applyBarrierDamage(slot, 25);
    expect(remainingDamage2).toBe(15);
    expect(slot.barrierHp).toBe(0);
  });

  it("purificado limpia estados negativos", () => {
    const target = {
      characterId: 1,
      activeEffects: [
        { tipo: "quemadura", category: "negative" },
        { tipo: "enredado", category: "negative" },
      ],
    };
    const lanzador = { character: { name: "Luz" } };

    const events = applyEffects(target, lanzador, ["purificado"]);
    expect(target.activeEffects).toHaveLength(0);
    expect(events[0].type).toBe("purify");
  });
});
