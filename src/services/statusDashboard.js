// @ts-nocheck
const { stats, getUptime, getMemory, formatDuration } = require("./stats");
const { getRecentErrors } = require("./loggerService");

let dashboardTimer = null;
/** @type {Array<{time: string, source: string, message: string}>} */
let cachedErrors = [];
let lastErrorFetch = 0;
const ERROR_CACHE_MS = 15000;

const B = "\x1b[1m";
const R = "\x1b[0m";
const G = "\x1b[32m";
const RE = "\x1b[31m";
const Y = "\x1b[33m";
const C = "\x1b[36m";
const M = "\x1b[35m";
const W = "\x1b[37m";
const D = "\x1b[2m";
const GR = "\x1b[90m";

function bar(val, max, w) {
  w = w || 12;
  max = Math.max(max || 1, 1);
  if (val === 0 && max === 1) return "#".repeat(w);
  const filled = Math.min(Math.round((val / max) * w), w);
  return "#".repeat(filled) + ".".repeat(w - filled);
}

function pad(s, n) {
  return String(s).padEnd(n);
}

async function refreshErrors() {
  const now = Date.now();
  if (now - lastErrorFetch < ERROR_CACHE_MS) return;
  lastErrorFetch = now;
  try {
    cachedErrors = await getRecentErrors(5);
  } catch {
    cachedErrors = [];
  }
}

function formatEventLine(e) {
  const t = e.time.toLocaleTimeString("es-ES", { hour12: false });
  let ic;
  if (e.type === "cmd") ic = C + ">" + R;
  else if (e.type === "err") ic = RE + "X" + R;
  else ic = G + ">" + R;
  return `  ${GR}${t}${R}  ${ic}  ${e.text.slice(0, 55)}`;
}

function buildErrorLines(out) {
  if (cachedErrors.length > 0) {
    for (const err of cachedErrors) {
      const timeShort = err.time ? err.time.slice(11, 19) : "??:??:??";
      const src = err.source ? err.source.slice(0, 12) : "unknown";
      const msg = err.message ? err.message.slice(0, 30) : "(sin msg)";
      out.push(`${M}|${R}  ${GR}${timeShort}${R} ${RE}${pad(src, 14)}${R} ${msg}`);
    }
  } else {
    out.push(`${M}|${R}  ${GR}(sin errores recientes)${R}                   ${M}|${R}`);
  }
}

async function render() {
  try {
    await refreshErrors();

    const uptime = formatDuration(getUptime());
    const mem = getMemory();
    const now = new Date();
    const ts = now.toLocaleTimeString("es-ES", { hour12: false });

    const connOk = stats.isConnected;
    const sIcon = connOk ? `${G}[OK]${R}` : `${RE}[--]${R}`;
    const sText = connOk ? `${G}CONECTADO${R}` : `${RE}DESCONECTADO${R}`;

    const maxMsg = Math.max(stats.messagesReceived, 100);
    const maxCmd = Math.max(stats.commandsExecuted, 50);
    const maxErr = Math.max(stats.errors, 10);

    const msgB = bar(stats.messagesReceived, maxMsg);
    const cmdB = bar(stats.commandsExecuted, maxCmd);
    const errB = bar(stats.errors, maxErr);
    const errL = stats.errors > 0 ? `${RE}${B}${stats.errors}${R}` : `${stats.errors}`;

    const lastMsg = stats.lastMessageTime ? `hace ${Math.floor((Date.now() - stats.lastMessageTime) / 1000)}s` : "---";

    const memS = `${mem} MB`;

    const healthOk = !stats.lastMessageTime || Date.now() - stats.lastMessageTime < 30000;
    const healthIcon = healthOk ? `${G}[OK]${R}` : `${Y}[!!]${R}`;
    const healthTxt = healthOk ? "Normal" : "Inactivo";

    const events = stats.lastEvents.map(formatEventLine).join("\n");

    const sep = `${M}+----------------------------------------------------+${R}`;

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

    buildErrorLines(out);

    out.push(`${M}|${R}`);
    out.push(sep);

    process.stdout.write("\x1b[2J\x1b[H" + out.join("\n") + "\n");
  } catch {
    /* Never crash the bot due to dashboard rendering error */
  }
}

function startDashboard() {
  if (dashboardTimer) return;
  render();
  dashboardTimer = setInterval(render, 30000);
}

function stopDashboard() {
  if (dashboardTimer) {
    clearInterval(dashboardTimer);
    dashboardTimer = null;
  }
}

module.exports = { startDashboard, stopDashboard };
