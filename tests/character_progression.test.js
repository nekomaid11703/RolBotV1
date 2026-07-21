const { habilidadesDisponibles, sanitizarHabilidadesArray } = require("../src/utils/characterSkillUtils");

describe("characterProgression — habilidadesDisponibles", () => {
  it("Civil nivel 20 tiene 5 habilidades disponibles (4 universales + vendas)", () => {
    const disp = habilidadesDisponibles("civil", 20);
    expect(disp).toHaveLength(5);
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("vendas");
  });

  it("Civil nivel 50 tiene 6 disponibles (desbloquea golpe_firme en 44)", () => {
    const disp = habilidadesDisponibles("civil", 50);
    expect(disp).toHaveLength(6);
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("golpe_firme");
  });

  it("Aventurero nivel 20 tiene ataque_veloz disponible", () => {
    const disp = habilidadesDisponibles("aventurero", 20);
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("ataque_veloz");
    expect(ids).not.toContain("doble_golpe");
  });

  it("Aventurero nivel 50 tiene doble_golpe disponible", () => {
    const disp = habilidadesDisponibles("aventurero", 50);
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("doble_golpe");
  });

  it("Ladrón nivel 20 tiene golpe_sombra disponible", () => {
    const disp = habilidadesDisponibles("ladron", 20);
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("golpe_sombra");
  });

  it("Comerciante nivel 20 tiene venda_rapida disponible", () => {
    const disp = habilidadesDisponibles("comerciante", 20);
    const ids = disp.map((h) => h.id);
    expect(ids).toContain("venda_rapida");
  });

  it("Clase inexistente solo da habilidades universales", () => {
    const disp = habilidadesDisponibles("inexistente", 20);
    for (const h of disp) {
      expect(h.clase).toBe("Universal");
    }
  });

  it("Universales siempre disponibles sin importar clase", () => {
    const civil = habilidadesDisponibles("civil", 20);
    const aventurero = habilidadesDisponibles("aventurero", 20);
    const civilIds = civil.map((h) => h.id);
    const aventIds = aventurero.map((h) => h.id);

    expect(civilIds).toContain("golpe_fuerte");
    expect(aventIds).toContain("golpe_fuerte");
    expect(civilIds).toContain("acelerar");
    expect(aventIds).toContain("acelerar");
  });
});

describe("characterProgression — sanitizarHabilidadesArray", () => {
  it("Filtra habilidades inválidas (no existen en catálogo)", () => {
    const result = sanitizarHabilidadesArray(["vendas", "skill_falsa", "golpe_firme"], "civil", 50);
    expect(result).toEqual(["vendas", "golpe_firme"]);
  });

  it("Filtra habilidades no disponibles por nivel", () => {
    const result = sanitizarHabilidadesArray(["vendas", "golpe_firme"], "civil", 20);
    expect(result).toEqual(["vendas"]);
  });

  it("Filtra habilidades de otra clase", () => {
    const result = sanitizarHabilidadesArray(["ataque_veloz", "vendas"], "civil", 50);
    expect(result).toEqual(["vendas"]);
  });

  it("Trunca a exactamente 2 slots a nivel 20", () => {
    const muchas = ["golpe_fuerte", "acelerar", "postura", "reflejo", "vendas", "golpe_firme"];
    const result = sanitizarHabilidadesArray(muchas, "civil", 50);
    expect(result).toHaveLength(3);
  });

  it("Maneja entrada null devolviendo array vacío", () => {
    expect(sanitizarHabilidadesArray(null, "civil", 20)).toEqual([]);
  });

  it("Maneja entrada undefined devolviendo array vacío", () => {
    expect(sanitizarHabilidadesArray(undefined, "civil", 20)).toEqual([]);
  });

  it("Maneja entrada con tipos inválidos (números, objetos)", () => {
    const corrupt = [123, null, "vendas", {}, true];
    const result = sanitizarHabilidadesArray(corrupt, "civil", 20);
    expect(result).toEqual(["vendas"]);
  });

  it("Nivel 20 en clase civil permite máximo 2 habilidades", () => {
    const result = sanitizarHabilidadesArray(["vendas", "golpe_fuerte", "acelerar"], "civil", 20);
    expect(result.length).toBe(2);
  });

  it("Nivel 50 permite hasta 3 habilidades", () => {
    const result = sanitizarHabilidadesArray(["vendas", "golpe_firme", "golpe_fuerte"], "civil", 50);
    expect(result.length).toBe(3);
  });

  it("Mantiene el orden original después de sanitizar", () => {
    const result = sanitizarHabilidadesArray(["golpe_fuerte", "acelerar", "vendas", "golpe_firme"], "civil", 50);
    expect(result.indexOf("golpe_fuerte")).toBeLessThan(result.indexOf("vendas"));
    expect(result.indexOf("acelerar")).toBeLessThan(result.indexOf("vendas"));
  });
});
