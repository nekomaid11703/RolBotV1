// @ts-nocheck
const { box } = require("../../../utils/boxUtils");
const { getActiveCharacter } = require("../../../services/characterService");
const { EXPEDITION_ZONES } = require("../../../config/expeditionConfig");
const {
  getDailyEnergy,
  startExpedition,
  claimActivity,
  cancelActivity,
} = require("../../../services/rpg/activityEngineService");
const { formatStelas } = require("../../../utils/economyUtils");

module.exports = {
  name: "expedicion",
  aliases: ["expediciones", "explorar", "exp"],
  description: "Envía a tu personaje a explorar zonas salvajes para recolectar recursos pasivamente.",
  category: "rpg",

  /**
   * Ejecuta el comando de expedición.
   * @param {*} ctx
   */
  async execute(ctx) {
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply(
        "❌ No tienes un personaje activo. Usa `/crear_pj` para crear uno o `/switch_pj <nombre>` para activarlo.",
      );
    }

    const subCommand = (ctx.args[0] || "").toLowerCase();

    // ── SUBCOMANDO: RECLAMAR ──
    if (subCommand === "reclamar" || subCommand === "claim") {
      const result = await claimActivity({ userId: ctx.sender, characterId: activeChar.id });
      if (!result.success) {
        return ctx.reply(`❌ ${result.error}`);
      }

      const lines = [];
      lines.push("🎉 **¡Expedición Completada con Éxito!**");
      lines.push(`📍 **Lugar:** ${result.zoneName}`);
      lines.push("");
      lines.push("📦 **Botín Extraído:**");
      const { getItem } = require("../../../data/items");
      result.loot.forEach((item) => {
        const itemDef = getItem(item.itemId);
        lines.push(`  └ ${item.quantity}x **${itemDef?.name || item.itemId}**`);
      });
      lines.push("");
      lines.push(`✨ **XP Ganada:** +${result.xp} XP`);
      lines.push(`💵 **Stelas Encontradas:** +${formatStelas(result.stelas)}`);
      lines.push(`🎒 *Los recursos se han guardado en tu mochila.*`);

      return ctx.reply(box("🗺️ BOTÍN DE EXPEDICIÓN", lines));
    }

    // ── SUBCOMANDO: CANCELAR ──
    if (subCommand === "cancelar" || subCommand === "abortar") {
      const result = await cancelActivity({ userId: ctx.sender, characterId: activeChar.id });
      if (!result.success) {
        return ctx.reply(`❌ ${result.error}`);
      }
      return ctx.reply(
        "⚠️ Has cancelado la expedición en curso. Tu personaje ahora está libre, pero no recibiste botín.",
      );
    }

    // ── SUBCOMANDO: ESTADO ──
    if (subCommand === "estado" || subCommand === "status") {
      const { data: charData } = await require("../../../database/supabase")
        .supabase.from("characters")
        .select("slots")
        .eq("id", activeChar.id)
        .maybeSingle();
      const activity = charData?.slots?.activity;

      if (!activity) {
        return ctx.reply("ℹ️ Tu personaje no está en ninguna expedición activa. Usa `/expedicion` para ver zonas.");
      }

      const now = Date.now();
      const totalMs = activity.finishesAt - activity.startedAt;
      const elapsedMs = Math.max(0, now - activity.startedAt);
      const remainingMs = Math.max(0, activity.finishesAt - now);
      const remainingMin = Math.ceil(remainingMs / 60000);
      const pct = Math.min(100, Math.round((elapsedMs / totalMs) * 100));

      const lines = [];
      lines.push(`📍 **Actividad:** ${activity.name}`);
      lines.push(
        `⏱️ **Progreso:** ${pct}% [${"█".repeat(Math.floor(pct / 10))}${"░".repeat(10 - Math.floor(pct / 10))}]`,
      );
      if (remainingMs === 0) {
        lines.push("✅ **¡Completada!** Usa `/expedicion reclamar` para recoger tu botín.");
      } else {
        lines.push(`⏳ **Tiempo restante:** ~${remainingMin} minuto(s).`);
        lines.push("💡 *Para abortar:* `/expedicion cancelar`");
      }

      return ctx.reply(box("⏳ ESTADO DE EXPEDICIÓN", lines));
    }

    // ── SUBCOMANDO: INICIAR <ZONA> [DURACION] ──
    if (subCommand === "iniciar" || subCommand === "start" || EXPEDITION_ZONES[subCommand]) {
      const zoneArg = subCommand === "iniciar" || subCommand === "start" ? ctx.args[1] : subCommand;
      const durationArg = (subCommand === "iniciar" || subCommand === "start" ? ctx.args[2] : ctx.args[1]) || "corta";

      if (!zoneArg) {
        return ctx.reply("❌ Especifica una zona. Ejemplo: `/expedicion iniciar bosque corta`.");
      }

      const result = await startExpedition({
        userId: ctx.sender,
        characterId: activeChar.id,
        zoneId: zoneArg,
        durationType: durationArg.toLowerCase(),
      });

      if (!result.success) {
        return ctx.reply(`❌ ${result.error}`);
      }

      const lines = [];
      lines.push("🌲 **¡Expedición Iniciada!**");
      lines.push("");
      lines.push(`📍 **Destino:** ${result.activity.zoneName}`);
      lines.push(`⏳ **Duración:** ${result.activity.durationMinutes} minutos (${result.activity.durationType})`);
      lines.push(`⚡ **Energía restante hoy:** ${result.remainingEnergy}/100`);
      lines.push("");
      lines.push("⚠️ *Tu personaje estará ocupado hasta que termine o canceles.*");
      lines.push("💡 Consulta el avance con `/expedicion estado`.");

      return ctx.reply(box("🗺️ EXPEDICIÓN EN MARCHA", lines));
    }

    // ── MENÚ PRINCIPAL: LISTA DE ZONAS Y ENERGÍA ──
    const energy = await getDailyEnergy(activeChar.id);

    const lines = [];
    lines.push(`⚡ **Energía:** ${energy.current}/${energy.max}`);
    lines.push("");

    for (const [id, zone] of Object.entries(EXPEDITION_ZONES)) {
      lines.push(`🏔️ **${zone.name}**`);
      lines.push(`  ID: \`${id}\` · Nv.${zone.minLevel}+`);
      lines.push(`  🛠️ ${zone.primaryTools.join(", ")}`);
      lines.push(`  ⏱️ Corta: ${zone.durationsMinutes.corta}m (⚡${zone.energyCosts.corta})`);
      lines.push(`  ⏱️ Media: ${zone.durationsMinutes.media}m (⚡${zone.energyCosts.media})`);
      lines.push(`  ⏱️ Larga: ${zone.durationsMinutes.larga}m (⚡${zone.energyCosts.larga})`);
      lines.push("");
    }

    lines.push("💡 **Uso:**");
    lines.push("`/expedicion iniciar <zona> [tiempo]`");
    lines.push("  Ej: `/expedicion iniciar bosque corta`");
    lines.push("`/expedicion estado`");
    lines.push("`/expedicion reclamar`");
    lines.push("`/expedicion cancelar`");

    return ctx.reply(box("🧭 EXPEDICIONES", lines));
  },
};
