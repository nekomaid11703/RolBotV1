const itemAddModule = require("../src/commands/rpg/inventory/item_add");
const itemRemModule = require("../src/commands/rpg/inventory/item_rem");

describe("item_add — module info", () => {
  it("tiene name, aliases, description, category, adminPerm", () => {
    expect(itemAddModule.name).toBe("item_add");
    expect(itemAddModule.aliases).toContain("dar_item");
    expect(itemAddModule.aliases).toContain("giveitem");
    expect(itemAddModule.category).toBe("rpg");
    expect(itemAddModule.adminPerm).toBe("items");
  });

  it("tiene execute function", () => {
    expect(typeof itemAddModule.execute).toBe("function");
  });
});

describe("item_rem — module info", () => {
  it("tiene name, aliases, description, category, adminPerm", () => {
    expect(itemRemModule.name).toBe("item_rem");
    expect(itemRemModule.aliases).toContain("quitar_item");
    expect(itemRemModule.aliases).toContain("removeitem");
    expect(itemRemModule.category).toBe("rpg");
    expect(itemRemModule.adminPerm).toBe("items");
  });

  it("tiene execute function", () => {
    expect(typeof itemRemModule.execute).toBe("function");
  });
});

describe("item_add — execute", () => {
  it("muestra ayuda si no hay argumentos", async () => {
    const replies = [];
    const ctx = {
      args: [],
      sender: "user@s.whatsapp.net",
      userName: "Tester",
      reply: vi.fn(async (msg) => {
        replies.push(String(msg));
      }),
    };
    await itemAddModule.execute(ctx);
    expect(ctx.reply).toHaveBeenCalledTimes(1);
    expect(replies[0]).toContain("AGREGAR");
  });
});

describe("item_rem — execute", () => {
  it("muestra ayuda si no hay argumentos", async () => {
    const replies = [];
    const ctx = {
      args: [],
      sender: "user@s.whatsapp.net",
      userName: "Tester",
      reply: vi.fn(async (msg) => {
        replies.push(String(msg));
      }),
    };
    await itemRemModule.execute(ctx);
    expect(ctx.reply).toHaveBeenCalledTimes(1);
    expect(replies[0]).toContain("Quitar");
  });
});
