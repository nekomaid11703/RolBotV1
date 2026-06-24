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

## Phase 8 - Supabase Bug Fixes, Race Conditions & Cache Integration

- [x] Fix race condition en `transferMoney` — transacción atómica con rollback compensatorio en `economyService.js`.
- [x] Fix race condition en `createCharacter` — elimina count check, usa UNIQUE constraint (código 23505) en `characterService.js`.
- [x] Fix transacción incompleta en `setActiveCharacter` — dos updates atómicos con validación en `characterService.js`.
- [x] Fix `saveGroupActivity` null check — lanza error si upsert falla en `groupActivityService.js`.
- [x] Crear `safeQuery.js` con `safeSingle`, `safeSingleOrNull`, `safeMaybeSingle` — aplicado a userService, characterService, groupActivityService, economyService.
- [x] Integrar cache LRU+TTL en 10+ funciones: `getUserProfile`, `listUserProfiles`, `getTopBalances`, `getTopActiveUsers`, `getGroupActivity`, `getTopGroupMembers`, `listCharacters`, `getCharacter`, `getActiveCharacter`, `getCharacterBySlug`.
- [x] Invalidación automática de cache en writes: `saveUserProfile`, `saveGroupActivity`, `createCharacter`, `updateCharacterStats`, `editCharacter`, `deleteCharacter`, `setActiveCharacter`, `claimDaily`, `transferMoney`, `addMoney`, `removeMoney`, `setMoney`.
- [x] Validación `targetId` existe en `dar_stelas` antes de transferir.
- [x] Tests: `test_prompt_cache.js` (22/22), `test_context_compactor.js` (21/21), `test_crear_pj.js` (3/3), `command_usage_format`, `memory_context`, `token_saving_delegation` — todos verdes sin regresión.

## Phase 9 - Supabase Source of Truth & Sync Infrastructure

- [x] Auditar datos locales vs Supabase — 30 players, 1 char, 6 groups, 43 members, 284 auth en Supabase. Cero datos transaccionales en local (solo JSONL de memoria IA).
- [x] Crear `src/services/syncService.js` con `verifySync()`, `forceSync()`, `clearServiceCaches()`, `fetchAllFromSupabase()`.
- [x] Crear `scripts/force_sync.js` — CLI tool con `--verify-only` para verificar sin limpiar cache.
- [x] Añadir `bypassCache` option a TODAS las funciones de lectura: `getUserProfile`, `listUserProfiles`, `getTopBalances`, `getTopActiveUsers`, `getGroupActivity`, `getTopGroupMembers`, `listCharacters`, `getCharacter`, `getActiveCharacter`, `getCharacterBySlug`.
- [x] Añadir `cachedRead()` helper genérico en `safeQuery.js` con soporte `bypassCache`.
- [x] Añadir `invalidateAllCache()` en `safeQuery.js`.
- [x] Limpiar cache al inicio del bot (`bot.js` startup) — garantiza datos frescos desde Supabase en cada reinicio.
- [x] Verificar que TODAS las escrituras van a Supabase primero (ninguna a local): auditados `saveUserProfile`, `saveGroupActivity`, `addMoney`, `removeMoney`, `setMoney`, `transferMoney`, `createCharacter`, `updateCharacterStats`, `editCharacter`, `deleteCharacter`, `setActiveCharacter`, `recordUserActivity`, `ensureUserProfile` — todas escriben a Supabase directo.
- [x] Tests: `test_prompt_cache.js` (22/22), `test_context_compactor.js` (21/21), `test_crear_pj.js` (3/3), `command_usage_format`, `memory_context`, `token_saving_delegation` — todos verdes sin regresión.
- [x] Memoria persistente, design_board, task.md, AI_CHANGELOG actualizados.

## Pending External Requirements

- [ ] GitHub MCP requires Docker or Go plus a real GitHub token.
- [ ] RAG/vector search requires an explicit future decision and supporting infrastructure.

## Notes

- Root `.agents` is read-only in the current sandbox, so integration is local to
  `RolBotV1/.agents`.
- No credentials, providers, endpoints, or external services were invented.
- `supabase_migration.sql` was updated as source-of-truth only; no destructive
  SQL was applied to the remote database from this run.
