# RolBotV1 Agent Operating Rules

This workspace uses a shared-memory workflow for Codex, Antigravity, and future agents.
The source of truth is the current project state plus the memory artifacts in
`ai-memory/`.

## Priority Order

1. Preserve and consult shared memory before making architectural decisions.
2. Use `ai-memory/design_board.md` as the live task board.
3. Use `ai-memory/rolbot-memory.jsonl` as the reusable knowledge log.
4. Validate changes before documenting them as complete.
5. Never invent credentials, endpoints, providers, or installed tools.

## Startup Checklist

At the start of any non-trivial task:

1. Read `ai-memory/memory_protocol.md`.
2. Read `ai-memory/design_board.md`.
3. Search `ai-memory/rolbot-memory.jsonl` for relevant tags or keywords.
4. Inspect the files directly involved in the task.
5. Check the working tree before modifying files.

## Shared Memory Rules

Use NekoMemori when available through MCP. If MCP is unavailable, update the
memory files directly using the schema defined in `ai-memory/memory_protocol.md`.

Record memory for:

- Decisions that affect architecture, data flow, providers, MCP, or Supabase.
- Bugs with confirmed cause and resolution.
- Validation results that future agents should trust.
- Handoffs that let another agent continue without chat context.
- Pending blockers that require user input or external setup.

Do not record memory for:

- Temporary thoughts.
- Raw logs without a conclusion.
- Duplicate summaries of the same decision.
- Secrets or credentials.

## Design Board Rules

`ai-memory/design_board.md` tracks operational work. A ticket should include:

- ID.
- Logical owner: `@Arquitecto`, `@Coder`, `@Creativo`, or `@Validador`.
- Status.
- Target files.
- Acceptance criteria.
- Related memory entries when available.

Completed tickets should point to validation evidence or a memory entry.

## Validation Rules

Prefer the existing project checks:

- `node tests/test_crear_pj.js`
- `node test_supa.js` when network access is available.
- MCP stdio tool listing for NekoMemori.
- AI orchestrator tests only when network/API quota is expected to be available.

If Docker, Go, GitHub PAT, or another external dependency is missing, report it
as a blocker instead of creating fake configuration.

## Documentation Rules

For meaningful work, update the smallest useful set of artifacts:

- `task.md` for current execution status.
- `ai-memory/design_board.md` for cross-agent coordination.
- `ai-memory/rolbot-memory.jsonl` for reusable facts.
- `AI_CHANGELOG.md` for completed project-level changes.

