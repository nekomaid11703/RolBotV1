// @ts-nocheck
const { stats, getUptime, getMemory, formatDuration } = require("./stats");
const { getRecentErrors } = require("./loggerService");

let dashboardTimer = null;
/** @type {Array<{time: string, source: string, message: string}>} */
let cachedErrors = [];
let lastErrorFetch = 0;
/**
 * @constant ERROR_CACHE_MS
 * @type {number}
 */
const ERROR_CACHE_MS = 15000;

/**
 * @constant B
 * @type {string}
 */
const B = "\x1b[1m";
/**
 * @constant R
 * @type {string}
 */
const R = "\x1b[0m";
/**
 * @constant G
 * @type {string}
 */
const G = "\x1b[32m";
/**
 * @constant RE
 * @type {string}
 */
const RE = "\x1b[31m";
/**
 * @constant Y
 * @type {string}
 */
const Y = "\x1b[33m";
/**
 * @constant C
 * @type {string}
 */
const C = "\x1b[36m";
/**
 * @constant M
 * @type {string}
 */
const M = "\x1b[35m";
/**
 * @constant W
 * @type {string}
 */
const W = "\x1b[37m";
/**
 * @constant D
 * @type {string}
 */
const D = "\x1b[2m";
/**
 * @constant GR
 * @type {string}
 */
const GR = "\x1b[90m";

/**
 * @param val
 * @param max
 * @param w
 * @returns
 */
function bar(val, max, w) {
  w = w || 12;
  max = Math.max(max || 1, 1);
  if (val === 0 && max === 1) return "#".repeat(w);
  /**
   * @constant filled
   */
  const filled = Math.min(Math.round((val / max) * w), w);
  return "#".repeat(filled) + ".".repeat(w - filled);
}

/**
 * @param s
 * @param n
 * @returns
 */
function pad(s, n) {
  return String(s).padEnd(n);
}

/**
 * TODO: describe what this does.
 */
async function refreshErrors() {
  /**
   * @constant now
   */
  const now = Date.now();
  if (now - lastErrorFetch < ERROR_CACHE_MS) return;
  lastErrorFetch = now;
  try {
    cachedErrors = await getRecentErrors(5);
  } catch {
    cachedErrors = [];
  }
}

/**
 * TODO: describe what this does.
 */
