# Roadmap — RolBotV1

> Consolidado el 2026-07-15 a partir de ROADMAP.md, ROADMAP2.md, ROADMAP_LIMPIEZA.md y roadmap_antigravity_rolbotv1.md

---

## Estado actual

| Métrica | Valor |
|---------|-------|
| Archivos activos (src/) | ~72 |
| Líneas activas | ~5,600 |
| Tests | 8 (node runner) |
| Lint | 0 errores, 169 warnings (JSDoc) |
| Typecheck | 0 errores |
| Formato | ✅ 100% formateado |
| Código muerto | 1 archivo eliminado |

---

## Fase 0 — Correcciones críticas ✅ Completada

| Item | Estado |
|------|--------|
| Fix 11 ESLint errors | ✅ |
| Fix crashing tests | ✅ |
| Export funciones faltantes | ✅ |
| Eliminar variables muertas | ✅ |
| Formatear todo el código | ✅ |
| Analizar archivos huérfanos | ✅ |
| Centralizar config en env | ✅ |

---

## Fase 1 — Infraestructura y calidad ✅ Completada

| Item | Estado |
|------|--------|
| ESLint + Prettier + Husky | ✅ |
| lint-staged pre-commit | ✅ |
| JSDoc plugin | ✅ |
| dependency-cruiser | ✅ |
| Knip | ✅ |
| ADR-001 y ADR-002 | ✅ |
| Graphify activo (1207 nodos) | ✅ |
| Skills migrados a opencode | ✅ |

---

## Fase 2 — Limpieza de código ✅ Parcial

| Item | Estado |
|------|--------|
| Implementar funciones rotas en characterService | ✅ |
| Eliminar roll.js, resultUtils.js | ✅ |
| Mover races.js, classes.js a _archive/ | ✅ |
| Eliminar messageTypeUtils.js | ✅ |
| Eliminar exports sin uso (28) | ⏳ Pendiente |
| Refactor duplicación en comandos | ⏳ Pendiente |
| Unificar roadmaps/checklists | ▶️ En proceso |

---

## Fase 3 — Pendiente

| Item | Prioridad |
|------|-----------|
| _archive/ limpiado (55 archivos → 3 items, ~95% de reducción) | ✅ Completado |
| Migrar tests a vitest nativo | 🟡 Media |
| Eliminar duplicación de documentación (4 roadmaps → 1) | 🟡 Media |
| Mover PII a env var (OWNER_PHONE) | 🟡 Media |
| Política de retención de logs | 🟢 Baja |

---

## Fase 4 — Visión a futuro

- CI/CD con GitHub Actions
- Pruebas de integración con Supabase mockeada
- Cobertura de mutación (Stryker)
- Despliegue reproducible (Docker)
- Cache de respuestas y prompts
