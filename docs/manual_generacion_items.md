# Manual de Generación de Ítems

> **Fuente de verdad** para crear y manejar ítems. Cualquier ítem nuevo debe
> poder explicarse desde este manual. Lo escrito en código manda sobre el manual;
> si hay discrepancia, se corrige el manual (o el código, previo análisis).
>
> Estado actual: **solo combate**. En el futuro se añadirán ítems de otros sistemas.
> El manual es incremental: se expande sección a sección.
>
> ⚠️ Este manual se construye con **retroalimentación humana**. Las secciones
> con `[PENDIENTE]` no están cerradas: no diseñar ítems sobre ellas todavía.

---

## 1. Propósito del manual

1. **Enseñar a crear ítems válidos**: qué campos son obligatorios, qué valores
   acepta cada campo, qué se deriva y qué se declara.
2. **Poner reglas al manejo de cada ítem**: cómo el motor consume cada tipo de
   ítem (equipar, atacar, absorber daño, durabilidad, precio, stack).

Cada ítem documentado aquí es un ejemplo **verificado** (se deriva con las
fórmulas reales del motor). No se documentan ítems imaginarios.

---

## 2. Principios de diseño (consensuados con el usuario)

Estos principios NO los decide el manual: son la base de diseño del sistema.
Todo ítem nuevo debe respetarlos.

### 2.1. El tier NO es una medida estándar

> **La progresión por tier depende de la naturaleza del arma.** Distintas
> naturalezas usan el tier de formas distintas; no existe un "tier = X poder"
> universal.

| Naturaleza | Cómo usa el tier |
|------------|------------------|
| `perforante` | Escala con ATK + tier del arma (`0.6×atk + base`), ignora DEF 100%. |
| `cortante` | Escala con ATK + tier (penetra DEF por tier). |
| `contundente` | Se mitiga con DEF; el arma aporta a cuerpo y el material es fijo ×1.5. |

Implicación: un `perforante` tier A no equivale a un `cortante` tier A. Hay que
juzgar cada arma en su naturaleza.

### 2.2. DPS parejo entre naturalezas

> A igualdad de tier y stats, las 3 naturalezas producen DPS parejo.
> Se diferencian por **mecánica**, no por números de base más altos/bajos.
> Balance cerrado en `combatBalance.js`/`combatEngine.js` (2026-08-06).

| Naturaleza | Cuerpo (DEF media, E→N) | Material | Mecánica distintiva |
|------------|--------------------------|----------|---------------------|
| `cortante` | 48→100 | = cuerpo | Penetra DEF 12-84% por tier. Fiable contra todo. |
| `contundente` | 52→73 | ×1.5 del cuerpo | Anti-equipamiento: rompe armadura en 2-3 golpes (no 1). |
| `perforante` (melee) | 52→79 | ×0.5 | Ignora DEF: consistente incluso contra tanques. |

Datos de ejemplo (ATK 60, DEF 50, arma hierro nominal 20): los tres rondan
50-70 de cuerpo a tier bajo y 73-100 a tier alto; contundente compensa su
cuerpo menor con más daño material, perforante con ignorar la DEF.

### 2.3. 1 mano vs 2 manos: decisión por arma, no regla

> El sistema está diseñado para crear armas **variadas**, incluso dentro de la
> misma naturaleza. Llevar un arma a 2 manos o a 1 mano es una decisión de
> equilibrio **por arma**, con ventajas y desventajas propias. No existe un bono
> universal "2 manos pega más".

### 2.4. Melee vs distancia: solo importa el rango

> La distinción melee/arco es **conceptual**, no mecánica. Al motor solo le
> importa que el objetivo esté **dentro del rango del arma** para atacar sin
> moverse.
>
> - Una **espada no es el único arma cortante**; un **arco no es el único arma
>   a distancia**. Pistolas, látigos y todo el espectro entre arco y espada están
>   contemplados por el sistema.
> - El número que importa es `weaponRange` (+ mecánica de proyectil si aplica).

### 2.5. Relación material → arma: aptitud por tipo

> Regla **cualitativa** (cerrada en §6, 2026-08-06): un material debe tener la
> aptitud evidente para el arma (flexibilidad alta → arco, afilabilidad →
> filo, resistencia → contundente). Sin umbrales numéricos obligatorios;
> el generador no restringe.

### 2.6. Armadura: mantener fórmulas actuales

> `maxResist = round(resistencia_material)` y `bonusDef = round(maxResist / 2)`.
> La cobertura es movilidad (penaliza mspd), no defensa.

### 2.7. Durabilidad: REVISAR

