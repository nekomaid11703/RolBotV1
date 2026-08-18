# Plan: Sistema Simplificado de Hechizos/Habilidades

> Fecha: 2026-08-18
> Estado: APROBADO PARA PREPARACIÓN (andamiaje) — implementación por fases
> Relacionado: `universal_module_system.md` (predecesor, se simplifica)

---

## 1. Objetivo

Reducir la complejidad de desarrollo del sistema de forja de hechizos **sacrificando
variabilidad a cambio de universalidad manejable**. El árbol actual (Fase D:
naturaleza → sub-tipo → rol → activación/momento → efectos → recursos) es difícil de
mantener y de resolver en el motor. Se reemplaza por **4 ejes fijos y pequeños** más un
**registro extensible de efectos** que NO se implementan todavía: solo el sistema que
los soporta.

El objetivo final se mantiene: **NO programar un módulo por habilidad**. El sistema
construye y recrea cualquier habilidad combinando datos (tipo + aplicación + naturaleza
+ efectos), no código.

---

## 2. Taxonomía nueva (sistema simplificado)

### 2.1 Tipo de hechizo (forma de resolución) — 5 valores

| tipo | comportamiento |
|------|----------------|
| `proyectil` | Daño a melee o a distancia (golpe único) |
| `explosion` | Daño en área o aplica un efecto en área |
| `barrera` | Protege o confina (bloqueo, muro, jaula) |
| `buffo` | Positivo o negativo, **solo afecta stats** |
| `aura` | Embuye objetos o jugadores (aplicación a un objetivo) |

### 2.2 Tipo de aplicación — 2 valores

| tipo | significado |
|------|-------------|
| `propia` | Afecta a quien casteó la habilidad |
| `externa` | Dirigida a un objetivo externo al jugador |

### 2.3 Naturaleza de fulgor — 2 familias

**TODO hechizo tiene SIEMPRE una naturaleza de fulgor (nunca nula).**

| familia | sub-tipos |
|---------|-----------|
| `elemental` | agua, fuego, tierra, aire, hielo, **electro** |
| `primordial` | luz, oscuridad, caos |

Total: **9 naturalezas de fulgor** (`FULGOR_NATURES`). Un hechizo siempre referencia
una de ellas como su aplicación de fulgor.

### 2.4 Reacciones elementales (orden de aplicación: pasivo @ dominante)

Se **mantienen las reacciones elementales**, gobernadas por la PERSISTENCIA ELEMENTAL
(estado de imbuición): cuando un objetivo está imbuido con un elemento (aura pasiva),
recibir otro elemento dispara la reacción por **orden de aplicación**:

```
pasivo (ya imbuido)  @  dominante (entrante)  →  reacción
```

Reglas de persistencia (`ELEMENT_PERSISTENCE`, `resolveElementReaction`):

| Caso | Comportamiento |
|------|----------------|
| Sin aura previa | El golpe IMPRIME el elemento dominante (aura pasiva por `baseTurnos`) |
| Mismo elemento de nuevo | **Refresca** la ventana, NO reacciona |
| Par con reacción en `ELEMENT_REACTIONS` | **Reacciona** (tabla `pasivo@dominante`) y consume el aura |
| Par sin reacción definida | El dominante **reemplaza** la aura pasiva |

La tabla `ELEMENT_REACTIONS` (clave `${pasivo}@${dominante}`) define las 39 reacciones
del sistema. Reglas de diseño:

| Regla | Efecto en la tabla |
|-------|--------------------|
| Un elemento NO reacciona consigo mismo | No hay claves `X@X` |
| geo (tierra) siempre cristalizado | Con cualquier elemento en ambos órdenes; el orden NO cambia la reacción pero SÍ el daño (geo dominante > geo pasivo) |
| geo y anemo NO reaccionan entre sí | `tierra@aire` excluida |
| anemo no es persistente: solo dominante | `X@aire` → torbellino; nunca pasivo |
| primordiales solo dominante contra elementales | `X@luz/oscuridad/caos` → reacción única por primordial |
| Núcleo fuego/hielo/agua/electro: ciclo fuego > hielo > agua > electro > fuego | Las dominancias cambian la reacción según el orden; las neutras (fuego-agua, hielo-electro) dan la misma en ambas direcciones |

### 2.5 Efectos (registro extensible — NO se crean aún, solo el sistema)

Lista semilla (no exhaustiva): `veneno`, `quemadura`, `enredado`, `congelado`,
`purificado`, `maldito`, `rompe_armaduras`, `choque_termico`, `decadencia`, etc.

Cada efecto se declara como **dato** con metadatos (id, label, descripción, targets
compatibles, duración, stackable, tipos de hechizo/aplicación compatibles). La lógica de
resolución de cada efecto se registra por separado (handler) — en esta fase quedan vacíos.

