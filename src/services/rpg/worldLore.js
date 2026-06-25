const fs = require('fs');
const path = require('path');

const LORE_DIR = path.join(process.cwd(), 'ai-memory', 'world-lore');
const SCENE_CACHE_TTL = 3600000;

let loreCache = null;
let loreCacheTime = 0;

function getLoreFiles() {
  try {
    if (!fs.existsSync(LORE_DIR)) return [];
    return fs.readdirSync(LORE_DIR)
      .filter(f => f.endsWith('.md'))
      .sort();
  } catch { return []; }
}

function readLoreFile(filename) {
  try {
    const content = fs.readFileSync(path.join(LORE_DIR, filename), 'utf8');
    return { filename, content, title: extractTitle(content, filename) };
  } catch { return null; }
}

function extractTitle(content, filename) {
  const match = content.match(/^#\s+(.+)/m);
  if (match) return match[1].trim();
  return filename.replace(/^\d+_/, '').replace(/\.md$/, '').replace(/_/g, ' ');
}

function getAllLore() {
  const now = Date.now();
  if (loreCache && (now - loreCacheTime) < SCENE_CACHE_TTL) return loreCache;

  const files = getLoreFiles();
  const lore = files.map(f => readLoreFile(f)).filter(Boolean);
  loreCache = lore;
  loreCacheTime = now;
  return lore;
}

function getLoreByKeyword(keywords) {
  const lore = getAllLore();
  const terms = (Array.isArray(keywords) ? keywords : [keywords]).map(k => k.toLowerCase());
  return lore.filter(entry => {
    const lower = entry.content.toLowerCase();
    return terms.some(t => lower.includes(t));
  });
}

function getLoreContext(maxLength = 2000) {
  const lore = getAllLore();
  let context = '';
  for (const entry of lore) {
    const header = `## ${entry.title}\n`;
    const body = entry.content.replace(/^#\s+.+\n*/m, '').trim();
    const snippet = body.length > 500 ? body.slice(0, 500) + '...' : body;
    const block = header + snippet + '\n\n';
    if ((context + block).length > maxLength) break;
    context += block;
  }
  return context.trim();
}

function invalidateCache() {
  loreCache = null;
  loreCacheTime = 0;
}

module.exports = {
  getLoreFiles,
  readLoreFile,
  getAllLore,
  getLoreByKeyword,
  getLoreContext,
  invalidateCache,
};
