# ADR-002: Infraestructura de herramientas de calidad

**Fecha**: 2026-07-14
**Contexto**: El proyecto tenía 0 herramientas de análisis estático, 0 CI, 0 guardarraíles. Los bugs llegaban a producción sin detección temprana (15 HIGH bugs encontrados en auditoría inicial).
**Decisión**: Implementar stack completo: ESLint 10 + TypeScript 7 (strict) + Prettier 3 + dependency-cruiser 18 + Knip + Husky/lint-staged + Vitest + Stryker + GitHub Actions CI + ADR.
**Consecuencias**: Todo cambio pasa por lint + typecheck + depcruise + format check antes de committear. CI verifica en cada push. Mutations testing mide calidad de tests. Decisiones arquitectónicas quedan documentadas en ADR.
**Alternativas consideradas**: Usar solo ESLint (insuficiente, no atrapa null/undefined). Usar solo TypeScript sin strict (no atrapa los 15 HIGH bugs).
