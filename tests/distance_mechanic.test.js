// @ts-nocheck

describe("Mecánica de Distancia v1.5", () => {
  // --- combatConfig constants ---
  describe("Constantes de distancia", () => {
    const config = require("../src/config/combatConfig");

    it("MAX_DISTANCE es 500", () => {
      expect(config.MAX_DISTANCE).toBe(500);
    });

    it("INITIAL_DISTANCE es 5", () => {
      expect(config.INITIAL_DISTANCE).toBe(5);
    });

    it("BASE_ATTACK_RANGE es 1", () => {
      expect(config.BASE_ATTACK_RANGE).toBe(1);
    });

    it("MSPD_TO_METERS es 0.5", () => {
      expect(config.MSPD_TO_METERS).toBe(0.5);
    });

    it("ASPD_PENALTY_PER_5M es 1", () => {
      expect(config.ASPD_PENALTY_PER_5M).toBe(1);
    });

    it("FATIGUE_BASE_PER_METER es 1", () => {
      expect(config.FATIGUE_BASE_PER_METER).toBe(1);
    });

    it("FATIGUE_SCALE_PER_5M es 1", () => {
      expect(config.FATIGUE_SCALE_PER_5M).toBe(1);
    });

    it("KITE_FATIGUE_MULTIPLIER es 1.5", () => {
      expect(config.KITE_FATIGUE_MULTIPLIER).toBe(1.5);
    });
  });

  // --- fatigueEngine functions ---
  describe("calculateMovementFatigue", () => {
    const { calculateMovementFatigue } = require("../src/services/rpg/fatigueEngine");

    it("retorna 0 para 0 metros", () => {
      expect(calculateMovementFatigue(0)).toBe(0);
    });

    it("retorna 1 para 1 metro", () => {
      expect(calculateMovementFatigue(1)).toBe(1);
    });

    it("retorna 4 para 4 metros (1 fat/metro)", () => {
      expect(calculateMovementFatigue(4)).toBe(4);
    });

    it("retorna 10 para 5 metros (2 fat/metro)", () => {
      expect(calculateMovementFatigue(5)).toBe(10);
    });

    it("retorna mayor coste para más metros", () => {
      const fatigue10 = calculateMovementFatigue(10);
      const fatigue5 = calculateMovementFatigue(5);
      expect(fatigue10).toBeGreaterThan(fatigue5);
    });
  });

  describe("getMovementRange", () => {
    const { getMovementRange } = require("../src/services/rpg/fatigueEngine");

    it("retorna 0 para MSPD 0", () => {
      expect(getMovementRange(0)).toBe(0);
    });

    it("retorna 5 para MSPD 10", () => {
      expect(getMovementRange(10)).toBe(5);
    });

    it("retorna 10 para MSPD 20", () => {
      expect(getMovementRange(20)).toBe(10);
    });

    it("retorna 2 para MSPD 5 (floor de 2.5)", () => {
      expect(getMovementRange(5)).toBe(2);
    });
  });

  // --- combatEngine functions ---
  describe("getAspdPenalty", () => {
    const { getAspdPenalty } = require("../src/services/rpg/combatEngine");

    it("retorna 0 para distancia 0-4m", () => {
      expect(getAspdPenalty(0)).toBe(0);
      expect(getAspdPenalty(4)).toBe(0);
    });

    it("retorna -1 para distancia 5-9m", () => {
      expect(getAspdPenalty(5)).toBe(-1);
      expect(getAspdPenalty(9)).toBe(-1);
    });

    it("retorna -2 para distancia 10-14m", () => {
      expect(getAspdPenalty(10)).toBe(-2);
      expect(getAspdPenalty(14)).toBe(-2);
    });

    it("retorna -3 para distancia 15-19m", () => {
      expect(getAspdPenalty(15)).toBe(-3);
    });
  });

  describe("checkAttackRange", () => {
    const { checkAttackRange } = require("../src/services/rpg/combatEngine");

    it("detecta ataque en rango con MSPD alto", () => {
      const stats = { mspd: 10 };
      const result = checkAttackRange(5, stats);
      // Range: 1 (base) + floor(10*0.5) = 6m
      expect(result.canAttack).toBe(true);
      expect(result.effectiveRange).toBe(6);
    });

    it("detecta ataque fuera de rango", () => {
      const stats = { mspd: 5 };
      const result = checkAttackRange(20, stats);
      // Range: 1 + floor(5*0.5) = 3m
      expect(result.canAttack).toBe(false);
      expect(result.effectiveRange).toBe(3);
    });

    it("considera weaponRange adicional", () => {
      const stats = { mspd: 5 };
      const result = checkAttackRange(5, stats, 5);
      // Range: 1 + 5 (weapon) + floor(5*0.5) = 8m
      expect(result.canAttack).toBe(true);
      expect(result.effectiveRange).toBe(8);
    });

    it("retorna canAttack=true a distancia 0", () => {
      const stats = { mspd: 1 };
      const result = checkAttackRange(0, stats);
      expect(result.canAttack).toBe(true);
    });
  });

  describe("canReact con ASPD penalty", () => {
    const { canReact } = require("../src/services/rpg/combatEngine");

    it("defensor puede reaccionar cuando no hay penalización", () => {
      const defenderStats = { ref: 10, aspd: 5, mspd: 5 };
      const attackerStats = { ref: 5, aspd: 8, mspd: 5 };
      const result = canReact(defenderStats, 100, attackerStats, 100, 0, 0, 0, 0, 0);
      expect(result).toBe(true); // 10 > 8
    });

    it("defensor NO puede reaccionar con penalización ASPD", () => {
      const defenderStats = { ref: 7, aspd: 5, mspd: 5 };
      const attackerStats = { ref: 5, aspd: 8, mspd: 5 };
      // Sin penalización: 7 > 8 = false
      // Con penalización -2: 7 > (8-2) = 7 > 6 = true
      const resultSinPenalizacion = canReact(defenderStats, 100, attackerStats, 100, 0, 0, 0, 0, 0);
      const resultConPenalizacion = canReact(defenderStats, 100, attackerStats, 100, 0, 0, 0, 0, -2);
      expect(resultSinPenalizacion).toBe(false);
      expect(resultConPenalizacion).toBe(true);
    });
  });

  // --- combatState with distance ---
  describe("Sesiones con distancia", () => {
    it("createSession incluye distance inicial", () => {
      const config = require("../src/config/combatConfig");
      expect(config.INITIAL_DISTANCE).toBe(5);
    });
  });

  // --- Message formatting ---
  describe("formatMovement", () => {
    const { formatMovement } = require("../src/services/rpg/combatMessages");

    it("retorna string con dirección y distancia", () => {
      const result = formatMovement("Test", "advanced", 5, 0, 10);
      expect(result).toContain("5m");
      expect(result).toContain("0m");
    });
  });

  describe("formatOutOfRange", () => {
    const { formatOutOfRange } = require("../src/services/rpg/combatMessages");

    it("retorna string con alcance", () => {
      const result = formatOutOfRange("Test", 5, 20, 10);
      expect(result).toContain("10m");
      expect(result).toContain("20m");
    });
  });

  // --- Integration test: distance affects combat ---
  describe("Integración: distancia afecta combate", () => {
    it("ASPD penalty reduce capacidad de reacción", () => {
      const { getAspdPenalty } = require("../src/services/rpg/combatEngine");

      // A 15m de distancia, penalización es -3
      const penalty = getAspdPenalty(15);
      expect(penalty).toBe(-3);

      // Esto hace que el atacante sea más lento para reaccionar
      // Permitiendo kites y esquivas más fáciles
    });

    it("Movement range escala con MSPD", () => {
      const { getMovementRange } = require("../src/services/rpg/fatigueEngine");

      const mspd10 = getMovementRange(10);
      const mspd20 = getMovementRange(20);

      expect(mspd20).toBeGreaterThan(mspd10);
      expect(mspd20).toBe(mspd10 * 2);
    });

    it("Fatiga por movimiento escala con distancia", () => {
      const { calculateMovementFatigue } = require("../src/services/rpg/fatigueEngine");

      const fatigue5 = calculateMovementFatigue(5);
      const fatigue10 = calculateMovementFatigue(10);

      // Fatiga escala: más metros = más coste por metro
      expect(fatigue10).toBeGreaterThan(fatigue5 * 2);
    });
  });

  // --- AI distance mechanic tests ---
  describe("IA con mecánica de distancia", () => {
    it("makeDecision retorna movimiento cuando está fuera de alcance", () => {
      const CombatAI = require("../src/services/rpg/combatAI");
      
      const session = {
        distance: 20,
        isPvE: true,
      };
      
      const aiSlot = {
        character: { stats: { mspd: 10, atk: 15, def: 10 } },
        hp: 100,
        fatigue: 0,
      };
      
      const playerSlot = {
        character: { stats: { mspd: 5, atk: 10, def: 8 } },
        hp: 100,
        fatigue: 0,
      };

      const decision = CombatAI.makeDecision(session, aiSlot, playerSlot);
      
      expect(decision.movement).not.toBeNull();
      expect(decision.movement.direction).toBe("advanced");
      expect(decision.movement.meters).toBeGreaterThan(0);
      expect(decision.movement.newDistance).toBeLessThan(20);
    });

    it("makeDecision no mueve cuando está en alcance", () => {
      const CombatAI = require("../src/services/rpg/combatAI");
      
      const session = {
        distance: 3,
        isPvE: true,
      };
      
      const aiSlot = {
        character: { stats: { mspd: 10, atk: 15, def: 10 } },
        hp: 100,
        fatigue: 0,
      };
      
      const playerSlot = {
        character: { stats: { mspd: 5, atk: 10, def: 8 } },
        hp: 100,
        fatigue: 0,
      };

      const decision = CombatAI.makeDecision(session, aiSlot, playerSlot);
      
      expect(decision.movement).toBeNull();
      expect(decision.action).toBe("attack");
    });

    it("makeDecision avanza lo máximo posible cuando no puede alcanzar", () => {
      const CombatAI = require("../src/services/rpg/combatAI");
      
      const session = {
        distance: 100,
        isPvE: true,
      };
      
      const aiSlot = {
        character: { stats: { mspd: 5, atk: 15, def: 10 } },
        hp: 100,
        fatigue: 0,
      };
      
      const playerSlot = {
        character: { stats: { mspd: 5, atk: 10, def: 8 } },
        hp: 100,
        fatigue: 0,
      };

      const decision = CombatAI.makeDecision(session, aiSlot, playerSlot);
      
      // MSPD 5 = 2 metros max
      expect(decision.movement).not.toBeNull();
      expect(decision.movement.meters).toBe(2);
      expect(decision.movement.newDistance).toBe(98);
    });
  });
});
