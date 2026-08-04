const { assertServiceRoleKey } = require("../src/database/supabase");

function syntheticJwt(payload) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.synthetic-signature`;
}

describe("Supabase service role configuration", () => {
  it("acepta claves JWT con service_role", () => {
    expect(() => assertServiceRoleKey(syntheticJwt({ role: "service_role" }))).not.toThrow();
  });

  it("rechaza claves JWT que declaran un rol cliente", () => {
    expect(() => assertServiceRoleKey(syntheticJwt({ role: "anon" }))).toThrow("se requiere service_role");
  });

  it("acepta claves backend opacas sin claims JWT", () => {
    const opaqueKey = ["sb", "secret", "synthetic", "test", "key"].join("_");
    expect(() => assertServiceRoleKey(opaqueKey)).not.toThrow();
  });
});
