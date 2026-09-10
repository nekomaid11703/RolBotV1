const { generateFighter } = require("../scripts/simulate_combat/fighterGenerator");
const { simulateCombat } = require("../scripts/simulate_combat/combatLoop");
const { collectMetrics } = require("../scripts/simulate_combat/metricsCollector");
const { aggregate } = require("../scripts/simulate_combat/aggregator");
const { formatMarkdownReport } = require("../scripts/simulate_combat/formatters");

function makeMagus(name) {
  const fighter = generateFighter("magus");
  fighter.name = name;
  fighter.stats = {
    ...fighter.stats,
    atk: 20,
    def: 20,
    aspd: 20,
    ref: 5,
    mspd: 20,
    fulgor: 20,
    d_fulgor: 0,
    r_fulgor: 10,
  };
  fighter.hp = 300;
  return fighter;
}

describe("simulate_combat magus", () => {
  it("genera foco y hechizo con el payload mágico del motor", () => {
    const magus = makeMagus("Magus");
    const weapon = magus.equipment.weapon;

    expect(weapon.damageNature).toBe("mágico");
    expect(weapon.focus.name).toBeTruthy();
    expect(weapon.spell.hits.length).toBeGreaterThan(0);
    expect(weapon.canalizeBase).toBeGreaterThan(0);
    expect(weapon.fulgorCost).toBeGreaterThan(0);
  });

  it("descuenta batería y registra la dilución sin cambiar el motor físico", () => {
    const result = simulateCombat(makeMagus("A"), makeMagus("B"));
    const magicAttack = result.log.find((entry) => entry.damageNature === "mágico");
    const metrics = collectMetrics(result);

    expect(magicAttack).toMatchObject({ castCost: expect.any(Number), fulgorSpent: expect.any(Number) });
    expect(result.stateA.spellCasts + result.stateB.spellCasts).toBeGreaterThan(0);
    expect(metrics.fighterA_fulgorSpent + metrics.fighterB_fulgorSpent).toBeGreaterThan(0);
    expect(metrics.fighterA_dilutedCasts + metrics.fighterB_dilutedCasts).toBeGreaterThan(0);
  });

  it("agrega y muestra el uso de recursos mágicos", () => {
    const metrics = collectMetrics(simulateCombat(makeMagus("A"), makeMagus("B")));
    const report = aggregate([metrics]);
    const markdown = formatMarkdownReport(report);

    expect(report.magicResources.avgFulgorSpentPerFighter).toBeGreaterThan(0);
    expect(report.magicResources.avgSpellCastsPerFighter).toBeGreaterThan(0);
    expect(report.magicResources.battlesWithSpellCastRate).toBe(1);
    expect(markdown).toContain("## Magic Resource Use");
    expect(markdown).toContain("Fulgor avg (start / spent / left)");
  });
});
