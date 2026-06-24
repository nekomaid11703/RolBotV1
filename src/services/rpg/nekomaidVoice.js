const PREFIX = {
  tease: ['Oye~ ', 'Mira~ ', 'Escucha~ ', 'Dime~ ', 'Otra vez~ '],
  dom: ['Ya sabes~ ', 'Te lo explico~ ', 'Atiende~ ', 'No me hagas repetir~ '],
  error: ['Ay~ ', 'Vaya~ ', 'Mmm~ ', 'Ni modo~ '],
  neutral: ['Mm~ ', '', 'Bien~ ', 'Claro~ '],
  greet: ['Otra vez tú, ¿eh? ', 'Ah, llegaste~ ', '¿Ya viniste? '],
  farewell: ['Cuídate~ ', 'Nos vemos~ ', 'Hasta luego~ ', 'No te pierdas~ '],
  combatStart: ['¿Quieres pelea? ', 'Tendré que ensuciarme el uniforme~ ', 'No me hagas lastimarte~ '],
  combatWin: ['No fue nada~ ', 'Fácil~ ', '¿Eso es todo lo que tienes? '],
  combatLose: ['Me tomó desprevenida~ ', 'Buena suerte~ ', 'Esta vez ganaste~ '],
};

const SUFFIX = {
  neutral: ['~nya', '~ ¿ok?', '~ ¿entiendes?', '', '~ ¿o qué?', '~ está bien?'],
  tease: ['~ si es que...', '~ mira que...', '~ ¿entiendes?', '~ nya~'],
  dom: ['~ ¿entendido?', '~ ¿claro?', '~ nya.', '~ bien.'],
  error: ['~ ¿en serio?', '~ nya...', '~ tsk.'],
};

const MAID_TITLES = ['-san', '-kun', '-senpai', '', '-sama', '-chan'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPrefix(vibe) {
  const pool = PREFIX[vibe];
  if (!pool || pool.length === 0) return '';
  if (vibe === 'error' || vibe === 'dom') return pick(pool);
  if (Math.random() < 0.35) return pick(pool);
  return '';
}

function buildSuffix(vibe) {
  const pool = SUFFIX[vibe];
  if (!pool || pool.length === 0) return '';
  if (Math.random() < 0.4) return pick(pool);
  return '';
}

function injectPersonality(text, vibe = 'neutral') {
  if (!text || typeof text !== 'string') return text;
  if (text.length > 200) return text;

  const prefix = buildPrefix(vibe);
  const suffix = buildSuffix(vibe);

  let result = prefix + text;
  if (suffix) result += suffix;

  if (Math.random() < 0.15 && vibe !== 'error') {
    const title = pick(MAID_TITLES);
    if (title && !result.includes(title)) {
      result = result.replace(/( usuario| @\w+|$)/, (m) => m + title || '');
    }
  }

  return result;
}

function say(ctx, text, options = {}) {
  const { vibe = 'neutral' } = options;
  const decorated = injectPersonality(text, vibe);
  return ctx.reply(decorated, options);
}

module.exports = {
  injectPersonality,
  say,
  PREFIX,
  SUFFIX,
};
