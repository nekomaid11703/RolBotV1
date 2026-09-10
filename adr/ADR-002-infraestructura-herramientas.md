# ADR-002: Infraestructura de herramientas de calidad

**Fecha**: 2026-07-14
**Contexto**: El proyecto tenía 0 herramientas de análisis estático, 0 CI, 0 guardarraíles. Los bugs llegaban a producción sin detección temprana (15 HIGH bugs encontrados en auditoría inicial).
**Decisión**: Implementar stack completo: ESLint 10 + TypeScript 7 (strict) + Prettier 3 + dependency-cruiser 18 + Knip + Husky/lint-staged + Vitest + GitHub Actions CI + ADR. Stryker (mutation testing) queda diferido: su configuración fue retirada del repo y se reintroducirá como Fase 3.3 del roadmap cuando se priorice la cobertura de mutantes.
**Consecuencias**: Todo cambio pasa por lint + typecheck + depcruise + format check antes de committear. CI verifica en cada push. Decisions arquitectónicas quedan documentadas en ADR.
**Alternativas consideradas**: Usar solo ESLint (insuficiente, no atrapa null/undefined). Usar solo TypeScript sin strict (no atrapa los 15 HIGH bugs).
