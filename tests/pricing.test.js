// @ts-nocheck
/**
 * Precios por tiempo de material (P2). Base: salario mínimo 720/100 energía,
 * jornada 120 min → 6 stelas/min; precio = valor × receta × 1.15.
 */

const {
  PRICING_TOOL_LEVEL,
  materialMinutesPerUnit,
  materialUnitValue,
  itemBasePrice,
} = require("../src/services/rpg/pricingService");
const {
  MINIMUM_WAGE_PER_DAY,
  WORKDAY_MINUTES,
  STELA_PER_MINUTE,
  VENDOR_MARGIN,
} = require("../src/config/economyConfig");
const { MIN_WAGE_PER_ENERGY, wageMultiplierForJob, JOBS } = require("../src/config/jobConfig");

describe("Salario mínimo y valor de la stela", () => {
  it("el salario mínimo es 720 por 100 de energía y la stela vale 6/minuto", () => {
    expect(MINIMUM_WAGE_PER_DAY).toBe(720);
    expect(WORKDAY_MINUTES).toBe(120);
    expect(STELA_PER_MINUTE).toBe(6);
    expect(MIN_WAGE_PER_ENERGY).toBeCloseTo(7.2, 5);
  });

  it("los trabajos se expresan como múltiplos del salario mínimo (≥1x)", () => {
    for (const job of Object.values(JOBS)) {
      expect(wageMultiplierForJob(job)).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("Valor de materiales por tiempo", () => {
  it("valora con herramienta maestra y crece con la rareza", () => {
    expect(PRICING_TOOL_LEVEL).toBe(10);
    const madera = materialUnitValue("madera");
    const acero = materialUnitValue("acero");
    const obsidiana = materialUnitValue("obsidiana");
    const oro = materialUnitValue("oro");
    const titanio = materialUnitValue("titanio");
    const filoEstelar = materialUnitValue("filo_estelar");

    expect(madera).toBeGreaterThan(0);
    expect(acero).toBeGreaterThan(madera);
    expect(obsidiana).toBeGreaterThan(acero);
    expect(oro).toBeGreaterThan(obsidiana);
    expect(titanio).toBeGreaterThan(oro);
    expect(filoEstelar).toBeGreaterThan(titanio);
  });

  it("un material sin ruta no tiene minutos finitos", () => {
    expect(Number.isFinite(materialMinutesPerUnit("no_existe"))).toBe(false);
  });
});

describe("Precio de ítems (material × receta × margen)", () => {
  it("trozo = valor del material con margen", () => {
    const madera = materialUnitValue("madera");
    expect(itemBasePrice("trozo_de_madera")).toBe(Math.round(madera * (1 + VENDOR_MARGIN)));
  });

  it("equipo = valor × coste de receta × margen", () => {
    const acero = materialUnitValue("acero");
    // espada: 2 unidades de material
    expect(itemBasePrice("espada_de_acero")).toBe(Math.round(acero * 2 * (1 + VENDOR_MARGIN)));
    // daga: 1 unidad
    expect(itemBasePrice("daga_de_acero")).toBe(Math.round(acero * 1 * (1 + VENDOR_MARGIN)));
  });

  it("munición reparte el coste entre las unidades producidas", () => {
    const acero = materialUnitValue("acero");
    expect(itemBasePrice("flechas_de_acero")).toBe(Math.round((acero / 16) * (1 + VENDOR_MARGIN)));
  });

  it("ítems sin material devuelven null (conservan su precio de config)", () => {
    expect(itemBasePrice("venda")).toBeNull();
    expect(itemBasePrice("pergamino")).toBeNull();
  });
});
