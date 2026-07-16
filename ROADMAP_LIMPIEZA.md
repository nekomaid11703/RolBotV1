# Roadmap de Limpieza — Código Muerto y Duplicado

> **Regla cardinal**: No pasar al siguiente punto hasta que el anterior esté 100% revisado, testeado y verificado. Cada fase produce un commit funcional.

## Fase 0: Preparación y Línea Base

```mermaid
flowchart LR
    A[Snapshot tests] --> B[graphify --update]
    B --> C[Ejecutar knip baseline]
    C --> D[git tag pre-limpieza]
```

### 0.1 — Backup del grafo
```bash
cd RolBotV1
python -m graphify . --update
```

### 0.2 — Snapshot de tests
```bash
npm run test:all 2>&1 | tee graphify-out/test-baseline.log
npm run lint > graphify-out/lint-baseline.log 2>&1
npm run typecheck > graphify-out/typecheck-baseline.log 2>&1
npm run depcruise > graphify-out/depcruise-baseline.log 2>&1
```

### 0.3 — Tag pre-limpieza
```bash
git tag pre-limpieza-$(date +%Y%m%d)
```

**✅ Verificación**: Todos los tests pasan, lint 0 errores, depcruise 0 errores (las 4 warnings de orphans son esperadas).

---

## Fase 1: Importaciones Rotas (Prioridad CRÍTICA)

> **Razón**: 3 comandos fallan en runtime. `getCharacterNames`, `updateCharacterSlots` y `renameCharacter` no existen en `characterService.js`. Los usuarios que ejecuten `eliminar_pj`, `renombrar_pj`, `switch_pj` o `editar_pj_descripcion` recibirán un error.

### 1.1 — Revisar qué hacen realmente los comandos rotos

Leer cada comando y entender qué esperan de las funciones faltantes:

| Comando | Importa | La usa para |
|---|---|---|
| `eliminar_pj.js` | `getCharacterNames` | `names.has(name)` — verificar si el personaje existe |
| `renombrar_pj.js` | `getCharacterNames` | `names.has(currentName)` y `names.has(newName)` |
| `switch_pj.js` | `getCharacterNames` | `names.has(name)` |
| `editar_pj_descripcion.js` | `updateCharacterSlots` | Actualizar campo `slots.historia` |
| `renombrar_pj.js` | `renameCharacter` | Cambiar nombre del personaje |

### 1.2 — Implementar `getCharacterNames` en `characterService.js`

La función debe retornar un `Set<string>` con los slugs/nombres de los personajes del usuario. Ya existe `listCharacters()` que consulta Supabase — podemos reutilizarla:

```js
async function getCharacterNames({ creatorId }) {
  const characters = await listCharacters({ creatorId, bypassCache: true });
  return new Set(characters.map((c) => c.name));
}
```

### 1.3 — Implementar `renameCharacter` en `characterService.js`

Operación simple: actualizar `slug` y `name` en Supabase para el personaje, validando que el nuevo slug no exista ya. Reutilizar `getCharacterSlug()`, `getCharacterNames()` y `safeSingleOrNull()`.

### 1.4 — Implementar `updateCharacterSlots` en `characterService.js`

Actualizar `slots` (columna JSONB) del personaje en Supabase, mezclando el parche con los slots existentes. Reutilizar `getCharacterSlug()` y `safeSingleOrNull()`.

### 1.5 — Exportar las 3 nuevas funciones

Agregar al `module.exports` de `characterService.js`.

### 1.6 — Test de humo para cada comando

```bash
node -e "
  const { getCharacterNames, renameCharacter, updateCharacterSlots } = require('./src/services/characterService');
  console.log('exports OK:', typeof getCharacterNames, typeof renameCharacter, typeof updateCharacterSlots);
"
```

**✅ Verificación**: Los 3 imports existen y son funciones. Ejecutar `npm run test:all` y `npm run lint`.

---

## Fase 2: Archivos Completamente Muertos (4 archivos)

### 2.1 — `src/utils/roll.js`

Es una función `roll(min, max)` de 3 líneas. **No se importa en ningún lado**.

- ✅ Revisar: ¿hay código que haga `Math.random()` manualmente y podría usar esto? NO — no hay imports.
- ❌ **Eliminar el archivo**.

### 2.2 — `src/utils/resultUtils.js`

Contiene `ok/fail/isError/unwrap`. **No se importa en ningún lado**.

