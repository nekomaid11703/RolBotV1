// @ts-nocheck
const { box } = require("../../../utils/boxUtils");
const { getActiveCharacter } = require("../../../services/characterService");
const { JOBS } = require("../../../config/jobConfig");
const {
  getDailyEnergy,
  startJob,
  claimActivity,
  cancelActivity,
} = require("../../../services/rpg/activityEngineService");
const { formatStelas } = require("../../../utils/economyUtils");

module.exports = {
  name: "trabajar",
  aliases: ["trabajo", "trabajos", "empleo", "job"],
  description: "Realiza trabajos urbanos para ganar stelas, experiencia y entrenar estadísticas pasivas.",
  category: "rpg",

  /**
   * Ejecuta el comando de trabajos.
   * @param {*} ctx
   */
  async execute(ctx) {
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo.");
    }

    const rawSubCommand = (ctx.args[0] || "").toLowerCase();
    const jobIds = Object.keys(JOBS);
    const subCommand = /^\d+$/.test(rawSubCommand) ? jobIds[Number(rawSubCommand) - 1] || rawSubCommand : rawSubCommand;

    // ── SUBCOMANDO: RECLAMAR ──
    if (subCommand === "reclamar" || subCommand === "claim" || subCommand === "cobrar") {
      const result = await claimActivity({ userId: ctx.sender, characterId: activeChar.id });
      if (!result.success) {
        return ctx.reply(`❌ ${result.error}`);
      }

      const lines = [];
      lines.push("💼 **¡Jornada Laboral Completada!**");
      lines.push(`🏢 **Empleo:** ${result.jobName}`);
      lines.push("");
      lines.push(`💵 **Salario cobrado:** +${formatStelas(result.stelas)}`);
      lines.push(`✨ **XP Obtenida:** +${result.xp} XP`);

      const training = result.training || {};
      if (training.atCap) {
        lines.push(`🏆 *${String(result.statTrained).toUpperCase()} ya está al máximo (100).*`);
      } else if (result.statIncreased) {
        lines.push(
          `📈 **¡Entrenamiento Exitoso!** **${String(result.statTrained).toUpperCase()}** subió a ${training.threshold} puntos de entrenamiento y ganó +1.`,
        );
        lines.push(
          `💪 Siguiente avance: ${training.pointsRemaining}/${training.threshold} puntos (${training.weekGains}/${training.weeklyCap} esta semana).`,
        );
      } else {
        lines.push(
          `💪 *Entrenando ${String(result.statTrained).toUpperCase()}:* ${training.pointsGained}+ puntos → ${training.pointsRemaining}/${training.threshold}.`,
        );
      }

      return ctx.reply(box("💰 SUELDO COBRADO", lines));
    }

    // ── SUBCOMANDO: CANCELAR ──
    if (subCommand === "cancelar" || subCommand === "abortar") {
      const result = await cancelActivity({ userId: ctx.sender, characterId: activeChar.id });
      if (!result.success) {
        return ctx.reply(`❌ ${result.error}`);
      }
      return ctx.reply("⚠️ Has abandonado tu jornada laboral antes de tiempo. No recibiste salario ni experiencia.");
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
        return ctx.reply("ℹ️ Tu personaje no está en ninguna jornada de trabajo. Usa `/trabajos` para ver ofertas.");
      }

      const now = Date.now();
      const totalMs = activity.finishesAt - activity.startedAt;
      const elapsedMs = Math.max(0, now - activity.startedAt);
      const remainingMs = Math.max(0, activity.finishesAt - now);
      const remainingMin = Math.ceil(remainingMs / 60000);
      const pct = Math.min(100, Math.round((elapsedMs / totalMs) * 100));

      const lines = [];
      lines.push(`🏢 **Ocupación:** ${activity.name}`);
      lines.push(
        `⏱️ **Progreso del turno:** ${pct}% [${"█".repeat(Math.floor(pct / 10))}${"░".repeat(10 - Math.floor(pct / 10))}]`,
      );

      if (activity.type === "job" && activity.jobId) {
        const { JOBS: jobCatalog, trainingPointsForJob } = require("../../../config/jobConfig");
        const { JOB_TRAINING } = require("../../../config/progressionBalance");
        const job = jobCatalog[activity.jobId];
        const statTrained = job?.statTrained;
        if (statTrained) {
          const training = (charData?.slots?.training || {})[statTrained];
          lines.push(`📈 **Entrenará ${statTrained.toUpperCase()}:** +${trainingPointsForJob(job)} pts por jornada.`);
          if (training?.points) {
            lines.push(`   Progreso actual: ${training.points}/${JOB_TRAINING.pointsPerStatPoint} pts.`);
          }
        }
      }

      if (remainingMs === 0) {
        lines.push("✅ **¡Turno finalizado!** Usa `/trabajar cobrar` para recibir tu paga.");
      } else {
        lines.push(`⏳ **Tiempo restante de turno:** ~${remainingMin} minuto(s).`);
        lines.push("💡 *Para abandonar:* `/trabajar cancelar`");
      }

      return ctx.reply(box("⏳ JORNADA EN CURSO", lines));
    }

    // ── SUBCOMANDO: INICIAR TRABAJO DIRECTO (o por ID) ──
    if (subCommand && subCommand !== "lista" && JOBS[subCommand]) {
      const result = await startJob({
        userId: ctx.sender,
        characterId: activeChar.id,
        jobId: subCommand,
      });

      if (!result.success) {
        return ctx.reply(`❌ ${result.error}`);
      }

      const lines = [];
      lines.push("💼 **¡Has comenzado tu jornada laboral!**");
      lines.push(`🏢 **Empleo:** ${result.activity.jobName}`);
      lines.push(`⏳ **Duración:** ${result.activity.durationMinutes} minutos`);
      lines.push(`⚡ **Energía restante hoy:** ${result.remainingEnergy}/100`);
      lines.push("");
      lines.push("⚠️ *Tu personaje estará ocupado hasta que termine el turno.*");
      lines.push("💡 Consulta tu progreso con `/trabajar estado`.");

      return ctx.reply(box("🔨 EN EL TRABAJO", lines));
    }

    // ── MENÚ PRINCIPAL: LISTA DE LOS 20 TRABAJOS URBANOS ──
    const energy = await getDailyEnergy(activeChar.id);
    const lines = [];
    lines.push(`⚡ **Energía:** ${energy.current}/${energy.max}`);
    lines.push("");

    let i = 1;
    for (const [id, job] of Object.entries(JOBS)) {
      const reqText =
        Object.keys(job.requirements).length > 0
          ? Object.entries(job.requirements)
              .map(([k, v]) => `${k.toUpperCase()}≥${v}`)
              .join(", ")
          : "Ninguno";

      lines.push(`\`[${i}]\` ${job.icon} **${job.name}**`);
      lines.push(`  ID: \`${id}\``);
      lines.push(`  💰 ✧ ${job.stelasReward} · XP: +${job.xpReward}`);
      lines.push(`  ⏱️ ${job.durationMinutes}m · ⚡ ${job.energyCost}`);
      lines.push(`  📈 +1 ${job.statTrained.toUpperCase()}`);
      lines.push(`  📋 Req: ${reqText}`);
      lines.push("");
      i++;
    }

    lines.push("💡 **Comandos:**");
    lines.push("`/trabajar <número o id_empleo>`");
    lines.push("  Ej: `/trabajar 1` o `/trabajar ayudante_panaderia`");
    lines.push("`/trabajar estado`");
    lines.push("`/trabajar cobrar`");
    lines.push("`/trabajar cancelar`");

    return ctx.reply(box("📋 TABLÓN DE TRABAJOS", lines));
  },
};
