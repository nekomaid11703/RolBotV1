// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const invService = require("../../../services/rpg/inventoryService");
const { formatError, box } = require("../../../utils/messageFormatUtils");
const { logError } = require("../../../services/loggerService");

const SLOTS = [
  "arma",
  "cabeza",
  "cuello",
  "pecho",
  "espalda",
  "brazo_izq",
  "brazo_der",
  "mano_izq",
  "mano_der",
  "pierna_izq",
  "pierna_der",
  "pie_izq",
  "pie_der",
  "accesorio_1",
  "accesorio_2",
];

module.exports = {
  name: "desequipar",
  aliases: ["unequip", "quitar", "remove", "desvestir"],
  description: "Desequipa un slot equipado. Usa: /desequipar arma, /desequipar pecho",
  category: "rpg",

  async execute(ctx) {
    try {
      const room = require("../../../services/rpg/combatStateManager").getRoomByGroup(ctx.from);
      if (
        room &&
        room.status === "active" &&
        require("../../../services/rpg/combatTurnManager").getParticipantByJid(room, ctx.sender)
      ) {
        return ctx.reply(
          "⚔️ Estás en combate. Usa `/rol <texto>` para cambiar equipo mediante rol.\n\nEj: `/rol me quito el yelmo para respirar mejor`",
        );
      }

      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno."));
      }

      const raw = ctx.args.join(" ").trim().toLowerCase();
      if (!raw) {
        const slots = SLOTS.map((s) => `• ${s.replace(/_/g, " ")}`).join("\n");
        return ctx.reply(box("❓ Qué slot desequipar?", ["", ...slots.split("\n")]));
      }

      let slot = raw.replace(/\s+/g, "_");
      if (slot === "brazo") slot = "brazo_der";
      if (slot === "pierna") slot = "pierna_der";
      if (slot === "mano") slot = "mano_der";
      if (slot === "pie") slot = "pie_der";

      if (!SLOTS.includes(slot)) {
        return ctx.reply(
          `Slot "${raw}" no válido. Usa: arma, cabeza, pecho, brazo_izq, brazo_der, pierna_izq, pierna_der, etc.`,
        );
      }

      const result = await invService.unequipItem(ctx.sender, slot);
      if (result.error) return ctx.reply(result.error);

      await invService.recalcStatsAfterEquip(ctx.sender);

      await ctx.react("🔄");

      return ctx.reply(
        box("🔄 Item desequipado", [
          "",
          `${result.item.name}`,
          `Slot: ${slot.replace(/_/g, " ")}`,
          "",
          "Volvió a tu inventario.",
        ]),
      );
    } catch (error) {
      logError({ source: "desequipar", error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
