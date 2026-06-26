const LOCATION_DESCRIPTORS = {
  bosque: ['entre los arboles', 'en la espesura', 'bajo las copas', 'entre la maleza'],
  ciudad: ['entre las calles empedradas', 'junto a los muros', 'en la plaza', 'en el callejon'],
  mazmorra: ['en la penumbra', 'entre las paredes de roca', 'bajo el techo abovedado', 'en el pasillo'],
  desierto: ['bajo el sol abrasador', 'entre las dunas', 'en la llanura arida'],
  playa: ['en la orilla', 'junto al mar', 'sobre la arena humeda'],
  montanya: ['en la ladera', 'entre las rocas', 'en el sendero escarpado'],
  default: ['en el campo de batalla', 'frente a frente', 'en la refriega'],
};

const ABILITY_NARRATIVES = {
  golpe_poderoso: (a, d, z) =>
    a + ' descarga un golpe brutal contra ' + z + ' de ' + d + ', poniendo toda su fuerza en el impacto.',
  defensa_total: (a) =>
    a + ' se cubre por completo, ofreciendo la menor superficie posible al enemigo.',
  ataque_rapido: (a, d, z) =>
    a + ' ejecuta una rafaga de golpes rapidos contra ' + z + ' de ' + d + '.',
  finta: (a, d, z) =>
    a + ' engana a ' + d + ' con una finta y clava el golpe en ' + z + '.',
  racha_de_golpes: (a, d) =>
    a + ' desata una andanada de golpes contra ' + d + ' en una progresion imparable.',
  curarse: (a) =>
    a + ' canaliza fulgor y sus heridas comienzan a cerrarse.',
  impulso: (a) =>
    'Una aura de fulgor envuelve a ' + a + ', agudizando sus sentidos.',
  onda_de_choque: (a, targets) =>
    a + ' golpea el suelo y una onda expansiva de fulgor arrolla a ' + (targets.join ? targets.join(' y ') : targets) + '.',
  golpe_de_gracia: (a, d, z) =>
    a + ' ve la oportunidad y lanza un golpe letal contra ' + z + ' de ' + d + '!',
  barrera_de_fulgor: (a) =>
    'El fulgor brota del cuerpo de ' + a + ' formando una barrera protectora.',
};

function getLocationDescriptor(zoneName) {
  const key = (zoneName || '').toLowerCase();
  for (const [loc, descs] of Object.entries(LOCATION_DESCRIPTORS)) {
    if (key.includes(loc)) return descs[Math.floor(Math.random() * descs.length)];
  }
  return LOCATION_DESCRIPTORS.default[Math.floor(Math.random() * LOCATION_DESCRIPTORS.default.length)];
}

const TEMPLATES = {
  attack_hit: (a, d, z, loc) =>
    a + ' golpea a ' + d + ' en ' + z + ' ' + getLocationDescriptor(loc) + '.',

  attack_miss: (a, d, loc) =>
    a + ' intenta golpear a ' + d + ' ' + getLocationDescriptor(loc) + ', pero falla.',

  attack_crit: (a, d, z, loc) =>
    a + ' encuentra una abertura y asesta un golpe devastador en ' + z + ' de ' + d + ' ' + getLocationDescriptor(loc) + '!',

  attack_blocked: (a, d) =>
    a + ' ataca, pero ' + d + ' logra bloquear el golpe justo a tiempo.',

  intercepted: (a, d) =>
    d + ' anticipa el movimiento de ' + a + ' e intercepta el ataque.',

  defend: (a, loc) =>
    a + ' se pone en guardia ' + getLocationDescriptor(loc) + '.',

  flee_success: (a, loc) =>
    a + ' aprovecha un descuido y logra escapar ' + getLocationDescriptor(loc) + '.',

  flee_fail: (a, loc) =>
    a + ' intenta huir ' + getLocationDescriptor(loc) + ', pero el camino esta bloqueado.',

  ko: (d) =>
    d + ' cae al suelo, sin fuerzas para continuar.',

  ko_critical: (d, z) =>
    'El golpe en ' + z + ' es demasiado para ' + d + ', que se desploma.',

  victory: (a, d) =>
    a + ' ha derrotado a ' + d + '.',

  defeat: (d) =>
    'Has caido ante ' + d + '.',

  fatigue_start: (a) =>
    a + ' empieza a sentir el peso del combate, su respiracion se acelera.',

  fatigue_worsen: (a) =>
    a + ' jadea, los movimientos se vuelven torpes y lentos.',

  environment: (escenario) =>
    'El ' + escenario + ' se extiende a tu alrededor, cargado de tension.',

  multi_hit: (a, targets, zone, loc) =>
    a + ' golpea a ' + (targets.join ? targets.join(' y ') : targets) + ' en ' + zone + ' ' + getLocationDescriptor(loc) + '.',

  zone_destroyed: (d, z) =>
    'El ' + z + ' de ' + d + ' queda inutilizado, inerte.',

  amputation: (d, z) =>
    'El ' + z + ' de ' + d + ' es seccionado limpiamente, la sangre brota a borbotones.',

  shield_absorb: (d, absorbed) =>
    'El escudo de fulgor de ' + d + ' absorbe ' + absorbed + ' puntos de dano antes de disiparse.',

  buff_activate: (a, stat, value) =>
    a + ' se fortalece: ' + stat + ' aumentado en +' + value + '.',

  dot_burn: (d, damage) =>
    d + ' sufre ' + damage + ' de dano continuo por los efectos persistentes.',
};

function render(templateKey, ...args) {
  const fn = TEMPLATES[templateKey];
  if (!fn) {
    const abilityFn = ABILITY_NARRATIVES[templateKey];
    if (abilityFn) return abilityFn(...args);
    return '[' + templateKey + ']';
  }
  return fn(...args);
}

function renderAbility(abilityId, ...args) {
  const fn = ABILITY_NARRATIVES[abilityId];
  if (fn) return fn(...args);
  return '[habilidad ' + abilityId + ']';
}

module.exports = { TEMPLATES, ABILITY_NARRATIVES, LOCATION_DESCRIPTORS, render, renderAbility };
