const { getCategoryLabel } = require("../src/services/permissionService");

describe("permissionService — getCategoryLabel", () => {
  it("retorna economia para economy", () => {
    expect(getCategoryLabel("economy")).toBe("econom\u00eda");
  });

  it("retorna items para items", () => {
    expect(getCategoryLabel("items")).toBe("\u00edtems");
  });

  it("retorna la misma cadena para categoria desconocida", () => {
    expect(getCategoryLabel("combat")).toBe("combat");
  });

  it("retorna la misma cadena para string vacio", () => {
    expect(getCategoryLabel("")).toBe("");
  });

  it("retorna undefined para undefined", () => {
    expect(getCategoryLabel(undefined)).toBeUndefined();
  });

  it("retorna null para null", () => {
    expect(getCategoryLabel(null)).toBeNull();
  });
});
