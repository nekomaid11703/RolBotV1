```js
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const P = require("pino");
const qrcode = require("qrcode-terminal");

const path = require("path");

async function startBot() {
    try {

        // =========================
        // AUTH
        // =========================

        const { state, saveCreds } = await useMultiFileAuthState(
            path.join(__dirname, "../database/auth")
        );

        // =========================
        // VERSION
        // =========================

        const { version } = await fetchLatestBaileysVersion();

        // =========================
        // SOCKET
        // =========================

        const sock = makeWASocket({
            version,

            logger: P({
                level: "silent"
            }),

            printQRInTerminal: false,

            auth: state,

            browser: [
                "NekoBot",
                "Chrome",
                "1.0.0"
            ]
        });

        // =========================
        // QR
        // =========================

        sock.ev.on("connection.update", async (update) => {

            const {
                connection,
                lastDisconnect,
                qr
            } = update;

            // =========================
            // QR CODE
            // =========================

            if (qr) {
                console.clear();

                console.log("\nEscanea el código QR:\n");

                qrcode.generate(qr, {
                    small: true
                });
            }

            // =========================
            // CONNECTED
            // =========================

            if (connection === "open") {

                console.clear();

                console.log("=================================");
                console.log("✅ BOT CONECTADO CORRECTAMENTE");
                console.log("=================================");
            }

            // =========================
            // DISCONNECTED
            // =========================

            if (connection === "close") {

                const reason =
                    lastDisconnect?.error?.output?.statusCode;

                console.log("\n⚠️ Conexión cerrada");

                // =========================
                // LOGOUT
                // =========================

                if (reason === DisconnectReason.loggedOut) {

                    console.log(
                        "❌ Sesión cerrada. Elimina la carpeta auth y vuelve a escanear."
                    );

                    return;
                }

                // =========================
                // RECONNECT
                // =========================

                console.log("🔄 Reconectando...\n");

                startBot();
            }
        });

        // =========================
        // SAVE CREDS
        // =========================

        sock.ev.on("creds.update", saveCreds);

        // =========================
        // MESSAGE EVENT
        // =========================

        sock.ev.on("messages.upsert", async ({ messages }) => {

            try {

                const msg = messages[0];

                if (!msg.message) return;

                // =========================
                // IGNORE STATUS
                // =========================

                if (
                    msg.key.remoteJid ===
                    "status@broadcast"
                ) {
                    return;
                }

                // =========================
                // EXTRACT TEXT
                // =========================

                const text =
                    msg.message?.conversation ||

                    msg.message?.extendedTextMessage?.text ||

                    msg.message?.imageMessage?.caption ||

                    msg.message?.videoMessage?.caption ||

                    "";

                if (!text) return;

                console.log("\n=========================");
                console.log("📩 NUEVO MENSAJE");
                console.log("=========================");
                console.log("De:", msg.key.remoteJid);
                console.log("Mensaje:", text);

            } catch (error) {

                console.log(
                    "\n❌ Error procesando mensaje:"
                );

                console.error(error);
            }
        });

    } catch (error) {

        console.log("\n❌ Error iniciando bot:\n");

        console.error(error);
    }
}

startBot();
```;
