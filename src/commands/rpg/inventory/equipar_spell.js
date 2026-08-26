// @ts-nocheck
const characterService = require("../../../services/characterService");
const { equipActiveSpell } = require("../../../services/rpg/spellContainerService");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");

const usageMessage = formatCommandUsage({
  icon: "✨",
  title: "Equipar Hechizo",
  description: "Equipa una habilidad/hechizo en una de las 4 ranuras activas de combate.",
  usage: "/equipar_spell <spell_id> [slot]",
  example: "/equipar_spell bola_de_fuego spell_1",
  notes: [
    "Ranuras disponibles: spell_1, spell_2, spell_3, spell_4 (o 1, 2, 3, 4).",
    "Si no indicas ranura, se asigna automáticamente al primer espacio libre (máximo 4 activas).",
  ],
});

module.exports = {
  name: "equipar_spell",
  aliases: ["equipar_hechizo", "equipar_habilidad", "equip_spell"],
  description: "Equipa una habilidad/hechizo en una de las 4 ranuras activas de combate.",
  category: "rpg",

  async execute(ctx) {
    const activeChar = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const [spellId, slotInput] = ctx.args;
    if (!spellId) {
      return ctx.reply(usageMessage);
    }

    try {
      const res = await equipActiveSpell({
        characterId: activeChar.id,
        creatorId: ctx.sender,
        spellId,
        slot: slotInput,
      });

      const lines = [`✅ *${activeChar.name}* equipó *${spellId}* en [${res.slot}]`];
      if (res.autoUnequipped?.length > 0) {
        lines.push(`🔄 Auto-reemplazó: ${res.autoUnequipped.join(", ")}`);
      }

      return ctx.reply(box("✨ HECHIZO EQUIPADO", lines));
    } catch (err) {
      return ctx.reply(formatError(err));
    }
  },
};
