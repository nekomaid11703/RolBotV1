---
name: investigacion
description: Evidence-first investigation workflow adapted for RolBotV1.
---

# Investigation Skill

Use this skill for bugs, unknown behavior, integrations, or external API checks.

## Procedure

1. Search with `rg` before opening broad files.
2. Follow definitions and call sites through the codebase.
3. Prefer local documentation and installed package files before web research.
4. Record the cause, impact, and evidence.
5. If data is missing, mark it as a pending requirement.

## Outputs

- Current behavior.
- Confirmed cause or uncertainty.
- Impact.
- Options for correction.
- Validation plan.

## Constraints

- Do not guess API behavior.
- Do not expose `.env` values.
- Do not modify files during a read-only investigation phase unless the user has
  already approved execution.

