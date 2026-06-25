const TEMPLATES = {
  attack_hit: (a, d, z) =>
    `${a} ataca ${d} en ${z}. El golpe conecta con fuerza.`,

  attack_miss: (a, d) =>
    `${a} intenta golpear a ${d}, pero el ataque falla por poco.`,

  attack_crit: (a, d, z) =>
    `${a} encuentra una abertura en la defensa de ${d} y asesta un golpe devastador en ${z}!`,

  attack_blocked: (a, d) =>
    `${a} ataca, pero ${d} logra bloquear el golpe justo a tiempo.`,

  defend: (a) =>
    `${a} se pone en guardia, cubriendo los puntos vitales.`,

  defend_block: (a, d) =>
    `${d} ataca a ${a}, pero su postura defensiva absorbe el impacto.`,

  flee_success: (a) =>
    `${a} aprovecha un descuido y logra escapar del combate.`,

  flee_fail: (a) =>
    `${a} intenta huir, pero no encuentra la distancia suficiente.`,

  ko: (d) =>
    `${d} cae al suelo, sin fuerzas para continuar.`,

  ko_critical: (d, z) =>
    `El golpe en ${z} es demasiado para ${d}, que se desploma.`,

  victory: (a, d) =>
    `${a} ha derrotado a ${d}! El campo de batalla queda en silencio.`,

  defeat: (d) =>
    `Has caído ante ${d}. La oscuridad se cierne sobre ti.`,

  fatigue_start: (a) =>
    `${a} empieza a sentir el peso del esfuerzo acumulado.`,

  fatigue_worsen: (a) =>
    `${a} jadea, los movimientos se vuelven más lentos.`,

  environment: (escenario) =>
    `El ${escenario} se extiende a tu alrededor, cargado de tensión.`,
};

function render(templateKey, ...args) {
  const fn = TEMPLATES[templateKey];
  if (!fn) return `[${templateKey}]`;
  return fn(...args);
}

module.exports = { TEMPLATES, render };
