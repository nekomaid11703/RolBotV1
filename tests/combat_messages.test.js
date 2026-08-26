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
    expect(stats).toHaveLength(2);
    expect(stats[0]).toContain("ATK 5");
    expect(stats[0]).toContain("DEF 5");
    expect(stats[0]).toContain("ASPD 2");
    expect(stats[0]).toContain("MSP 2");
    expect(stats[1]).toContain("REF 2");
    expect(stats[1]).toContain("FUL 3");
    expect(stats[1]).toContain("DF 4");
    expect(stats[1]).toContain("RF 1");
  });

  it("buildFatigueBar retorna string con formato compacto", () => {
    const bar = buildFatigueBar(10, 50);
    expect(typeof bar).toBe("string");
    expect(bar).toContain("10/50");
  });
});
