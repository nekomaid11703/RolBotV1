const { supabase } = require("../../database/supabase");
const { getFirstMentionedJid } = require("../../utils/commandParseUtils");
const { resolveTargetDisplayName } = require("../../utils/userMentionUtils");
const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

const MAX_WARNS = 3;
const WARN_SESSION = "warn";

async function getWarns(groupId, userId) {
  const { data } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", WARN_SESSION)
    .eq("id", `${groupId}:${userId}`)
    .maybeSingle();
  return data?.data || { count: 0 };
}

async function saveWarns(groupId, userId, warns) {
  await supabase.from("bot_auth_state").upsert({
    session_id: WARN_SESSION,
    id: `${groupId}:${userId}`,
    data: warns,
  }, { onConflict: "session_id,id" });
}

const usageMessage = formatCommandUsage({
  icon: "⚠️",
  title: "Advertir miembro",
  description: `Advierte a un miembro. ${MAX_WARNS} warns = expulsión automática.`,
  usage: "/warn @usuario",
  example: "/warn @Nekomaid",
  notes: ["Solo administradores del grupo.", "Usa /unwarn @usuario para quitar un warn."],
});

module.exports = {
  name: "warn",
  aliases: ["advertir", "warning"],
  description: `Advierte a un miembro (${MAX_WARNS} warns = kick).`,
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply(usageMessage);
    }

    const targetName = await resolveTargetDisplayName(ctx, targetId);
    const warns = await getWarns(ctx.from, targetId);
    warns.count = (warns.count || 0) + 1;
    warns.lastWarnAt = new Date().toISOString();

    if (warns.count >= MAX_WARNS) {
      try {
        await ctx.sock.groupParticipantsUpdate(ctx.from, [targetId], "remove");
        await supabase.from("bot_auth_state").delete().eq("session_id", WARN_SESSION).eq("id", `${ctx.from}:${targetId}`);
        return ctx.reply(
          [
            "━━━━━━━━━━━━━━━━━━━━",
            "⚠️ Usuario expulsado",
            "",
            `👤 ${targetName}`,
            `⚠️ Motivo: ${MAX_WARNS} warns acumulados`,
            "━━━━━━━━━━━━━━━━━━━━",
          ].join("\n"),
          { mentions: [targetId] },
        );
      } catch {
        return ctx.reply(formatError(`No se pudo expulsar a ${targetName}. Asegúrate de que el bot sea admin.`));
      }
    }

    await saveWarns(ctx.from, targetId, warns);

    await ctx.reply(
      [
        "━━━━━━━━━━━━━━━━━━━━",
        "⚠️ Advertencia",
        "",
        `👤 ${targetName}`,
        `⚠️ Warn ${warns.count}/${MAX_WARNS}`,
        "",
        `Próximo warn: expulsión automática.`,
        "━━━━━━━━━━━━━━━━━━━━",
      ].join("\n"),
      { mentions: [targetId] },
    );
  },
};