> **Regla de oro**: los efectos son la parte más amplia y compleja. Por eso NO se
> implementan ahora; solo se construye el sistema que los soporta (registro + resolver
> declarativo). Añadir un efecto nuevo = añadir una entrada al registro + un handler, sin
> tocar el motor.

---

## 3. Arquitectura propuesta

```
src/config/spellTree.js            [NEW]  Taxonomía simplificada (kinds, applications,
                                           natures + FULGOR_NATURES, effect registry,
                                           ELEMENT_REACTIONS + ELEMENT_PERSISTENCE)
src/services/rpg/spellEffects.js   [NEW]  Resolver declarativo de efectos (+
                                           resolveElementReaction por orden pasivo@dominante)
src/services/rpg/skillForgeService.js [MODIFY] validateSpellRecipe acepta la taxonomía
                                           nueva; buildSpellDefinition traduce tipo/
                                           aplicación/naturaleza/efectos al SpellModule
src/data/itemCategories/spell.js   [MODIFY] payload con los nuevos ejes + naturaleza
                                           de fulgor siempre presente
src/config/combatBalance.js        [MODIFY] SPELL_NATURES/ROLES/etc. → migrados a
                                           spellTree.js (re-export para retrocompat)
scripts/spell_lab/index.html       [MODIFY] árbol desplegable: tipo → aplicación →
                                           naturaleza → efectos
tests/spell_tree_simplified.test.js [NEW]  Valida taxonomía + resolver + reacciones
```

### 3.1 `spellTree.js` — esqueleto de datos

```js
const SPELL_KINDS = {
  proyectil:  { label: "Proyectil/Arma", target: ["enemigo", "area"] },
  explosion:  { label: "Explosión",       target: ["area"] },
  barrera:    { label: "Barrera",         target: ["propio", "area"] },
  buffo:      { label: "Buffo",           target: ["propio", "enemigo", "aliado"] },
  aura:       { label: "Aura",            target: ["propio", "aliado"] },
};

const SPELL_APPLICATIONS = ["propia", "externa"];

const SPELL_NATURES = {
  elemental:  { subtypes: ["agua", "fuego", "tierra", "aire", "hielo", "electro"] },
  primordial: { subtypes: ["luz", "oscuridad", "caos"] },
};
const FULGOR_NATURES = [...]; // 9 naturalezas aplanadas

// Persistencia elemental (imbuición): baseTurnos / mismoElemento / sinReaccion.
const ELEMENT_PERSISTENCE = { baseTurnos: 2, mismoElemento: "refresca", sinReaccion: "reemplaza" };

// Reacciones por orden de aplicación: clave `${pasivo}@${dominante}`.
const ELEMENT_REACTIONS = {
  // "hielo@fuego": { label: "Derretido", canal: "x1.5" },  // se llena en Fase 4
};

// Registro de efectos: SOLO metadatos. El campo `handler` se llena en fases futuras.
const EFFECT_DEFS = { /* ... veneno, quemadura, enredado, congelado, purificado,
  maldito, rompe_armaduras, choque_termico, decadencia ... */ };
```

### 3.2 `spellEffects.js` — resolver declarativo

```js
function resolveSpellEffects(spell, ctx) {
  // spell.effects[] → para cada uno, busca handler en EFFECT_DEFS
  //   handler presente → ejecuta y acumula resultado
  //   handler null     → { tipo, applied: false, pending: true }
  return resultados;
}

function resolveElementReaction(ctx, dominante) {
  // ctx.objetivo.auraPasiva (elemento imbuido) @ dominante (entrante)
  //   sin aura            → imprime dominante como aura pasiva
  //   mismo elemento      → refresca ventana (no reacciona)
  //   par en la tabla     → reacciona y consume el aura
  //   sin reacción        → el dominante reemplaza la aura
  return decision + auraResultante;
}
```

El resolver es genérico: no sabe qué hace cada efecto ni cada reacción. Solo
despacha por `tipo` a un handler registrado y consulta la tabla de reacciones por
`pasivo@dominante`. Eso es lo que permite añadir habilidades nuevas sin tocar el motor.

---

## 4. Cambios por archivo

| Archivo | Acción | Detalle |
|---------|--------|---------|
| `src/config/spellTree.js` | [NEW] | Taxonomía simplificada + FULGOR_NATURES + EFFECT_DEFS + ELEMENT_REACTIONS + ELEMENT_PERSISTENCE |
| `src/services/rpg/spellEffects.js` | [NEW] | Resolver declarativo de efectos + resolveElementReaction |
| `src/services/rpg/skillForgeService.js` | [MODIFY] | Validar/construir con la taxonomía nueva (retrocompat hits legacy); naturaleza de fulgor obligatoria |
| `src/data/itemCategories/spell.js` | [MODIFY] | Payload con `kind`, `application`, `nature`, `effects[]` |
| `src/config/combatBalance.js` | [MODIFY] | Re-export de la nueva taxonomía (retrocompat con exports actuales) |
| `scripts/spell_lab/index.html` | [MODIFY] | Árbol simplificado: tipo → aplicación → naturaleza → efectos |
| `tests/spell_tree_simplified.test.js` | [NEW] | Validación de taxonomía + resolver + reacciones elementales + retrocompat |
| `memory/decisions.md` | [MODIFY] | Registrar la decisión arquitectónica |