> [PENDIENTE / HALLAZGO] Con el sistema de daño material actual, **ninguna
> armadura aguanta más de un combate**. Hay que revisar el sistema de daño
> material antes de cerrar reglas de durabilidad (§8).

### 2.8. Rareza: puramente conceptual

> La rareza es una **escala conceptual, no mecánica**. Se usa solo para definir
> conceptualmente qué materiales deberían ser más fuertes. No otorga poder,
> afijos ni efectos por sí misma.

---

## 3. Anatomía de un ítem (`ItemDefinition`)

Un ítem se define con `createItemDefinition(input)` (`src/services/rpg/itemFactory.js`).
El factory valida y **deriva** parte de la definición; no se puede inventar
números donde la fórmula ya los calcula.

| Campo | Tipo | ¿Derivado? | Regla |
|-------|------|------------|-------|
| `id` | `string` | — | Obligatorio, único. Patrón `snake_case`. |
| `type` | `string` | — | Obligatorio. Uno de los tipos válidos (§4). |
| `name` | `string` | si falta | Default: el `id`. |
| `description` | `string` | si falta | Default: `""`. |
| `basePrice` | `number` | si falta | Default: `0`. |
| `maxStack` | `number` | si falta | Default: `99` (consumibles) / `1` (resto). |
| `rarity` | `string` | si falta | Default: `"comun"`. |
| `tier` | `string` | si falta | Default: `"E"`. Se normaliza (E–N). |
| `material` | `string` | si falta | Default: `"madera"`. |
| `categories` | `string[]` | si falta | Default: `[type]`. |
| `modules` | `object` | — | Claves = módulos registrados (§5). Validado fail-fast. |
| `setId` | `string\|null` | si falta | Default: `null`. |
| `isRepairable` | `boolean` | si falta | Default: `true`. |
| `metadata` | `object` | **SÍ** | Se deriva de material × tier (§7). NO se declara. |

### 3.1. Regla de oro

> **El tier de un material es solo su calidad individual.** Un material puede
> existir en cualquier tier: cobre tier S o N, adamantita tier E. El tier **no**
> es un techo ligado a la rareza. NO usar caps de tier por rareza al crear ítems.

---

## 4. Tipos de ítem (`ItemType`)

Fuente: `itemFactory.js` → `VALID_TYPES`.

| Tipo | Uso | Ejemplo de módulo |
|------|-----|-------------------|
| `weapon` | Arma equipable en `mano_der` (o 2 manos) | `weapon` |
| `armor` | Pieza de armadura en slot corporal | `armor` |
| `artifact` | Artefacto pasivo (buff) en `artefacto_1..4` | `buff` |
| `consumable` | Consumible (poción, venda…) | `heal` |
| `material` | Material de crafteo | — |
| `special` | Ítem especial | — |
| `throwable` | Arma arrojadiza (no equipable, consume turno) | `throwable` |

---

## 5. Módulos (`modules`)

Fuente: `src/data/itemCategories/index.js` (registro). Claves válidas y su efecto
en combate:

| Módulo | Clave | Config | Qué hace |
|--------|-------|--------|----------|
| `weapon` | `weapon` | `damageNature`, `hands`, `baseDamage`, `weaponRange` | Define el arma y su ataque. |
| `armor` | `armor` | `slot`, `coverage`, `bonusDef` | Pieza de armadura. |
| `buff` | `buff` | `stats` | Stats pasivas del artefacto. |
| `heal` | `heal` | `amount` | Curación del consumible. |
| `throwable` | `throwable` | `damageNature`, `baseDamage`, `range` | Arma arrojadiza de una pieza. |
| `equipable` | `equipable` | — | Hace equipable un ítem. |
| `temporal` | `temporal` | — | Ítem temporal (se limpia al terminar). |
| `damage` | `damage` | — | Módulo de daño genérico. |
| `durability` | `durability` | `maxResist`, `currentResist`, `isRepairable` | Absorbe daño material. |

> **Regla**: si un módulo no está registrado, `createItemDefinition` lanza error.
> No inventar claves de módulo nuevas sin registrarlas primero.

---

## 6. Material y tipo de arma (mínimos por tipo)

> **CERRADO (2026-08-06)**: se descartan umbrales numéricos obligatorios.
> Los mínimos quedan como **regla cualitativa**: un material debe tener la
> aptitud evidente para el arma (flexibilidad alta → arco; afilabilidad alta →
> filo; resistencia alta → contundente). El generador NO restringe: todo
> material forja todo arma de su pool.

Aptitud cualitativa de referencia (guía, no umbral):

