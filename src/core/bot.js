require('dotenv').config({ path: require('path').join(__dirname, '../../.env.local') });
const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  initAuthCreds,
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
  cleanOldLogs,
} = require("../services/loggerService");
const { getResolvedSince } = require("../services/bugReportService");
const { getOwnerJids } = require("../utils/permissionUtils");
const { startMidnightReview } = require("../services/schedulerService");
const { startDashboard, stopDashboard } = require("../services/statusDashboard");
const { stats, addEvent, incrementErrors } = require("../services/stats");

const MAX_RECONNECT_ATTEMPTS = Number(process.env.MAX_RECONNECT_ATTEMPTS) || 50;
const RECONNECT_MAX_DELAY = 60000;
const RECONNECT_INITIAL_DELAY = 2000;
const CONNECT_TIMEOUT_MS = Number(process.env.CONNECT_TIMEOUT_MS) || 120000;
const QUERY_TIMEOUT_MS = Number(process.env.QUERY_TIMEOUT_MS) || 90000;
const WATCHDOG_INTERVAL_MS = 60000;
const WATCHDOG_MAX_DISCONNECTED_MS = 300000;

const SUPABASE_TABLE = 'bot_auth_state';
let currentSock = null;
let reconnectAttempts = 0;
let restartRequiredCount = 0;
let watchdogTimer = null;

process.on('uncaughtException', async (err) => {
  await logError({ source: 'process.uncaughtException', error: err });
  startBot().catch(e => logError({ source: 'bot.restartAfterCrash', error: e }));
});

process.on('unhandledRejection', async (reason) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  await logError({ source: 'process.unhandledRejection', error: err });
  startBot().catch(e => logError({ source: 'bot.restartAfterRejection', error: e }));
});

async function forceNewSession() {
  const { supabase } = require('../database/supabase');
  await supabase.from(SUPABASE_TABLE).delete().eq('session_id', 'bot-session-1');
}

function cleanupSock() {
  if (currentSock) {
    try {
      currentSock.removeAllListeners("connection.update");
      currentSock.removeAllListeners("creds.update");
      currentSock.removeAllListeners("messages.upsert");
      currentSock.end(undefined);
    } catch {}
    currentSock = null;
  }
}

function startWatchdog(sock) {
  stopWatchdog();
  watchdogTimer = setInterval(() => {
    if (!stats.isConnected && stats.lastConnectionTime) {
      const elapsed = Date.now() - stats.lastConnectionTime;
      if (elapsed > WATCHDOG_MAX_DISCONNECTED_MS) {
        addEvent("err", "Watchdog: bot desconectado >5min, reiniciando");
        logSystem("Watchdog reiniciando bot por desconexión prolongada");
        stopWatchdog();
        cleanupSock();
        startBot().catch(e => logError({ source: 'bot.watchdog', error: e }));
      }
    }
  }, WATCHDOG_INTERVAL_MS);
}

function stopWatchdog() {
  if (watchdogTimer) {
    clearInterval(watchdogTimer);
    watchdogTimer = null;
  }
}

