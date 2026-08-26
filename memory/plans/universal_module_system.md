# Plan: Universal Module System

> Fecha: 2026-07-24
> Estado: PENDIENTE DE REVISION

---

## 1. Diagnostico del Sistema Actual

### Lo que funciona
- `src/data/itemCategories/` — registro de modulos por tipo, con `static type`, `static triggers[]`, metodos de lifecycle
- `itemService.js` — factory que compone modulos en una entidad, expone `entity.use(context)`
- `items.js` — definiciones declarativas con `modules: { heal: { amount: 15 } }`
- `statusService.js` — efectos persistentes (active_effects[], cooldowns) via JSONB

### Lo que impide la universalidad

| Problema | Donde | Impacto |
|----------|-------|---------|
| **Hardcode de tipos** en `useItem()`: `if moduleType === "heal"`, `if moduleType === "buff"` | `inventoryService.js:178-202` | Anyadir nuevo modulo = modificar inventoryService |
| **Categorias atadas a items** | `itemCategories/` nombrado y estructurado solo para items | No reusable para armas/armaduras/habilidades |
| **Un solo trigger** (onUse) | Todos los modulos actuales | No hay ciclo de vida (onEquip, onAttack, onTurnStart...) |
| **Logica de aplicacion hardcodeada** (`setHp`, `addEffect` llamados directamente) | `inventoryService.js:193-202` | El orquestador deberia solo ejecutar modulos, no saber que hacen |
| **clases.js es data, no modulo** | `src/data/clases.js` | Las clases no pueden componerse con modulos |
| **6 stats decorativas** (fulgor/d_fulgor/r_fulgor/aspd/ref/mspd sin efecto real) | `combatEngine.js` | El sistema de modulos debe resolver esto dandoles funcion |
| **items.js en `src/data/` vs config en `src/config/`** | Inconsistencia de ubicacion | Dificulta encontrar definiciones |

---

## 2. Arquitectura Propuesta

### 2.1 Core: `Module` (la unidad minima de comportamiento)

```
src/modules/
  moduleRegistry.js     # Registro central de tipos de modulo
  ModuleBase.js         # Clase base que todos los modulos extienden
  triggers/
    onUse.js            # Ejecutor del trigger "onUse"
    onEquip.js          # Ejecutor del trigger "onEquip"
    onUnequip.js        # Ejecutor del trigger "onUnequip"
    onAttack.js         # Ejecutor del trigger "onAttack"
    onHit.js            # Ejecutor del trigger "onHit"
    onTurnStart.js      #
    onTurnEnd.js        #
  builtins/
    heal.js             # Module existente, renombrado
    buff.js             # Module existente, renombrado
    damage.js           # Module existente, completado
    temporal.js         # Module existente
    equipable.js        # Module existente
    statBoost.js        # NUEVO: buff persistente (para equipamiento)
    classFeature.js     # NUEVO: habilidades de clase
```

### 2.2 `ModuleBase` — clase base

```js
class ModuleBase {
  static type = "module_name";         // Identificador unico
  static triggers = ["onUse"];         // Eventos a los que responde
  static priority = 0;                 // Orden de ejecucion

  constructor(config) {
    this.config = config;              // Parametros de esta instancia
  }

  // Lifecycle methods — cada modulo implementa los que necesita
  onUse(context)       { return null; }
  onEquip(context)     { return null; }
  onUnequip(context)   { return null; }
  onAttack(context)    { return null; }
  onHit(context)       { return null; }
  onTurnStart(context) { return null; }
  onTurnEnd(context)   { return null; }

  // Helper: condiciones
  condition(context)   { return true; }
}
```

### 2.3 `ModuleRegistry` — registro central

```js
// moduleRegistry.js
class ModuleRegistry {
  static #types = new Map();

  static register(ModuleClass) {
    this.#types.set(ModuleClass.type, ModuleClass);
  }

  static get(type) {
    return this.#types.get(type) || null;
  }

  static getAll() {
    return Array.from(this.#types.keys());
  }

  static createInstance(type, config) {
    const Klass = this.#types.get(type);
    if (!Klass) return null;
    return new Klass(config);
  }
}
```

### 2.4 `Entity` — composicion de modulos (reemplaza a createItem)

