const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');

const LORE_DIR = path.join(process.cwd(), 'ai-memory', 'world-lore');
const SCENE_CACHE_TTL = 3600000;

let loreCache = null;
let loreCacheTime = 0;

function getLoreFiles() {
  try {
    if (!fsSync.existsSync(LORE_DIR)) return [];
    return fsSync.readdirSync(LORE_DIR)
      .filter(f => f.endsWith('.md'))
      .sort();
  } catch { return []; }
}

function readLoreFile(filename) {
  try {
    const content = fsSync.readFileSync(path.join(LORE_DIR, filename), 'utf8');
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

function extractSectionByKeyword(content, keyword) {
  if (!content || !keyword) return null;
  const lower = keyword.toLowerCase();
  const sections = content.split(/(?=^###\s+)/m);
  for (const section of sections) {
    if (section.toLowerCase().includes(lower)) {
      const lines = section.trim().split('\n');
      const title = lines[0].replace(/^###\s*/, '').trim();
      const body = lines.slice(1).join('\n').trim();
      return { title, body: body.length > 500 ? body.slice(0, 500) + '...' : body };
    }
  }
  return null;
}

function getContextualLore(region, zone, locationId, maxTokens = 800) {
  const lore = getAllLore();
  if (!lore || lore.length === 0) return null;

  const zoneFiles = lore.filter(e =>
    e.filename.startsWith('02_') || e.filename.startsWith('2_')
  );
  const regionFiles = lore.filter(e =>
    e.filename.startsWith('01_') || e.filename.startsWith('1_')
  );
  const globalFiles = lore.filter(e =>
    e.filename.startsWith('00_') || e.filename.startsWith('0_')
  );

  const searchTerms = [locationId, zone, region].filter(Boolean);

  for (const term of searchTerms) {
    for (const file of zoneFiles) {
      const match = extractSectionByKeyword(file.content, term);
      if (match) {
        const block = `## ${match.title}\n${match.body}`;
        if (block.length <= maxTokens * 3) return block;
      }
    }
  }

  for (const term of searchTerms) {
    for (const file of regionFiles) {
      const match = extractSectionByKeyword(file.content, term);
      if (match) {
        const block = `## ${match.title}\n${match.body}`;
        if (block.length <= maxTokens * 3) return block;
      }
    }
  }

  const global = globalFiles[0];
  if (global) {
    const body = global.content.replace(/^#\s+.+\n*/m, '').trim();
    const snippet = body.length > 500 ? body.slice(0, 500) + '...' : body;
    if (snippet.length <= maxTokens * 3) return snippet;
  }

  return null;
}

module.exports = {
  getLoreFiles,
  readLoreFile,
  getAllLore,
  getLoreByKeyword,
  getLoreContext,
  getContextualLore,
  invalidateCache,
};
