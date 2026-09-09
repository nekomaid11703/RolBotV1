// @ts-nocheck
/**
 * Dummy PvE SIN equipamiento de prueba — el dummy se genera con equipo vacío
 * (ya no se inyecta la Familia del Hierro). Verifica que los resolvers y la UI
 * manejan correctamente un dummy desarmado.
 */

const { buildDummyEquipment } = require("../src/services/rpg/dummyEquipment");
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

describe("buildDummyEquipment — sin equipamiento de prueba", () => {
  it("por defecto construye slots e inventario vacíos", () => {
    const eq = buildDummyEquipment();
    expect(eq.slots).toEqual({});
    expect(eq.inventory).toEqual([]);
  });

  it("acepta un loadout explícito (p. ej. dummy mágico)", () => {
    const eq = buildDummyEquipment([{ slot: "mano_der", itemId: "hechizo_doom" }]);
    expect(eq.slots.mano_der).toBe("hechizo_doom");
    expect(Object.keys(eq.slots)).toHaveLength(1);
  });
});

describe("generateDummyCharacter — dummy sin equipo", () => {
  it("adjunta dummyEquipment vacío al personaje generado", () => {
    const dummy = generateDummyCharacter(makeChallenger());
    expect(dummy.dummyEquipment).toBeDefined();
    expect(dummy.dummyEquipment.slots).toEqual({});
    expect(dummy.dummyEquipment.inventory).toEqual([]);
  });
});

describe("Resolvers con el equipo vacío (sin DB)", () => {
  const dummy = generateDummyCharacter(makeChallenger());

  it("getEquippedItems no resuelve ítems", async () => {
    const items = await getEquippedItems(dummy);
    expect(items.length).toBe(0);
  });

  it("resolveAttackerWeapon devuelve null (desarmado)", async () => {
    const weapon = await resolveAttackerWeapon(dummy);
    expect(weapon).toBeNull();
  });

  it("resolveDefenderArmor devuelve 0 piezas", async () => {
    const armor = await resolveDefenderArmor(dummy);
    expect(armor.list.length).toBe(0);
    expect(armor.totalMaxResist).toBe(0);
    expect(armor.totalCurrentResist).toBe(0);
  });
});

describe("resolveCharacterEquipment — resumen para UI (vacío)", () => {
  const dummy = generateDummyCharacter(makeChallenger());

  it("no expone arma, armadura, artefactos ni bono de set", async () => {
    const eq = await resolveCharacterEquipment(dummy);
    expect(eq.weapon).toBeNull();
    expect(eq.armor.length).toBe(0);
    expect(eq.artifacts.length).toBe(0);
    expect(eq.setBonuses.every((b) => !b.active)).toBe(true);
  });
});

describe("UI de combate — sin equipo de prueba", () => {
  function makeSession() {
    const dummy = generateDummyCharacter(makeChallenger());
    const challenger = { ...makeChallenger(), dummyEquipment: { slots: {}, inventory: [] } };
    return {
      rounds: 0,
      status: "waiting_action",
      currentTurnCharId: String(challenger.id),
      challenger: { userId: "u1", characterId: String(challenger.id), character: challenger, hp: 40, fatigue: 0 },
      defender: {
        userId: "bot_dummy",
        characterId: String(dummy.id),
        character: dummy,
        hp: dummy.hp_actual,
        fatigue: 0,
      },
      distance: 5,
    };
  }

  it("formatCombatOpen no muestra equipo de hierro del dummy", async () => {
    const session = makeSession();
    const dEq = await resolveCharacterEquipment(session.defender.character);
    const msg = formatCombatOpen(session, false, { challenger: null, defender: dEq });
    expect(msg).not.toContain("Espada de Hierro");
    expect(msg).not.toContain("Pechera de Hierro");
  });

  it("formatCombatStatus no renderiza set de hierro", async () => {
    const session = makeSession();
    const [cEq, dEq] = await Promise.all([
      resolveCharacterEquipment(session.challenger.character),
      resolveCharacterEquipment(session.defender.character),
    ]);
    const msg = formatCombatStatus(session, { challenger: cEq, defender: dEq });
    expect(msg).not.toContain("Espada de Hierro");
    expect(msg).not.toContain("Set *Hierro*");
  });
});