async function render() {
  try {
    await refreshErrors();

    /**
     * @constant uptime
     */
    const uptime = formatDuration(getUptime());
    /**
     * @constant mem
     */
    const mem = getMemory();
    /**
     * @constant now
     * @type {Date}
     */
    const now = new Date();
    /**
     * @constant ts
     */
    const ts = now.toLocaleTimeString("es-ES", { hour12: false });

    /**
     * @constant connOk
     */
    const connOk = stats.isConnected;
    /**
     * @constant sIcon
     */
    const sIcon = connOk ? `${G}[OK]${R}` : `${RE}[--]${R}`;
    /**
     * @constant sText
     */
    const sText = connOk ? `${G}CONECTADO${R}` : `${RE}DESCONECTADO${R}`;

    /**
     * @constant maxMsg
     */
    const maxMsg = Math.max(stats.messagesReceived, 100);
    /**
     * @constant maxCmd
     */
    const maxCmd = Math.max(stats.commandsExecuted, 50);
    /**
     * @constant maxErr
     */
    const maxErr = Math.max(stats.errors, 10);

    /**
     * @constant msgB
     */
    const msgB = bar(stats.messagesReceived, maxMsg);
    /**
     * @constant cmdB
     */
    const cmdB = bar(stats.commandsExecuted, maxCmd);
    /**
     * @constant errB
     */
    const errB = bar(stats.errors, maxErr);
    /**
     * @constant errL
     */
    const errL = stats.errors > 0 ? `${RE}${B}${stats.errors}${R}` : `${stats.errors}`;

    /**
     * @constant lastMsg
     */
    const lastMsg = stats.lastMessageTime ? `hace ${Math.floor((Date.now() - stats.lastMessageTime) / 1000)}s` : "---";

    /**
     * @constant memS
     */
    const memS = `${mem} MB`;

    /**
     * @constant healthOk
     */
    const healthOk = !stats.lastMessageTime || Date.now() - stats.lastMessageTime < 30000;
    /**
     * @constant healthIcon
     */
    const healthIcon = healthOk ? `${G}[OK]${R}` : `${Y}[!!]${R}`;
    /**
     * @constant healthTxt
     */
    const healthTxt = healthOk ? "Normal" : "Inactivo";

    /**
     * @constant events
     */
    const events = stats.lastEvents
      .map((e) => {
        /**
         * @constant t
         */
        const t = e.time.toLocaleTimeString("es-ES", { hour12: false });
        let ic;
        if (e.type === "cmd") ic = C + ">" + R;
        else if (e.type === "err") ic = RE + "X" + R;
        else ic = G + ">" + R;
        return `  ${GR}${t}${R}  ${ic}  ${e.text.slice(0, 55)}`;
      })
      .join("\n");

    /**
     * @constant n
     * @type {string}
     */
    const n = "\n";
    /**
     * @constant sep
     */
    const sep = `${M}+----------------------------------------------------+${R}`;

    /**
     * @constant out
     * @type {Array}
     */
    const out = [
      `${GR}${ts}  presione Ctrl+C para salir${R}`,
      sep,
      `${M}|${R}        ${B}${W}***  N E K O B O T  -  R O L B O T  V 1  ***${R}        ${M}|${R}`,
      `${M}|${R}          ${D}${GR}Sistema de Rol por WhatsApp${R}          ${M}|${R}`,
      sep,
      `${M}|${R}  ${sIcon}  ${sText}          ${D}tiempo:${R} ${uptime}          ${M}|${R}`,
      sep,
      `${M}|${R}  ${B}${W}ESTADISTICAS${R}                                   ${M}|${R}`,
      `${M}|${R}  ${D}----------------------------------------------${R}  ${M}|${R}`,
      `${M}|${R}  ${pad("Mensajes", 12)} ${msgB}  ${B}${W}${String(stats.messagesReceived).padStart(5)}${R}  ${M}|${R}`,
      `${M}|${R}  ${pad("Comandos", 12)} ${cmdB}  ${B}${W}${String(stats.commandsExecuted).padStart(5)}${R}  ${M}|${R}`,
      `${M}|${R}  ${pad("Errores", 12)} ${errB}  ${errL.padStart(5)}  ${M}|${R}`,
      `${M}|${R}  ${pad("Ultimo msg", 12)} ${bar(0, 0)}  ${pad(lastMsg, 6)}  ${M}|${R}`,
      `${M}|${R}  ${pad("Memoria", 12)} ${bar(parseFloat(mem), 200)}  ${pad(memS, 6)}  ${M}|${R}`,
      `${M}|${R}  ${pad("Salud", 12)}              ${healthIcon} ${healthTxt}  ${M}|${R}`,
      sep,
      `${M}|${R}  ${B}${W}ULTIMOS EVENTOS${R}                               ${M}|${R}`,
      `${M}|${R}  ${D}----------------------------------------------${R}  ${M}|${R}`,
    ];

    if (events) {
      /**
       * @constant evLines
       */
      const evLines = events.split("\n");
      for (const line of evLines) {
        out.push(`${M}|${R}${line}`);
      }
      out.push(`${M}|${R}`);
    } else {
      out.push(`${M}|${R}  ${GR}(sin actividad)${R}                           ${M}|${R}`);
    }

    out.push(sep);

    out.push(`${M}|${R}  ${B}${W}ULTIMOS ERRORES (LOG)${R}                        ${M}|${R}`);
    out.push(`${M}|${R}  ${D}----------------------------------------------${R}  ${M}|${R}`);

    if (cachedErrors.length > 0) {
      for (const err of cachedErrors) {
        /**
         * @constant timeShort
         */
        const timeShort = err.time ? err.time.slice(11, 19) : "??:??:??";
        /**
         * @constant src
         */
        const src = err.source ? err.source.slice(0, 12) : "unknown";
        /**
         * @constant msg
         */
        const msg = err.message ? err.message.slice(0, 30) : "(sin msg)";
        out.push(`${M}|${R}  ${GR}${timeShort}${R} ${RE}${pad(src, 14)}${R} ${msg}`);
      }
    } else {
      out.push(`${M}|${R}  ${GR}(sin errores recientes)${R}                   ${M}|${R}`);
    }

    out.push(`${M}|${R}`);
    out.push(sep);

    process.stdout.write("\x1b[2J\x1b[H" + out.join(n) + n);
  } catch {
    /* Never crash the bot due to dashboard rendering error */
  }
}

/**
 * TODO: describe what this does.
 */
function startDashboard() {
  if (dashboardTimer) return;
  render();
  dashboardTimer = setInterval(render, 30000);
}

/**
 * TODO: describe what this does.
 */
function stopDashboard() {
  if (dashboardTimer) {
    clearInterval(dashboardTimer);
    dashboardTimer = null;
  }
}

module.exports = { startDashboard, stopDashboard };
