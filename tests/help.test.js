const helpModule = require("../src/commands/info/help");
const { commands, aliases, registerCommand } = require("../src/core/commandRegistry");

describe("help — module info", () => {
  it("tiene name, aliases, description, category", () => {
    expect(helpModule.name).toBe("help");
    expect(helpModule.aliases).toContain("menu");
    expect(helpModule.aliases).toContain("comandos");
    expect(helpModule.description).toBeTruthy();
    expect(helpModule.category).toBe("info");
  });
});

describe("help — output structure", () => {
  beforeAll(() => {
    commands.clear();
    aliases.clear();

    const execute = async () => {};
    const cmds = [
      { name: "atacar", category: "rpg", description: "Ataca a un enemigo", execute },
      { name: "retar", category: "rpg", description: "Reto combate", execute },
      { name: "estado", category: "rpg", description: "Estado del combate", execute },
      { name: "bloquear", category: "rpg", description: "Bloquea ataque", execute },
      { name: "esquivar", category: "rpg", description: "Esquiva ataque", execute },
      { name: "huir", category: "rpg", description: "Huir del combate", execute },
      { name: "crear_pj", category: "rpg", description: "Crea personaje", execute },
      { name: "ver_pj", category: "rpg", description: "Ver personaje", execute },
      { name: "inventario", category: "rpg", description: "Inventario", execute },
      { name: "usar", category: "rpg", description: "Usar objeto", execute },
      { name: "item_add", category: "rpg", description: "Agregar item", adminPerm: "items", execute },
      { name: "item_rem", category: "rpg", description: "Quitar item", adminPerm: "items", execute },
      { name: "balance", category: "economia", description: "Ver saldo", execute },
      { name: "daily", category: "economia", description: "Reclamo diario", execute },
      { name: "add_stelas", category: "economia", description: "Agregar stelas", economyAdminOnly: true, execute },
      { name: "ban", category: "admin", description: "Banear usuario", adminOnly: true, groupOnly: true, execute },
      { name: "warn", category: "admin", description: "Advertir usuario", adminOnly: true, groupOnly: true, execute },
      {
        name: "disolver_combate",
        category: "admin",
        description: "Disolver combate",
        adminOnly: true,
        groupOnly: true,
        execute,
      },
      { name: "eco_admin_add", category: "admin", description: "Agregar eco admin", creatorOnly: true, execute },
      { name: "admin_perm_add", category: "admin", description: "Agregar permiso", creatorOnly: true, execute },
      { name: "help", category: "info", description: "Muestra ayuda", aliases: ["menu", "comandos"], execute },
      { name: "dado", category: "info", description: "Lanza dado", execute },
      { name: "bugreport", category: "info", description: "Reportar bug", execute },
    ];

    for (const cmd of cmds) {
      registerCommand(cmd, `${cmd.name}.js`);
    }
  }, 15000);

  /**
   *
   */
  async function execHelp() {
    const replies = [];
    const ctx = {
      args: [],
      text: "/help",
      sender: "user@s.whatsapp.net",
      userName: "Tester",
      isGroup: false,
      reply: async (msg) => {
        replies.push(String(msg));
      },
      react: async () => {},
    };
    await helpModule.execute(ctx);
    return replies[0] || "";
  }

  it("muestra las 3 secciones principales", async () => {
    const output = await execHelp();
    expect(output).toContain("ADMINISTRADOR");
    expect(output).toContain("CREADOR");
    expect(output).toContain("COMUNES");
  });

  it("seccion administrador tiene subcategorias RPG y Grupo", async () => {
    const output = await execHelp();
    expect(output).toContain("/item_add");
    expect(output).toContain("/item_rem");
    expect(output).toContain("/add_stelas");
    expect(output).toContain("/ban");
    expect(output).toContain("/warn");
    expect(output).toContain("/disolver_combate");
  });

  it("seccion creador tiene comandos de permisos", async () => {
    const output = await execHelp();
    expect(output).toContain("/eco_admin_add");
    expect(output).toContain("/admin_perm_add");
  });

  it("seccion comunes tiene RPG, economia e info", async () => {
    const output = await execHelp();
    expect(output).toContain("/atacar");
    expect(output).toContain("/crear_pj");
    expect(output).toContain("/balance");
    expect(output).toContain("/daily");
    expect(output).toContain("/dado");
    expect(output).toContain("/bugreport");
  });

  it("incluye comandos de combate", async () => {
    const output = await execHelp();
    expect(output).toContain("/atacar");
    expect(output).toContain("/retar");
    expect(output).toContain("/estado");
    expect(output).toContain("/bloquear");
    expect(output).toContain("/esquivar");
    expect(output).toContain("/huir");
  });

  it("incluye el pie de pagina con el conteo de comandos", async () => {
    const output = await execHelp();
    expect(output).toMatch(/\d+ comandos/);
  });
});
