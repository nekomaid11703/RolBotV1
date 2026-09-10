const { supabase } = require("../src/database/supabase");
const {
  applyBarrierDamage,
  applyPrisonDamage,
  attackPrisonFromInside,
  createDummySession,
  removeSession,
} = require("../src/services/rpg/combatState");

describe("Mecánicas de Barreras Defensivas y Prisiones Rompibles (Punto 2)", () => {
  beforeEach(() => {
    vi.spyOn(supabase, "from").mockImplementation(() => ({
      upsert: vi.fn(async () => ({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(async () => ({ error: null })),
      })),
      select: vi.fn(() => ({
        in: vi.fn(async () => ({ data: [], error: null })),
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => ({ data: null, error: null })),
        })),
      })),
    }));
  });
  describe("applyBarrierDamage (Barreras Defensivas)", () => {
    it("absorbe daño completamente si barrierHp >= daño recibido", () => {
      const slot = { barrierHp: 50, hp: 100 };
      const netDamage = applyBarrierDamage(slot, 30);
      expect(netDamage).toBe(0);
      expect(slot.barrierHp).toBe(20);
    });

    it("absorbe daño parcial y agota la barrera si daño > barrierHp", () => {
      const slot = { barrierHp: 30, hp: 100 };
      const netDamage = applyBarrierDamage(slot, 50);
      expect(netDamage).toBe(20);
      expect(slot.barrierHp).toBe(0);
    });

    it("pasa todo el daño si no hay barrera activa", () => {
      const slot = { barrierHp: 0, hp: 100 };
      const netDamage = applyBarrierDamage(slot, 40);
      expect(netDamage).toBe(40);
      expect(slot.barrierHp).toBe(0);
    });
  });

  describe("applyPrisonDamage (Ataques Externos hacia Objetivo Confinado)", () => {
    it("absorbe todo el daño entrante si la prisión resiste", () => {
      const slot = {
        prison: { hp: 100, maxHp: 100, element: "geo" },
        hp: 50,
      };
      const res = applyPrisonDamage(slot, 40);
      expect(res.netDamage).toBe(0);
      expect(res.absorbed).toBe(40);
      expect(res.destroyed).toBe(false);
      expect(res.element).toBe("geo");
      expect(slot.prison.hp).toBe(60);
    });

    it("destruye la prisión y penetra el daño sobrante", () => {
      const slot = {
        prison: { hp: 30, maxHp: 100, element: "cryo" },
        hp: 50,
      };
      const res = applyPrisonDamage(slot, 50);
      expect(res.netDamage).toBe(20);
      expect(res.absorbed).toBe(30);
      expect(res.destroyed).toBe(true);
      expect(res.element).toBe("cryo");
      expect(slot.prison).toBeNull();
    });

    it("no absorbe daño si el slot no tiene prisión", () => {
      const slot = { prison: null, hp: 50 };
      const res = applyPrisonDamage(slot, 25);
      expect(res.netDamage).toBe(25);
      expect(res.absorbed).toBe(0);
      expect(res.destroyed).toBe(false);
    });
  });

  describe("attackPrisonFromInside (Golpe Interno para Liberación)", () => {
    it("reduce durabilidad de la prisión y devuelve elemento para imbuición", () => {
      const slot = {
        prison: { hp: 80, maxHp: 100, element: "pyro" },
      };
      const res = attackPrisonFromInside(slot, 30);
      expect(res.isPrison).toBe(true);
      expect(res.destroyed).toBe(false);
      expect(res.damageDealt).toBe(30);
      expect(res.remainingHp).toBe(50);
      expect(res.maxHp).toBe(100);
      expect(res.element).toBe("pyro");
      expect(slot.prison.hp).toBe(50);
    });

    it("rompe la prisión cuando el daño interno supera o iguala la durabilidad", () => {
      const slot = {
        prison: { hp: 40, maxHp: 100, element: "hydro" },
      };
      const res = attackPrisonFromInside(slot, 50);
      expect(res.isPrison).toBe(true);
      expect(res.destroyed).toBe(true);
      expect(res.damageDealt).toBe(40);
      expect(res.remainingHp).toBe(0);
      expect(res.element).toBe("hydro");
      expect(slot.prison).toBeNull();
    });

    it("devuelve isPrison false si el slot no está en prisión", () => {
      const slot = { prison: null };
      const res = attackPrisonFromInside(slot, 30);
      expect(res.isPrison).toBe(false);
      expect(res.destroyed).toBe(false);
    });
  });

  describe("Bloqueo de Movimiento con Prisión Activa", () => {
    const avanzarCmd = require("../src/commands/rpg/combat/avanzar");
    const retrocederCmd = require("../src/commands/rpg/combat/retroceder");
    const characterService = require("../src/services/characterService");
    const combatState = require("../src/services/rpg/combatState");

    it("avanzar rechaza el movimiento si el jugador está en prisión", async () => {
      const char = { id: "p1_prison", name: "MagoPrueba", stats: { hp: 50, mspd: 10, def: 10 } };
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(char);
      const session = await combatState.createDummySession("user_prison_1", char);
      session.challenger.prison = { hp: 50, maxHp: 50 };

      let replyMsg = "";
      const ctx = {
        sender: "user_prison_1",
        args: ["3"],
        reply: (msg) => {
          replyMsg = msg;
        },
      };

      await avanzarCmd.execute(ctx);
      expect(replyMsg).toContain("atrapado en una **Prisión Mágica**");
      expect(replyMsg).toContain("50/50 HP");
    });

    it("retroceder rechaza el movimiento si el jugador está en prisión", async () => {
      const char = { id: "p2_prison", name: "MagoPrueba2", stats: { hp: 50, mspd: 10, def: 10 } };
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(char);
      const session = await combatState.createDummySession("user_prison_2", char);
      session.challenger.prison = { hp: 40, maxHp: 50 };

      let replyMsg = "";
      const ctx = {
        sender: "user_prison_2",
        args: ["3"],
        reply: (msg) => {
          replyMsg = msg;
        },
      };

      await retrocederCmd.execute(ctx);
      expect(replyMsg).toContain("atrapado en una **Prisión Mágica**");
      expect(replyMsg).toContain("40/50 HP");
    });
  });

  describe("Integración con /spell y /atacar", () => {
    const spellCmd = require("../src/commands/rpg/combat/spell");
    const atacarCmd = require("../src/commands/rpg/combat/atacar");
    const characterService = require("../src/services/characterService");
    const combatState = require("../src/services/rpg/combatState");
    const spellContainerService = require("../src/services/rpg/spellContainerService");

    it("lanzar barrera propia otorga barrierHp al lanzador y no ataca al rival", async () => {
      const char = { id: "p_caster", name: "MagoDefensivo", stats: { hp: 50, fulgor: 20, def: 10 } };
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(char);
      const session = await combatState.createDummySession("user_caster", char);

      const barrierSpell = {
        id: "escudo_magico",
        name: "Escudo Mágico",
        kind: "barrera",
        application: "propia",
        resolution: { barrierHp: 40 },
        fulgorCost: 5,
        cooldown: 2,
      };

      vi.spyOn(spellContainerService, "getActiveSpells").mockResolvedValue({
        activeSpells: [
          {
            slot: "spell_1",
            spellId: "escudo_magico",
            itemDef: { name: "Escudo Mágico", modules: { spell: barrierSpell } },
          },
        ],
        slots: { spell_1: "escudo_magico" },
      });
      vi.spyOn(spellContainerService, "getSpellDetails").mockReturnValue(barrierSpell);

      let replyMsg = "";
      const ctx = {
        sender: "user_caster",
        args: ["1"],
        reply: (msg) => {
          replyMsg = msg;
        },
      };

      await spellCmd.execute(ctx);
      expect(session.challenger.barrierHp).toBeGreaterThanOrEqual(40);
      expect(replyMsg).toContain("Barrera Defensiva");
      expect(replyMsg).toContain("40 HP");
    });

    it("lanzar prisión externa confina al rival con durabilidad y elemento", async () => {
      const char = { id: "p_caster_2", name: "MagoPrisionero", stats: { hp: 50, fulgor: 20, def: 10 } };
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(char);
      const session = await combatState.createDummySession("user_caster_2", char);

      const prisonSpell = {
        id: "jaula_hielo",
        name: "Jaula de Hielo",
        kind: "barrera",
        application: "externa",
        nature: "hielo",
        resolution: { barrierHp: 60 },
        fulgorCost: 8,
        cooldown: 3,
      };

      vi.spyOn(spellContainerService, "getActiveSpells").mockResolvedValue({
        activeSpells: [
          {
            slot: "spell_1",
            spellId: "jaula_hielo",
            itemDef: { name: "Jaula de Hielo", modules: { spell: prisonSpell } },
          },
        ],
        slots: { spell_1: "jaula_hielo" },
      });
      vi.spyOn(spellContainerService, "getSpellDetails").mockReturnValue(prisonSpell);

      let replyMsg = "";
      const ctx = {
        sender: "user_caster_2",
        args: ["1"],
        reply: (msg) => {
          replyMsg = msg;
        },
      };

      await spellCmd.execute(ctx);
      expect(session.defender.prison).not.toBeNull();
      expect(session.defender.prison.hp).toBeGreaterThanOrEqual(60);
      expect(session.defender.prison.element).toBe("hielo");
      expect(replyMsg).toContain("Prisión Rompible");
      expect(replyMsg).toContain("hielo");
    });

    it("atacar desde adentro de la prisión impacta la prisión e imbuye al atacante", async () => {
      const char = {
        id: "p_trapped",
        name: "GuerreroAtrapado",
        stats: { hp: 50, atk: 15, def: 10, aspd: 10, ref: 10 },
      };
      const oppChar = { id: "p_opp", name: "Rival", stats: { hp: 50, atk: 10, def: 10, aspd: 10, ref: 10 } };
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(char);
      const session = await combatState.createSession("user_trapped", "user_opp", char, oppChar);
      session.challenger.prison = { hp: 50, maxHp: 50, element: "fuego" };

      let replyMsg = "";
      const ctx = {
        sender: "user_trapped",
        args: [],
        reply: (msg) => {
          replyMsg = msg;
        },
      };

      await atacarCmd.execute(ctx);
      expect(replyMsg).toContain("golpea los barrotes de la **Prisión Mágica**");
      expect(replyMsg).toContain("queda imbuido en el elemento **fuego**");
      expect(session.challenger.aura.pasiva).toBe("fuego");
    });
  });
});
