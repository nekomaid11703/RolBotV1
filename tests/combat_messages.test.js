const {
  formatCombatOpen,
  formatActionMenu,
  formatReactionPrompt,
  formatCombatStatus,
  buildStatSummary,
  buildFatigueBar,
} = require("../src/services/rpg/combatMessages");

describe("combatMessages — Single Message Formatters", () => {
  const session = {
    id: "test:1",
    rounds: 0,
    status: "waiting_action",
    challenger: {
      userId: "userA",
      characterId: 1,
      character: { name: "Aelin", nivel: 20, stats: { hp: 100, atk: 5, def: 5, aspd: 2, ref: 2, mspd: 2 } },
      hp: 100,
    },
    defender: {
      userId: "userB",
      characterId: 2,
      character: {
        name: "Maniquí de Práctica",
        nivel: 20,
        stats: { hp: 100, atk: 4, def: 4, aspd: 4, ref: 4, mspd: 4 },
      },
      hp: 100,
    },
    currentTurnCharId: 1,
  };

  it("formatCombatOpen genera un único mensaje con stats de ambos y menú de acción", () => {
    const msg = formatCombatOpen(session, true);
    expect(msg).toContain("COMBATE INICIADO");
    expect(msg).toContain("Aelin");
    expect(msg).toContain("Maniquí de Práctica");
    expect(msg).toContain("Consumibles de prueba");
    expect(msg).toContain("/atacar");
  });

  it("formatActionMenu muestra las opciones disponibles", () => {
    const menu = formatActionMenu("Aelin");
    expect(menu).toContain("Turno de *Aelin*");
    expect(menu).toContain("/atacar");
    expect(menu).toContain("/usar");
    expect(menu).toContain("/huir");
    expect(menu).toContain("/descansar");
  });

  it("formatReactionPrompt genera submenú de esquivar / bloquear", () => {
    const prompt = formatReactionPrompt("Aelin", "Maniquí de Práctica", 10, false);
    expect(prompt).toContain("/esquivar");
    expect(prompt).toContain("/bloquear");
    expect(prompt).toContain("10");
  });

  it("formatCombatStatus incluye ronda, vida de ambos y menú", () => {
    const status = formatCombatStatus(session);
    expect(status).toContain("ESTADO");
    expect(status).toContain("R1");
    expect(status).toContain("Aelin");
    expect(status).toContain("Maniquí de Práctica");
    expect(status).toContain("/atacar");
  });

  it("buildStatSummary retorna array de 3 filas con HP", () => {
    const stats = buildStatSummary({
      hp: 100,
      atk: 5,
      def: 5,
      aspd: 2,
      ref: 2,
      mspd: 2,
      fulgor: 3,
      d_fulgor: 4,
      r_fulgor: 1,
    });
    expect(Array.isArray(stats)).toBe(true);
    expect(stats).toHaveLength(3);
    expect(stats[0]).toContain("HP100");
    expect(stats[0]).toContain("ATK5");
    expect(stats[0]).toContain("DEF5");
    expect(stats[0]).toContain("ASPD2");
    expect(stats[1]).toContain("REF2");
    expect(stats[1]).toContain("MSP2");
    expect(stats[1]).toContain("FUL3");
    expect(stats[2]).toContain("DF4");
    expect(stats[2]).toContain("RF1");
  });

  it("buildFatigueBar retorna string con formato compacto", () => {
    const bar = buildFatigueBar(10, 50);
    expect(typeof bar).toBe("string");
    expect(bar).toContain("10/50");
  });
});
