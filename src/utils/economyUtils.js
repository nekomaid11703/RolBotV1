function formatStelas(amount) {
  const value = Math.floor(Number(amount) || 0);

  return value === 1
    ? `✧ ${value} stela`
    : `✧ ${value} stelas`;
}

module.exports = {
  formatStelas,
};
