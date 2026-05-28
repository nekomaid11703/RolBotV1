const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const P = require("pino");
const qrcode = require("qrcode-terminal");
const path = require("path");

const { loadCommands } = require("./commandHandler");
const { registerEvents } = require("./eventHandler");

async function startBot() {
  try {
    console.log("🚀 Iniciando bot...\n");

    const { state, saveCreds } = await useMultiFileAuthState(
      path.join(__dirname, "../database/auth"),
    );

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: P({ level: "silent" }),
      printQRInTerminal: false,
      auth: state,
      browser: ["NekoBot", "Chrome", "1.0.0"],
    });

    loadCommands();
    registerEvents(sock);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.clear();
        console.log("\nEscanea el código QR:\n");
        qrcode.generate(qr, { small: true });
      }

      if (connection === "open") {
        console.log("=================================");
        console.log("✅ BOT CONECTADO CORRECTAMENTE");
        console.log("=================================");
      }

      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;

        console.log("\n⚠️ Conexión cerrada");

        if (reason === DisconnectReason.loggedOut) {
          console.log("❌ Sesión cerrada. Elimina auth y vuelve a escanear.");
          return;
        }

        console.log("🔄 Reconectando...\n");
        startBot();
      }
    });

    sock.ev.on("creds.update", saveCreds);
  } catch (error) {
    console.log("\n❌ Error iniciando bot:\n");
    console.error(error);
  }
}

startBot();
