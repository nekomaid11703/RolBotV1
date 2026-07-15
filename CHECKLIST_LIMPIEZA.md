# Checklist de Implementación — Limpieza de Código

> Cada item debe ser completado secuencialmente. No pasar al siguiente hasta que el anterior esté verificado.

## Fase 0: Preparación

- [ ] 0.1 Ejecutar `python -m graphify . --update` para grafo actualizado
- [ ] 0.2 Ejecutar `npm run test:all` y guardar snapshot en `graphify-out/test-baseline.log`
- [ ] 0.3 Ejecutar `npm run lint > graphify-out/lint-baseline.log 2>&1`
- [ ] 0.4 Ejecutar `npm run typecheck > graphify-out/typecheck-baseline.log 2>&1`
- [ ] 0.5 Ejecutar `npm run depcruise > graphify-out/depcruise-baseline.log 2>&1`
- [ ] 0.6 Crear tag: `git tag pre-limpieza-$(date +%Y%m%d)`

---

## Fase 1: Importaciones Rotas (CRÍTICO)

### Paso 1.1 — Implementar `getCharacterNames` en `characterService.js`
- [ ] Agregar función que retorna `Set<string>` con nombres de personajes
- [ ] Reutilizar `listCharacters()` para evitar duplicar lógica Supabase
- [ ] Exportar en `module.exports`

### Paso 1.2 — Implementar `renameCharacter` en `characterService.js`
- [ ] Validar que el nuevo nombre no exista ya (usar `getCharacterNames`)
- [ ] Actualizar `name` y `slug` en Supabase
- [ ] Invalidar cache con `invalidateUserCache`
- [ ] Exportar en `module.exports`

### Paso 1.3 — Implementar `updateCharacterSlots` en `characterService.js`
- [ ] Leer slots actuales de Supabase
- [ ] Merge con el parche recibido
- [ ] Hacer upsert en Supabase
- [ ] Invalidar cache
- [ ] Exportar en `module.exports`

### Paso 1.4 — Verificación
- [ ] `node -e "const {getCharacterNames,renameCharacter,updateCharacterSlots}=require('./src/services/characterService');console.log('OK:', typeof getCharacterNames, typeof renameCharacter, typeof updateCharacterSlots)"`
- [ ] `npm run test:all`
- [ ] `npm run lint`
- [ ] `npm run typecheck`

---

## Fase 2: Archivos Completamente Muertos

### Paso 2.1 — Eliminar `src/utils/roll.js`
- [ ] Confirmar con grep que ningún archivo lo require
- [ ] Eliminar archivo

### Paso 2.2 — Eliminar `src/utils/resultUtils.js`
- [ ] Confirmar con grep que ningún archivo lo require
- [ ] Eliminar archivo

### Paso 2.3 — Mover `src/data/races.js` a `_archive/`
- [ ] Confirmar que ningún archivo lo require
- [ ] Mover: `git mv src/data/races.js _archive/races.js`
- [ ] Si _archive no existe como directorio, crearlo

### Paso 2.4 — Mover `src/data/classes.js` a `_archive/`
- [ ] Confirmar que ningún archivo lo require
- [ ] Mover: `git mv src/data/classes.js _archive/classes.js`

### Paso 2.5 — Verificación
- [ ] `npm run depcruise` — deben haber desaparecido los 4 orphans warnings
- [ ] `npm run test:all`
- [ ] `npm run lint`

---

## Fase 3: Exports Sin Uso Externo

### Paso 3.1 — `messageFormatUtils.js`
- [ ] Quitar del `module.exports`: `LINE`, `BOX_TOP`, `BOX_BTM`, `BAR`, `buildUsageBody`, `buildFormBody`, `buildFeedbackBody`, `formatFeedback`
- [ ] ✅ Mantener definiciones internas de las funciones (se usan entre sí)

### Paso 3.2 — `commandParseUtils.js`
- [ ] Quitar del `module.exports`: `formatJidTag`, `formatMentionTag`, `parsePositiveInteger`, `resolveTargetUserId`, `extractPhoneFromArgs`
- [ ] ✅ Mantener `formatJidTag`, `formatMentionTag`, `parsePositiveInteger` como funciones internas (las usan otras funciones del mismo archivo)
- [ ] ❌ Eliminar `resolveTargetUserId` y `extractPhoneFromArgs` (sin uso interno ni externo)

### Paso 3.3 — `groupUtils.js`
- [ ] Quitar del `module.exports`: `saveWarns`, `deleteWarns`
- [ ] ✅ Mantener las funciones (uso interno por `addWarn`, `deleteWarn`)

### Paso 3.4 — `identityUtils.js`
- [ ] ❌ Eliminar función `getDisplayableIdentity` y quitarla del `module.exports`

### Paso 3.5 — `permissionUtils.js`
- [ ] Quitar del `module.exports`: `normalizeJid`, `extractPhoneNumber`, `isSameIdentity`
- [ ] ✅ Mantener los imports desde `identityUtils.js` (se usan internamente)

