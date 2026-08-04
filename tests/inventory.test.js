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
  it("Tiene 7 ítems (4 estándar + 3 temporales)", () => {
    expect(Object.keys(ITEMS)).toHaveLength(7);
  });

  it("Cada ítem tiene id, name, description, basePrice, modules, categories (sin icon)", () => {
    for (const [key, item] of Object.entries(ITEMS)) {
      expect(item.id).toBe(key);
      expect(item.name).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(typeof item.basePrice).toBe("number");
      expect(Array.isArray(item.categories)).toBe(true);
      expect(item.icon).toBeUndefined();
    }
  });

  it("getItem devuelve el ítem correcto", () => {
    expect(getItem("venda")).toBe(ITEMS.venda);
    expect(getItem("noexiste")).toBeNull();
  });

  it("getItemsByCategory devuelve todos para consumable", () => {
    expect(getItemsByCategory("consumable")).toHaveLength(7);
    expect(getItemsByCategory("weapon")).toHaveLength(0);
  });
});

describe("items — Precios (inflados, roadmap)", () => {
  it("venda cuesta 100 stelas", () => {
    expect(ITEMS.venda.basePrice).toBe(100);
  });

  it("pocion cuesta 180 stelas", () => {
    expect(ITEMS.pocion.basePrice).toBe(180);
  });

  it("tonico cuesta 280 stelas", () => {
    expect(ITEMS.tonico.basePrice).toBe(280);
  });

  it("antidoto cuesta 200 stelas", () => {
    expect(ITEMS.antidoto.basePrice).toBe(200);
  });
});
