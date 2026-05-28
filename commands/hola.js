module.exports = {
    name: "hola",
    description: "Saluda al usuario",
    async execute(sock, msg) {
        const from = msg.key.remoteJid;
            await sock.sendMessage(from, { text:
                "*}NekoBotV1.0{*\n" +
                "¡Mucho gusto gente linda! \n" + 
                "Me presentó, soy *NekoBotV1*, asistente vitual a tu disposicion \n\n" +
                "Para ver mis comandos, escribe **/help***\n" +
                "¡Espero ser de ayuda! 🤖"
            });
    }
};