### Paso 3.6 — `userMentionUtils.js`
- [ ] Quitar del `module.exports`: `isMeaningfulDisplayName`
- [ ] ✅ Mantener la función (uso interno por `formatDisplayMention`, `getProfileDisplayName`)

### Paso 3.7 — `cacheService.js`
- [ ] Quitar del `module.exports`: `LRUCache`
- [ ] ✅ Mantener la clase (se usa internamente para instanciar `cache`)

### Paso 3.8 — `userService.js`
- [ ] Quitar del `module.exports`: `stripAccents`, `creatorDigits`, `getCreatorFolderName`
- [ ] ❌ Eliminar funciones `isUserRegistered` y `syncUserMetadata` (sin uso: ni interno ni externo)
- [ ] ✅ Mantener `stripAccents`, `creatorDigits`, `getCreatorFolderName` como funciones internas

### Paso 3.9 — `schedulerService.js`
- [ ] Quitar del `module.exports`: `stopMidnightReview`
- [ ] ✅ Mantener la función

### Verificación Fase 3
- [ ] `npx knip` — verificar que exports muertos bajaron significativamente
- [ ] `npm run test:all`
- [ ] `npm run lint`
- [ ] `npm run typecheck`

---

## Fase 4: Código Duplicado

### Paso 4.1 — `top_dinero.js`: reemplazar `getMedal()`
- [ ] Agregar import: `const { medal } = require("../../utils/activityFormatUtils")`
- [ ] Reemplazar todas las llamadas `getMedal(idx)` → `medal(idx)`
- [ ] Eliminar función `getMedal`

### Paso 4.2 — Verificar re-exports de `permissionUtils.js`
- [ ] Ya cubierto en 3.5. Confirmar con grep que nadie importa `normalizeJid/extractPhoneNumber/isSameIdentity` desde `permissionUtils.js`

### Paso 4.3 — Helper de economía admin (opcional pero recomendado)
- [ ] Crear `src/commands/economy/_ecoAdminHelper.js`
- [ ] Refactorizar `add_stelas.js` para usarlo
- [ ] Refactorizar `rem_stelas.js` para usarlo
- [ ] Refactorizar `set_stelas.js` para usarlo
- [ ] Test manual de cada comando: add, rem, set

### Paso 4.4 — Helper de grupo admin (opcional pero recomendado)
- [ ] Crear `src/commands/admin/group/_groupAdminHelper.js`
- [ ] Refactorizar `ban.js`, `demote.js`, `promote.js` para usarlo
- [ ] Refactorizar `warn.js`, `unwarn.js` para usarlo
- [ ] Test manual de cada comando

### Verificación Fase 4
- [ ] `npm run test:all`
- [ ] `npm run lint`
- [ ] `npm run typecheck`

---

## Fase 5: Verificación Final

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run depcruise`
- [ ] `npm run test:all`
- [ ] `npx knip`
- [ ] `python -m graphify . --update`
- [ ] Revisar diff final: `git diff --stat`
- [ ] Commit: `git add -A && git commit -m "limpieza: código muerto y duplicado"`

---

## Resumen de Archivos Afectados

| Archivo | Cambio | Fase |
|---|---|---|
| `src/services/characterService.js` | +3 funciones (getCharacterNames, renameCharacter, updateCharacterSlots) | 1 |
| `src/utils/roll.js` | ❌ Eliminado | 2 |
| `src/utils/resultUtils.js` | ❌ Eliminado | 2 |
| `src/data/races.js` | Movido a `_archive/` | 2 |
| `src/data/classes.js` | Movido a `_archive/` | 2 |
| `src/utils/messageFormatUtils.js` | -8 exports | 3 |
| `src/utils/commandParseUtils.js` | -5 exports, -2 funciones | 3 |
| `src/utils/groupUtils.js` | -2 exports | 3 |
| `src/utils/identityUtils.js` | -1 función, -1 export | 3 |
| `src/utils/permissionUtils.js` | -3 exports redundantes | 3 |
| `src/utils/userMentionUtils.js` | -1 export | 3 |
| `src/utils/cacheService.js` | -1 export | 3 |
| `src/services/userService.js` | -5 exports, -2 funciones | 3 |
| `src/services/schedulerService.js` | -1 export | 3 |
| `src/commands/economy/top_dinero.js` | +1 import, -1 función | 4 |
| `src/commands/economy/add_stelas.js` | Refactor (opcional) | 4 |
| `src/commands/economy/rem_stelas.js` | Refactor (opcional) | 4 |
| `src/commands/economy/set_stelas.js` | Refactor (opcional) | 4 |
| `src/commands/admin/group/ban.js` | Refactor (opcional) | 4 |
| `src/commands/admin/group/demote.js` | Refactor (opcional) | 4 |
| `src/commands/admin/group/promote.js` | Refactor (opcional) | 4 |
| `src/commands/admin/group/warn.js` | Refactor (opcional) | 4 |
| `src/commands/admin/group/unwarn.js` | Refactor (opcional) | 4 |
