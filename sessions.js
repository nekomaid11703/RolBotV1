// sessions.js
const fs = require("fs");
const path = require("path");

const SESSIONS_FILE = path.join(__dirname, "data", "sessions.json");

// Cargar sesiones desde disco (si existe)
let sessions = {};
try {
  if (fs.existsSync(SESSIONS_FILE)) {
    sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
  }
} catch (e) {
  console.error("No se pudo cargar sessions.json:", e);
}

// Guardar en disco (sin bloqueo)
function saveSessions() {
  try {
    fs.mkdirSync(path.dirname(SESSIONS_FILE), { recursive: true });
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf8");
  } catch (e) {
    console.error("Error guardando sessions.json:", e);
  }
}

function startSession(userId, flowName) {
  sessions[userId] = {
    flow: flowName,
    step: 0,
    data: {}
  };
  saveSessions();
  return sessions[userId];
}

function getSession(userId) {
  return sessions[userId] || null;
}

function updateSession(userId, upd) {
  sessions[userId] = { ...sessions[userId], ...upd };
  saveSessions();
}

function deleteSession(userId) {
  delete sessions[userId];
  saveSessions();
}

module.exports = {
  startSession,
  getSession,
  updateSession,
  deleteSession
};
