function formatStelas(amount) {
  const value = Math.floor(Number(amount) || 0);

  return value === 1
    ? `✧ ${value} stela`
    : `✧ ${value} stelas`;
}

function formatDuration(ms) {
  const totalMs = Math.max(0, Math.floor(Number(ms) || 0));

  const totalMinutes = Math.ceil(totalMs / 60000);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes}m`;
  }

  if (minutes <= 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

module.exports = {
  formatStelas,
  formatDuration,
};
