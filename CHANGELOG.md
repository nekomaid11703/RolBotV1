# Changelog

## 2026-07-14 — Tooling & cleanup sprint

### Added
- TypeScript strict mode (`strict: true`) — 1069→0 errors in src/
- Knip (dead code analysis) — 5 dead files deleted
- `npm run check:all` (lint + typecheck + depcruise + format:check + test:all)
- Husky + lint-staged (pre-commit lint + format)
- GitHub Actions CI (lint, typecheck, depcruise, format:check)
- eslint-plugin-jsdoc (flat config, warn level)
- Vitest 4 + config (tests not yet migrated)
- Stryker 9 + config (mutates src/core/, break:50)
- ADR records: ADR-001 (IA elimination), ADR-002 (tooling infrastructure)
- Graphify skill workflow documented (.opencode/skills/graphify.md)
- `src/services/displayNameService.js` — extracted from userMentionUtils for architecture compliance

### Fixed
- 35 unused vars removed across 23 files (ESLint clean: 0 errors, 0 warnings)
- 110 files formatted with Prettier
- 12 dead exports removed (characterService, bugReportService, loggerService, permissionService)
- 2 `utils-not-to-services` depcruise violations eliminated
- `test_cache_state_version.js` — 5 combat-specific tests removed, 6/6 pass
- README.md — AI layer references removed, tooling badges added

### Removed
- AI orchestrator layer (Gemini, OpenRouter, HuggingFace, Ollama)
- `classifyUtils.js`, `combatLogger.js`, `dataLoader.js`, `statCalculator.js`, `duelService.js`, `syncService.js`
- `getOwnerDisplayName` (dead export from permissionUtils)

### Remaining debt
- depcruise: 3 warnings (2 data/ orphans, 1 combat circular)
- 11 test failures (8 combat-related, 3 missing npm modules)
- Knip: ~139 "unused exports" mostly false positives (dynamic require)
