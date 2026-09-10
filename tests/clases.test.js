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

  it("Cada clase tiene id, name, description", () => {
    for (const cls of Object.values(CLASES)) {
      expect(cls.id).toBeTruthy();
      expect(cls.name).toBeTruthy();
      expect(cls.description).toBeTruthy();
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
