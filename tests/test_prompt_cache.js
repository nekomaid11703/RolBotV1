const { cache, LRUCache, generateCacheKey, classificationCacheKey, memoryCacheKey, TTLS } = require("../src/services/ai/promptCacheService");

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    failed++;
  }
}

function assertEqual(a, b, name) {
  const ok = a === b || JSON.stringify(a) === JSON.stringify(b);
  if (ok) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name} — expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
    failed++;
  }
}

console.log("\n🧪 test_prompt_cache.js\n");

// 1. Basic set/get
console.log("--- Basic set/get ---");
cache.clear();
cache.set("key1", "value1");
assertEqual(cache.get("key1"), "value1", "get returns set value");
assertEqual(cache.get("nonexistent"), undefined, "get returns undefined for missing key");

// 2. LRU eviction
console.log("\n--- LRU eviction ---");
const smallCache = new LRUCache(3);
smallCache.set("a", 1);
smallCache.set("b", 2);
smallCache.set("c", 3);
smallCache.set("d", 4);
assertEqual(smallCache.get("a"), undefined, "oldest evicted when over capacity");
assertEqual(smallCache.get("d"), 4, "newest survives");
assertEqual(smallCache.stats().size, 3, "size stays at max after eviction");

// 3. TTL expiration
console.log("\n--- TTL expiration ---");
cache.clear();
cache.set("ttl-key", "ttl-value", 10);
assertEqual(cache.get("ttl-key"), "ttl-value", "value accessible before TTL");

// 4. Cache stats
console.log("\n--- Cache stats ---");
cache.clear();
cache.get("miss1");
cache.get("miss2");
cache.set("hit1", 1);
cache.get("hit1");
cache.get("hit1");
const stats = cache.stats();
assertEqual(stats.hits, 2, "stats.hits counts correctly");
assertEqual(stats.misses, 2, "stats.misses counts correctly");
assert(stats.hitRate > 0, "hitRate > 0");
assertEqual(stats.size, 1, "stats.size is 1");

// 5. generateCacheKey consistency
console.log("\n--- generateCacheKey ---");
const k1 = generateCacheKey({ prompt: "hello", systemInstruction: "be helpful", temperature: 0.7, model: "gpt-4", provider: "openrouter" });
const k2 = generateCacheKey({ prompt: "hello", systemInstruction: "be helpful", temperature: 0.7, model: "gpt-4", provider: "openrouter" });
const k3 = generateCacheKey({ prompt: "different", systemInstruction: "be helpful", temperature: 0.7, model: "gpt-4", provider: "openrouter" });
assertEqual(k1, k2, "same inputs produce same key");
assert(k1 !== k3, "different inputs produce different keys");
assert(k1.startsWith("prompt:"), "key starts with 'prompt:'");

// 6. classificationCacheKey consistency
console.log("\n--- classificationCacheKey ---");
const ck1 = classificationCacheKey("do this task", ["feat", "fix"], "openrouter", "auto");
const ck2 = classificationCacheKey("do this task", ["fix", "feat"], "openrouter", "auto");
const ck3 = classificationCacheKey("other task", ["feat", "fix"], "openrouter", "auto");
assertEqual(ck1, ck2, "label order doesn't matter");
assert(ck1 !== ck3, "different text produces different key");

// 7. memoryCacheKey
console.log("\n--- memoryCacheKey ---");
const mk1 = memoryCacheKey({ prompt: "hello", tags: ["ai", "memory"], limit: 4, includeBoard: true });
const mk2 = memoryCacheKey({ prompt: "hello", tags: ["memory", "ai"], limit: 4, includeBoard: true });
assertEqual(mk1, mk2, "tag order doesn't matter in memory key");
assert(mk1.startsWith("memory:"), "memory key starts with 'memory:'");

// 8. invalidate by predicate
console.log("\n--- invalidate ---");
cache.clear();
cache.set("test:foo", 1);
cache.set("test:bar", 2);
cache.set("other:baz", 3);
cache.invalidate((key) => key.startsWith("test:"));
assertEqual(cache.get("test:foo"), undefined, "invalidate removes matching keys");
assertEqual(cache.get("other:baz"), 3, "invalidate keeps non-matching keys");

// 9. TTLS constants
console.log("\n--- TTLS ---");
assert(TTLS.textGeneration > 0, "textGeneration TTL > 0");
assert(TTLS.classification > TTLS.textGeneration, "classification TTL > textGeneration TTL");
assert(TTLS.memoryContext < TTLS.textGeneration, "memoryContext TTL < textGeneration TTL");

// Summary
console.log(`\n${"=".repeat(40)}`);
console.log(`Resultados: ${passed} pasaron, ${failed} fallaron de ${passed + failed} pruebas`);
if (failed > 0) process.exit(1);
