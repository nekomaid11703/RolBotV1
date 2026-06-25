const { getCombatState, processFlee } = require("../../services/rpg/combatEngine");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "huir",
  aliases: ["flee", "escape", "escapar"],
  description: "Intentas huir del combate actual.",
  category: "rpg",

  async execute(ctx) {
    try {
      const state = getCombatState(ctx.sender);
      if (!state) {
        return ctx.reply(formatError("No estás en combate.", "Usa /atacar <enemigo> para iniciar uno."));
      }

      if (state.turn !== 'player') {
        return ctx.reply("❌ No es tu turno!");
      }

      const result = await processFlee(ctx.sender);
      if (result.error) return ctx.reply(result.error);

      if (result.fled) {
        await ctx.react("🏃");
      } else if (result.ended) {
        await ctx.react("💀");
      } else {
        await ctx.react("❌");
      }

      return ctx.reply(result.message);

    } catch (error) {
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
