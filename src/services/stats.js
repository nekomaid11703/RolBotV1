const stats = {
  startTime: Date.now(),
  messagesReceived: 0,
  commandsExecuted: 0,
  errors: 0,
  lastMessageTime: null,
  lastEvents: [],
  groupsCount: 0,
  isConnected: false,
  lastConnectionTime: null,
};

function incrementMessages() {
  stats.messagesReceived++;
  stats.lastMessageTime = Date.now();
}

function incrementCommands() {
  stats.commandsExecuted++;
}

function incrementErrors() {
  stats.errors++;
}

function addEvent(type, text) {
  stats.lastEvents.unshift({ time: new Date(), type, text });
  if (stats.lastEvents.length > 6) stats.lastEvents.pop();
}

function getUptime() {
  return Date.now() - stats.startTime;
}

function getMemory() {
  const usage = process.memoryUsage();
  return Math.round(usage.rss / 1024 / 1024 * 10) / 10;
}

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

module.exports = {
  stats,
  incrementMessages,
  incrementCommands,
  incrementErrors,
  addEvent,
  getUptime,
  getMemory,
  formatDuration,
};
