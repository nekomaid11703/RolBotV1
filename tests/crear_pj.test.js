function testParser(rawText) {
  const nameMatch = rawText.match(/Nombre:\s*(.+)/i);
  const classMatch = rawText.match(/Clase:\s*(.+)/i);
  const historyMatch = rawText.match(/Historia:\s*([\s\S]+)/i);
  if (!nameMatch) throw new Error("No encontré el campo 'Nombre:'.");
  return {
    name: nameMatch[1].trim(),
    clase: classMatch ? classMatch[1].trim() : "",
    historia: historyMatch ? historyMatch[1].trim() : "",
  };
}

describe("Regex de crear_pj", () => {
  it("Caso Ideal (copiar/pegar de la plantilla)", () => {
    const result = testParser(
      `/crear_pj\nNombre: Kevin\nClase: Guerrero Mágico\nHistoria: Vivía en una montaña lejana.\nTenía un perro.`,
    );
    expect(result).toEqual({
      name: "Kevin",
      clase: "Guerrero Mágico",
      historia: "Vivía en una montaña lejana.\nTenía un perro.",
    });
  });
  it("Caso desordenado (espacios y mayúsculas aleatorias)", () => {
    const result = testParser(`/CREAR_pj\nnombre:    Aragorn  \ncLAse:   Ranger\nhistoria:  \nEl heredero de Isildur.`);
    expect(result).toEqual({ name: "Aragorn", clase: "Ranger", historia: "El heredero de Isildur." });
  });
  it("Caso sin clase (Clase vacía u omitida)", () => {
    const result = testParser(`/crear_pj\nNombre: Frodo\nHistoria: Portador del anillo.`);
    expect(result).toEqual({ name: "Frodo", clase: "", historia: "Portador del anillo." });
  });
});
