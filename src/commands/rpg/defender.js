const { getCombatState, processDefend } = require("../../services/rpg/combatEngine");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "defender",
  aliases: ["defensa", "block", "protegerse"],
  description: "Te pones en guardia para reducir el daño del próximo ataque enemigo.",
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

      const result = await processDefend(ctx.sender);
      if (result.error) return ctx.reply(result.error);

      if (result.ended) {
        await ctx.react("💀");
      } else {
        await ctx.react("🛡️");
      }

      return ctx.reply(result.message);

    } catch (error) {
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
