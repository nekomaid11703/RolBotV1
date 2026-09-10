const { buildToolMetrics } = require("../src/services/rpg/progressionAnalyticsService");

describe("B4 — progresión de herramientas", () => {
  it("genera métricas para cada herramienta y sus 9 mejoras", () => {
    const metrics = buildToolMetrics();
    expect(metrics.tools).toHaveLength(4);
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

  it("con el modelo por ejes ninguna mejora queda bloqueada por materiales (todos tienen ruta)", () => {
    const metrics = buildToolMetrics();
    for (const tool of metrics.tools) {
      const nine = tool.upgrades.find((upgrade) => upgrade.upgradeTo === 9);
      const ten = tool.upgrades.find((upgrade) => upgrade.upgradeTo === 10);
      expect(nine.sourceBlocked).toBe(false);
      expect(ten.sourceBlocked).toBe(false);
    }
    expect(metrics.warnings.hasBlockedUpgrades).toBe(false);
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

  it("el payback acumulado al nivel 10 cumple las metas por herramienta (B4 revisado)", () => {
    const metrics = buildToolMetrics();
    const targets = metrics.policy.cumulativePaybackTargets;
    for (const tool of metrics.tools) {
      const final = tool.upgrades[tool.upgrades.length - 1];
      if (targets[tool.tool] == null) continue;
      expect(final.paybackCumulativeExpeditions).not.toBeNull();
      expect(final.paybackCumulativeExpeditions).toBeLessThanOrEqual(targets[tool.tool]);
      expect(final.withinCumulativeTarget).toBe(true);
    }
    expect(metrics.warnings.hasOverLimitPayback).toBe(false);
  });
});
