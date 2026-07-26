// @ts-nocheck
require("dotenv").config({ path: require("path").join(__dirname, "../../.env.local"), quiet: true });
const { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const { useSupabaseAuthState } = require("./supabaseAuthState");

/**
 * @constant P
 */
const P = require("pino");
// @ts-expect-error
/**
 * @constant qrcode
 */
const qrcode = require("qrcode-terminal");
const { loadCommands } = require("./commandHandler");
const { registerEvents } = require("./eventHandler");
const { logSystem, logError, cleanOldLogs } = require("../services/loggerService");
const { getResolvedSince } = require("../services/bugReportService");
const { getOwnerJids } = require("../utils/permissionUtils");
const { startMidnightReview, stopMidnightReview } = require("../services/schedulerService");
const { startDashboard, stopDashboard } = require("../services/statusDashboard");
const { stats, addEvent, incrementErrors } = require("../services/stats");

/**
 * @constant MAX_RECONNECT_ATTEMPTS
 */
const MAX_RECONNECT_ATTEMPTS = Number(process.env.MAX_RECONNECT_ATTEMPTS) || 50;
/**
 * @constant RECONNECT_MAX_DELAY
 * @type {number}
 */
const RECONNECT_MAX_DELAY = 60000;
/**
 * @constant RECONNECT_INITIAL_DELAY
 * @type {number}
 */
const RECONNECT_INITIAL_DELAY = 2000;
/**
 * @constant CONNECT_TIMEOUT_MS
 */
const CONNECT_TIMEOUT_MS = Number(process.env.CONNECT_TIMEOUT_MS) || 120000;

/** @type {boolean} */
let startupValidated = false;
/**
 * @constant QUERY_TIMEOUT_MS
 */
const QUERY_TIMEOUT_MS = Number(process.env.QUERY_TIMEOUT_MS) || 90000;
/**
 * @constant WATCHDOG_INTERVAL_MS
 * @type {number}
 */
const WATCHDOG_INTERVAL_MS = 60000;
/**
 * @constant WATCHDOG_MAX_DISCONNECTED_MS
 * @type {number}
 */
const WATCHDOG_MAX_DISCONNECTED_MS = 300000;
/**
 * @constant USE_PAIRING_CODE
 */
const USE_PAIRING_CODE = process.argv.slice(2).includes("code");

/**
 * @constant SUPABASE_TABLE
 * @type {string}
 */
const SUPABASE_TABLE = "bot_auth_state";
/** @type {object|null} */
let currentSock = null;
/**
 * @variable reconnectAttempts
 * @type {number}
 */
let reconnectAttempts = 0;
/**
 * @variable restartRequiredCount
 * @type {number}
 */
let restartRequiredCount = 0;
/** @type {ReturnType<typeof setInterval>|null} */
let watchdogTimer = null;
/**
 * @variable pairingCodeRequested
 * @type {boolean}
 */
let pairingCodeRequested = false;
/**
 * @variable pairingCodeRegistered
 * @type {boolean}
 */
let pairingCodeRegistered = false;
/** @type {string|null} */
let cachedPairingPhone = null;
/** @type {boolean} */
let isStarting = false;
/** @type {number} */
let consecutiveCrashes = 0;
/**
 * @constant MAX_CONSECUTIVE_CRASHES
 * @type {number}
 */
const MAX_CONSECUTIVE_CRASHES = 5;

process.on("uncaughtException", async (err) => {
  await logError({ source: "process.uncaughtException", error: err });
  consecutiveCrashes++;
  if (consecutiveCrashes > MAX_CONSECUTIVE_CRASHES) {
    await logSystem(`Bot crashó ${MAX_CONSECUTIVE_CRASHES} veces seguidas, abortando`);
    process.exit(1);
  }
  if (!isStarting) startBot().catch((e) => logError({ source: "bot.restartAfterCrash", error: e }));
});

process.on("unhandledRejection", async (reason) => {
  /**
   * @constant err
   */
  const err = reason instanceof Error ? reason : new Error(String(reason));
  await logError({ source: "process.unhandledRejection", error: err });
  consecutiveCrashes++;
  if (consecutiveCrashes > MAX_CONSECUTIVE_CRASHES) {
    await logSystem(`Bot crashó ${MAX_CONSECUTIVE_CRASHES} veces seguidas, abortando`);
    process.exit(1);
  }
  if (!isStarting) startBot().catch((e) => logError({ source: "bot.restartAfterRejection", error: e }));
});

/**
 * Force a new authentication session.
 */
async function forceNewSession() {
  try {
    const { supabase } = require("../database/supabase");
    await supabase.from(SUPABASE_TABLE).delete().eq("session_id", "bot-session-1");
  } catch {
    /* cleanup on error */
  }
  pairingCodeRegistered = false;
}

/**
 * Clean up the current socket connection.
 */
function cleanupSock() {
  stopMidnightReview();
  if (currentSock) {
    try {
      currentSock.removeAllListeners("connection.update");
      currentSock.removeAllListeners("creds.update");
      currentSock.removeAllListeners("messages.upsert");
      currentSock.end(undefined);
    } catch {
      /* cleanup on error */
    }
    currentSock = null;
  }
}

/**
 * @param {object} _sock - Socket instance.
 * @param _sock
 */
function startWatchdog(_sock) {
  stopWatchdog();
  watchdogTimer = setInterval(() => {
    if (!stats.isConnected && stats.lastConnectionTime) {
      /**
       * @constant elapsed
       */
      const elapsed = Date.now() - stats.lastConnectionTime;
      if (elapsed > WATCHDOG_MAX_DISCONNECTED_MS) {
        addEvent("err", "Watchdog: bot desconectado >5min, reiniciando");
        logSystem("Watchdog reiniciando bot por desconexión prolongada");
        stopWatchdog();
        cleanupSock();
        isStarting = false;
        startBot().catch((e) => logError({ source: "bot.watchdog", error: e }));
      }
    }
  }, WATCHDOG_INTERVAL_MS);
}

/**
 * Stop the watchdog timer.
 */
function stopWatchdog() {
  if (watchdogTimer) {
    clearInterval(watchdogTimer);
    watchdogTimer = null;
  }
}

/**
 * Handles the show qr.
 * @param qr - - qr.
 */
function handleShowQR(qr) {
  if (!qr) return;
  restartRequiredCount = 0;
  if (pairingCodeRequested) return;
  process.stdout.write("\n\x1b[1m\x1b[36mEscanea el codigo QR con WhatsApp:\x1b[0m\n\n");
  qrcode.generate(qr, { small: true });
  process.stdout.write("\n");
}

/**
 * Try request pairing code.
 * @param connection - - connection.
 * @param sock - - sock.
 */
function tryRequestPairingCode(connection, sock) {
  if (connection !== "connecting") return;
  if (!USE_PAIRING_CODE) return;
  if (!cachedPairingPhone) return;
  if (pairingCodeRequested) return;
  if (pairingCodeRegistered) return;
  pairingCodeRequested = true;
  setTimeout(async () => {
    try {
      /**
       * @constant code
       */
      const code = await sock.requestPairingCode(cachedPairingPhone);
      /**
       * @constant formattedCode
       */
      const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
      process.stdout.write(`\n\x1b[1m\x1b[36mCódigo de pareo:\x1b[0m\n`);
      process.stdout.write(`\x1b[1m\x1b[32m${formattedCode}\x1b[0m\n\n`);
      process.stdout.write(`\x1b[1m\x1b[36mPasos:\x1b[0m\n`);
      process.stdout.write(`  \x1b[90m1. Ve a web.whatsapp.com > tres puntos > Vincular con número\x1b[0m\n`);
      process.stdout.write(`  \x1b[90m2. O en tu teléfono: Menú > Dispositivos vinculados > Vincular\x1b[0m\n`);
      process.stdout.write(`  \x1b[90m3. Ingresa el código: \x1b[1m\x1b[97m${formattedCode}\x1b[0m\n\n`);
      await logSystem("Código de pareo generado");
    } catch (err) {
      pairingCodeRequested = false;
      await logError({ source: "bot.pairingCode", error: err });
    }
  }, 2000);
}

/**
 * Notifies about the bug fixes.
 * @param sock - - sock.
 * @async
 */
async function notifyBugFixes(sock) {
  try {
    /**
     * @constant lastWeek
     */
    const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString();
    /**
     * @constant fixed
     */
    const fixed = await getResolvedSince(lastWeek);
    if (fixed.length === 0) return;
    /**
     * @constant owners
     */
    const owners = getOwnerJids();
    for (const jid of owners) {
      await sock.sendMessage(jid, {
        text: `✅ Bugs resueltos (últimos 7 días, ${fixed.length}):\n${fixed
          .slice(0, 5)
          .map((r) => `  #${r.id.slice(0, 8)}: ${r.resolution?.summary || "Corregido"}`)
          .join("\n")}`,
      });
    }
  } catch (err) {
    await logError({ source: "bot.startup.bugNotify", error: err });
  }
}

/**
 * Handles the connection open.
 * @param sock - - sock.
 * @async
 */
async function handleConnectionOpen(sock) {
  pairingCodeRegistered = true;
  stats.isConnected = true;
  stats.lastConnectionTime = Date.now();
  reconnectAttempts = 0;
  restartRequiredCount = 0;
  addEvent("ok", "Bot conectado correctamente");
  await logSystem("Bot conectado correctamente");
  startWatchdog(sock);
  await notifyBugFixes(sock);
  startDashboard();
  startMidnightReview(sock);
  isStarting = false;
}

/**
 * Handles the logged out.
 * @async
 */
async function handleLoggedOut() {
  stopWatchdog();
  stopDashboard();
  addEvent("err", "Sesión inválida, limpiando y generando nuevo QR");
  await logSystem("Sesión inválida — limpiando credenciales para nuevo QR");
  await forceNewSession();
  cleanupSock();
  isStarting = false;
  startBot().catch((err) => {
    logError({ source: "bot.startBot", error: err instanceof Error ? err : new Error(String(err)) });
  });
}

/**
 * Handles the restart required.
 * @async
 */
async function handleRestartRequired() {
  restartRequiredCount++;
  if (restartRequiredCount >= 2) {
    stopWatchdog();
    addEvent("err", "Sesión inválida, forzando nuevo QR");
    await logSystem("Sesión rechazada por WhatsApp — limpiando credenciales");
    await forceNewSession();
    cleanupSock();
    isStarting = false;
    startBot().catch((err) => {
      logError({ source: "bot.startBot", error: err instanceof Error ? err : new Error(String(err)) });
    });
    return;
  }
  reconnectAttempts = 0;
  addEvent("warn", "Pareo exitoso, reconectando...");
  await logSystem("Reconectando tras pareo exitoso");
  await new Promise((r) => {
    setTimeout(r, 1000);
  });
  cleanupSock();
  isStarting = false;
  startBot().catch((err) => {
    logError({ source: "bot.startBot", error: err instanceof Error ? err : new Error(String(err)) });
  });
}

/**
 * Attempt reconnect.
 * @async
 */
async function attemptReconnect() {
  reconnectAttempts++;
  /**
   * @constant delay
   */
  const delay = Math.min(RECONNECT_INITIAL_DELAY * Math.pow(2, reconnectAttempts - 1), RECONNECT_MAX_DELAY);
  addEvent(
    "warn",
    `Reconectando en ${Math.round(delay / 1000)}s (intento ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
  );
  await logSystem("Reconectando bot", { attempt: reconnectAttempts, max: MAX_RECONNECT_ATTEMPTS, delay });
  setTimeout(() => {
    cleanupSock();
    isStarting = false;
    startBot().catch((err) => {
      logError({ source: "bot.startBot", error: err instanceof Error ? err : new Error(String(err)) });
    });
  }, delay);
}

/**
 * Handles the connection close.
 * @param update - - update.
 * @param sock - - sock.
 * @async
 */
async function handleConnectionClose(update, sock) {
  const { lastDisconnect } = update;
  stats.isConnected = false;
  /**
   * @constant disconnectErr
   */
  const disconnectErr = lastDisconnect?.error;
  /**
   * @constant reason
   */
  const reason = disconnectErr?.output?.statusCode;

  /**
   * @constant reasonName
   */
  const reasonName = Object.entries(DisconnectReason).find(([, v]) => v === reason)?.[0] || reason;

  if (disconnectErr) {
    await logError({
      source: "bot.connection.close",
      error: disconnectErr instanceof Error ? disconnectErr : new Error(String(disconnectErr)),
    });
  }

  addEvent("err", `Conexión cerrada (${reasonName})`);
  await logSystem("Conexión cerrada", { reason: reasonName });

  if (reason === DisconnectReason.loggedOut) {
    await handleLoggedOut();
    return;
  }

  if (reason === DisconnectReason.restartRequired) {
    await handleRestartRequired();
    return;
  }

  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    await logSystem("Máximos reintentos alcanzados, deteniendo reconexión");
    return;
  }

  await attemptReconnect();
}

/**
 * Handles the start bot error.
 * @param error - - error instance.
 * @async
 */
async function handleStartBotError(error) {
  incrementErrors();
  await logError({ source: "startBot", error });

  reconnectAttempts++;
  if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
    isStarting = false;
    return;
  }
  /**
   * @constant delay
   */
  const delay = Math.min(RECONNECT_INITIAL_DELAY * Math.pow(2, reconnectAttempts - 1), RECONNECT_MAX_DELAY);
  await logSystem("Reintentando startBot por error externo", { attempt: reconnectAttempts, delay });
  setTimeout(() => {
    cleanupSock();
    isStarting = false;
    startBot().catch((e) => logError({ source: "bot.startBot", error: e }));
  }, delay);
}

/**
 * Start the bot and establish connection.
 */
async function startBot() {
  if (isStarting) return;
  isStarting = true;
  try {
    pairingCodeRequested = false;
    pairingCodeRegistered = false;

    if (USE_PAIRING_CODE && !cachedPairingPhone) {
      cachedPairingPhone = process.env.PAIRING_PHONE_NUMBER || null;
      if (!cachedPairingPhone) {
        /**
         * @constant readline
         */
        const readline = require("readline");
        /**
         * @constant rl
         */
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        cachedPairingPhone = await new Promise((resolve) => {
          rl.question(
            "\n\x1b[1m\x1b[36mIngresa el número de teléfono (código de país + número, sin + ni espacios, ej: 573175473297):\x1b[0m ",
            (answer) => {
              rl.close();
              resolve(answer.trim());
            },
          );
        });
      }
      cachedPairingPhone = (cachedPairingPhone || "").replace(/[^\d]/g, "");
    }

    if (!startupValidated) {
      process.stdout.write("\x1b[90m[1/5] Limpiando logs viejos...\x1b[0m\n");
      await cleanOldLogs();
      process.stdout.write("\x1b[90m[1/5] ✓\x1b[0m\n");
      const { invalidateAllCache } = require("../utils/safeQuery");
      invalidateAllCache();

      process.stdout.write("\x1b[90m[2/5] Verificando schema de base de datos...\x1b[0m\n");
      const { verifyStartup } = require("../database/schemaValidator");
      await verifyStartup();
      process.stdout.write("\x1b[90m[2/5] ✓\x1b[0m\n");

      process.stdout.write("\x1b[90m[3/5] Ejecutando migraciones...\x1b[0m\n");
      const { runStartupMigration } = require("../database/schemaMigration");
      await runStartupMigration();
      process.stdout.write("\x1b[90m[3/5] ✓\x1b[0m\n");

      startupValidated = true;
    }

    await logSystem("Iniciando bot");

    /**
     * @constant ownerJids
     */
    const ownerJids = getOwnerJids();
    if (ownerJids.length === 0) {
      await logSystem("OWNER_PHONE no configurado — funciones de owner deshabilitadas");
    }

    process.stdout.write("\x1b[90m[4/4] Cargando sesión de WhatsApp desde Supabase...\x1b[0m\n");
    const { state, saveCreds } = await useSupabaseAuthState("bot-session-1");
    process.stdout.write("\x1b[90m[4/4] ✓\x1b[0m\n");

    process.stdout.write("\x1b[36mConectando con WhatsApp...\x1b[0m\n");
    const { version } = await fetchLatestBaileysVersion();

    /**
     * @constant sock
     */
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
    const { restoreSessions, startCleanupInterval } = require("../services/rpg/combatState");
    await restoreSessions();
    startCleanupInterval();

    await logSystem("Bot inicializado y eventos registrados", { version });

    sock.ev.on("connection.update", async (update) => {
      const { connection, qr } = update;

      handleShowQR(qr);
      tryRequestPairingCode(connection, sock);

      if (connection === "open") {
        await handleConnectionOpen(sock);
      }

      if (connection === "close") {
        await handleConnectionClose(update, sock);
      }
    });

    sock.ev.on("creds.update", saveCreds);
  } catch (error) {
    await handleStartBotError(error);
  }
}

startBot();
