require('dotenv').config();
const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const { useSupabaseAuthState } = require("./supabaseAuthState");

const P = require("pino");
const qrcode = require("qrcode-terminal");
const path = require("path");

const { loadCommands } = require("./commandHandler");
const { registerEvents } = require("./eventHandler");
const {
  logSystem,
  logError,
} = require("../services/loggerService");

async function startBot() {
  try {
    console.log("🚀 Iniciando bot...\n");

    const { invalidateAllCache } = require("../utils/safeQuery");
    invalidateAllCache();
    console.log("📦 Cache local limpiado. Los datos se leerán desde Supabase.\n");

    await logSystem("Iniciando bot");

    const { state, saveCreds } = await useSupabaseAuthState('bot-session-1');

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

    await logSystem("Bot inicializado y eventos registrados", {
      version,
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.clear();
        console.log("\nEscanea el código QR:\n");
        qrcode.generate(qr, { small: true });

        await logSystem("Código QR generado");
      }

      if (connection === "open") {
        console.log("=================================");
        console.log("✅ BOT CONECTADO CORRECTAMENTE");
        console.log("=================================");

        await logSystem("Bot conectado correctamente");
      }

      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;

        console.log("\n⚠️ Conexión cerrada");
        await logSystem("Conexión cerrada", {
          reason: reason || null,
        });

        if (reason === DisconnectReason.loggedOut) {
          console.log("❌ Sesión cerrada. Elimina auth y vuelve a escanear.");

          await logSystem("Sesión cerrada por logout");
          return;
        }

        console.log("🔄 Reconectando...\n");
        await logSystem("Reconectando bot");
        startBot();
      }
    });

    sock.ev.on("creds.update", saveCreds);
  } catch (error) {
    console.log("\n❌ Error iniciando bot:\n");
    console.error(error);

    await logError({
      source: "startBot",
      error,
    });
  }
}

startBot();
