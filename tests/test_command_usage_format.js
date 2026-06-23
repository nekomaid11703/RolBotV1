const assert = require("assert");

const commands = [
  {
    name: "add_stelas",
    module: require("../src/commands/economia/add_stelas"),
    expect: ["*Uso*", "*Ejemplo*", "/add_stelas @usuario cantidad"],
  },
  {
    name: "rem_stelas",
    module: require("../src/commands/economia/rem_stelas"),
    expect: ["*Uso*", "*Ejemplo*", "/rem_stelas @usuario cantidad"],
  },
  {
    name: "set_stelas",
    module: require("../src/commands/economia/set_stelas"),
    expect: ["*Uso*", "*Ejemplo*", "/set_stelas @usuario cantidad"],
  },
  {
    name: "dar_stelas",
    module: require("../src/commands/economia/dar_stelas"),
    expect: ["*Uso*", "*Ejemplo*", "/dar_stelas @usuario cantidad"],
  },
  {
    name: "eco_admin_add",
    module: require("../src/commands/permisos/eco_admin_add"),
    expect: ["*Uso*", "*Ejemplo*", "/eco_admin_add @usuario"],
  },
  {
    name: "eco_admin_rem",
    module: require("../src/commands/permisos/eco_admin_rem"),
    expect: ["*Uso*", "*Ejemplo*", "/eco_admin_rem @usuario"],
  },
  {
    name: "switch_pj",
    module: require("../src/commands/personajes/switch_pj"),
    expect: ["*Uso*", "*Ejemplo*", "/switch_pj Nombre"],
  },
  {
    name: "renombrar_pj",
    module: require("../src/commands/personajes/edit_pj_name"),
    expect: ["*Uso*", "*Ejemplo*", "/renombrar_pj NuevoNombre"],
  },
  {
    name: "eliminar_pj",
    module: require("../src/commands/personajes/eliminar_pj"),
    expect: ["*Uso*", "*Ejemplo*", "/eliminar_pj NombrePersonaje"],
  },
  {
    name: "dado",
    module: require("../src/commands/utilidades/dado"),
    expect: ["*Uso*", "*Ejemplo*", "/dado XdY", "/dado 2d20"],
  },
  {
    name: "crear_pj",
    module: require("../src/commands/personajes/crear_pj"),
    expect: ["*Plantilla*", "*Ejemplo*", "Nombre:", "Historia:"],
  },
  {
    name: "editar_pj_descripcion",
    module: require("../src/commands/personajes/editar_pj_descripcion"),
    expect: ["*Plantilla*", "*Ejemplo*", "Campo:", "Descripción:"],
  },
];

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

async function run() {
  console.log("Ejecutando pruebas de formato de uso/ejemplo en comandos...");

  for (const command of commands) {
    const ctx = createCtx();
    await command.module.execute(ctx);

    assert.strictEqual(ctx.replies.length, 1, `${command.name} debe responder una vez.`);
    const response = ctx.replies[0];

    for (const expected of command.expect) {
      assert.ok(
        response.includes(expected),
        `${command.name} debe incluir "${expected}" en su salida.`,
      );
    }
  }

  const invalidDiceCtx = createCtx({ args: ["2x20"] });
  await require("../src/commands/utilidades/dado").execute(invalidDiceCtx);
  assert.ok(invalidDiceCtx.replies[0].includes("*No se pudo completar*"));
  assert.ok(invalidDiceCtx.replies[0].includes("/dado XdY"));
  assert.ok(invalidDiceCtx.replies[0].includes("*Ejemplo*"));

  console.log("Formato de comandos OK.");
}

run().catch((error) => {
  console.error("Fallo test_command_usage_format:", error);
  process.exit(1);
});
