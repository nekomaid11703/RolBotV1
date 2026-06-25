const { getActiveCharacter } = require("../../services/characterService");
const { startCombat, processAttack, getCombatState } = require("../../services/rpg/combatEngine");
const { getAllEnemies } = require("../../services/rpg/enemies");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "atacar",
  aliases: ["attack", "pelear"],
  description: "Inicia un combate contra un enemigo o ataca en combate activo. Usa: /atacar slime",
  category: "rpg",

  async execute(ctx) {
    const target = ctx.args.join(" ").trim().toLowerCase();

    try {
      const state = getCombatState(ctx.sender);

      if (state && state.turn === 'player' && !target) {
        const result = await processAttack(ctx.sender);
        if (result.error) return ctx.reply(result.error);

        if (result.ended && result.reward) {
          await ctx.react("🎉");
        } else if (result.ended) {
          await ctx.react("💀");
        } else {
          await ctx.react("⚔️");
        }

        return ctx.reply(result.message);
      }

      if (state && state.turn !== 'player') {
        return ctx.reply("❌ No es tu turno!");
      }

      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno o /switch_pj para activarlo."));
      }

      const available = getAllEnemies().map(e => `• *${e.name}* (nvl ${e.level}) — ${e.description}`).join('\n');

      if (!target) {
        return ctx.reply([
          "✦ ━━━━━━━━━━━━━━ ✦",
          "⚔️ *SELECCIONA UN ENEMIGO*",
          "✦ ━━━━━━━━━━━━━━ ✦",
          "",
          "Usa: `/atacar <enemigo>`",
          "",
          "Enemigos disponibles:",
          available,
          "",
          "✦ ━━━━━━━━━━━━━━ ✦",
        ].join('\n'));
      }

      const result = await startCombat(ctx.sender, character, target);
      if (result.error) return ctx.reply(formatError(result.error));

      await ctx.react("⚔️");
      return ctx.reply(result.message);

    } catch (error) {
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