```js
// entityFactory.js
class Entity {
  constructor(def) {
    this.id = def.id;
    this.type = def.type;         // "item" | "weapon" | "armor" | "skill" | "class"
    this.name = def.name;
    this.icon = def.icon;
    this.description = def.description;
    this.rarity = def.rarity || "common";
    this.price = def.price || 0;
    this.tags = def.tags || [];
    this.maxStack = def.maxStack || 1;

    // Instanciar modulos desde las definiciones
    this.modules = [];
    for (const [type, config] of Object.entries(def.modules || {})) {
      const instance = ModuleRegistry.createInstance(type, config);
      if (instance) this.modules.push(instance);
    }
  }

  trigger(event, context) {
    const sorted = this.modules
      .filter(m => m.constructor.triggers.includes(event))
      .sort((a, b) => b.constructor.priority - a.constructor.priority);

    const results = [];
    for (const mod of sorted) {
      if (mod.condition(context)) {
        const method = `on${event.charAt(0).toUpperCase() + event.slice(1)}`;
        if (typeof mod[method] === "function") {
          results.push({ type: mod.constructor.type, result: mod[method](context) });
        }
      }
    }
    return results;
  }
}
```

### 2.5 Trigger Executor Pipeline

Cada trigger tiene un ejecutor que sabe como aplicar los resultados de los modulos al estado del juego.

```js
// triggers/onUse.js
async function executeOnUse(character, entity, context) {
  const results = entity.trigger("onUse", context);
  const effects = [];

  for (const { type, result } of results) {
    if (!result) continue;
    switch (result.action) {
      case "heal":
        effects.push({ type: "hp_change", amount: result.amount });
        break;
      case "add_effect":
        effects.push({ type: "effect", effect: result.effect });
        break;
      case "damage":
        effects.push({ type: "damage", amount: result.amount });
        break;
      // Sin default — modulos nuevos solo anyaden cases nuevos
    }
  }

  return applyEffects(character, effects);
}
```

### 2.6 Capa de Definiciones

```
src/data/definitions/
  items.js          # items.js existente, renombrado como definicion de entidad
  weapons.js        # NUEVO: armas
  armor.js          # NUEVO: armaduras
  skills.js         # NUEVO: habilidades
  classes.js        # clases.js migrado a usar modulos
```

Cada definicion usa la misma forma:

```js
// weapons.js
const WEAPONS = {
  espada_basica: {
    id: "espada_basica",
    type: "weapon",
    name: "Espada Basica",
    icon: "🗡️",
    tags: ["fisico"],
    modules: {
      statBoost: { stat: "atk", amount: 5 },
      equipable: { slot: "mano_derecha" },
    },
  },
};
```

### 2.7 Capa de Servicios — orquestadores genericos

```
src/services/
  entityService.js        # Crea entidades desde definiciones (reemplaza itemService.js)
  effectService.js        # Aplica efectos genericos (hp_change, effect, damage...)
  equipmentService.js     # NUEVO: equipar/desequipar armas y armaduras
  skillService.js         # NUEVO: usar habilidades, cooldowns propios
  itemService.js          # REFINED: solo logica de inventario (add/remove/use delegado a entityService)
```

---

## 3. Mapeo de Migracion

### Fase 1 — Fundacion (no rompe nada existente)

| Archivo | Accion |
|---------|--------|
| `src/modules/ModuleBase.js` | [NEW] Clase base |
| `src/modules/moduleRegistry.js` | [NEW] Registro central |
| `src/modules/entityFactory.js` | [NEW] Factory de entidades |
| `tests/modules/moduleBase.test.js` | [NEW] Tests |

### Fase 2 — Migrar modulos existentes

| Archivo | Accion |
|---------|--------|
| `src/data/itemCategories/heal.js` | [MOVE → DELETE] Migrar a `src/modules/builtins/heal.js` |
| `src/data/itemCategories/buff.js` | [MOVE → DELETE] Migrar a `src/modules/builtins/buff.js` |
| `src/data/itemCategories/damage.js` | [MODIFY] Completar implementacion |
| `src/data/itemCategories/equipable.js` | [MOVE → DELETE] Migrar a `src/modules/builtins/equipable.js` |
| `src/data/itemCategories/temporal.js` | [MOVE → DELETE] Migrar a `src/modules/builtins/temporal.js` |
| `src/data/itemCategories/index.js` | [DELETE] Reemplazado por moduleRegistry |
| `src/modules/builtins/statBoost.js` | [NEW] Buff persistente para equipamiento |
| `src/modules/builtins/classFeature.js` | [NEW] Habilidad de clase |

### Fase 3 — Servicios centrales

| Archivo | Accion |
|---------|--------|
| `src/services/rpg/itemService.js` | [MODIFY] Reducir a delegar en entityService |
| `src/services/rpg/entityService.js` | [NEW] Factory universal |
| `src/services/rpg/effectService.js` | [NEW] Aplicador de efectos generico |
| `src/services/rpg/inventoryService.js` | [MODIFY] useItem() sin hardcode de tipos |
| `src/services/rpg/statusService.js` | [MODIFY] Adaptar para efectos genericos |

