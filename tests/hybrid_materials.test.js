// @ts-nocheck
const { getWeaponStats, getSpellStats } = require("../src/services/rpg/itemStatService");
const { resolveAttackerWeapon } = require("../src/services/rpg/equipmentResolverService");
const itemCatalog = require("../src/data/itemCatalog");

describe("Afinidad Cruzada de Materiales (Builds Híbridas) — Paso 3", () => {
  beforeAll(() => {
    try {
      itemCatalog.register("basto_obsidiana", () => ({
        id: "basto_obsidiana",
        name: "Bastón de Obsidiana",
        tier: "B",
        material: "obsidiana",
        modules: { focus: { canalizeScale: 1.2, slotHeld: "2h" } },
      }));
    } catch {
      // Ignorar si ya estaba registrado
    }
  });

  it("arma física de plata/platino devuelve magicConduction > 0", () => {
    const defPlata = {
      id: "espada_plata",
      tier: "C",
      material: "plata",
      modules: { weapon: { baseDamage: 15, damageNature: "cortante" } },
    };

    const stats = getWeaponStats(defPlata);
    expect(stats.magicConduction).toBeGreaterThan(0);
    expect(stats.baseDamage).toBeGreaterThan(0);
  });

  it("foco/bastón de obsidiana/bronce devuelve physicalDamage > 0", () => {
    const defObsidiana = {
      id: "basto_obsidiana",
      tier: "B",
      material: "obsidiana",
      modules: { focus: { canalizeScale: 1.2, slotHeld: "2h" } },
    };

    const stats = getSpellStats(defObsidiana);
    expect(stats.physicalDamage).toBeGreaterThan(0);
    expect(stats.magicConduction).toBeGreaterThan(0);
  });

  it("resolveAttackerWeapon permite ataque físico directo con foco si no hay hechizo cargado", async () => {
    const dummyChar = {
      id: 99,
      dummyEquipment: {
        slots: { mano_der: "basto_obsidiana" },
        inventory: [
          {
            item_id: "basto_obsidiana",
            metadata: { tier: "B", material: "obsidiana" },
          },
        ],
      },
    };

    const weaponInfo = await resolveAttackerWeapon(dummyChar);
    expect(weaponInfo).not.toBeNull();
    expect(weaponInfo.damageNature).toBe("impacto");
    expect(weaponInfo.baseDamage).toBeGreaterThan(0);
    expect(weaponInfo.magicConduction).toBeGreaterThan(0);
  });
});
