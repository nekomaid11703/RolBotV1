" dado.js - Comando para lanzar dados (d4, d10, d20) con detección de críticos altos y bajos. Ej: /dado 2d20";
module.exports = {
    name: "dado",
    description: "Lanza dados (d4, d10, d20). Ej: /dado 2d20",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (args.length === 0) {
            await sock.sendMessage(from, {
                text: "🎲 Uso: /dado XdY\nEjemplos:\n/dado d20\n/dado 2d10\n/dado 3d4"
            });
            return;
        }

        const input = args[0].toLowerCase();
        const match = input.match(/^(\d*)d(\d+)$/);

        if (!match) {
            await sock.sendMessage(from, {
                text: "❌ Formato inválido.\nUsa: /dado XdY (ej: 2d20)"
            });
            return;
        }

        let cantidad = match[1] ? parseInt(match[1]) : 1;
        const caras = parseInt(match[2]);
        const dadosPermitidos = [4, 10, 20];

        if (!dadosPermitidos.includes(caras)) {
            await sock.sendMessage(from, {
                text: "❌ Solo se permiten dados d4, d10 y d20."
            });
            return;
        }

        if (cantidad < 1 || cantidad > 10) {
            await sock.sendMessage(from, {
                text: "❌ Puedes lanzar entre 1 y 10 dados."
            });
            return;
        }

        const resultados = [];
        let total = 0;
        let criticosAltos = 0;
        let criticosBajos = 0;

        for (let i = 0; i < cantidad; i++) {
            const roll = Math.floor(Math.random() * caras) + 1;
            total += roll;

            if (roll === caras) {
                criticosAltos++;
                resultados.push(`🎉${roll}`);
            } else if (roll === 1) {
                criticosBajos++;
                resultados.push(`💀${roll}`);
            } else {
                resultados.push(`${roll}`);
            }
        }

        let respuesta =
            "🎲 *Tirada de dados*\n\n" +
            `${cantidad}d${caras} → [${resultados.join(", ")}]\n` +
            `*Total:* ${total}`;

        if (criticosAltos > 0 || criticosBajos > 0) {
            respuesta += "\n\n⚡ *Críticos detectados:*";
            if (criticosAltos > 0) respuesta += `\n🎉 Críticos positivos: ${criticosAltos}`;
            if (criticosBajos > 0) respuesta += `\n💀 Críticos negativos: ${criticosBajos}`;
        }

        if (criticosAltos === cantidad) {
            respuesta += "\n\n🔥 *¡CRÍTICO PERFECTO!* 🔥";
        }

        if (criticosBajos === cantidad) {
            respuesta += "\n\n☠️ *DESASTRE TOTAL* ☠️";
        }

        await sock.sendMessage(from, { text: respuesta });
    }
};