### Fase 4 — Nuevas entidades

| Archivo | Accion |
|---------|--------|
| `src/data/definitions/weapons.js` | [NEW] Catalogo de armas |
| `src/data/definitions/armor.js` | [NEW] Catalogo de armaduras |
| `src/data/definitions/skills.js` | [NEW] Catalogo de habilidades |
| `src/data/definitions/classes.js` | [MOVE] clases.js → definitions/ |
| `src/services/rpg/equipmentService.js` | [NEW] Equipar/desequipar |
| `src/services/rpg/skillService.js` | [NEW] Usar habilidades |

### Fase 5 — Trigger pipeline completo

| Archivo | Accion |
|---------|--------|
| `src/modules/triggers/onUse.js` | [NEW] Ejecutor pipeline |
| `src/modules/triggers/onEquip.js` | [NEW] Ejecutor pipeline |
| `src/modules/triggers/onUnequip.js` | [NEW] Ejecutor pipeline |
| `src/modules/triggers/onAttack.js` | [NEW] Ejecutor pipeline |
| `src/modules/triggers/onHit.js` | [NEW] Ejecutor pipeline |
| `src/modules/triggers/onTurnStart.js` | [NEW] Ejecutor pipeline |
| `src/modules/triggers/onTurnEnd.js` | [NEW] Ejecutor pipeline |

### Fase 6 — Integracion con combate

| Archivo | Accion |
|---------|--------|
| `src/services/rpg/combatEngine.js` | [MODIFY] Disparar triggers onAttack/onHit/onTurnStart/onTurnEnd |
| `src/services/rpg/combatState.js` | [MODIFY] Hook de modulos en ciclo de combate |
| `src/commands/rpg/combat/atacar.js` | [MODIFY] Pasar contexto de modulos |

---

## 4. Principios de Diseno

1. **Cero hardcode de tipos**: Ningun `if (type === "heal")` en servicios. El unico lugar que conoce tipos es `moduleRegistry`.
2. **Definiciones declarativas**: Todo se describe con `{ modules: { tipo: config } }`. Sin logica en las definiciones.
3. **Triggers como contract**: Los modulos solo se comunican con el sistema via resultados de triggers. El orquestador no sabe que hace internamente un modulo.
4. **Composicion > Herencia**: Las entidades son contenedores de modulos, no jerarquias de clases.
5. **Registro explícito**: Cada modulo debe registrarse en `moduleRegistry`. No hay autodeteccion.
6. **Separacion definicion/instancia**: Las definiciones son datos planos. Las instancias tienen estado (duracion, cargas, etc.).

---

## 5. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigacion |
|--------|:-----------:|------------|
| Romper items existentes (279 tests) | Alta | Migrar fase por fase, tests pasando en cada commit |
| Acoplar triggers de combate muy temprano | Media | Fase 6 es la ultima — todo lo anterior funciona sin combate |
| Overengineering | Media | No disenar para casos que no existen. Hacer lo minimo para el caso actual + 1 futuro |
| Perder rendimiento (mas objetos, mas modulos) | Baja | Los triggers son map lookups + sorted filter, O(n) con n pequeno |

---

## 6. Plan de Verificacion

| Etapa | Comando | Esperado |
|-------|---------|----------|
| Tests existentes | `npm run test:vite` | 279 tests verdes |
| Lint | `npm run lint` | 0 errores |
| Typecheck | `npm run typecheck` | 0 errores |
| Regresion items | Test manual: `/item_add`, `/usar`, `/inventario` | Mismo comportamiento |
| Regresion combate | Test manual: `/retar`, `/atacar`, `/esquivar`, etc. | Mismo comportamiento |
| Graphify | `npm run graphify:update` | Sin errores |
| Memoria | `nekomemori_record_memory` | Decisión registrada |

---

## 7. Resumen del Cambio

| Antes | Despues |
|-------|---------|
| `itemCategories/` (solo items) | `modules/` (universal) |
| Modulos atados a items | Modulos componibles en items/weapons/armor/skills/classes |
| `inventoryService.useItem()` con switch de tipos | Pipeline de triggers generico |
| Un solo trigger: `onUse` | Multiples triggers: onUse, onEquip, onUnequip, onAttack, onHit, onTurnStart, onTurnEnd |
| `clases.js` como data plana | Clases como entidades con modulos |
| 6 stats decorativas sin efecto | Stats conectadas a modulos que les dan funcion |
| Servicios saben que hace cada modulo | Servicios solo ejecutan triggers y aplican efectos genericos |
