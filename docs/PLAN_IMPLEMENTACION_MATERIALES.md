# Plan de Implementación — Canon de Materiales, Identidad y Ley de Obtención (B8)

Estado: aprobado por el usuario (2026-09-08). Contiene las tablas y datos canónicos
proporcionados por el usuario; son fuente de verdad para la implementación.

Estado 2026-09-09: B8.2a (canon) y B8.2b (ley R(L) + pisos, P1 del roadmap FASE 2.6)
implementados y en verde, junto con la recalibración B5/B1 y los anclajes material↔nivel.
B3 (rutas de raros/endgame) es el P2 de ese roadmap.

---

## 1. Objetivo

Restaurar la identidad de los materiales RPG con un canon estructurado e intuitivo,
eliminar la compresión de poder entre rarezas y definir una ley de obtención universal
medible. El balance de combate (winrate) recibirá una segunda pasada posterior.

## 2. Canon de materiales (TABLA OFICIAL)

Columnas: Material | Rareza | Enfoque | Afil | Conduc | Resist | Flex.

### Comunes (presupuesto 50)
| Material | Enfoque | Afil | Conduc | Resist | Flex |
|---|---|---|---|---|---|
| Piedra | filo | 19 | 14 | 10 | 7 |
| Cuarzo | cond | 7 | 10 | 19 | 14 |
| Cuero | res | 14 | 7 | 19 | 14 |
| Madera | flex | 7 | 10 | 14 | 19 |

### Poco comunes (presupuesto 69)
| Material | Enfoque | Afil | Conduc | Resist | Flex |
|---|---|---|---|---|---|
| Acero | filo | 26 | 19 | 14 | 10 |
| Plata | cond | 19 | 26 | 14 | 10 |
| Coraza desgastada | res | 10 | 14 | 26 | 19 |
| Madera de Caoba | flex | 10 | 14 | 19 | 26 |

### Raros (presupuesto 95)
| Material | Enfoque | Afil | Conduc | Resist | Flex |
|---|---|---|---|---|---|
| Obsidiana | filo | 36 | 26 | 19 | 14 |
| Oro | cond | 26 | 36 | 14 | 19 |
| Coraza robusta | res | 14 | 19 | 36 | 26 |
| Madera de ébano | flex | 14 | 19 | 26 | 36 |

### Épicos (presupuesto 132)
| Material | Enfoque | Afil | Conduc | Resist | Flex |
|---|---|---|---|---|---|
| Titanio | filo | 51 | 36 | 26 | 19 |
| Mitril | cond | 36 | 51 | 26 | 19 |
| Piel bestial | res | 19 | 26 | 51 | 36 |
| Madera noble | flex | 19 | 26 | 36 | 51 |

### Legendarios (presupuesto 184)
| Material | Enfoque | Afil | Conduc | Resist | Flex |
|---|---|---|---|---|---|
| Mineral Pálido | filo | 71 | 51 | 36 | 26 |
| Obsidiana Azul | cond | 51 | 71 | 36 | 26 |
| Luminita | res | 26 | 36 | 71 | 51 |
| Madera Tétrica | flex | 26 | 36 | 51 | 71 |

### Míticos (presupuesto 258)
| Material | Enfoque | Afil | Conduc | Resist | Flex |
|---|---|---|---|---|---|
| Filo Estelar | filo | 100 | 71 | 51 | 36 |
| Fulgorita | cond | 71 | 100 | 51 | 36 |
| Piel de titán | res | 36 | 51 | 100 | 71 |
| Madera del Irminsul | flex | 36 | 51 | 71 | 100 |

Notas canónicas de nombres (confirmadas por el usuario):
- “Madera Tétrica” (de tenebroso/perturbador) — id propuesto `madera_tetrica`.
- “Piel de titán” — id propuesto `piel_titan`.
- “Coraza desgastada” y “Coraza robusta” conservan el nombre — ids propuestos
  `coraza_desgastada`, `coraza_robusta`.

## 3. Reglas de identidad (lógica intuitiva)

1. **Flex = maderas**: Madera, Madera de Caoba, Madera de ébano, Madera noble,
   Madera Tétrica, Madera del Irminsul → buenas para arcos, útiles y flexibles.
