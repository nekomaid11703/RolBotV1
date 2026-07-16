# Checklist — RolBotV1

> Consolidado el 2026-07-15. Marcar con `[x]` cuando esté completado.

---

## 🔴 Pendientes críticos

- [ ] **P0-2**: Rotar credenciales de Supabase y GitHub (`.env.local`)
  - [ ] Revocar SUPABASE_KEY actual en panel de Supabase
  - [ ] Revocar GITHUB_PERSONAL_ACCESS_TOKEN en GitHub Settings
  - [ ] Generar nuevas keys y actualizar `.env.local`

---

## 🟠 Alta prioridad

### Limpieza de _archive/ ✅ Completada
- [x] 55 archivos → 3 items: `races.js`, `classes.js`, `combat_systems_archive.zip`
- [x] Combate comprimido (44 archivos → 1 zip, 101 KB)
- [x] `docs/` y `fase3_purga/` eliminados (obsoletos)

### Documentación
- [ ] Verificar que ROADMAP.md, CHECKLIST.md y AUDITORIA_COMPLETA.md están actualizados
- [ ] Eliminar ROADMAP2.md, ROADMAP_LIMPIEZA.md, roadmap_antigravity_rolbotv1.md
- [ ] Eliminar CHECKLIST2.md, CHECKLIST_LIMPIEZA.md, CODE_REVIEW_CHECKLIST.md

---

## 🟡 Media prioridad

### Tests
- [ ] Migrar tests de `assert` nativo a vitest (`test()`/`expect()`)
- [ ] Renombrar `test_*.js` → `*.test.js` cuando estén migrados
- [ ] Remover `process.exit()` de los tests

### Arquitectura
- [ ] Verificar que schedulerService no importa de scripts/ (✅ resuelto)
- [ ] Evaluar si `_ecoAdminHelper.js` y `_groupAdminHelper.js` están completos

---

## 🟢 Baja prioridad

- [ ] Documentar política de retención de logs en `loggerService.js` (retención máxima, cleanOldLogs threshold)
- [ ] Re-auditar después de completar todos los items altos

---

## Historial de cambios

| Fecha | Items resueltos |
|-------|-----------------|
| 2026-07-15 | P1-1 (formato), P0-1 (messageTypeUtils), P1-2 (eslint .mjs), P1-3 (typecheck), P2-2 (repomix), P2-4 (zip), P2-3 (schedulerService), vitest config |
