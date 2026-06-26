const { getActiveCharacter } = require("../../services/characterService");
const stateManager = require("../../services/rpg/combatStateManager");
const turnManager = require("../../services/rpg/combatTurnManager");
const { getAllEnemies } = require("../../services/rpg/enemies");
const invService = require("../../services/rpg/inventoryService");
const { formatError } = require("../../utils/messageFormatUtils");
const { logSystem, logError } = require("../../services/loggerService");

module.exports = {
  name: "atacar",
  aliases: ["attack", "pelear", "a"],
  description: "Inicia un combate. Usa: /atacar <enemigo> o /atacar @usuario para PvP",
  category: "rpg",

  async execute(ctx) {
    const groupId = ctx.from;
    const raw = ctx.args.join(" ").trim();

    try {
      const room = stateManager.getRoomByGroup(groupId);
      if (room) {
        return ctx.reply("⚔️ Ya hay un combate activo aquí. Usa `/rol <acción>` para actuar.\n\nEj: `/rol ataco al " + (room.participants.find(p => p.team === 'enemies')?.name || 'enemigo') + " en la cabeza`");
      }

      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno o /switch_pj para activarlo."));
      }

      const mentions = ctx.mentions || [];
      if (mentions.length > 0) {
        const targetJid = mentions[0];
        const targetName = raw.replace(/@\S+/g, '').trim() || targetJid.split('@')[0];
        const inv = await invService.getInventory(ctx.sender);
        const newRoom = stateManager.createRoom(groupId, [
          stateManager.makeBaseParticipant(ctx.sender, character.name, 'players', character.stats || {}, inv.equipped || {}, await invService.calculateEquipmentBonuses(ctx.sender)),
          stateManager.makeBaseParticipant(targetJid, targetName, 'players'),
        ], { startedVia: 'pvp' });
        await stateManager.updateRoom(newRoom.id, {});
        await ctx.reply(`⚔️ Combate PvP iniciado contra @${targetName}!\n\n${turnManager.formatStatus(newRoom)}`);
        return;
      }

      if (!raw) {
        const available = getAllEnemies().map(e => `• *${e.name}* (nvl ${e.level}) — ${e.description}`).join('\n');
        return ctx.reply([
          "✦ ━━━━━━━━━━━━━━ ✦",
          "⚔️ *SELECCIONA UN ENEMIGO*",
          "✦ ━━━━━━━━━━━━━━ ✦",
          "",
          "Usa: `/atacar <enemigo>` o `/atacar @usuario` para PvP",
          "",
          "Enemigos disponibles:",
          available,
          "",
          "✦ ━━━━━━━━━━━━━━ ✦",
        ].join('\n'));
      }

      const targetEnemy = raw.toLowerCase().replace(/[0-9]+$/, '').trim();
      const quantityMatch = raw.match(/(\d+)\s*$/);
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
      const enemyData = getAllEnemies().find(e => e.id === targetEnemy);
      if (!enemyData) {
        return ctx.reply(formatError("Enemigo no encontrado.", "Usa /atacar para ver la lista."));
      }

      const inv = await invService.getInventory(ctx.sender);
      const newRoom = await stateManager.createCombatRoom(groupId, ctx.sender, character, [enemyData.id], Math.min(quantity, 8), inv.equipped || {}, await invService.calculateEquipmentBonuses(ctx.sender));
      await ctx.react("⚔️");
      return ctx.reply(turnManager.formatStatus(newRoom));

    } catch (error) {
      logError({ source: 'atacar', error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
