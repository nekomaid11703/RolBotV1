# Shared Memory Protocol

This protocol defines how Codex, Antigravity, and future agents coordinate
through persistent project memory.

## Canonical Stores

- `ai-memory/rolbot-memory.jsonl`: durable knowledge log.
- `ai-memory/design_board.md`: live operational task board.
- `task.md`: current execution checklist.
- `AI_CHANGELOG.md`: project-level completed changes.

NekoMemori MCP is the preferred interface when available. Direct file edits are
allowed only when MCP is unavailable or when the change is part of project
maintenance.

## Entry Schema

Every new durable memory entry should include:

```json
{
  "id": "mem-YYYYMMDD-HHMMSS-topic",
  "createdAt": "YYYY-MM-DDTHH:MM:SSZ",
  "type": "decision",
  "summary": "Short reusable fact",
  "details": "What happened, why it matters, and how it was validated.",
  "tags": ["memory", "mcp"],
  "sourceAgent": "codex",
  "relatedFiles": ["ai-memory/design_board.md"],
  "status": "active",
  "supersedes": []
}
```

Existing entries without the extended fields remain valid historical data.
New entries should use the extended fields so agents can filter reliably.

## Types

- `decision`: architecture or process decision.
- `bug`: confirmed faulty behavior.
- `fix`: correction applied.
- `feature`: capability implemented.
- `risk`: known risk or technical debt.
- `validation`: test, check, or verification result.
- `handoff`: context for another agent to continue.
- `pending`: missing information or external blocker.

## Write Rules

Write memory when:

- A technical decision changes future work.
- A bug root cause is confirmed.
- A fix or feature is validated.
- A handoff is needed between Codex, Antigravity, or another agent.
- An external blocker is confirmed.

Do not write memory for:

- Raw command output without a conclusion.
- Temporary reasoning.
- Duplicate decisions.
- Secrets or credentials.

## Read Rules

Before significant work:

1. Read the design board.
2. Search memory by tags, filenames, and feature names.
3. Prefer recent active entries, but check `supersedes` for replaced decisions.
4. Use the smallest relevant context in prompts to external AI providers.

## Synchronization Rules

- Board tickets track work state.
- Memory entries track reusable knowledge.
- Changelog entries track completed project changes.
- `task.md` tracks the current execution.

If a ticket is completed, it should reference either validation evidence or a
memory entry. If a memory entry replaces another, set `supersedes` and mark the
older entry as superseded when practical.

## Fragmentation Controls

- One active decision per topic.
- One active ticket per unit of work.
- Handoffs must include target files, current state, next step, and blockers.
- Agents must not rely on chat history when a fact belongs in memory.

## Current Confirmed Capabilities

- NekoMemori MCP is operational through stdio.
- Supabase connectivity has been validated with `node test_supa.js`.
- The AI orchestrator has providers for Gemini, OpenRouter, Hugging Face, and
  Ollama, with fallback behavior validated.
- Shared memory context is available through `memoryContextService.js`.
  Agent/worker tasks can opt in with `useMemory: true`; user-facing generation
  should stay clean unless explicitly intended.
- Automatic token-saving delegation is available through
  `aiOrchestrator.runTokenSavingWorkflow()` and `aiService.runTokenSavingWorkflow()`.
  It delegates only when estimated savings or quality gain is meaningful,
  prioritizes free/cheap providers for simple work, keeps low-value tasks local
  to Codex/Antigravity, and runs a highest-quality `qualityGate` before final
  assembly. If delegation, quality review, or assembly fails because a provider
  runs out of quota/tokens, the workflow must return structured fallback data so
  Codex/Antigravity can continue locally without discarding safe partial results.
- GitHub MCP source is present but local operation is blocked until Docker or Go
  and a real GitHub token are available.
- RAG, vector databases, and embeddings are not implemented.
