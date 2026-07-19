const { HABILIDADES } = require("../src/data/habilidades");
const { CLASES, getClase, listarClases, validarClase } = require("../src/data/clases");

describe("clases — Catálogo", () => {
  it("Tiene exactamente 4 clases", () => {
    expect(Object.keys(CLASES)).toHaveLength(4);
  });

  it("Contiene civil, aventurero, ladron, comerciante", () => {
    expect(CLASES.civil).toBeDefined();
    expect(CLASES.aventurero).toBeDefined();
    expect(CLASES.ladron).toBeDefined();
    expect(CLASES.comerciante).toBeDefined();
  });

  it("Cada clase tiene id, name, description, skillsByLevel", () => {
    for (const cls of Object.values(CLASES)) {
      expect(cls.id).toBeTruthy();
      expect(cls.name).toBeTruthy();
      expect(cls.description).toBeTruthy();
      expect(cls.skillsByLevel).toBeDefined();
    }
  });

  it("Cada clase desbloquea al menos 1 habilidad en nivel 20", () => {
    for (const cls of Object.values(CLASES)) {
      expect(cls.skillsByLevel[20]).toBeTruthy();
    }
  });

  it("Cada clase desbloquea exactamente 2 habilidades (niveles 20 y 44)", () => {
    for (const cls of Object.values(CLASES)) {
      const levels = Object.keys(cls.skillsByLevel).map(Number);
      expect(levels).toEqual([20, 44]);
    }
  });

  it("Todas las habilidades referenciadas en skillsByLevel existen en el catálogo", () => {
    const catalogIds = Object.keys(HABILIDADES);
    for (const [clsId, cls] of Object.entries(CLASES)) {
      for (const [level, skillId] of Object.entries(cls.skillsByLevel)) {
        expect(catalogIds).toContain(skillId);
      }
    }
  });

  it("Las habilidades referenciadas en skillsByLevel pertenecen a la clase correcta", () => {
    for (const [clsId, cls] of Object.entries(CLASES)) {
      for (const [level, skillId] of Object.entries(cls.skillsByLevel)) {
        const skill = HABILIDADES[skillId];
        expect(skill).toBeDefined();
        expect(skill.clase).toBe(clsId);
      }
    }
  });
});

describe("clases — getClase", () => {
  it("getClase('civil') devuelve la clase Civil", () => {
    const cls = getClase("civil");
    expect(cls).toBeDefined();
    expect(cls.name).toBe("Civil");
  });

  it("getClase('inexistente') devuelve null", () => {
    expect(getClase("inexistente")).toBeNull();
  });

  it("getClase('') devuelve null", () => {
    expect(getClase("")).toBeNull();
  });
});

describe("clases — listarClases", () => {
  it("Devuelve 4 clases", () => {
    const list = listarClases();
    expect(list).toHaveLength(4);
  });

  it("Cada entrada tiene id, name, description", () => {
    for (const entry of listarClases()) {
      expect(entry.id).toBeTruthy();
      expect(entry.name).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.skillsByLevel).toBeUndefined();
    }
  });
});

describe("clases — validarClase", () => {
  it("valida clases existentes", () => {
    expect(validarClase("civil")).toBe(true);
    expect(validarClase("aventurero")).toBe(true);
    expect(validarClase("ladron")).toBe(true);
    expect(validarClase("comerciante")).toBe(true);
  });

  it("rechaza clases inexistentes", () => {
    expect(validarClase("guerrero")).toBe(false);
    expect(validarClase("mago")).toBe(false);
    expect(validarClase("")).toBe(false);
  });
});
