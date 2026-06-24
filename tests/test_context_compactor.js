const { estimateTokens, stripExcessWhitespace, truncatePreservingHeadTail, compactMemoryEntries, minifyClassificationPrompt, compactPrompt } = require("../src/services/ai/contextCompactor");

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
  const ok = a === b;
  if (ok) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name} — expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
    failed++;
  }
}

console.log("\n🧪 test_context_compactor.js\n");

// 1. estimateTokens
console.log("--- estimateTokens ---");
assertEqual(estimateTokens("hello world"), 3, "12 chars / 4 = 3 tokens");
assertEqual(estimateTokens(""), 0, "empty string = 0 tokens");
assertEqual(estimateTokens("a".repeat(100)), 25, "100 chars / 4 = 25 tokens");

// 2. stripExcessWhitespace
console.log("\n--- stripExcessWhitespace ---");
assertEqual(stripExcessWhitespace("hello   world"), "hello world", "multiple spaces collapsed");
assertEqual(stripExcessWhitespace("line1\n\n\nline2"), "line1\n\nline2", "excess newlines collapsed");
assertEqual(stripExcessWhitespace("  trimmed  "), "trimmed", "leading/trailing whitespace trimmed");

// 3. truncatePreservingHeadTail
console.log("\n--- truncatePreservingHeadTail ---");
const longText = "The quick brown fox jumps over the lazy dog near the bank of the river.";
const truncated = truncatePreservingHeadTail(longText, 30, 0.3);
assert(truncated.length <= 33, "truncated string within maxChars + 3 for ellipsis");
assert(truncated.includes("..."), "truncated contains ellipsis");
assert(truncated.startsWith("The qui"), "truncated preserves head");
assert(truncated.endsWith("river."), "truncated preserves tail");

// 4. compactMemoryEntries
console.log("\n--- compactMemoryEntries ---");
const entries = [
  { type: "decision", summary: "First entry about architecture", details: "Long details here" },
  { type: "feature", summary: "Second entry about features", details: "More long details here" },
  { type: "fix", summary: "Third entry about fixes", details: "Even more details here" },
];
const compacted = compactMemoryEntries(entries, 20);
assert(compacted.length <= entries.length, "compacted has fewer or equal entries");
assert(compacted.length > 0, "compacted has at least 1 entry");
assertEqual(compacted[0].type, "decision", "first entry (highest priority) is kept");

// 5. minifyClassificationPrompt
console.log("\n--- minifyClassificationPrompt ---");
const shortDesc = "Classify this code";
const longDesc = "This is a very long task description that definitely exceeds the one hundred twenty character threshold for classification minification purposes";
const minified = minifyClassificationPrompt(longDesc, ["feat", "fix"]);
assert(minified.length < longDesc.length, "minified is shorter for long descriptions");
assert(minified.startsWith("Classify:"), "minified starts with 'Classify:'");
assertEqual(minifyClassificationPrompt(shortDesc, ["feat"]), 'Classify: "Classify this code"', "short descriptions pass through");

// 6. compactPrompt reduces tokens
console.log("\n--- compactPrompt ---");
const result = compactPrompt({
  prompt: "Tell me about the architecture of the system with many details that go on and on forever",
  systemInstruction: "You are a helpful assistant that knows everything about everything and can explain complex topics easily",
  memoryContext: "Memory: previous decisions were made about database schema and API design patterns for the new system architecture review process",
  maxTokens: 40,
});
assert(result.prompt.length > 0, "prompt is not empty after compaction");
assert(result.systemInstruction.length > 0, "systemInstruction is not empty after compaction");
const originalTokens = estimateTokens("Tell me about the architecture of the system with many details that go on and on forever") + estimateTokens("You are a helpful assistant that knows everything about everything and can explain complex topics easily") + estimateTokens("Memory: previous decisions were made about database schema and API design patterns for the new system architecture review process");
const compactedTokens = estimateTokens(result.prompt) + estimateTokens(result.systemInstruction) + estimateTokens(result.memoryContext);
assert(compactedTokens < originalTokens, `compacted (${compactedTokens}) < original (${originalTokens}) tokens`);

// 7. compactPrompt without budget (no compaction needed)
console.log("\n--- compactPrompt no compaction needed ---");
const short = compactPrompt({
  prompt: "Hello",
  systemInstruction: "Be nice",
  maxTokens: 9999,
});
assertEqual(short.prompt, "Hello", "short prompt unchanged");
assertEqual(short.systemInstruction, "Be nice", "short system instruction unchanged");

// Summary
console.log(`\n${"=".repeat(40)}`);
console.log(`Resultados: ${passed} pasaron, ${failed} fallaron de ${passed + failed} pruebas`);
if (failed > 0) process.exit(1);
