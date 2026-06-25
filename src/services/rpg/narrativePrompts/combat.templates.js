const TEMPLATES = {
  attack_hit: (a, d, z) =>
    `${a} golpea a ${d} en ${z} con fuerza.`,

  attack_miss: (a, d) =>
    `${a} intenta golpear a ${d}, pero falla.`,

  attack_crit: (a, d, z) =>
    `${a} encuentra una abertura y asesta un golpe devastador en ${z} de ${d}!`,

  attack_blocked: (a, d) =>
    `${a} ataca, pero ${d} logra bloquear el golpe.`,

  intercepted: (a, d) =>
    `${d} intercepta el ataque de ${a} antes de que conecte.`,

  defend: (a) =>
    `${a} se pone en guardia.`,

  flee_success: (a) =>
    `${a} logra escapar del combate.`,

  flee_fail: (a) =>
    `${a} intenta huir, pero no lo consigue.`,

  ko: (d) =>
    `${d} cae al suelo, sin fuerzas.`,

  ko_critical: (d, z) =>
    `El golpe en ${z} es demasiado para ${d}, que se desploma.`,

  victory: (a, d) =>
    `${a} ha derrotado a ${d}.`,

  defeat: (d) =>
    `Has caído ante ${d}.`,

  fatigue_start: (a) =>
    `${a} empieza a sentir el peso del combate.`,

  fatigue_worsen: (a) =>
    `${a} jadea, los movimientos se vuelven más lentos.`,

  environment: (escenario) =>
    `El ${escenario} se extiende a tu alrededor.`,

  multi_hit: (a, targets, zone) =>
    `${a} golpea a ${targets.join(' y ')} en ${zone}.`,

  zone_destroyed: (d, z) =>
    `El ${z} de ${d} queda inutilizado.`,

  amputation: (d, z) =>
    `El ${z} de ${d} es seccionado limpiamente.`,
};

function render(templateKey, ...args) {
  const fn = TEMPLATES[templateKey];
  if (!fn) return `[${templateKey}]`;
  return fn(...args);
}

module.exports = { TEMPLATES, render };
