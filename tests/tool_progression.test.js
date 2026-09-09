const { buildToolMetrics } = require("../src/services/rpg/progressionAnalyticsService");

describe("B4 — progresión de herramientas", () => {
  it("genera métricas para cada herramienta y sus 9 mejoras", () => {
    const metrics = buildToolMetrics();
    expect(metrics.tools).toHaveLength(5);
    for (const tool of metrics.tools) {
      expect(tool.upgrades).toHaveLength(9);
      expect(tool.upgrades[0].upgradeTo).toBe(2);
      expect(tool.upgrades[8].upgradeTo).toBe(10);
    }
  });

  it("calcula coste total (stelas + materiales) y días de stelas por mejora", () => {
    const metrics = buildToolMetrics();
    const pico = metrics.tools.find((tool) => tool.tool === "pico");
    const level2 = pico.upgrades.find((upgrade) => upgrade.upgradeTo === 2);
    expect(level2.totalCost).toBe(level2.costStelas + level2.materialCost);
    expect(level2.totalCost).toBeGreaterThan(0);
    expect(level2.daysStelas).toBeGreaterThan(0);
    expect(metrics.dailyStelasIncome).toBeGreaterThan(0);
  });

  it("detecta mejoras bloqueadas por materiales sin fuente (titanio)", () => {
    const metrics = buildToolMetrics();
    for (const tool of metrics.tools) {
      const nine = tool.upgrades.find((upgrade) => upgrade.upgradeTo === 9);
      const ten = tool.upgrades.find((upgrade) => upgrade.upgradeTo === 10);
      expect(nine.sourceBlocked).toBe(false); // oro ya tiene ruta (tundra)
      expect(ten.sourceBlocked).toBe(true); // titanio sigue sin fuente
    }
    expect(metrics.warnings.hasBlockedUpgrades).toBe(true);
  });

  it("distingue la mochila (expansión) de las herramientas de recolección", () => {
    const metrics = buildToolMetrics();
    const mochila = metrics.tools.find((tool) => tool.tool === "mochila");
    const pico = metrics.tools.find((tool) => tool.tool === "pico");
    expect(mochila.zone).toBeNull();
    expect(mochila.upgrades[0].isExpansion).toBe(true);
    expect(mochila.upgrades[0].paybackExpeditions).toBeNull();
    expect(pico.zone).not.toBeNull();
    expect(pico.upgrades[0].paybackExpeditions).not.toBeNull();
  });
});