---

## 5. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Romper la forja existente (Fase D) que ya tiene hechizos persistidos en `user_spells.json` | `spellTree.js` como fuente única re-exportada desde `combatBalance.js`; validación acepta ambos modos (árbol nuevo + legacy) |
| Los tests existentes (`spell_forge_tree_service.test.js`, `spell_module_tree.test.js`, etc.) dependen de la taxonomía vieja | Migrar los fixtures de los tests al sistema nuevo; el resolver nuevo no toca el motor existente (aditivo) |
| Efectos sin handler = hechizos que "no hacen nada" en combate | El resolver devuelve `{ pending: true }` explícito; la UI muestra "efecto no implementado" |
| Overengineering del registro de efectos | Solo metadatos mínimos (id/label/description/compatibilidad/duración/stackable); los handler se añaden cuando exista la mecánica |

---

## 6. Plan de verificación

| Etapa | Comando | Esperado |
|-------|---------|----------|
| Tests del nuevo módulo | `npx vitest run tests/spell_tree_simplified.test.js` | Verde |
| Suite completa | `npm test` | 0 fallos |
| Lint | `npm run lint` | 0 errores |
| Typecheck | `npm run typecheck` | 0 errores |
| Grafo | `npm run graphify:update` | Sin errores |

---

## 7. Fases de implementación

- **Fase 0 — Preparación (ESTA)**: `spellTree.js` + `spellEffects.js` + tests + decisión.
  No toca código existente (aditivo).
- **Fase 1 — Servicio**: `skillForgeService` valida/construye con la taxonomía nueva;
  retrocompat con recetas legacy (Fase B hits y Fase D árbol viejo).
- **Fase 2 — Lab**: `index.html` consume la nueva taxonomía y expone los 4 ejes.
- **Fase 3 — Motor**: `combatEngine`/`combatState` consumen el resolver de efectos
  (aplicar duraciones, stacks, triggers onHit/onTurnStart). Los handler de efectos se
  implementan en esta fase, efecto a efecto, sin tocar el motor.
- **Fase 4 — Reacciones**: la tabla `ELEMENT_REACTIONS` YA está llenada (39 reacciones,
  incluidas primordiales); queda `combatState` manteniendo el estado de imbuición
  (`auraPasiva` + turnos) que `resolveElementReaction` consulta y la semántica
  numérica de cada reacción (amplificador `canal`, daño geo según rol, estados).

  **Implementado (2026-08-18)**:
  - `resolveElementReaction` devuelve `multiplicador` (= `canal`, default 1) y `efectos`
    (ids de `EFFECT_DEFS`) en todas las ramas; las no-reacción dan 1/[].
  - `combatState` mantiene `aura: { pasiva, turnos }` por slot (challenger/defender),
    `applyElementalHit` consulta el resolver y persiste `auraResultante`
    (imprimir/refresca/consumir/reemplazar), `advanceTurn` decae la ventana (`decaySlotAura`).
  - `applyElementalAttack`: helper de motor que resuelve la imbuición sobre el objetivo
    y AMPLIFICA el daño del golpe por el `canal` (evento instantáneo). `equipmentResolverService`
    expone el elemento dominante del hechizo en el vocabulario canónico de reacciones
    (`resolveSpellDominante`: pyro→fuego, hydro→agua, cryo→hielo, ..., primordiales directos).
  - Cableado: `dummyTurnService.executeDummyAttack` (dummy→jugador) y `atacar.js`
    (jugador→objetivo) llaman a `applyElementalAttack` cuando el arma trae elemento;
    `combatMessages.formatElementReactionLine` imprime el evento ("Reacción derretido ×1.5").
  - Los `efectos` de estado (quemadura/congelado/...) viajan en la decisión pero su
    aplicación por `statusService` queda en Fase 3/4 siguiente (handlers de efectos).

---

## 8. Resumen del cambio

| Antes (Fase D) | Después (Simplificado) |
|----------------|------------------------|
| 4 naturalezas (primordial/elemental/material/conceptual) | 2 naturalezas (elemental/primordial) |
| 6 roles (ataque/imbuicion/defensa/curacion/utilidad/movimiento) | 5 tipos de hechizo (proyectil/explosion/barrera/buffo/aura) |
| 10 tipos de efecto genéricos + targets | 2 aplicaciones (propia/externa) |
| Activación + momento | Eliminados (derivados del tipo) |
| Efectos como taxonomía cerrada | Efectos como **registro extensible** (datos + handler) |
