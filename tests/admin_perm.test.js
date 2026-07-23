const adminPermAdd = require("../src/commands/admin/permissions/admin_perm_add");
const adminPermRem = require("../src/commands/admin/permissions/admin_perm_rem");
const adminPermList = require("../src/commands/admin/permissions/admin_perm_list");

describe("admin_perm_add — module info", () => {
  it("tiene name, aliases, category, creatorOnly", () => {
    expect(adminPermAdd.name).toBe("admin_perm_add");
    expect(adminPermAdd.aliases).toContain("apa");
    expect(adminPermAdd.category).toBe("admin");
    expect(adminPermAdd.creatorOnly).toBe(true);
  });

  it("tiene execute function", () => {
    expect(typeof adminPermAdd.execute).toBe("function");
  });
});

describe("admin_perm_rem — module info", () => {
  it("tiene name, aliases, category, creatorOnly", () => {
    expect(adminPermRem.name).toBe("admin_perm_rem");
    expect(adminPermRem.aliases).toContain("apr");
    expect(adminPermRem.category).toBe("admin");
    expect(adminPermRem.creatorOnly).toBe(true);
  });

  it("tiene execute function", () => {
    expect(typeof adminPermRem.execute).toBe("function");
  });
});

describe("admin_perm_list — module info", () => {
  it("tiene name, aliases, category, creatorOnly", () => {
    expect(adminPermList.name).toBe("admin_perm_list");
    expect(adminPermList.aliases).toContain("apl");
    expect(adminPermList.category).toBe("admin");
    expect(adminPermList.creatorOnly).toBe(true);
  });

  it("tiene execute function", () => {
    expect(typeof adminPermList.execute).toBe("function");
  });
});

describe("admin_perm commands — help messages", () => {
  it("admin_perm_add muestra uso sin argumentos", async () => {
    const replies = [];
    const ctx = {
      args: [],
      sender: "creator@s.whatsapp.net",
      userName: "Creator",
      reply: vi.fn(async (msg) => {
        replies.push(String(msg));
      }),
    };
    await adminPermAdd.execute(ctx);
    const output = replies[0] || "";
    expect(output).toContain("Uso");
  });

  it("admin_perm_rem muestra uso sin argumentos", async () => {
    const replies = [];
    const ctx = {
      args: [],
      sender: "creator@s.whatsapp.net",
      userName: "Creator",
      reply: vi.fn(async (msg) => {
        replies.push(String(msg));
      }),
    };
    await adminPermRem.execute(ctx);
    const output = replies[0] || "";
    expect(output).toContain("Uso");
  });

  it("admin_perm_add muestra uso con JID pero sin categoria", async () => {
    const replies = [];
    const ctx = {
      args: ["5511999999999"],
      mentionedJid: ["5511999999999@s.whatsapp.net"],
      sender: "creator@s.whatsapp.net",
      userName: "Creator",
      reply: vi.fn(async (msg) => {
        replies.push(String(msg));
      }),
    };
    await adminPermAdd.execute(ctx);
    const output = replies[0] || "";
    expect(output).toContain("Uso");
  });
});