async function startBot() {
  try {
    await cleanOldLogs();

    const { invalidateAllCache } = require("../utils/safeQuery");
    invalidateAllCache();

    await logSystem("Iniciando bot");

    const { state, saveCreds } = await useSupabaseAuthState('bot-session-1');

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: P({ level: "error" }),
      printQRInTerminal: false,
      auth: state,
      browser: ["NekoBot", "Chrome", "1.0.0"],
      keepAliveIntervalMs: 30000,
      connectTimeoutMs: CONNECT_TIMEOUT_MS,
      defaultQueryTimeoutMs: QUERY_TIMEOUT_MS,
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false,
      maxMsgRetryCount: 10,
    });

    currentSock = sock;
    reconnectAttempts = 0;

    loadCommands();
    registerEvents(sock);

    await logSystem("Bot inicializado y eventos registrados", { version });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        restartRequiredCount = 0;
        process.stdout.write('\n\x1b[1m\x1b[36mEscanea el codigo QR con WhatsApp:\x1b[0m\n\n');
        qrcode.generate(qr, { small: true });
        process.stdout.write('\n');
        await logSystem("Código QR generado");
      }

      if (connection === "open") {
        stats.isConnected = true;
        stats.lastConnectionTime = Date.now();
        reconnectAttempts = 0;
        restartRequiredCount = 0;
        addEvent("ok", "Bot conectado correctamente");
        await logSystem("Bot conectado correctamente");

        startWatchdog(sock);

        try {
          const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString();
          const fixed = await getResolvedSince(lastWeek);
          if (fixed.length > 0) {
            const ownerJids = getOwnerJids();
            for (const jid of ownerJids) {
              await sock.sendMessage(jid, {
                text: `✅ Bugs resueltos (últimos 7 días, ${fixed.length}):\n${fixed.slice(0, 5).map(r => `  #${r.id.slice(0, 8)}: ${r.resolution?.summary || 'Corregido'}`).join('\n')}`,
              });
            }
          }
        } catch (err) {
          await logError({ source: 'bot.startup.bugNotify', error: err });
        }

        startDashboard();
        startMidnightReview(sock);
      }

      if (connection === "close") {
        stats.isConnected = false;
        const disconnectErr = lastDisconnect?.error;
        const reason = disconnectErr?.output?.statusCode;

        const reasonName = Object.entries(DisconnectReason).find(([, v]) => v === reason)?.[0] || reason;

        if (disconnectErr) {
          await logError({ source: 'bot.connection.close', error: disconnectErr instanceof Error ? disconnectErr : new Error(String(disconnectErr)) });
        }

        addEvent("err", `Conexión cerrada (${reasonName})`);
        await logSystem("Conexión cerrada", { reason: reasonName });

        if (reason === DisconnectReason.loggedOut) {
          stopWatchdog();
          stopDashboard();
          addEvent("err", "Sesión inválida, limpiando y generando nuevo QR");
          await logSystem("Sesión inválida — limpiando credenciales para nuevo QR");
          await forceNewSession();
          cleanupSock();
          startBot().catch(err => {
            logError({ source: 'bot.startBot', error: err instanceof Error ? err : new Error(String(err)) });
          });
          return;
        }

        if (reason === DisconnectReason.restartRequired) {
          restartRequiredCount++;
          if (restartRequiredCount >= 2) {
            stopWatchdog();
            addEvent("err", "Sesión inválida, forzando nuevo QR");
            await logSystem("Sesión rechazada por WhatsApp — limpiando credenciales");
            await forceNewSession();
            cleanupSock();
            startBot().catch(err => {
              logError({ source: 'bot.startBot', error: err instanceof Error ? err : new Error(String(err)) });
            });
            return;
          }
          reconnectAttempts = 0;
          addEvent("warn", "Pareo exitoso, reconectando...");
          await logSystem("Reconectando tras pareo exitoso");
          await new Promise(r => setTimeout(r, 1000));
          cleanupSock();
          startBot().catch(err => {
            logError({ source: 'bot.startBot', error: err instanceof Error ? err : new Error(String(err)) });
          });
          return;
        }

        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          await logSystem("Máximos reintentos alcanzados, deteniendo reconexión");
          return;
        }

        reconnectAttempts++;
        const delay = Math.min(
          RECONNECT_INITIAL_DELAY * Math.pow(2, reconnectAttempts - 1),
          RECONNECT_MAX_DELAY,
        );

        addEvent("warn", `Reconectando en ${Math.round(delay / 1000)}s (intento ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        await logSystem("Reconectando bot", { attempt: reconnectAttempts, max: MAX_RECONNECT_ATTEMPTS, delay });

        setTimeout(() => {
          cleanupSock();
          startBot().catch(err => {
            logError({ source: 'bot.startBot', error: err instanceof Error ? err : new Error(String(err)) });
          });
        }, delay);
      }
    });

    sock.ev.on("creds.update", saveCreds);
  } catch (error) {
    incrementErrors();
    await logError({ source: "startBot", error });

    reconnectAttempts++;
    if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.min(
        RECONNECT_INITIAL_DELAY * Math.pow(2, reconnectAttempts - 1),
        RECONNECT_MAX_DELAY,
      );
      await logSystem("Reintentando startBot por error externo", { attempt: reconnectAttempts, delay });
      setTimeout(() => {
        cleanupSock();
        startBot().catch(e => logError({ source: 'bot.startBot', error: e }));
      }, delay);
    }
  }
}

startBot();