| Tipo de arma | Aptitud preferida |
|--------------|-------------------|
| Espada (cortante) | afilabilidad |
| Estoque (perforante melee) | afilabilidad |
| Maza/Clava (contundente) | resistencia_material |
| Arco (ranged) | flexibilidad |

---

## 7. Fórmulas derivadas (fuente: `itemStatService.js`)

Base general: `base × tier × material`. Nunca definir estas stats planas.

### 7.1. Material (`getMaterialStats(material, tier)`, `materialData.js`)

`materialData.js` define 4 stats base por material (rango 1-100):

| Stat | Rol |
|------|-----|
| `afilabilidad` | Filo: escala el daño base de armas. |
| `conduccion_magica` | Fulgor: conducción mágica. |
| `resistencia_material` | Dureza: durabilidad y resistencia de armadura. |
| `flexibilidad` | Elasticidad: arcos y materiales flexibles. |

Las stats efectivas = `round(base × getTierMultiplier(tier))`.

Multiplicadores de tier (`tierConfig.js`):
`E 1.12 · D 1.24 · C 1.36 · B 1.48 · A 1.60 · S 1.72 · N 1.84`.

> ⚠️ Aunque el tier aplica un multiplicador global, **la progresión efectiva se
> siente por naturaleza** (§2.1). Este multiplicador es el "techo nominal", no la
> medida estándar de poder.

### 7.2. Arma (`getWeaponStats`)

| Stat | Fórmula |
|------|---------|
| `baseDamage` (cuerpo a cuerpo) | `round(baseNominal × tierMult × afilabilidad / 50)` |
| `baseDamage` (ranged) | `0` — el daño lo aporta la flecha |
| `damageNature` | Del módulo `weapon` (cortante/contundente/perforante) |
| `hands` | Del módulo `weapon` (1 o 2) |
| `weaponRange` | Del módulo `weapon` |

### 7.3. Armadura (`getArmorStats`)

| Stat | Fórmula |
|------|---------|
| `maxResist` | `round(resistencia_material)` (a tier efectivo) |
| `bonusDef` | `round(maxResist / 2)` — derivado, NO configurable |

### 7.4. Durabilidad (derivada en `itemFactory`)

Para `weapon`/`armor`/`artifact`:
`maxResist = max(1, round(resistencia_material))`, `currentResist = maxResist`,
`isRepairable` según definición.

> ⚠️ Ver §2.7: hay que revisar el sistema de daño material. Reglas de vida útil
> en §8 `[PENDIENTE]`.

> Los tipos `consumable`, `material`, `special` y `throwable` **no** llevan
> durabilidad persistente.

---

## 8. Reglas de manejo en combate

Cómo el motor consume cada ítem equipado (`equipmentResolverService.js` →
`combatEngine.js`).

### 8.1. Arma equipada

- El arma se busca en el slot **`mano_der`** y debe tener módulo `weapon`.
- Se resuelve a `weaponInfo = { damageNature, tier, baseDamage, hands, weaponRange, ranged }`.
- Sin arma equipada ⇒ `weaponInfo = null` ⇒ ataque **desarmado**.
- Arma a 2 manos ocupa `mano_der` + `mano_izq` (marcador interno `__2h:`).

### 8.2. Naturalezas de daño (`calculateWeaponDamage`, `combatEngine.js`)

| Naturaleza | Fórmula corporal | Regla |
|------------|------------------|-------|
| `cortante` | `0.8×atk + base` | Penetra DEF por tier (12-84%). Material = cuerpo. |
| `contundente` | `atk × 100/(100+def) + 0.5×base` | Se mitiga con DEF; material = cuerpo × 1.5 (fijo). |
| `perforante` (melee) | `0.6×atk + base` | Ignora DEF 100%; material = cuerpo × 0.5. |
| `perforante` (arco) | `base(flecha) × BOW_DAMAGE_MULT × falloff` | La flecha aporta daño; el tier del arco multiplica; ignora DEF. |
| desarmado | `atk × 100/(100+def)` | Sin arma. |

> Recordatorio §2.2: pese a fórmulas distintas, el diseño busca DPS parejo;
> la diferencia está en la mecánica (penetrar, romper armadura, ignorar DEF).

### 8.3. Rango y mecánica de proyectil

- Al motor solo le importa que el objetivo esté dentro de `weaponRange` (§2.4).
- `ranged: true` implica mecánica de proyectil (arco + flecha, falloff, AERO).
- Un arma sin `ranged` es cuerpo a cuerpo aunque su `weaponRange` sea alto
  (látigo, jabalina equipable…).

### 8.4. Arco y flechas

