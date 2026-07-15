// @ts-nocheck
function formatCount(value) {
  return String(Math.max(0, Math.floor(Number(value) || 0)));
}

function formatDate(value) {
  if (!value) {
    return "sin datos";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "sin datos";
  }

  return date.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function medal(index) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}.`;
}

module.exports = { formatCount, formatDate, medal };
