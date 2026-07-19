/**
 *
 * @param rawText
 */
function parseCrearPj(rawText) {
  const lines = rawText.split("\n");
  let name = "";
  let clase = "";
  let raza = "";
  let historia = "";
  let historiaStarted = false;
  let historiaFirstLine = true;

  const labelToKey = { str: "str", def: "def", spd_atk: "spd_atk", ref: "ref", spd_mov: "spd_mov" };
  Object.assign(labelToKey, { str: "str", def: "def", spd_atk: "spd_atk", ref: "ref", spd_mov: "spd_mov" });
  Object.entries({ STR: "str", SPD_ATK: "spd_atk", SPD_MOV: "spd_mov", REF: "ref", DEF: "def" }).forEach(([k, v]) => {
    labelToKey[k.toLowerCase()] = v;
  });

  for (const rawLine of lines) {
    const trimmed = (rawLine || "").trim();

    if (historiaStarted) {
      if (historiaFirstLine) {
        historia += trimmed;
        historiaFirstLine = false;
      } else {
        historia += "\n" + trimmed;
      }
      continue;
    }

    if (/^Historia/i.test(trimmed)) {
      historiaStarted = true;
      const rest = trimmed.replace(/^Historia[^:]*:\s*/i, "");
      if (rest) {
        historia = rest;
        historiaFirstLine = false;
      }
      continue;
    }

    const nameMatch = trimmed.match(/^Nombre:\s*(.+)/i);
    if (nameMatch && !name) {
      name = nameMatch[1].trim();
      continue;
    }

    const raceMatch = trimmed.match(/^Raza:\s*(.+)/i);
    if (raceMatch && !raza) {
      raza = raceMatch[1].trim();
      continue;
    }

    const classMatch = trimmed.match(/^Clase:\s*(.+)/i);
    if (classMatch && !clase) {
      clase = classMatch[1].trim();
      continue;
    }
  }

  if (historiaFirstLine) historia = "";

  return { name, clase, raza, historia };
}

describe("Parser de crear_pj (nuevo formato)", () => {
  it("Caso ideal completo con formato nuevo", () => {
    const result = parseCrearPj(
      `/crear_pj\nNombre: Aelin\nRaza: Humana\nClase: Aventurero\nSTR(2): 2\nSPD_ATK(2): 3\nSPD_MOV(2): 2\nREF(2): 2\nDEF(2): 1\nHistoria y detalles: Una viajera que vaga por el mundo\nnacio en las montañas nevadas y pasa sus dias vagando por los bosques`,
    );
    expect(result.name).toBe("Aelin");
    expect(result.raza).toBe("Humana");
    expect(result.clase).toBe("Aventurero");
    expect(result.historia).toContain("Una viajera que vaga por el mundo");
    expect(result.historia).toContain("nacio en las montañas nevadas");
  });

  it("Caso desordenado (espacios y mayúsculas aleatorias)", () => {
    const result = parseCrearPj(
      `/CREAR_pj\nnombre:    Aragorn  \nRaza:   HUMANA\ncLAse:   Civil\nHistoria:\nEl heredero de Isildur.`,
    );
    expect(result).toEqual({ name: "Aragorn", raza: "HUMANA", clase: "Civil", historia: "El heredero de Isildur." });
  });

  it("Caso sin clase (clase vacía u omitida)", () => {
    const result = parseCrearPj(`/crear_pj\nNombre: Frodo\nRaza: Humano\nHistoria: Portador del anillo.`);
    expect(result).toEqual({ name: "Frodo", raza: "Humano", clase: "", historia: "Portador del anillo." });
  });

  it("Caso sin historia (campo omitido por completo)", () => {
    const result = parseCrearPj(`/crear_pj\nNombre: Sam\nRaza: Humano\nClase: Civil\nSTR: 2`);
    expect(result.name).toBe("Sam");
    expect(result.historia).toBe("");
  });

  it("Historia multiline sin prefijo en líneas siguientes", () => {
    const result = parseCrearPj(`Nombre: Test\nRaza: Humano\nClase: Ladron\nHistoria:\nLínea 1\nLínea 2\nLínea 3`);
    expect(result.historia).toBe("Línea 1\nLínea 2\nLínea 3");
  });

  it("Historia con 'Historia y detalles:' como prefijo largo", () => {
    const result = parseCrearPj(
      `Nombre: Test\nRaza: Humano\nClase: Comerciante\nHistoria y detalles: Un comerciante.\nSegunda línea.`,
    );
    expect(result.historia).toBe("Un comerciante.\nSegunda línea.");
  });

  it("Raza resiste variantes humano/humana", () => {
    const r1 = parseCrearPj(`Nombre: A\nRaza: humano\nClase: Civil\nHistoria: x`).raza;
    const r2 = parseCrearPj(`Nombre: B\nRaza: Humana\nClase: Civil\nHistoria: x`).raza;
    const r3 = parseCrearPj(`Nombre: C\nRaza:  Humano  \nClase: Civil\nHistoria: x`).raza;
    expect(r1).toBe("humano");
    expect(r2).toBe("Humana");
    expect(r3).toBe("Humano");
  });
});
