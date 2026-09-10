// @ts-nocheck
/**
 * D4 — Cap de rareza en tiendas y firma de expedición.
 */

const { buildShopReport } = require("../src/services/rpg/progressionAnalyticsService");
const { SHOPS } = require("../src/config/shopConfig");
const { RARITY_BAND_INDEX } = require("../src/config/rarityDropConfig");

describe("D4 — cap de rareza en tiendas", () => {
  it("cada tienda declara su cap de rareza (material y equipo)", () => {
    for (const shop of Object.values(SHOPS)) {
      expect(shop.rarityCap, `tienda ${shop.id} sin rarityCap`).toBeTruthy();
      expect(RARITY_BAND_INDEX[shop.rarityCap.material]).toBeGreaterThanOrEqual(0);
      expect(RARITY_BAND_INDEX[shop.rarityCap.equipment]).toBeGreaterThanOrEqual(0);
    }
  });

  it("ninguna tienda vende por encima de su cap", () => {
    const report = buildShopReport();
    expect(report.checks.capsRespected).toBe(true);
    for (const shop of report.shops) {
      expect(shop.violations).toEqual([]);
    }
  });

  it("los materiales raro+ no se venden en tiendas (firma de expedición)", () => {
    const report = buildShopReport();
    expect(report.checks.rareMaterialsNotSold).toBe(true);
    expect(report.signatureOverlap).toBe(0);
  });
});
