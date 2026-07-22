const { habilidadesDisponibles, sanitizarHabilidadesArray } = require("../src/utils/characterSkillUtils");

function cuantasDeClase(arr, claseId) {
  return arr.filter((h) => h.clase === claseId).length;
}

function contarUniversales(arr) {
  return arr.filter((h) => h.clase === "Universal").length;
}

describe("characterProgression — habilidadesDisponibles", () => {
  it("Civil tiene todas sus habilidades disponibles sin importar nivel", () => {
    const disp = habilidadesDisponibles("civil");
    expect(disp.length).toBeGreaterThanOrEqual(5);
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("vendas");
    expect(ids).toContain("golpe_firme");
  });

  it("Aventurero tiene todas sus habilidades desde el inicio", () => {
    const disp = habilidadesDisponibles("aventurero");
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("ataque_veloz");
    expect(ids).toContain("doble_golpe");
  });

  it("Ladrón tiene todas sus habilidades desde el inicio", () => {
    const disp = habilidadesDisponibles("ladron");
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("golpe_sombra");
  });

  it("Comerciante tiene todas sus habilidades desde el inicio", () => {
    const disp = habilidadesDisponibles("comerciante");
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("venda_rapida");
  });

  it("Clase inexistente solo da habilidades universales", () => {
    const disp = habilidadesDisponibles("inexistente");
    for (const h of disp) {
      expect(h.clase).toBe("Universal");
    }
  });

  it("Universales siempre disponibles sin importar clase", () => {
    const civil = habilidadesDisponibles("civil");
    const aventurero = habilidadesDisponibles("aventurero");

    const universalesCivil = contarUniversales(civil);
    const universalesAvent = contarUniversales(aventurero);

    expect(universalesCivil).toBe(4);
    expect(universalesAvent).toBe(4);
  });
});

describe("characterProgression — sanitizarHabilidadesArray", () => {
  it("Filtra habilidades inválidas (no existen en catálogo)", () => {
    const result = sanitizarHabilidadesArray(["vendas", "skill_falsa", "golpe_firme"], "civil");
    expect(result).toEqual(["vendas", "golpe_firme"]);
  });

  it("Mantiene todas las habilidades disponibles sin importar nivel", () => {
    const result = sanitizarHabilidadesArray(["vendas", "golpe_firme"], "civil");
    expect(result).toEqual(["vendas", "golpe_firme"]);
  });

  it("Filtra habilidades de otra clase", () => {
    const result = sanitizarHabilidadesArray(["ataque_veloz", "vendas"], "civil");
    expect(result).toEqual(["vendas"]);
  });

  it("Permite todas las habilidades sin límite de slots", () => {
    const muchas = ["golpe_fuerte", "acelerar", "postura", "reflejo", "vendas", "golpe_firme"];
    const result = sanitizarHabilidadesArray(muchas, "civil");
    expect(result).toHaveLength(muchas.length);
  });

  it("Maneja entrada null devolviendo array vacío", () => {
    expect(sanitizarHabilidadesArray(null, "civil")).toEqual([]);
  });

  it("Maneja entrada undefined devolviendo array vacío", () => {
    expect(sanitizarHabilidadesArray(undefined, "civil")).toEqual([]);
  });

  it("Maneja entrada con tipos inválidos (números, objetos)", () => {
    const corrupt = [123, null, "vendas", {}, true];
    const result = sanitizarHabilidadesArray(corrupt, "civil");
    expect(result).toEqual(["vendas"]);
  });

  it("Mantiene el orden original después de sanitizar", () => {
    const result = sanitizarHabilidadesArray(["golpe_fuerte", "acelerar", "vendas", "golpe_firme"], "civil");
    expect(result.indexOf("golpe_fuerte")).toBeLessThan(result.indexOf("vendas"));
    expect(result.indexOf("acelerar")).toBeLessThan(result.indexOf("vendas"));
  });
});