- El arco (`weapon.ranged = true`) NO aporta `baseDamage` propio; la **flecha** sí.
- `BOW_DAMAGE_MULT` (E 1.2 … N 7.6), `BOW_SPEED_BASE`, `BOW_ASPD_BASE`, `AERO`,
  `FALLOFF_K = 2` en `combatBalance.js`.
- Stock de flechas: **fijo en 20** (`AMMO_STOCK_MIN = AMMO_STOCK_MAX = 20`).

### 8.5. Durabilidad / resistencia material

> [PENDIENTE] Reglas a revisar (§2.7). Hoy: `currentResist` baja con cada golpe
> absorbido; si llega a 0, `broken` (si reparable) o se destruye.

### 8.6. Artefactos

- Los ítems con categoría `artifact` aportan `buff.stats` pasivos al combate
  (`resolveArtifacts` → `getArtifactStats`).

---

## 9. Ejemplos verificados

> Cada ejemplo incluye la definición real y las stats derivadas por el motor.

### 9.1. Espada de Hierro (cortante) — `espada_de_hierro`

**Definición** (`src/data/ironFamily.js`, registrada en `itemCatalog`):

```js
{
  id: "espada_de_hierro",
  type: "weapon",
  name: "Espada de Hierro",
  description: "Espada cortante forjada en hierro. Sólida y fiable.",
  rarity: "poco_comun",
  basePrice: 350,
  categories: ["weapon"],
  material: "hierro",        // afil 45 · conj 20 · res 55 · flex 25
  tier: "E",                 // mult 1.12
  modules: {
    weapon: { damageNature: "cortante", hands: 1, baseDamage: 20, weaponRange: 1 },
  },
}
```

**Stats derivadas (verificadas con el motor):**

| Stat | Valor | Cálculo |
|------|-------|---------|
| `baseDamage` | **22** | `round(20 × 1.12 × 50/50) = round(22.4)` |
| `damageNature` | `cortante` | módulo |
| `hands` | 1 | módulo |
| `weaponRange` | 1 m | módulo |
| `tier` | E | normalizado |
| Durabilidad `maxResist` | **62** | `max(1, round(55 × 1.12)) = round(61.6)` |
| Durabilidad `currentResist` | 62 | = maxResist inicial |
| Material tier E | afil 50 · conj 22 · res 62 · flex 28 | `round(base × 1.12)` |

**Reglas de manejo:**
- Se equipa en `mano_der` (1 mano) → deja `mano_izq` libre para escudo.
- Ataque: `0.8×atk + 22` (cortante, penetra por tier).
- Durabilidad 62: absorbe daño material hasta romperse (reparable).
- `maxStack = 1` (no apilable).
- `basePrice = 350` monedas.

**Validación en el sistema:**

```js
const { getItem } = require("./src/data/items");
const { createItemDefinition } = require("./src/services/rpg/itemFactory");
const { getWeaponStats } = require("./src/services/rpg/itemStatService");

const def = createItemDefinition(getItem("espada_de_hierro"));
getWeaponStats(def); // { damageNature: "cortante", tier: "E", hands: 1, baseDamage: 22, weaponRange: 1, ranged: false }
```

---

## 10. Checklist para crear un ítem válido

1. [ ] `id` único en `snake_case`.
2. [ ] `type` en `VALID_TYPES` (§4).
3. [ ] Módulo(s) registrado(s) (§5); `modules` válidos.
4. [ ] `material` existe en `materialData.js`.
5. [ ] `tier` en E–N (no usarlo como cap por rareza; es calidad individual).
6. [ ] Stats derivadas con las fórmulas de §7 (no planas).
7. [ ] Naturaleza de daño coherente con la fórmula de §8.2.
8. [ ] **DPS en línea con su naturaleza** (§2.2): no inflar una naturaleza.
9. [ ] **1H/2H y rango justificados por diseño del arma** (§2.3, §2.4).
10. [ ] Durabilidad/`isRepairable` coherentes con el tipo (§7.4).
11. [ ] Definido en el catálogo real (`src/data/`) y, si aplica, probado en simulación.
12. [ ] Verificado con `createItemDefinition` + `getItem` + `getWeaponStats`/`getArmorStats`.

---

## 11. Pendiente / en expansión

- [ ] §6 Mínimos de material por tipo de arma.
- [ ] §8.5 Revisar sistema de daño material (durabilidad > 1 combate).
- [ ] Definir tabla de nominales por naturaleza (si aplica).
- [ ] Ítems de sistemas fuera de combate (economía, crafteo, eventos).
- [ ] Materiales como ítem (`type: "material"`) y recetas de crafteo.
- [ ] Más familias y ejemplos verificados (armadura, artefactos, arrojadizos).
