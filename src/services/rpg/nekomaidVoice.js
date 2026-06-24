const PREFIX = {
  dom: ['Atiende~ ', 'Escucha~ '],
  error: ['Ay~ ', 'Vaya~ ', 'Mmm~ '],
};

const SUFFIX = {
  neutral: ['~nya', '~ ¿ok?', '~ ¿entiendes?'],
  tease: ['~nya', '~ ¿eh?', '~ mira...'],
  dom: ['~ ¿entendiste?', '~ ¿claro?'],
  error: ['~nya...', '~ tsk.'],
  greet: ['~nya', '~ ¿qué tal?'],
  farewell: ['~ cuídate.', '~ nos vemos.', '~ hasta luego.'],
};

const HONORIFICS = ['-kun', '-san', '-chan'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function injectPersonality(text, vibe = 'neutral') {
  if (!text || typeof text !== 'string') return text;
  if (text.length > 200) return text;

  let result = text;

  const prefixPool = PREFIX[vibe];
  if (prefixPool && prefixPool.length > 0) {
    result = pick(prefixPool) + result;
  }

  const suffixPool = SUFFIX[vibe];
  if (suffixPool && suffixPool.length > 0) {
    result += pick(suffixPool);
  }

  if (vibe !== 'error' && vibe !== 'dom' && vibe !== 'farewell') {
    const honorific = pick(HONORIFICS);
    result = result.replace(/@(\w+)/g, (_, name) => `@${name}${honorific}`);
  }

  return result;
}

function say(ctx, text, options = {}) {
  const { vibe = 'neutral' } = options;
  return ctx.reply(text, { ...options, vibe });
}

module.exports = {
  injectPersonality,
  say,
  PREFIX,
  SUFFIX,
};