2. **Resistencia = biológicos y reliquias orgánicas**: Cuero, Coraza desgastada,
   Coraza robusta, Piel bestial, Piel de titán y Luminita (restos de un antiguo titán).
3. **Filo = minerales**: Piedra, Acero, Obsidiana, Titanio, Mineral Pálido, Filo Estelar.
4. **Conducción = cristales y metales preciosos**: Cuarzo, Plata, Oro, Mitril,
   Obsidiana Azul, Fulgorita.
5. No existe material “balanceado”: cada material es el especialista de su eje
   dentro de su rareza (builds mixtas: filo en el arma, resistencia en la armadura,
   conducción en el foco/amuleto, flexibilidad en el arco/herramienta).

## 4. Matemática del canon (serie ×1.4)

- Primarias del especialista por rareza: 19 → 26 → 36 → 51 → 71 → 100 (×1.4).
- Presupuestos por rareza (suma de 4 stats): 50 → 69 → 95 → 132 → 184 → 258 (×1.4).
- Cada fila usa los 4 escalones `x, x/1.4, x/1.96, x/2.74` de su rareza.
- Consecuencia de balance (sin techos de refinado): el refinado es universal (2:1, E→N),
  pero cada escalón duplica su coste mientras la rareza siguiente aporta un pedestal
  ×1.4 y además es 16:1 más escasa. Dar el salto a un material de rareza superior
  (aunque escaso) siempre ofrece más rango de mejora que refinar el material viejo;
  refinar prolonga la vida útil de un material y el mercado decide el equilibrio.

## 5. Ley de obtención universal (RARIDAD POR PROBABILIDAD)

Distribución geométrica entre rarezas adyacentes controlada por el nivel de herramienta:

- `P(rareza i+1) = P(rareza i) / R(L)`
- `P(mítico) = (R−1)/(R⁶−1)`
- **L1**: R = 16 ⇒ por cada ~16 comunes, ~1 poco común (curva empinada).
- **L10**: R ≈ 1.39 ⇒ de cada ~16 items recolectados, ~1 es mítico (curva suave).

| L | R | Poco (≈) | Raro (≈) | Épico (≈) | Legendario (≈) | Mítico (≈) |
|---|---|---|---|---|---|---|
| 1 | 16.00 | 1/17 | 1/273 | 1/4.370 | 1/69.900 | 1/1.118.000 |
| 2 | 14.38 | 1/15 | 1/223 | 1/3.300 | 1/49.000 | 1/732.000 |
| 3 | 12.75 | 1/14 | 1/181 | 1/2.440 | 1/34.000 | 1/480.000 |
| 4 | 11.13 | 1/12 | 1/147 | 1/1.800 | 1/23.500 | 1/315.000 |
| 5 | 9.51 | 1/11 | 1/119 | 1/1.330 | 1/16.300 | 1/206.000 |
| 6 | 7.88 | 1/9 | 1/96 | 1/980 | 1/11.200 | 1/135.000 |
| 7 | 6.26 | 1/7 | 1/77 | 1/720 | 1/7.700 | 1/88.000 |
| 8 | 4.63 | 1/6 | 1/61 | 1/520 | 1/5.200 | 1/57.000 |
| 9 | 3.01 | 1/4 | 1/46 | 1/360 | 1/3.400 | 1/37.000 |
| 10 | 1.39 | 1/2.8 | 1/15 | 1/42 | 1/90 | 1/16 |

Verificaciones exactas:
- R=16 → `P(mítico) = (16−1)/(16⁶−1) ≈ 1/1.118.000` (curva base casi imposible).
- R=1.39 → `P(mítico) = (1.39−1)/(1.39⁶−1) = 1/16` exacto (regla de L10).

Fórmula de suavizado lineal: `R(L) = 16 − 14.61 × (L − 1) / 9`.

Semántica por zona (B3): cada zona declarará un **piso de rareza**; por debajo del piso
no se reparte probabilidad y la curva se renormaliza. La herramienta nunca abre rarezas
por sí sola: abre suavizado (R) y, combinada con el piso de la zona, acceso.

## 6. Efecto de las herramientas (revisión de B4)