- ✅ Revisar: ¿el patrón Result podría ser útil para servicios? Sí, pero nadie lo usa.
- ❌ **Eliminar el archivo**. Si se necesita en el futuro, se recupera de git.

### 2.3 — `src/data/races.js` (1200+ líneas)

20 definiciones de razas RPG. **No se importa en ningún lado**. La migración de FASE 3 (refactor) probablemente movió los datos a Supabase.

- ✅ Verificar con `grep -r "races" src/` que no haya referencias residuales.
- ✅ Preguntar: ¿el plan es poblar desde Supabase? El archivo es un catálogo estático obsoleto.
- ❌ **Mover a `_archive/`** en lugar de eliminar, por si el diseño aún necesita estos datos como seed.

### 2.4 — `src/data/classes.js` (299 líneas)

Mismo caso que `races.js`. Definiciones de clases RPG estáticas.

- ❌ **Mover a `_archive/`** manteniendo el historial.

**✅ Verificación**: `npm run depcruise` debe reportar 0 orphans (dejaron de ser 4). `npm run test:all` 0 fallos.

---

## Fase 3: Exports Sin Uso (28 funciones/variables)

> **Razón**: Estas funciones se exportan pero ningún otro archivo las importa. Son ruido que confunde a futuros desarrolladores y a herramientas de análisis.

### 3.1 — Limpiar `messageFormatUtils.js` (8 exports muertos)

`LINE`, `BOX_TOP`, `BOX_BTM`, `BAR`, `buildUsageBody`, `buildFormBody`, `buildFeedbackBody`, `formatFeedback`.

- Todas son usadas **internamente** por `box()`, `formatCommandUsage()`, `formatError()`.
- Solo eliminar del `module.exports`. No eliminar las funciones si se usan internamente.

**Cuidado**: `buildUsageBody` es usado por `formatCommandUsage`, `buildFormBody` por `formatCommandForm`, `buildFeedbackBody` por `formatFeedback` y `formatError`. Tienen uso interno. Solo sacarlas del export.

### 3.2 — Limpiar `commandParseUtils.js` (5 exports muertos)

`formatJidTag`, `formatMentionTag`, `parsePositiveInteger`, `resolveTargetUserId`, `extractPhoneFromArgs`.

- `parsePositiveInteger` es usado internamente por `extractAmountFromArgs` → mantener función, quitar del export.
- `formatMentionTag` y `formatJidTag` se usan internamente → mantener, quitar del export.
- `resolveTargetUserId` y `extractPhoneFromArgs` no se usan ni interna ni externamente → eliminar funciones y del export.

### 3.3 — Limpiar `groupUtils.js` (2 exports muertos)

`saveWarns`, `deleteWarns`.

- `saveWarns` es usado internamente por `addWarn` y `deleteWarn`.
- `deleteWarns` es usado internamente por `deleteWarn`.
- Solo eliminar del `module.exports`. Mantener las funciones.

### 3.4 — Limpiar `identityUtils.js` (1 export muerto)

`getDisplayableIdentity`.

- No tiene uso ni interno ni externo → eliminar función y del export.

### 3.5 — Limpiar `permissionUtils.js` (3 exports redundantes)

`normalizeJid`, `extractPhoneNumber`, `isSameIdentity`.

- Son **re-exports** de `identityUtils.js`. Ya los importa internamente para usarlos, no necesita re-exportarlos.
- Solo eliminar del `module.exports`.

### 3.6 — Limpiar `userMentionUtils.js` (1 export muerto)

`isMeaningfulDisplayName`.

- Es usado internamente por `formatDisplayMention` y `getProfileDisplayName`.
- Solo eliminar del `module.exports`.

### 3.7 — Limpiar `cacheService.js` (1 export muerto)

`LRUCache` (la clase).

- Solo la instancia `cache` se usa desde `safeQuery.js`.
- Eliminar del `module.exports`.

### 3.8 — Limpiar `userService.js` (5 exports muertos)

`stripAccents`, `creatorDigits`, `getCreatorFolderName`, `isUserRegistered`, `syncUserMetadata`.

- `stripAccents` se usa **internamente** por `sanitizeName` → mantener función, quitar del export.
- `creatorDigits` se usa internamente por `getCreatorFolderName` → mantener, quitar del export.
- `getCreatorFolderName` se usa internamente → mantener, quitar del export.
- `isUserRegistered` y `syncUserMetadata` no se usan ni interna ni externamente → eliminar funciones y del export.

### 3.9 — Limpiar `schedulerService.js` (1 export muerto)

