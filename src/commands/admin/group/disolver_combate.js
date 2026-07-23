// @ts-nocheck
const { findSessionByUser, removeSession } = require("../../../services/rpg/combatState");
const { formatCombatDisolved } = require("../../../services/rpg/combatMessages");

module.exports = {
  name: "disolver_combate",
  aliases: ["dc", "endfight"],
  description: "Disuelve un combate activo. Desbloquea los personajes forzosamente.",
  category: "admin",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const mentioned = Array.isArray(ctx.mentionedJid) ? ctx.mentionedJid.filter(Boolean) : [];

    if (mentioned.length === 0) {
      const session = findSessionByUser(ctx.sender);
      if (session) {
        removeSession(session.id);
        return ctx.reply(formatCombatDisolved(ctx.userName));
      }
      return ctx.reply(
        "❌ Debes mencionar a un usuario en combate o estar en combate tú mismo.\n\nUso: /disolver_combate @usuario",
      );
    }

    const targetId = mentioned[0];
    const session = findSessionByUser(targetId);

    if (!session) {
      return ctx.reply("❌ Ese usuario no está en un combate activo.");
    }

    removeSession(session.id);
    return ctx.reply(formatCombatDisolved(ctx.userName));
  },
};
