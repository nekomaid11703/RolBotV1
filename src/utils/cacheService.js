// @ts-nocheck
/**
 * Cache for storing lru.
 */
class LRUCache {
  /**
   * @param {number} [maxSize] - - max size or length.
   * @class
   */
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.map = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Returns the .
   * @param key - - lookup key.
   * @returns
   */
  get(key) {
    if (!this.map.has(key)) {
      this.misses++;
      return undefined;
    }
    /**
     * @constant entry
     */
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

  /**
   * Sets the .
   * @param key - lookup key.
   * @param value - value to process.
   * @param {number} [ttl] - ttl.
   */
  set(key, value, ttl = 300000) {
    if (this.map.has(key)) this.map.delete(key);
    if (this.map.size >= this.maxSize) {
      /**
       * @constant oldest
       */
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
    this.map.set(key, { value, ttl: ttl > 0 ? Date.now() + ttl : null });
  }

  /**
   * Invalidate.
   * @param predicate - predicate function returning a boolean.
   */
  invalidate(predicate) {
    for (const key of this.map.keys()) {
      if (predicate(key)) this.map.delete(key);
    }
  }

  /**
   * Clears the .
   */
  clear() {
    this.map.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Stats.
   * @returns
   */
  stats() {
    /**
     * @constant total
     */
    const total = this.hits + this.misses;
    return {
      size: this.map.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      keys: Array.from(this.map.keys()),
    };
  }
}

/**
 * @constant cache
 * @type {LRUCache}
 */
const cache = new LRUCache(100);

/**
 * @constant TTLS
 * @type {object}
 */
const TTLS = {
  textGeneration: 300000,
  classification: 3600000,
  delegationPlan: 600000,
  memoryContext: 30000,
};

module.exports = {
  cache,
  TTLS,
};
