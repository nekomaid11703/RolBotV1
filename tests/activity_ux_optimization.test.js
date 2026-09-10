const { supabase } = require("../src/database/supabase");
const { cache, TTLS } = require("../src/utils/cacheService");
const createContext = require("../src/core/context");
const { recordGroupActivity } = require("../src/services/groupActivityService");
const { recordUserActivity } = require("../src/services/userService");
const { addMoney, getBalance, transferMoney } = require("../src/services/economyService");
const todos = require("../src/commands/admin/group/todos");

function cachedProfile(userId, { money = 500, messages = 7, commands = 2 } = {}) {
  const profile = {
    creatorId: userId,
    creatorName: "Neko",
    metadata: { displayName: "Neko", pushName: "Neko", lastSeenAt: "2026-01-01T00:00:00.000Z" },
    economy: { money },
    activity: { messages, commands },
  };
  cache.set(`user:${userId}`, { folder: "supabase", profilePath: "supabase", profile }, TTLS.memoryContext);
  return profile;
}

describe("optimizaciones de actividad y UX", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    cache.clear();
    vi.spyOn(supabase, "from");
    vi.spyOn(supabase, "rpc");
  });

  it("persiste solo el grupo y el miembro que enviÃ³ el mensaje, manteniendo la cachÃ© caliente", async () => {
    const memberPayloads = [];
    supabase.from.mockImplementation((table) => {
      if (table === "groups") {
        return {
          upsert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(async () => ({ data: { id: 42 }, error: null })),
            })),
          })),
        };
      }
      return {
        upsert: vi.fn(async (payload) => {
          memberPayloads.push(payload);
          return { error: null };
        }),
      };
    });

    const record = {
      groupId: "group@g.us",
      groupName: "Grupo",
      totals: { messages: 10 },
      members: {
        "old@s.whatsapp.net": { memberId: "old@s.whatsapp.net", memberName: "Old", messages: 9 },
        "new@s.whatsapp.net": { memberId: "new@s.whatsapp.net", memberName: "New", messages: 1 },
      },
    };
    cache.set("group:group@g.us", record, TTLS.memoryContext);
    cache.set("topGroupMembers:group@g.us:10", [record.members["old@s.whatsapp.net"]], TTLS.memoryContext);

    await recordGroupActivity({
      groupId: "group@g.us",
      memberId: "new@s.whatsapp.net",
      memberName: "New",
      messageType: "conversation",
      messageCount: 1,
      isText: true,
    });

    expect(supabase.from).toHaveBeenCalledTimes(2);
    expect(memberPayloads).toEqual([{ group_id: 42, player_phone: "new@s.whatsapp.net", messages_count: 2 }]);
    expect(cache.get("group:group@g.us").totals.messages).toBe(11);
    expect(cache.get("topGroupMembers:group@g.us:10")).toBeUndefined();
  });

  it("actividad y economÃ­a actualizan solo sus propias columnas", async () => {
    const updates = [];
    const updateIds = [];
    supabase.from.mockImplementation(() => ({
      update: vi.fn((payload) => ({
        eq: vi.fn(async (_column, value) => {
          updates.push(payload);
          updateIds.push(value);
          return { error: null };
        }),
      })),
    }));

    cachedProfile("user@s.whatsapp.net");
    await recordUserActivity({
      creatorId: "user@s.whatsapp.net",
      creatorName: "Neko",
      messageType: "conversation",
      messageCount: 1,
      isText: true,
    });

    cachedProfile("canonical@s.whatsapp.net", { messages: 8 });
    cache.set("user:alias@lid", cache.get("user:canonical@s.whatsapp.net"), TTLS.memoryContext);
    await addMoney("alias@lid", 100);

    expect(updates[0]).toMatchObject({ username: "Neko", activity_messages: 8, activity_commands: 2 });
    expect(updates[0]).not.toHaveProperty("money");
    expect(updates[1]).toMatchObject({ money: 600 });
    expect(updates[1]).not.toHaveProperty("activity_messages");
    expect(updates[1]).not.toHaveProperty("activity_commands");
    expect(updateIds).toEqual(["user@s.whatsapp.net", "canonical@s.whatsapp.net"]);
  });

  it("actualiza todos los metadatos aunque cambie el nombre primero", async () => {
    let payload;
    supabase.from.mockImplementation(() => ({
      update: vi.fn((nextPayload) => ({
        eq: vi.fn(async () => {
          payload = nextPayload;
          return { error: null };
        }),
      })),
    }));
    const oldSeenAt = "2026-01-01T00:00:00.000Z";
    cachedProfile("user@s.whatsapp.net").metadata.lastSeenAt = oldSeenAt;

    const result = await recordUserActivity({
      creatorId: "user@s.whatsapp.net",
      creatorName: "Neko",
      displayName: "Nuevo nombre",
      pushName: "Nuevo push",
      senderJid: "alias@lid",
      senderNumber: "595100200",
      messageType: "conversation",
      messageCount: 1,
      isText: true,
    });

    expect(result.metadata).toMatchObject({
      displayName: "Nuevo nombre",
      pushName: "Nuevo push",
      lastKnownJid: "alias@lid",
      lastKnownNumber: "595100200",
    });
    expect(result.metadata.lastSeenAt).not.toBe(oldSeenAt);
    expect(payload.last_active_at).toBe(result.metadata.lastSeenAt);
  });

  it("invalida aliases tras guardar economÃ­a y la siguiente lectura ve el saldo persistido", async () => {
    let storedMoney = 500;
    supabase.from.mockImplementation(() => ({
      update: vi.fn((payload) => ({
        eq: vi.fn(async () => {
          storedMoney = payload.money;
          return { error: null };
        }),
      })),
      select: vi.fn(() => ({
        eq: vi.fn((_column, phone) => ({
          single: vi.fn(async () => ({
            data: { phone, username: "Neko", money: storedMoney, activity_messages: 0, activity_commands: 0 },
            error: null,
          })),
        })),
      })),
    }));
    cachedProfile("canonical@s.whatsapp.net", { money: storedMoney });
    cache.set("user:alias@lid", cache.get("user:canonical@s.whatsapp.net"), TTLS.memoryContext);

    await addMoney("alias@lid", 100);

    expect(cache.get("user:alias@lid")).toBeUndefined();
    expect(await getBalance("canonical@s.whatsapp.net")).toBe(600);
  });

  it("invalida IDs solicitados y canÃ³nicos despuÃ©s de una transferencia", async () => {
    const balances = new Map([
      ["from@s.whatsapp.net", 500],
      ["to@s.whatsapp.net", 100],
    ]);
    supabase.rpc.mockImplementation(async (_name, payload) => {
      balances.set(payload.from_phone, balances.get(payload.from_phone) - payload.amount);
      balances.set(payload.to_phone, balances.get(payload.to_phone) + payload.amount);
      return { data: { success: true }, error: null };
    });
    supabase.from.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn((_column, phone) => ({
          single: vi.fn(async () => ({
            data: {
              phone,
              username: "Neko",
              money: balances.get(phone),
              activity_messages: 0,
              activity_commands: 0,
            },
            error: null,
          })),
        })),
      })),
    }));
    cachedProfile("from@s.whatsapp.net", { money: 500 });
    cachedProfile("to@s.whatsapp.net", { money: 100 });
    cache.set("user:from@lid", cache.get("user:from@s.whatsapp.net"), TTLS.memoryContext);
    cache.set("user:to@lid", cache.get("user:to@s.whatsapp.net"), TTLS.memoryContext);

    await transferMoney("from@lid", "to@lid", 50);

    expect(cache.get("user:from@lid")).toBeUndefined();
    expect(cache.get("user:to@lid")).toBeUndefined();
    expect(await getBalance("from@s.whatsapp.net")).toBe(450);
    expect(await getBalance("to@s.whatsapp.net")).toBe(150);
  });

  it("no adelanta las cachés si falla la persistencia", async () => {
    const group = {
      groupId: "group@g.us",
      groupName: "Grupo",
      totals: { messages: 10 },
      members: {
        "user@s.whatsapp.net": {
          memberId: "user@s.whatsapp.net",
          memberName: "Neko",
          messages: 10,
        },
      },
    };
    cache.set("group:group@g.us", group, TTLS.memoryContext);
    cachedProfile("user@s.whatsapp.net", { money: 500 });

    supabase.from.mockImplementation((table) => {
      if (table === "groups") {
        return {
          upsert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(async () => ({ data: null, error: { message: "database unavailable" } })),
            })),
          })),
        };
      }
      return {
        update: vi.fn(() => ({
          eq: vi.fn(async () => ({ error: { message: "database unavailable" } })),
        })),
      };
    });

    await expect(
      recordGroupActivity({
        groupId: "group@g.us",
        memberId: "user@s.whatsapp.net",
        memberName: "Neko",
        messageType: "conversation",
        messageCount: 1,
        isText: true,
      }),
    ).rejects.toThrow("Error guardando grupo");
    await expect(addMoney("user@s.whatsapp.net", 100)).rejects.toThrow("Error guardando saldo");

    expect(cache.get("group:group@g.us").totals.messages).toBe(10);
    expect(cache.get("user:user@s.whatsapp.net").profile.economy.money).toBe(500);
  });

  it("serializa actividad concurrente del mismo usuario sin perder incrementos", async () => {
    let storedMessages = 7;
    const writes = [];
    supabase.from.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn((_column, phone) => ({
          single: vi.fn(async () => ({
            data: {
              phone,
              username: "Neko",
              money: 0,
              activity_messages: storedMessages,
              activity_commands: 0,
              last_active_at: "2026-01-01T00:00:00.000Z",
            },
            error: null,
          })),
        })),
      })),
      update: vi.fn((payload) => ({
        eq: vi.fn(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          storedMessages = payload.activity_messages;
          writes.push(storedMessages);
          return { error: null };
        }),
      })),
    }));
    cachedProfile("user@s.whatsapp.net", { messages: storedMessages });
    const options = {
      creatorId: "user@s.whatsapp.net",
      creatorName: "Neko",
      displayName: "Neko",
      pushName: "Neko",
      senderJid: "user@s.whatsapp.net",
      messageType: "conversation",
      messageCount: 1,
      isText: true,
    };

    await Promise.all([recordUserActivity(options), recordUserActivity(options)]);

    expect(writes).toEqual([8, 9]);
    expect(storedMessages).toBe(9);
  });

  it("serializa actividad concurrente del mismo grupo sin perder incrementos", async () => {
    const groupWrites = [];
    let groupTotal = 10;
    let memberMessages = 10;
    supabase.from.mockImplementation((table) => {
      if (table === "groups") {
        return {
          upsert: vi.fn((payload) => ({
            select: vi.fn(() => ({
              single: vi.fn(async () => {
                await new Promise((resolve) => {
                  setTimeout(resolve, 10);
                });
                groupTotal = payload.total_messages;
                groupWrites.push(groupTotal);
                return { data: { id: 42 }, error: null };
              }),
            })),
          })),
        };
      }
      return {
        upsert: vi.fn(async (payload) => {
          memberMessages = payload.messages_count;
          return { error: null };
        }),
      };
    });
    cache.set(
      "group:group@g.us",
      {
        groupId: "group@g.us",
        groupName: "Grupo",
        totals: { messages: groupTotal },
        members: {
          "user@s.whatsapp.net": {
            memberId: "user@s.whatsapp.net",
            memberName: "Neko",
            messages: memberMessages,
          },
        },
      },
      TTLS.memoryContext,
    );
    const options = {
      groupId: "group@g.us",
      memberId: "user@s.whatsapp.net",
      memberName: "Neko",
      messageType: "conversation",
      messageCount: 1,
      isText: true,
    };

    await Promise.all([recordGroupActivity(options), recordGroupActivity(options)]);

    expect(groupWrites).toEqual([11, 12]);
    expect(memberMessages).toBe(12);
  });

  it.each([
    [
      "efÃ­mero con texto extendido",
      {
        ephemeralMessage: {
          message: {
            extendedTextMessage: {
              text: "/balance @5951",
              contextInfo: { mentionedJid: ["5951@s.whatsapp.net"] },
            },
          },
        },
      },
    ],
    [
      "view-once con caption",
      {
        viewOnceMessageV2: {
          message: {
            imageMessage: {
              caption: "/balance @5952",
              contextInfo: { mentionedJid: ["5952@s.whatsapp.net"] },
            },
          },
        },
      },
    ],
  ])("extrae menciones de contenido %s", (_label, message) => {
    const ctx = createContext(
      { sendMessage: vi.fn() },
      {
        key: { remoteJid: "group@g.us", participant: "5950@s.whatsapp.net" },
        pushName: "Neko",
        message,
      },
    );

    expect(ctx.mentionedJid).toHaveLength(1);
    expect(ctx.text).toContain("/balance");
  });

  it.each([
    [
      "grupo",
      {
        remoteJid: "group@g.us",
        participant: "123456@lid",
        participantPn: "595981234567@s.whatsapp.net",
      },
    ],
    [
      "chat privado",
      {
        remoteJid: "123456@lid",
        senderPn: "595981234567@s.whatsapp.net",
      },
    ],
  ])("usa el PN como identidad canónica en %s sin cambiar el JID de routing", (_label, key) => {
    const ctx = createContext(
      { sendMessage: vi.fn() },
      {
        key,
        pushName: "Neko",
        message: { conversation: "/balance" },
      },
    );

    expect(ctx.userId).toBe("595981234567@s.whatsapp.net");
    expect(ctx.senderPn).toBe("595981234567@s.whatsapp.net");
    expect(ctx.senderNumber).toBe("595981234567");
    expect(ctx.senderJid).toBe(key.participant || key.remoteJid);
  });

  it("cada chunk de /todos contiene solo los JIDs mencionados en su texto", async () => {
    const memberJids = Array.from(
      { length: 300 },
      (_, index) => `595000${String(index).padStart(4, "0")}@s.whatsapp.net`,
    );
    const replies = [];
    const ctx = {
      from: "group@g.us",
      sock: {
        user: { id: "bot@s.whatsapp.net" },
        groupMetadata: vi.fn(async () => ({ participants: memberJids.map((id) => ({ id })) })),
      },
      reply: vi.fn(async (payload) => replies.push(payload)),
    };

    await todos.execute(ctx);

    expect(replies.length).toBeGreaterThan(1);
    expect(replies.flatMap((reply) => reply.mentions)).toEqual(memberJids);
    for (const reply of replies) {
      expect(reply.mentions.length).toBeLessThan(memberJids.length);
      for (const jid of reply.mentions) {
        expect(reply.text).toContain(`@${jid.split("@")[0]}`);
      }
    }
  });
});
