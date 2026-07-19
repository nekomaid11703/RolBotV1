const commands = [
  {
    name: "add_stelas",
    module: require("../src/commands/economy/add_stelas"),
    expect: ["*Uso*", "*Ejemplo*", "/add_stelas @usuario cantidad"],
  },
  {
    name: "rem_stelas",
    module: require("../src/commands/economy/rem_stelas"),
    expect: ["*Uso*", "*Ejemplo*", "/rem_stelas @usuario cantidad"],
  },
  {
    name: "set_stelas",
    module: require("../src/commands/economy/set_stelas"),
    expect: ["*Uso*", "*Ejemplo*", "/set_stelas @usuario cantidad"],
  },
  {
    name: "dar_stelas",
    module: require("../src/commands/economy/dar_stelas"),
    expect: ["*Uso*", "*Ejemplo*", "/dar_stelas @usuario cantidad"],
  },
  {
    name: "eco_admin_add",
    module: require("../src/commands/admin/permissions/eco_admin_add"),
    expect: ["*Uso*", "*Ejemplo*", "/eco_admin_add @usuario"],
  },
  {
    name: "eco_admin_rem",
    module: require("../src/commands/admin/permissions/eco_admin_rem"),
    expect: ["*Uso*", "*Ejemplo*", "/eco_admin_rem @usuario"],
  },
  {
    name: "switch_pj",
    module: require("../src/commands/rpg/characters/switch_pj"),
    expect: ["*Uso*", "*Ejemplo*", "/switch_pj Nombre"],
  },
  {
    name: "renombrar_pj",
    module: require("../src/commands/rpg/characters/renombrar_pj"),
    expect: ["*Uso*", "*Ejemplo*", "/renombrar_pj nombre_actual nuevo_nombre"],
  },
  {
    name: "eliminar_pj",
    module: require("../src/commands/rpg/characters/eliminar_pj"),
    expect: ["*Uso*", "*Ejemplo*", "/eliminar_pj NombreDelPersonaje"],
  },
  {
    name: "editar_pj",
    module: require("../src/commands/rpg/characters/editar_pj"),
    expect: ["*Uso*", "*Ejemplo*", "/editar_pj"],
  },
];

/**
 *
 * @param overrides
 */
function createCtx(overrides = {}) {
  const replies = [];
  return {
    args: [],
    text: "",
    mentionedJid: [],
    sender: "user@s.whatsapp.net",
    senderJid: "user@s.whatsapp.net",
    userName: "Tester",
    isGroup: false,
    from: "chat@s.whatsapp.net",
    sock: {},
    reply: async (message) => {
      replies.push(String(message));
    },
    react: async () => {},
    replies,
    ...overrides,
  };
}

describe("Formato de uso/ejemplo en comandos", () => {
  for (const command of commands) {
    it(`${command.name} incluye los campos esperados`, async () => {
      const ctx = createCtx();
      await command.module.execute(ctx);
      expect(ctx.replies.length).toBe(1);
      const response = ctx.replies[0];
      for (const expected of command.expect) {
        expect(response.includes(expected)).toBe(true);
      }
    });
  }

  it("dado inválido muestra formato de error", async () => {
    const ctx = createCtx({ args: ["2x20"] });
    const dadoModule = require("../src/commands/info/dado");
    await dadoModule.execute(ctx);
    expect(ctx.replies[0].includes("*No se pudo completar*")).toBe(true);
    expect(ctx.replies[0].includes("/dado [X]dY")).toBe(true);
    expect(ctx.replies[0].includes("*Ejemplo*")).toBe(true);
  });

  describe("crear_pj — multi-step flow", () => {
    it("sin args muestra lista de razas", async () => {
      const crearModule = require("../src/commands/rpg/characters/crear_pj");
      const ctx = createCtx();
      await crearModule.execute(ctx);
      expect(ctx.replies.length).toBe(1);
      expect(ctx.replies[0]).toContain("raza");
    });

    it("con arg numérico 1 muestra la plantilla de la raza", async () => {
      const crearModule = require("../src/commands/rpg/characters/crear_pj");
      const ctx = createCtx({ text: "/crear_pj 1", args: ["1"] });
      await crearModule.execute(ctx);
      expect(ctx.replies.length).toBe(1);
      expect(ctx.replies[0]).toContain("Plantilla");
      expect(ctx.replies[0]).toContain("Nombre:");
      expect(ctx.replies[0]).toContain("Historia");
    });

    it("con arg 'humano' muestra la plantilla de humano", async () => {
      const crearModule = require("../src/commands/rpg/characters/crear_pj");
      const ctx = createCtx({ text: "/crear_pj humano", args: ["humano"] });
      await crearModule.execute(ctx);
      expect(ctx.replies.length).toBe(1);
      expect(ctx.replies[0]).toContain("Humano");
    });
  });
});
