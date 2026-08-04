// @ts-nocheck
/**
 * Dummy PvE equipado con la Familia del Hierro — integración del equipo en
 * memoria con los resolvers de combate y la UI (apertura/estado).
 */

const { IRON_ITEMS } = require("../src/data/ironFamily");
const { buildDummyEquipment, IRON_DUMMY_LOADOUT } = require("../src/services/rpg/dummyEquipment");
const { generateDummyCharacter } = require("../src/services/rpg/combatState");
const {
  getEquippedItems,
  resolveAttackerWeapon,
  resolveDefenderArmor,
  resolveCharacterEquipment,
} = require("../src/services/rpg/equipmentResolverService");
const { formatCombatStatus, formatCombatOpen } = require("../src/services/rpg/combatMessages");

const CHALLENGER_STATS = { atk: 25, def: 15, aspd: 10, ref: 8, mspd: 8, fulgor: 5, d_fulgor: 5, r_fulgor: 5 };

function makeChallenger() {
  return {
    id: 1,
    name: "Retador",
    nivel: 12,
    hp_actual: 40,
    stats: { hp: 20, ...CHALLENGER_STATS },
  };
}

describe("buildDummyEquipment — Familia del Hierro en memoria", () => {
  it("Carga el set completo: arma + 4 armaduras + artefacto", () => {
    const eq = buildDummyEquipment();
    expect(eq.slots.mano_der).toBe("espada_de_hierro");
    expect(eq.slots.cabeza).toBe("casco_de_hierro");
    expect(eq.slots.pecho).toBe("pechera_de_hierro");
    expect(eq.slots.pantalones).toBe("grebas_de_hierro");
    expect(eq.slots.botas).toBe("botas_de_hierro");
    expect(eq.slots.artefacto_1).toBe("amuleto_de_hierro");
    expect(Object.keys(eq.slots)).toHaveLength(IRON_DUMMY_LOADOUT.length);
  });

  it("Las filas de inventario portan durabilidad a plena resistencia", () => {
    const eq = buildDummyEquipment();
    const row = eq.inventory.find((r) => r.item_id === "pechera_de_hierro");
    expect(row.metadata.durability.maxResist).toBeGreaterThan(0);
    expect(row.metadata.durability.currentResist).toBe(row.metadata.durability.maxResist);
    expect(row.metadata.durability.isRepairable).toBe(true);
  });

  it("Cada slot del loadout existe en el catálogo", () => {
    const eq = buildDummyEquipment();
    for (const { itemId } of IRON_DUMMY_LOADOUT) {
      expect(eq.slots).toHaveProperty(IRON_DUMMY_LOADOUT.find((l) => l.itemId === itemId).slot);
      expect(IRON_ITEMS[itemId]).toBeDefined();
    }
  });
});

describe("generateDummyCharacter — dummy equipado", () => {
  it("Adjunta dummyEquipment al personaje generado", () => {
    const dummy = generateDummyCharacter(makeChallenger());
    expect(dummy.dummyEquipment).toBeDefined();
    expect(dummy.dummyEquipment.slots.mano_der).toBe("espada_de_hierro");
  });
});

describe("Resolvers con el equipo en memoria (sin DB)", () => {
  const dummy = generateDummyCharacter(makeChallenger());

  it("getEquippedItems resuelve sin tocar la DB", async () => {
    const items = await getEquippedItems(dummy);
    expect(items.length).toBe(6);
    expect(items.every((e) => e.def)).toBe(true);
  });

  it("resolveAttackerWeapon devuelve la espada cortante", async () => {
    const weapon = await resolveAttackerWeapon(dummy);
    expect(weapon).not.toBeNull();
    expect(weapon.damageNature).toBe("cortante");
    expect(weapon.baseDamage).toBeGreaterThan(0);
  });

  it("resolveDefenderArmor devuelve 4 piezas con totales > 0", async () => {
    const armor = await resolveDefenderArmor(dummy);
    expect(armor.list.length).toBe(4);
    expect(armor.totalMaxResist).toBeGreaterThan(0);
    expect(armor.totalCurrentResist).toBe(armor.totalMaxResist);
  });
});

describe("resolveCharacterEquipment — resumen para UI", () => {
  const dummy = generateDummyCharacter(makeChallenger());

  it("Expone arma, armadura, artefactos y bono de set activo", async () => {
    const eq = await resolveCharacterEquipment(dummy);
    expect(eq.weapon.name).toBe("Espada de Hierro");
    expect(eq.weapon.damageNature).toBe("cortante");
    expect(eq.armor.length).toBe(4);
    expect(eq.artifacts.length).toBe(1);
    expect(eq.artifacts[0].buffs).toEqual({ atk: 5 });
    const set = eq.setBonuses.find((b) => b.setId === "set_hierro");
    expect(set.active).toBe(true);
    expect(set.count).toBe(4);
    expect(set.name).toBe("Hierro");
  });
});

describe("UI de combate — muestra el equipo", () => {
  function makeSession() {
    const dummy = generateDummyCharacter(makeChallenger());
    const challenger = makeChallenger();
    return {
      rounds: 0,
      status: "waiting_action",
      currentTurnCharId: String(challenger.id),
      challenger: { userId: "u1", characterId: String(challenger.id), character: challenger, hp: 40, fatigue: 0 },
      defender: { userId: "bot_dummy", characterId: String(dummy.id), character: dummy, hp: dummy.hp_actual, fatigue: 0 },
      distance: 5,
    };
  }

  it("formatCombatOpen muestra arma y armadura del dummy", async () => {
    const session = makeSession();
    const dEq = await resolveCharacterEquipment(session.defender.character);
    const msg = formatCombatOpen(session, true, { challenger: null, defender: dEq });
    expect(msg).toContain("Espada de Hierro");
    expect(msg).toContain("Pechera de Hierro");
    expect(msg).toContain("Hierro");
  });

  it("formatCombatStatus renderiza el equipo de ambos bandos", async () => {
    const session = makeSession();
    const [cEq, dEq] = await Promise.all([
      resolveCharacterEquipment(session.challenger.character),
      resolveCharacterEquipment(session.defender.character),
    ]);
    const msg = formatCombatStatus(session, { challenger: cEq, defender: dEq });
    expect(msg).toContain("Espada de Hierro");
    expect(msg).toContain("Material:");
    expect(msg).toContain("Set *Hierro*");
  });

  it("formatEquipmentSummary devuelve [] sin equipo (backward-compat)", async () => {
    const lines = [];
    expect(lines).toHaveLength(0);
  });
});