`stopMidnightReview`.

- No es usada por ningún otro archivo. Pero la función `stopMidnightReview` podría ser útil para apagar el scheduler en tests o al hacer shutdown. Decisión: mantener la función por si acaso, eliminar del export si nadie la necesita. O simplemente dejarla como está — Knip la marca pero es una función de "API pública" potencial.

**✅ Verificación**: Ejecutar `npx knip` y confirmar que las exportaciones muertas bajaron de 28 a ~0-1 (solo la intencional). `npm run test:all`, `npm run lint`, `npm run typecheck`.

---

## Fase 4: Código Duplicado

### 4.1 — Reemplazar `getMedal()` en `top_dinero.js`

**Problema**: `getMedal()` en `top_dinero.js` es idéntica a `medal()` en `activityFormatUtils.js`.

**Solución**: Importar `medal` desde `activityFormatUtils.js` y eliminar `getMedal` de `top_dinero.js`.

**Riesgo**: Mínimo. La función es pura, sin side effects.

### 4.2 — Eliminar re-exports de `permissionUtils.js`

**Problema**: `normalizeJid`, `extractPhoneNumber`, `isSameIdentity` se definen en `identityUtils.js` y se re-exportan desde `permissionUtils.js`.

**Solución**: Ya se cubrió en 3.5. Solo confirmar que ningún archivo importa estas 3 desde `permissionUtils.js` (grep confirma que no).

### 4.3 — Extraer helper para comandos de economía admin (refactor mediano)

**Problema**: `add_stelas.js`, `rem_stelas.js`, `set_stelas.js` comparten ~80% de estructura idéntica.

**Solución**: Crear `src/commands/economy/_ecoAdminHelper.js` con una función `async function adminEconomyAction(ctx, { action, amountLabel, ... })`.

**Riesgo**: Moderado. Involucra tocar 3 comandos + crear 1 archivo nuevo. Requiere test manual de cada comando.

### 4.4 — Extraer helper para comandos de grupo admin (refactor mediano)

**Problema**: `ban.js`, `demote.js`, `promote.js`, `unwarn.js`, `warn.js` comparten estructura.

**Solución**: Similar a 4.3 — crear `src/commands/admin/group/_groupAdminHelper.js`.

**Riesgo**: Moderado. 5 comandos afectados.

### 4.5 — Unificar bloque de actividad en `actividad.js` / `actividad_global.js`

**Problema**: Ambos archivos construyen el mismo listado de estadísticas con formato idéntico.

**Solución**: Opcional. Extraer `formatActivityLines(activity)` en `activityFormatUtils.js`.

**Riesgo**: Bajo. Solo mover formato existente.

**✅ Verificación**: Ejecutar cada comando manualmente en test suite o con mocking. `npm run test:all`, `npm run lint`.

---

## Fase 5: Refinamiento y Verificación Final

### 5.1 — Actualizar `.gitignore` si archivos movidos a `_archive/`

### 5.2 — Re-ejecutar análisis completo

```bash
npm run lint
npm run typecheck
npm run depcruise
npm run test:all
npx knip
```

### 5.3 — Actualizar graphify

```bash
python -m graphify . --update
```

### 5.4 — Commit final

```bash
git add -A
git commit -m "limpieza: código muerto y duplicado (fases 1-5)"
```

---

## Resumen de Fases

| Fase | Descripción | Archivos tocados | Riesgo |
|---|---|---|---|
| 0 | Preparación y baseline | 0 (solo logs) | Ninguno |
| 1 | Importaciones rotas | 1 (characterService.js) + test | **CRÍTICO** |
| 2 | Archivos muertos | 4 eliminados/movidos | Bajo |
| 3 | Exports sin uso | 9 archivos | Bajo |
| 4 | Código duplicado | 10+ archivos (refactors) | Moderado |
| 5 | Verificación final | 0 | Ninguno |

## Orden de Fases (DAG de dependencias)

```
Fase 0 (preparación)
  │
  ▼
Fase 1 (importaciones rotas) — debe ir primero porque arregla bugs activos
  │
  ▼
Fase 2 (archivos muertos) — independiente de Fase 1, pero después por seguridad
  │
  ▼
Fase 3 (exports sin uso) — toca los mismos archivos que Fase 2? NO. Independiente.
  │
  ▼
Fase 4 (código duplicado) — toca commands, no services/utils ya limpiados
  │
  ▼
Fase 5 (verificación final)
```
