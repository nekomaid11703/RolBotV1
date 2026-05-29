module.exports = {
  name: "dado",

  aliases: ["dice"],

  description: "Lanza dados RPG. Ej: /dado 2d20",

  category: "utilidades",


  async execute(ctx) {
    // =========================
    // VALIDAR INPUT
    // =========================

    if (ctx.args.length === 0) {
      await ctx.reply(
        "🎲 Uso: /dado XdY\n\n" +
          "Ejemplos:\n" +
          "/dado d20\n" +
          "/dado 2d10\n" +
          "/dado 3d4",
      );

      return;
    }

    const input = ctx.args[0].toLowerCase();

    const match = input.match(/^(\d*)d(\d+)$/);

    // =========================
    // FORMATO INVÁLIDO
    // =========================

    if (!match) {
      await ctx.reply(
        "❌ Formato inválido.\n\n" + "Usa: /dado XdY\n" + "Ejemplo: /dado 2d20",
      );

      return;
    }

    // =========================
    // EXTRAER DATOS
    // =========================

    let cantidad = match[1] ? parseInt(match[1]) : 1;

    const caras = parseInt(match[2]);

    // =========================
    // DADOS PERMITIDOS
    // =========================

    const dadosPermitidos = [4, 6, 8, 10, 12, 20, 100];

    if (!dadosPermitidos.includes(caras)) {
      await ctx.reply(
        "❌ Dados permitidos:\n" + "d4, d6, d8, d10, d12, d20 y d100",
      );

      return;
    }

    // =========================
    // LIMITE DE DADOS
    // =========================

    if (cantidad < 1 || cantidad > 20) {
      await ctx.reply("❌ Puedes lanzar entre 1 y 20 dados.");

      return;
    }

    // =========================
    // TIRADAS
    // =========================

    const resultados = [];

    let total = 0;

    let criticosAltos = 0;

    let criticosBajos = 0;

    for (let i = 0; i < cantidad; i++) {
      const roll = Math.floor(Math.random() * caras) + 1;

      total += roll;

      // =========================
      // CRÍTICO POSITIVO
      // =========================

      if (roll === caras) {
        criticosAltos++;

        resultados.push(`🎉${roll}`);
      }

      // =========================
      // CRÍTICO NEGATIVO
      // =========================
      else if (roll === 1) {
        criticosBajos++;

        resultados.push(`💀${roll}`);
      }

      // =========================
      // NORMAL
      // =========================
      else {
        resultados.push(`${roll}`);
      }
    }

    // =========================
    // RESPUESTA
    // =========================

    let respuesta =
      "🎲 *Tirada de dados*\n\n" +
      `${cantidad}d${caras}\n` +
      `→ [ ${resultados.join(", ")} ]\n\n` +
      `⭐ *Total:* ${total}`;

    // =========================
    // CRÍTICOS
    // =========================

    if (criticosAltos > 0 || criticosBajos > 0) {
      respuesta += "\n\n⚡ *Críticos detectados:*";

      if (criticosAltos > 0) {
        respuesta += `\n🎉 Positivos: ${criticosAltos}`;
      }

      if (criticosBajos > 0) {
        respuesta += `\n💀 Negativos: ${criticosBajos}`;
      }
    }

    // =========================
    // CRÍTICO PERFECTO
    // =========================

    if (criticosAltos === cantidad) {
      respuesta += "\n\n🔥 *¡CRÍTICO PERFECTO!* 🔥";
    }

    // =========================
    // DESASTRE TOTAL
    // =========================

    if (criticosBajos === cantidad) {
      respuesta += "\n\n☠️ *DESASTRE TOTAL* ☠️";
    }

    // =========================
    // REACT
    // =========================

    await ctx.react("🎲");

    // =========================
    // SEND
    // =========================

    await ctx.reply(respuesta);
  },
};
