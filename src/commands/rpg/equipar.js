const { getActiveCharacter } = require("../../services/characterService");
const invService = require("../../services/rpg/inventoryService");
const itemsData = require("../../services/rpg/items");
const { formatError } = require("../../utils/messageFormatUtils");
const { logSystem, logError } = require("../../services/loggerService");

module.exports = {
  name: "equipar",
  aliases: ["equip", "wield", "vestir", "ponerse"],
  description: "Equipa un item de tu inventario. Usa: /equipar espada corta",
  category: "rpg",

  async execute(ctx) {
    try {
      const room = require("../../services/rpg/combatStateManager").getRoomByGroup(ctx.from);
      if (room && room.status === 'active' && require("../../services/rpg/combatTurnManager").getParticipantByJid(room, ctx.sender)) {
        return ctx.reply("⚔️ Estás en combate. Usa `/rol <texto>` para cambiar equipo mediante rol.\n\nEj: `/rol guardo mi arma y saco un cuchillo`");
      }

      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno."));
      }

      const raw = ctx.args.join(" ").trim().toLowerCase();
      if (!raw) {
        return ctx.reply("¿Qué item quieres equipar? Usa: `/equipar <item>`");
      }

      const item = itemsData.findItemByName(raw);
      if (!item) {
        return ctx.reply(`No se encontró el item "${raw}".`);
      }

      const inv = await invService.getInventory(ctx.sender);
      const stack = inv.items.find(i => i.itemId === item.id);
      if (!stack || stack.quantity < 1) {
        return ctx.reply(`No tienes "${item.name}" en tu inventario.`);
      }

      if (!itemsData.isEquippable(item)) {
        return ctx.reply(`"${item.name}" no es equipable. Solo armas y armaduras.`);
      }

      const result = await invService.equipItem(ctx.sender, item.id);
      if (result.error) return ctx.reply(result.error);

      await invService.recalcStatsAfterEquip(ctx.sender);

      const slotLabel = result.slot.replace(/_/g, ' ');
      const bonusText = item.stats
        ? Object.entries(item.stats).map(([s, v]) => `${s}+${v}`).join(', ')
        : 'sin bonus';

      return ctx.reply(`⚔️ Equipaste *${item.name}* (${slotLabel}). Stats: ${bonusText}.`);

    } catch (error) {
      logError({ source: 'equipar', error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
