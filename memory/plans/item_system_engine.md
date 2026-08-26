# Plan — Sistema Gestor de Ítems (infraestructura, sin ítems concretos)

> **Estado**: En ejecución (Fases 1-7 completadas; Fase 8 en cierre) · 2026-08-03
> **Fecha**: 2026-08-03
> **Fuente**: `docs/item_system_specification.md` v1.0.0
> **Alcance**: construir la **mecánica que maneja ítems** (factory, estadística, resolución de equipo, durabilidad, cobertura, sets, persistencia, integración a combate). **NO se crean ítems del catálogo** — se prueban con fixtures sintéticos.

---

## Contexto (estado actual del código)

| Pieza | Estado |
|---|---|
| `tierConfig.js` (E–N, multiplicadores, mult. contundente/perforante, penetración) | ✅ implementado |
| `materialData.js` (20 materiales, 6 categorías, 4 atributos) | ✅ catálogo de materiales listo |
| Módulos de ítem (`itemCategories/`): heal, buff, damage, equipable, temporal, weapon, armor, durability | ✅ definidos |
| `itemService.createItem()` → `Entity` con módulos | ✅ factory básico |
| `combatEngine.calculateWeaponDamage()` (cortante/contundente/perforante) | ✅ motor listo |
| `combatEngine.applyMaterialAbsorption()` / DurabilityModule | ✅ motor listo |
| **Comandos de combate** (`atacar`, `huir`, `descansar`) llaman `executeAttack` sin `weaponInfo`/`armorDurability` | ❌ **grieta: el equipo no se resuelve ni aplica en combate real** |
| `inventory.metadata` (DB) | ✅ columna creada (migración 003), **code no la lee/escribe aún** |
| `characters.equipped_slots` | ✅ columna creada; `equipmentService` OK |
| Persistencia de durabilidad / rotura / destroyed | ❌ solo en memoria transitoria |
| Set bonuses (≥3 piezas) | ❌ no existe |
| Cobertura de armadura → MSPD / fatiga | ❌ no existe |
| `statusService` active_effects / cooldowns | ✅ parcial (buff de ítems) |

**Conclusión**: El ***motor*** (fórmulas y módulos) está casi completo; falta la **capa de gestión**: un sistema que (a) construya/valide definiciones de ítem genéricas, (b) derive estadísticas y durabilidad finales, (c) resuelva qué tiene equipado un personaje y lo entregue al combate, (d) persista durabilidad/rotura/metadata, y (e) integre cobertura y bonos de set. Eso es exactamente "el sistema que maneja los ítems".

---

## Fase 1 — Factoría & Registro genérico de definiciones

**Objetivo**: crear la mecánica para construir/validar una `ItemDefinition` sin hardcodear instancias; dejar el catálogo como inyectable.

- [x] **`src/services/rpg/itemFactory.js`**: `createItemDefinition({ type, base, material, tier, modules, price, maxStack, rarity, slots, setId })`
  - Deriva `metadata` inicial desde material+tier (durabilidad `maxResist`, daño base, rango).
  - Normaliza `tier` (reusar `normalizeTier`).
  - Valida tipo ∈ `weapon|armor|artifact|consumable|material|special`.
- [x] **`src/data/itemCategories/`**: asegurar que `index.js` expone `getCategory(type)` (ya existe) — sin cambios mayores; se usará para instanciar módulos.
- [ ] **Catálogo como interfaz inyectable**: definir `createRegistry(loadFns)` para que las definiciones vengan de un storage/fixture, no de un `items.js` estático. Vacío por ahora.

## Fase 2 — Resolución de Estadísticas del Ítem

**Objetivo**: combinar `base × tier × material` → estadísticas finales del ítem (sin ítems concretos, solo la fórmula).

- [x] **`src/services/rpg/itemStatService.js`**:
  - `getWeaponStats(def)` → `baseDamage` (corregido por `afilabilidad`), `tier`, `damageNature`, `hands`, `range` (flexibilidad para arcos).
  - `getArmorStats(def)` → `maxResist` (de `resistencia_material` × tier), `defBonus`, `coverage`, `setId`, `slot`.
  - `getArtifactStats(def)` → bonuses/buffs.
  - `getMaterialCost` / craft inputs (solo resolver, sin receta de crafteo aún).
- [ ] Tests de fórmulas con fixtures sintéticos (multiplicador tier × material).

## Fase 3 — Resolución de Equipo → Payload de Combate

**Objetivo:** convertir `equipped_slots` del personaje en insumos para `combatEngine`.

