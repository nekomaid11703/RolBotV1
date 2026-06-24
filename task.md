# RolBotV1 Roadmap Execution Tasks

Status: In Progress

## Phase 1 - Shared Memory Foundation

- [x] Inventory `antigravity_config_asistente`.
- [x] Identify reusable configs, skills, and templates.
- [x] Create project-local agent rules in `.agents/AGENTS.md`.
- [x] Adapt compatible skills under `.agents/skills/`.
- [x] Create canonical memory protocol in `ai-memory/memory_protocol.md`.
- [x] Update design board with roadmap execution tickets.
- [x] Record durable memory entry for this integration.
- [x] Validate NekoMemori MCP after changes.

## Phase 2 - Cross-Agent Coordination

- [x] Ensure active tickets include owner, status, target files, and acceptance criteria.
- [x] Define handoff format for Codex to Antigravity.
- [x] Keep `AI_CHANGELOG.md` aligned with completed work.

## Phase 3 - AI Orchestrator Memory Integration

- [x] Design a small memory context service using existing JSONL/MCP data.
- [x] Integrate memory lookup before AI dispatch without adding new providers.
- [x] Add tests or dry-run validation for memory lookup.

## Phase 4 - Supabase Schema And Security

- [x] Audit runtime Supabase table usage.
- [x] Add missing `bot_auth_state` table to the migration source.
- [x] Replace permissive anon/authenticated grants in migration source with service-role-only policies.
- [x] Add read-only schema validation test for required tables.
- [x] Validate current remote schema access for bot tables.

## Phase 5 - Automatic Token-Saving Delegation

- [x] Define delegation policy for when external agents are worth using.
- [x] Prioritize providers by quality and free-tier value.
- [x] Keep small or low-value tasks local to Codex/Antigravity.
- [x] Add automatic workflow API for planning, delegation, assembly, and optional persistence.
- [x] Add a highest-quality quality gate before final assembly.
- [x] Validate delegation and local fallback with no-network dummy providers.

## Phase 6 - Command UX Consistency And Pause Resilience

- [x] Add shared message formatting helpers for usage, examples, forms, feedback, and errors.
- [x] Normalize commands that require user input across economy, permissions, characters, and utilities.
- [x] Test empty-command responses that show examples to users.
- [x] Harden delegated workflows so quota/token exhaustion returns structured fallback instead of throwing.
- [x] Validate continuation after a Codex pause without losing partial work.

## Phase 7 - Prompt Cache And Context Compaction

- [x] Create `promptCacheService.js` with LRU cache, TTL, key generation, and stats.
- [x] Create `contextCompactor.js` with token estimation, smart trimming, and classification minification.
- [x] Integrate cache into `aiOrchestrator.generateText()` — check cache before provider call, bypass if temperature > 0.7.
- [x] Integrate cache into `aiOrchestrator.classifyText()` — cache classification results with 1h TTL.
- [x] Add memory context compaction via `compactMemoryEntries()` in `memoryContextService.js`.
- [x] Add 30s cache for memory retrieval to avoid redundant JSONL reads.
- [x] Cache `_inferTaskType` results in `aiDispatcher.js`.
- [x] Add `CACHE_POLICY` and `COMPACTION_POLICY` to `aiConfig.js`.
- [x] Write `tests/test_prompt_cache.js` (22 tests, all pass).
- [x] Write `tests/test_context_compactor.js` (21 tests, all pass).
- [x] Verify no regressions in existing tests (command_usage_format, memory_context, crear_pj).

## Pending External Requirements

- [ ] GitHub MCP requires Docker or Go plus a real GitHub token.
- [ ] RAG/vector search requires an explicit future decision and supporting infrastructure.

## Notes

- Root `.agents` is read-only in the current sandbox, so integration is local to
  `RolBotV1/.agents`.
- No credentials, providers, endpoints, or external services were invented.
- `supabase_migration.sql` was updated as source-of-truth only; no destructive
  SQL was applied to the remote database from this run.
