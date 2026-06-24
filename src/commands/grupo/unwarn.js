const { supabase } = require("../../database/supabase");
const { getFirstMentionedJid } = require("../../utils/commandParseUtils");
const { resolveTargetDisplayName } = require("../../utils/userMentionUtils");
const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

async function getWarns(groupId, userId) {
  const { data } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", "warn")
    .eq("id", `${groupId}:${userId}`)
    .maybeSingle();
  return data?.data || { count: 0 };
}

async function saveWarns(groupId, userId, warns) {
  await supabase.from("bot_auth_state").upsert({
    session_id: "warn",
    id: `${groupId}:${userId}`,
    data: warns,
  }, { onConflict: "session_id,id" });
}

const usageMessage = formatCommandUsage({
  icon: "✅",
  title: "Quitar advertencia",
  description: "Reduce en 1 el contador de warns de un miembro.",
  usage: "/unwarn @usuario",
  example: "/unwarn @Nekomaid",
  notes: ["Solo administradores del grupo."],
});

module.exports = {
  name: "unwarn",
  aliases: ["quitar_warn", "delwarn", "remwarn"],
  description: "Quita un warn a un miembro.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.social(usageMessage);
    }

    const targetName = await resolveTargetDisplayName(ctx, targetId);
    const warns = await getWarns(ctx.from, targetId);

    if (warns.count <= 0) {
      return ctx.social(`ℹ️ ${targetName} no tiene warns activos.`);
    }

    warns.count = Math.max(0, (warns.count || 0) - 1);

    if (warns.count === 0) {
      await supabase.from("bot_auth_state").delete().eq("session_id", "warn").eq("id", `${ctx.from}:${targetId}`);
    } else {
      await saveWarns(ctx.from, targetId, warns);
    }

    await ctx.social(
      [
        "━━━━━━━━━━━━━━━━━━━━",
        "✅ Warn removido",
        "",
        `👤 ${targetName}`,
        `⚠️ Warns restantes: ${warns.count}`,
        "━━━━━━━━━━━━━━━━━━━━",
      ].join("\n"),
      { mentions: [targetId] },
    );
  },
};
