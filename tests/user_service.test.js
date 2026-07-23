const { sanitizeName } = require("../src/services/userService");

describe("userService — sanitizeName", () => {
  it("elimina acentos: Jose", () => {
    expect(sanitizeName("Jose")).toBe("Jose");
  });

  it("elimina acentos: cafe", () => {
    expect(sanitizeName("cafe")).toBe("cafe");
  });

  it("reemplaza espacios con guion bajo", () => {
    expect(sanitizeName("Goku  Black")).toBe("Goku_Black");
  });

  it("elimina caracteres prohibidos", () => {
    expect(sanitizeName("Name/With*Chars")).toBe("NameWithChars");
  });

  it("retorna usuario para input vacio", () => {
    expect(sanitizeName("")).toBe("usuario");
  });

  it("retorna usuario para null", () => {
    expect(sanitizeName(null)).toBe("usuario");
  });

  it("retorna usuario para undefined", () => {
    expect(sanitizeName(undefined)).toBe("usuario");
  });

  it("normaliza espacios multiples y guiones bajos", () => {
    expect(sanitizeName("  Hello   World  ")).toBe("Hello_World");
  });

  it("elimina caracteres de control", () => {
    expect(sanitizeName("Name\x00With\x1fChars")).toBe("NameWithChars");
  });

  it("maneja strings con solo espacios", () => {
    expect(sanitizeName("   ")).toBe("usuario");
  });
});

describe("userService — sanitizeName edge cases", () => {
  it("maneja numeros en el nombre", () => {
    expect(sanitizeName("User123")).toBe("User123");
  });

  it("elimina caracteres especiales de WhatsApp", () => {
    expect(sanitizeName("User@Name#1")).toBe("User@Name#1");
  });

  it("preserva guiones bajos existentes", () => {
    expect(sanitizeName("my_user_name")).toBe("my_user_name");
  });

  it("maneja strings muy largos", () => {
    const longName = "A".repeat(100);
    expect(sanitizeName(longName)).toBe(longName);
  });
});