- [x] **`src/services/rpg/equipmentResolverService.js`**:
  - `resolveAttackerWeapon(char, inventoryMetadata)` → `{ damageNature, tier, baseDamage, hands, range } | null`.
  - `resolveDefenderArmor(char, inventory)` → lista de `DurabilityModule` por pieza + totales (`maxResist`, `currentResist`).
  - `resolveArtifacts(char)` → lista de buffs pasivos.
  - `getEquippedItems(charId)` → cruza `equipped_slots` ↔ `inventory` (con `metadata`).
- [ ] Datos fuente: `characters.equipped_slots` + `inventory.metadata` (leer durabilidad inicial).

## Fase 4 — Integración al Combate Real (cerrar la grieta)

- [x] Modificar `commands/rpg/combat/atacar.js` (principal):
  - Pasar `weaponInfo` (atacante) y `armorDurability` (defensor) a `executeAttack`/`executeReaction`.
  - Aplicar `applyMaterialAbsorption` + overflow → daño corporal.
  - Persistir durabilidad tras cada `Hit` (fallback silencioso).
- [x] **`src/services/rpg/durabilityPersistenceService.js`**: tras un `Hit`, actualizar `inventory.metadata` (currentResist, broken); si `isDestroyed` → quitar del inventario.
- [x] Mantener backward-compat: sin arma → `weaponInfo=null` (desarmado).

> [!note] Alcance Fase 4
> Cableado aplicado en `atacar.js` (ataque principal PvE/PvP). Los contraata de
> `descansar.js`/`huir.js` y la durabilidad en reacciones `esquivar/bloquear`
> quedan backward-compat (sin arma/armadura) → deuda registrada (TD-005).

## Fase 5 — Cobertura de Armadura y Bonos de Set

- [x] **`src/services/rpg/armorSetService.js`**:
  - Cobertura total/alta/media/ligera → penalizaciones `MSPD` / costo fatiga por movimiento (integración `fatigueEngine`).
  - Bonos de set: contar piezas por `setId`; si ≥3 → activar bonus (stat/mod o `active_effects`).

## Fase 6 — Persistencia de metadata (round-trip)

- [x] `inventoryService.addItem/useItem`: inicializar y mantener `metadata` (ruido del ítem, durabilidad inicial, broken).
- [ ] `inventoryService.useItem`: aplicar buffs a `statusService.active_effects` y persistir (ya parcial).
- [ ] Verificación de round-trip: `addItem → read inventory.metadata → update → reread`.

## Fase 7 — Pruebas (fixtures sintéticos, sin ítems concretos)

- [x] `tests/item_factory.test.js` — validación de tipos y derivación de stats.
- [x] `tests/item_stat_service.test.js` — fórmula base×tier×material.
- [x] `tests/equipment_resolver.test.js` — `equipped_slots` → payload de combate.
- [x] `tests/durability_persistence.test.js` — decremento, `broken`, `destroyed`, round-trip metadata.
- [x] `tests/armor_set.test.js` — cobertura y bonus de set.
- [ ] `tests/combat_integration.test.js` — `atacar` pasa weaponInfo/armorDurability (mock).

## Fase 8 — Verificación y cierre

- [x] `npm test` (414 verdes) / typecheck 0 / eslint 0 / depcruise 3 warn (382 + nuevas suites verdes)
- [ ] Smoke vs Supabase (pendiente: requiere �tems equipables reales): `addItem` con metadata; `equipar`sí usa; combate aplica naturaleza y durabilidad.
- [x] `npm run graphify:update` (1658 nodos)
- [x] Registrar en `docs/AI_CHANGELOG.md` (2.5.0), `memory/decisions.md`, `memory/technical_debt.md`, NekoMemori.

---

## Arquitectura resultante

```
combat commands ──> equipmentResolverService ──> equipped_slots + inventory.metadata
      │  weaponInfo / armorDurability
      └─> combatEngine (naturalezas + applyMaterialAbsorption)
                  │  (post-Hit)
                  └─> durabilityPersistenceService ──> inventory.metadata
item commands ──> itemFactory / itemStatService ──> ItemDefinition (sin catálogo fijo)
armor_setService ──> cobertura + sets ──> fatigueEngine / statusService
```

## Exclusions / no hacer ahora
- ❌ Crear ítems del juego en el catálogo.
- ❌ Sistema de crafteo completo (solo la base de resolución de materiales).
- ❌ Comercio / tiendas.
- ❌ Mascotas / ítems special.

## Archivos nuevos
- `src/services/rpg/itemFactory.js`
- `src/services/rpg/itemStatService.js`
- `src/services/rpg/equipmentResolverService.js`
- `src/services/rpg/durabilityPersistenceService.js`
- `src/services/rpg/armorSetService.js`
- `src/data/itemCatalog.js` (registro inyectable, vacío)
- tests asociados (Fase 7)

## Archivos modificados
- `src/commands/rpg/combat/{atacar,descansar,huir}.js`
- `src/services/rpg/inventoryService.js`