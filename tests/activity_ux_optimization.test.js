const { supabase } = require("../src/database/supabase");
const { cache, TTLS } = require("../src/utils/cacheService");
const createContext = require("../src/core/context");
const { recordGroupActivity } = require("../src/services/groupActivityService");
const { recordUserActivity } = require("../src/services/userService");
const { addMoney } = require("../src/services/economyService");
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
