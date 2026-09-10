// @ts-nocheck
const fs = require("fs");
const path = require("path");

describe("Modelo de movimiento Opción 1 (ticket 028)", () => {
  describe("comando avanzar", () => {
    const source = fs.readFileSync(path.join(__dirname, "../src/commands/rpg/combat/avanzar.js"), "utf8");

    it("importa advanceTurn y runDummyTurn", () => {
      expect(source).toContain("advanceTurn");
      expect(source).toContain("runDummyTurn");
    });

    it("consuma el turno tras moverse (PvP)", () => {
      expect(source).toContain("await advanceTurn(session.id, session.challenger.hp, session.defender.hp);");
    });

    it("en PvE delega el turno del dummy (Opción 1)", () => {
      expect(source).toContain("session.isPvE");
      expect(source).toContain("return runDummyTurn(ctx, session, isChallenger, [movementLine]);");
    });

    it("ya no muestra 'puede atacar' tras avanzar (el avance gasta la acción)", () => {
      expect(source).not.toContain("puede atacar");
    });
  });

  describe("comando retroceder", () => {
    const source = fs.readFileSync(path.join(__dirname, "../src/commands/rpg/combat/retroceder.js"), "utf8");

    it("importa advanceTurn y runDummyTurn", () => {
      expect(source).toContain("advanceTurn");
      expect(source).toContain("runDummyTurn");
    });

    it("consuma el turno tras moverse (PvP)", () => {
      expect(source).toContain("await advanceTurn(session.id, session.challenger.hp, session.defender.hp);");
    });

    it("en PvE delega el turno del dummy (Opción 1)", () => {
      expect(source).toContain("return runDummyTurn(ctx, session, isChallenger, [movementLine]);");
    });

    it("ya no muestra 'puede atacar' tras retroceder (el retroceso gasta la acción)", () => {
      expect(source).not.toContain("puede atacar");
    });
  });

  describe("comando atacar PvE", () => {
    const source = fs.readFileSync(path.join(__dirname, "../src/commands/rpg/combat/atacar.js"), "utf8");

    it("delega el turno del dummy tras el ataque (no contraataca siempre)", () => {
      expect(source).toContain("return runDummyTurn(ctx, session, isChallenger, lines);");
    });

    it("ya no contiene handlePvECounterAttack", () => {
      expect(source).not.toContain("handlePvECounterAttack");
    });
  });

  describe("dummyTurnService", () => {
    const service = require("../src/services/rpg/dummyTurnService");

    it("expone runDummyTurn, executeDummyAttack y executeDummyAdvance", () => {
      expect(typeof service.runDummyTurn).toBe("function");
      expect(typeof service.executeDummyAttack).toBe("function");
      expect(typeof service.executeDummyAdvance).toBe("function");
    });
  });
});