- El nivel de herramienta deja de aplicar un bonus plano de botín.
- Su efecto pasa a ser gobernar `R(L)`: subir de nivel “suaviza” la curva de rareza.
- Se conserva la calibración de costes de `TOOL_UPGRADE_COSTS` (B4) y su ROI.

## 7. Materiales eliminados o reemplazados

Fuera de canon: **hierro, bronce, hueso, platino, oricalco**. Impacto y reemplazos
propuestos (por confirmar en ejecución):

| Uso actual (id antiguo) | Referencia | Reemplazo candidato |
|---|---|---|
| `trozo_de_hierro` | herramientas, tiendas, minas/montañas, recetas de prueba | `trozo_de_acero` |
| `trozo_de_bronce` | tiendas rotativas, minas | `trozo_de_cuarzo` |
| `trozo_de_platino` | tundra | `trozo_de_oro` o `trozo_de_coraza_robusta` (decisión por rareza/eje) |
| `hueso` / `oricalco` | catálogo/recetas | eliminar recetas asociadas o redirigir a su eje (`piedra`/`mineral_palido`) |
| `madera`/`cuero`/`plata`/`oro`/`titanio`/`mitril`/`obsidiana`/`luminita`/`mineral_palido`/`obsidiana_azul`/`madera_irminsul`/`filo_estelar` | conservan id, cambian stats/enfoque | — |

## 8. Plan de ejecución

### B8.2a — Catálogo canon (implementado 2026-09-08)
- [x] Reescribir `src/data/materialData.js` con los 24 materiales (ids, rareza,
      archetype, baseStats) y eliminar los fuera de canon.
- [x] Definir y exportar ids nuevos (`madera_tetrica`, `piel_titan`,
      `coraza_desgastada`, `coraza_robusta`, `cuarzo`, `madera_ebano`,
      `madera_noble`, `madera_terica`, `fulgorita`... con la grafía exacta).
- [x] Propagar referencias: `toolsConfig`, `shopConfig`, `expeditionConfig`,
      `arcaneFamily`, recetas de forja/refinado y catálogos de prueba.
- [x] Refinado universal 2:1 (E→N) sin techos: se eliminó `RARITY_TIER_CAP` y la
      validación asociada en `craftingService` (2026-09-09).

### B8.2b — Ley de obtención universal (P1 del roadmap FASE 2.6 — implementado 2026-09-09)
- [x] Implementar `R(L)` y el generador de rareza (geométrico con piso de zona):
      `rarityDropConfig.js` + `rarityDropService.js`; zonas con `floorRarity`/`rarityPool`.
- [x] Conectar el generador a expediciones; la herramienta deja de ser bonus plano y gobierna la curva.
- [x] Guardas en `progression:report`: “16:1 en L1” y “~1 mítico/16 en L10”, fuentes por banda/piso
      y anclajes material↔nivel (`MATERIAL_LEVEL_ANCHOR`, f=0.35).

### B8.2c — Guardas y documentación
- [x] Actualizar `tests/material_identity.test.js` a los nuevos presupuestos
      (50/69/95/132/184/258), serie ×1.4 y familias por eje.
- [x] Actualizar pruebas de stats/forja/refinado afectadas.
- [ ] Regenerar `docs/BALANCE_MATERIALES.md` y añadir tabla de `R(L)`.

### Fase 2 — Segunda pasada de balance de combate (posterior)
- [ ] Recalibrar winrate/damage con los nuevos stats (EDGE_SCALE, dummy, armaduras).
- [ ] Usar harnesses existentes (`scripts/simulate_combat`, `run_balance_sweep`).

## 9. Archivos afectados (referencia de ejecución)

- `src/data/materialData.js`, `src/data/materialFamilies.js`, `src/data/itemCatalog.js`
- `src/data/arcaneFamily.js`, `src/data/items.js`
- `src/config/toolsConfig.js`, `src/config/shopConfig.js`, `src/config/expeditionConfig.js`
- `src/services/rpg/craftingService.js` (refinado + forja)
- `src/services/rpg/progressionAnalyticsService.js` (reporte, tabla de materiales, R(L))
- `tests/` (material_identity, item_stat_service, ranged/crafting, forge, materials_table…)
- `docs/BALANCE_MATERIALES.md`, `docs/BALANCE_TROZOS.md`
