// @ts-nocheck
const { composeMessage } = require("../src/ui/sectionBuilder");
const { box } = require("../src/utils/boxUtils");

describe("sectionBuilder — composeMessage", () => {
  it("Une secciones separadas por línea en blanco", () => {
    const msg = composeMessage({ title: "TEST", sections: [["a"], ["b"], ["c"]] });
    expect(msg).toBe(box("TEST", ["a", "", "b", "", "c"]));
  });

  it("Ignora secciones vacías y null", () => {
    const msg = composeMessage({ title: "TEST", sections: [[], null, ["a"]] });
    expect(msg).toContain("a");
    expect(msg.split("\n").filter((l) => l === "").length).toBe(0);
  });

  it("Acepta secciones string (multi-línea)", () => {
    const msg = composeMessage({ title: "TEST", sections: ["x\ny"] });
    expect(msg).toContain("x");
    expect(msg).toContain("y");
  });

  it("Permite un boxFn custom", () => {
    const wrap = (title, lines) => `<${title}:${lines.join("|")}>`;
    const msg = composeMessage({ title: "T", sections: [["a"]], boxFn: wrap });
    expect(msg).toBe("<T:a>");
  });
});
