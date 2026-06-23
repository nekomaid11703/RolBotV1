---
name: auditoria_calidad
description: Quality, verification, and repository hygiene workflow adapted for RolBotV1.
---

# Quality Audit Skill

Use this skill after implementation or when reviewing existing changes.

## Checklist

1. Verify the smallest relevant test suite.
2. Check that generated or sensitive files are ignored.
3. Confirm no unrelated user changes were reverted.
4. Update memory, board, and changelog only with verified outcomes.
5. Record unresolved risks as `pending` or `risk`.

## Preferred Checks

- `node tests/test_crear_pj.js`
- `node test_supa.js` when network is allowed.
- MCP stdio tool listing for NekoMemori.
- Dependency checks with `npm.cmd ls --depth=0`.

## Done Criteria

The task is done when the code/config is validated, documentation is updated,
and remaining blockers are explicit.

