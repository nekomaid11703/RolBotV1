---
name: memoria_compartida
description: Shared-memory coordination for Codex, Antigravity, and future agents working on RolBotV1.
---

# Shared Memory Skill

Use this skill whenever a task affects coordination, architecture, AI providers,
MCP, Supabase, or cross-agent handoff.

## Procedure

1. Read `ai-memory/memory_protocol.md`.
2. Read `ai-memory/design_board.md`.
3. Search `ai-memory/rolbot-memory.jsonl` for matching tags or filenames.
4. Determine whether the task needs a new ticket, a memory entry, or both.
5. After validation, record only durable knowledge.

## Memory Types

Use the canonical types from `ai-memory/memory_protocol.md`:

- `decision`
- `bug`
- `fix`
- `feature`
- `risk`
- `validation`
- `handoff`
- `pending`

## Fragmentation Controls

- Prefer updating or superseding a prior decision over duplicating it.
- Keep board tickets operational and memory entries reusable.
- Include `relatedFiles` and `tags` so other agents can recover context cheaply.
- Never store secrets.

## Done Criteria

A coordination task is complete only when:

- The board reflects the current status.
- Durable decisions are in memory.
- Validation evidence is recorded or explicitly marked pending.

