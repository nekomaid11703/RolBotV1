const crypto = require("crypto");

class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.map = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    if (!this.map.has(key)) {
      this.misses++;
      return undefined;
    }
    const entry = this.map.get(key);
    if (entry.ttl && Date.now() > entry.ttl) {
      this.map.delete(key);
      this.misses++;
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key, value, ttl = 300000) {
    if (this.map.has(key)) this.map.delete(key);
    if (this.map.size >= this.maxSize) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
    this.map.set(key, { value, ttl: ttl > 0 ? Date.now() + ttl : null });
  }

  invalidate(predicate) {
    for (const key of this.map.keys()) {
      if (predicate(key)) this.map.delete(key);
    }
  }

  clear() {
    this.map.clear();
    this.hits = 0;
    this.misses = 0;
  }

  stats() {
    const total = this.hits + this.misses;
    return {
      size: this.map.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) : 0,
      keys: Array.from(this.map.keys()),
    };
  }
}

function generateCacheKey(inputs) {
  const normalized = {
    prompt: (inputs.prompt || "").trim(),
    systemInstruction: (inputs.systemInstruction || "").trim(),
    temperature: inputs.temperature ?? 0.7,
    model: inputs.model || "",
    provider: inputs.provider || "",
  };
  const hash = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
  return `prompt:${hash}`;
}

function classificationCacheKey(text, candidateLabels, provider, model) {
  const normalized = {
    text: (text || "").trim().toLowerCase(),
    candidateLabels: (candidateLabels || []).map(l => l.toLowerCase()).sort(),
    provider: provider || "",
    model: model || "",
  };
  const hash = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
  return `classify:${hash}`;
}

function memoryCacheKey(params) {
  const normalized = {
    prompt: (params.prompt || "").slice(0, 200),
    tags: (params.tags || []).map(t => t.toLowerCase()).sort(),
    limit: params.limit ?? 4,
    includeBoard: params.includeBoard ?? true,
  };
  const hash = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
  return `memory:${hash}`;
}

const TTLS = {
  textGeneration: 300000,
  classification: 3600000,
  delegationPlan: 600000,
  memoryContext: 30000,
};

const cache = new LRUCache(100);

module.exports = {
  cache,
  LRUCache,
  generateCacheKey,
  classificationCacheKey,
  memoryCacheKey,
  TTLS,
};
