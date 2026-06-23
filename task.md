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

## Pending External Requirements

- [ ] GitHub MCP requires Docker or Go plus a real GitHub token.
- [ ] RAG/vector search requires an explicit future decision and supporting infrastructure.

## Notes

- Root `.agents` is read-only in the current sandbox, so integration is local to
  `RolBotV1/.agents`.
- No credentials, providers, endpoints, or external services were invented.
- `supabase_migration.sql` was updated as source-of-truth only; no destructive
  SQL was applied to the remote database from this run.
