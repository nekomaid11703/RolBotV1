const { MAX_INVENTORY_SIZE, MAX_STACK_SIZE } = require("../src/config/inventoryConfig");
const { ITEMS, getItem, getItemsByCategory } = require("../src/data/items");

describe("inventoryConfig", () => {
  it("MAX_INVENTORY_SIZE es 20", () => {
    expect(MAX_INVENTORY_SIZE).toBe(20);
  });

  it("MAX_STACK_SIZE es 99", () => {
    expect(MAX_STACK_SIZE).toBe(99);
  });
});

describe("items — Catálogo", () => {
  it("Tiene 4 ítems", () => {
    expect(Object.keys(ITEMS)).toHaveLength(4);
  });

  it("Cada ítem tiene id, name, description, price, healHp, category, icon", () => {
    for (const [key, item] of Object.entries(ITEMS)) {
      expect(item.id).toBe(key);
      expect(item.name).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(typeof item.price).toBe("number");
      expect(item.price).toBeGreaterThan(0);
      expect(typeof item.healHp).toBe("number");
      expect(item.healHp).toBeGreaterThanOrEqual(0);
      expect(item.category).toBe("consumable");
      expect(item.icon).toBeTruthy();
    }
  });

  it("getItem devuelve el ítem correcto", () => {
    expect(getItem("venda")).toBe(ITEMS.venda);
    expect(getItem("noexiste")).toBeNull();
  });

  it("getItemsByCategory devuelve todos para consumable", () => {
    expect(getItemsByCategory("consumable")).toHaveLength(4);
    expect(getItemsByCategory("weapon")).toHaveLength(0);
  });
});

describe("items — Precios (inflados, roadmap)", () => {
  it("venda cuesta 100 stelas", () => {
    expect(ITEMS.venda.price).toBe(100);
  });

  it("pocion cuesta 180 stelas", () => {
    expect(ITEMS.pocion.price).toBe(180);
  });

  it("tonico cuesta 280 stelas", () => {
    expect(ITEMS.tonico.price).toBe(280);
  });

  it("antidoto cuesta 200 stelas", () => {
    expect(ITEMS.antidoto.price).toBe(200);
  });
});
