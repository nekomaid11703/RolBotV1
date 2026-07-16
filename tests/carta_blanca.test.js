const path = require("path");

let combatValidator, combatRefereeService, invService;
try {
  combatValidator = require("../src/services/rpg/combatValidator");
} catch {
  /* archived */
}
try {
  combatRefereeService = require("../src/services/rpg/combatRefereeService");
} catch {
  /* archived */
}
try {
  invService = require("../src/services/rpg/inventoryService");
} catch {
  /* archived */
}

const createMockParticipant = (overrides = {}) => ({
  id: "test-player-1",
  name: "TestPlayer",
  team: "players",
  hp: 100,
  maxHp: 100,
  fulgor: 50,
  maxFulgor: 50,
  fatigue: 0,
  fuerza: 7,
  reflejos: 6,
  velocidad_ataque: 5,
  precision: 6,
  velocidad_desplazamiento: 5,
  dominio_fulgor: 3,
  resistencia_fisica: 5,
  resistencia_magica: 3,
  ko: false,
  stunned: false,
  defending: false,
  defenseMultiplier: 1,
  bodyParts: {
    cabeza: 10,
    cuello: 5,
    pecho: 20,
    abdomen: 15,
    espalda: 15,
    brazo_izq: 10,
    brazo_der: 10,
    mano_izq: 5,
    mano_der: 5,
    pierna_izq: 12,
    pierna_der: 12,
    pie_izq: 5,
    pie_der: 5,
  },
  equipped: {},
  buffs: [],
  cooldowns: {},
  ...overrides,
});

const createMockRoom = (overrides = {}) => ({
  id: "room-test-001",
  participants: [],
  turnCount: 0,
  round: 1,
  status: "active",
  currentTurnIndex: 0,
  location: { zone: "bosque", region: "valle_verde", locationId: "bosque_01" },
  lastActionAt: Date.now(),
  koThreshold: 30,
  activeEffects: [],
  stateVersion: 0,
  ...overrides,
});

describe("Carta Blanca + Inventory Error Handling", () => {
  (combatValidator && combatRefereeService && invService ? describe : describe.skip)("Combat Validator", () => {
    it("mano_blanca detecta patrones de KO", () => {
      const v1 = combatValidator.validate("lo mato de un golpe.", {});
      expect(v1.valid).toBe(false);
      expect(v1.infractions.length).toBe(1);
      expect(v1.infractions[0].type).toBe("mano_blanca");
    });

    it("mano_negra detecta patrones de fallo", () => {
      const v2 = combatValidator.validate("su golpe falla estrepitosamente.", {});
      expect(v2.valid).toBe(false);
      expect(v2.infractions[0].type).toBe("mano_negra");
    });

    it("texto limpio pasa validación", () => {
      const v3 = combatValidator.validate("Ataco con mi espada hacia su pecho.", {});
      expect(v3.valid).toBe(true);
      expect(v3.infractions.length).toBe(0);
    });
  });

  (invService ? describe : describe.skip)("Inventory Service", () => {
    it("getInventory returns object for unknown player", async () => {
      const inv = await invService.getInventory("nonexistent_player_test_123");
      expect(inv).toBeTruthy();
      expect(Array.isArray(inv.items)).toBe(true);
    });
    it("addItem returns error for unknown itemId", async () => {
      const addResult = await invService.addItem("test_player_inv", "item_no_existe");
      expect(addResult.error).toBeTruthy();
    });
  });
});
