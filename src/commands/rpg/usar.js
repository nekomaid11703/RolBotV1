const { getActiveCharacter, updateCharacterStats } = require("../../services/characterService");
const invService = require("../../services/rpg/inventoryService");
const itemsData = require("../../services/rpg/items");
const turnManager = require("../../services/rpg/combatTurnManager");
const stateManager = require("../../services/rpg/combatStateManager");
const { formatError } = require("../../utils/messageFormatUtils");

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
        const list = consumibles.map(i => `• *${i.name}* — ${i.desc}`).join('\n');
        return ctx.reply(`¿Qué item quieres usar?\n\n${list}`);
      }

      const item = itemsData.findItemByName(raw);
      if (!item) return ctx.reply(`No se encontró el item "${raw}".`);
      if (item.type !== 'consumible') return ctx.reply(`"${item.name}" no es un item consumible.`);

      const inv = await invService.getInventory(ctx.sender);
      const stack = inv.items.find(i => i.itemId === item.id);
      if (!stack || stack.quantity < 1) return ctx.reply(`No tienes "${item.name}".`);

      const room = stateManager.getRoomByGroup(ctx.from);
      const inCombat = room && turnManager.getParticipantByJid(room, ctx.sender);

      if (item.efecto === 'cura' && item.potencia) {
        if (inCombat) {
          const p = turnManager.getParticipantByJid(room, ctx.sender);
          const vidaAntes = p.hp;
          p.hp = Math.min(p.maxHp, p.hp + item.potencia);
          await invService.removeItem(ctx.sender, item.id, 1);
          await stateManager.updateRoom(room.id, {});
          return ctx.reply(`💚 Usaste *${item.name}*. Vida: ${vidaAntes} → ${p.hp} (+${p.hp - vidaAntes}).`);
        } else {
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
          return ctx.reply(`💚 Usaste *${item.name}*. Vida: ${currentHp} → ${newHp}.`);
        }
      }

      if (item.efecto === 'estabiliza') {
        if (inCombat) {
          const p = turnManager.getParticipantByJid(room, ctx.sender);
          let estabilizado = false;
          for (const [zone, hp] of Object.entries(p.bodyParts)) {
            if (hp <= 0) {
              p.bodyParts[zone] = 1;
              estabilizado = true;
            }
          }
          await invService.removeItem(ctx.sender, item.id, 1);
          await stateManager.updateRoom(room.id, {});
          if (estabilizado) {
            return ctx.reply(`🩹 Usaste *${item.name}*. Zonas amputadas estabilizadas (1 HP).`);
          }
          return ctx.reply(`🩹 Usaste *${item.name}*, pero no tenías zonas amputadas.`);
        } else {
          return ctx.reply(`🩹 ${item.name} solo es útil durante un combate, para estabilizar zonas heridas.`);
        }
      }

      return ctx.reply(`No sé cómo usar "${item.name}".`);

    } catch (error) {
      console.error('usar error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
