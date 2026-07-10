const { getActiveCharacter, updateCharacterStats } = require("../../../services/characterService");
const invService = require("../../../services/rpg/inventoryService");
const itemsData = require("../../../services/rpg/items");
const turnManager = require("../../../services/rpg/combatTurnManager");
const stateManager = require("../../../services/rpg/combatStateManager");
const { formatError, box } = require("../../../utils/messageFormatUtils");
const { logSystem, logError } = require("../../../services/loggerService");

module.exports = {
  name: "usar",
  aliases: ["use", "consumir", "drink", "eat"],
  description: "Usa un item consumible de tu inventario. Usa: /usar pocion de vida",
  category: "rpg",

  async execute(ctx) {
    try {
      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno."));
      }

      const raw = ctx.args.join(" ").trim().toLowerCase();
      if (!raw) {
        const consumibles = itemsData.ITEMS.filter(i => i.type === 'consumible');
        const list = consumibles.map(i => `• ${i.name} — ${i.desc}`).join('\n');
        return ctx.reply(box("❓ Qué item usar?", [
          "",
          ...list.split('\n'),
        ]));
      }

      const item = itemsData.findItemByName(raw);
      if (!item) return ctx.reply(`No se encontró el item "${raw}".`);
      if (item.type !== 'consumible') return ctx.reply(`"${item.name}" no es un item consumible.`);

      const inv = await invService.getInventory(ctx.sender);
      const stack = inv.items.find(i => i.itemId === item.id);
      if (!stack || stack.quantity < 1) return ctx.reply(`No tienes "${item.name}".`);

      const room = stateManager.getRoomByGroup(ctx.from);
      const inCombat = room && room.status === 'active' && turnManager.getParticipantByJid(room, ctx.sender);

      if (inCombat) {
        return ctx.reply("⚔️ Estás en combate. Usa `/rol <texto>` para usar items mediante rol.\n\nEj: `/rol saco una poción de vida y la bebo`");
      }

      if (item.efecto === 'cura' && item.potencia) {
        const currentHp = character.stats?.vida || 100;
        const newHp = Math.min(currentHp + item.potencia, character.maxVida || 200);
        await invService.removeItem(ctx.sender, item.id, 1);
        const patch = {};
        if (character.stats) {
          patch.stats = { ...character.stats, vida: newHp };
        } else {
          patch.vida = newHp;
        }
        await updateCharacterStats({
          creatorId: ctx.sender,
          characterName: character.slug || character.name,
          patch,
        });
        await ctx.react("💚");
        return ctx.reply(box("💚 Item usado", [
          "",
          `${item.name}`,
          "",
          `Vida: ${currentHp} → ${newHp}`,
        ]));
      }

      if (item.efecto === 'estabiliza') {
        return ctx.reply(`🩹 ${item.name} solo es útil durante un combate, para estabilizar zonas heridas.`);
      }

      return ctx.reply(`No sé cómo usar "${item.name}".`);

    } catch (error) {
      logError({ source: 'usar', error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};