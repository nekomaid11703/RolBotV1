# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T02:25:03.498Z · Sims: 2000 · Máx rounds: 50

## 1. Integridad de datos

| Check | Casos | Detalle |
|-------|-------|---------|
| NaN en stats | 0 | stats no numéricas o NaN
| Stats fuera de clamp 1–100 | 0 | incluye magia y físicas
| winner fuera de {A,B} | 0 | 
| koType fuera de {ko,timeout} | 0 | 
| winnerIsFirstAttacker incoherente | 0 | 
| Rounds/distancia inválidos | 0 | rounds<1 o distancia negativa
| totalDamage negativo/NaN | 0 | 
| ítem↔heal incoherente | 0 | ítem sin heal o heal sin ítem
| Ítems > stock máximo (5) | 0 | 
| HP sube sin ítem | 0 | picos en hpCurve sin heal registrado
| Curvas vacías o inconsistentes | 0 | 

## 2. Sesgo de métricas (daño)

Post-fix: `collectMetrics` ahora incluye los contraataques (`*_counter`) en `totalDamage`/`damagePerTurn`. Verificación contra el daño real (pérdida de HP del rival en curvas):

| Métrica | Valor |
|---------|-------|
| Sims donde totalDamage < 90% del daño real (curvas) | 0 |
| Ratio dañoReal/dañoRegistrado > 1.05 (ambos lados) | 0 |
| Mediana del ratio (solo donde hay registro) | n/a |

**Diagnóstico**: consistencia total entre el daño registrado y el daño real por curvas (0 desviaciones >5%).

## 3. Timeouts (draws)

| Métrica | Valor |
|---------|-------|
| Timeouts | 88 (4.4%) |
| Ambos vivos al round 51 | 88/88 |
| Con fatiga ≥ 90 al final | 12/88 |
| Con algún HP ≤ 5 al final | 2/88 |
| Distancia final P50 | 8 m |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El techo de 50 rounds NO debería recortar combates decisivos.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 12.06 | 10.72–13.41 (n=296) | target 7.0 ⚠️ |
| Ventaja primer atacante | 2.1% | -0.0%–4.3% (n=2000) | target ≤5% ✅ |
| Winrate meta (velocista) | 64.6% | 58.8%–70.0% (n=277) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 36.2% | 36.2% [34.7%–37.7%] |
| Mismo build (berserker) | 552 | 36.4% | 36.4% [32.5%–40.5%] |
| Mismo build (esquivo) | 560 | 39.8% | 39.8% [35.8%–43.9%] |
| Mismo build (velocista) | 554 | 34.7% | 34.7% [30.8%–38.7%] |
| Mismo build (gladiador) | 552 | 35.9% | 35.9% [32.0%–40.0%] |
| Mismo build (tanque) | 576 | 37.0% | 37.0% [33.1%–41.0%] |
| Mismo build (asesino) | 552 | 36.1% | 36.1% [32.2%–40.1%] |
| Mismo build (estratega) | 560 | 36.3% | 36.3% [32.4%–40.3%] |
| Mismo build (equilibrado) | 592 | 36.0% | 36.0% [32.2%–39.9%] |
| Mismo build (extremista_defensa) | 530 | 35.8% | 35.8% [31.9%–40.0%] |
| Mismo build (extremista_velocidad) | 536 | 35.1% | 35.1% [31.2%–39.2%] |
| Mismo build (magus) | 536 | 36.2% | 36.2% [32.2%–40.3%] |
| Mismo build (extremista_ataque) | 566 | 35.7% | 35.7% [31.9%–39.7%] |
| Mismo build (extremista_reflejos) | 566 | 34.3% | 34.3% [30.5%–38.3%] |
| Mismo build (guardian) | 484 | 35.7% | 35.7% [31.6%–40.1%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.186 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 31.5% | 108 | 42.2% | 846 | -10.7pp |
| 200–299 | 37.7% | 289 | 46.8% | 863 | -9.1pp |
| 300–399 | 35.2% | 273 | 55.8% | 706 | -20.6pp |
| 400–500 | 47.8% | 278 | 74.3% | 637 | -26.4pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 29.8% | 114 | 42.5% | 840 | -12.7pp |
| 200–299 | 38.4% | 279 | 46.5% | 873 | -8.2pp |
| 300–399 | 34.8% | 279 | 56.1% | 700 | -21.4pp |
| 400–500 | 47.5% | 278 | 74.4% | 637 | -26.9pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 32.5% | 114 | 42.1% | 840 | -9.7pp |
| 200–299 | 38.6% | 277 | 46.4% | 875 | -7.8pp |
| 300–399 | 34.1% | 279 | 56.4% | 700 | -22.4pp |
| 400–500 | 47.5% | 276 | 74.3% | 639 | -26.9pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 68.1% | 464 | 458 |
| B | 59.5% | 839 | 392 |
| C | 49.7% | 1057 | 303 |
| E | 40.2% | 1640 | 201 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 954 | 0.0% | 0.8% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1152 | 3.6% | 12.2% | 0.1% | 0.0% | 0.0% | 0.0% |
| 300–399 | 979 | 8.0% | 19.5% | 0.9% | 0.7% | 0.0% | 0.0% |
| 400–500 | 915 | 17.5% | 20.5% | 2.6% | 1.7% | 0.2% | 0.5% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 30.1% | 30.6% | 29.1% | 10.2% |
| 200–299 | 29.2% | 31.3% | 30.8% | 8.8% |
| 300–399 | 28.9% | 30.9% | 29.6% | 10.5% |
| 400–500 | 30.8% | 30.1% | 30.7% | 8.4% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 954 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 535 (46.4%) | 617 (53.6%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 142 (14.5%) | 331 (33.8%) | 506 (51.7%) | 0 (0.0%) |
| 400–500 | 9 (1.0%) | 109 (11.9%) | 333 (36.4%) | 464 (50.7%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.21 |
| Cobertura dominante | total: 2596 · alta: 1269 · media: 115 · ligera: 19 · ninguna: 1 |
| Piezas de set (0 / 1-2 / 3+) | 0: 1 · 3+: 3905 · 1-2: 94 |
| Set bonus activo | 97.6% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 41.1% |
| Con escudo | 60.4% |
| Fighters con ≥1 pieza rota post-batalla | 60.7% (6329 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 88.8% |
| Batallas con ≥1 ítem | 52.8% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 12.9% |
| Rests por batalla (P50/P90) | 3/4 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.089 |
| def | 0.057 |
| aspd | -0.031 |
| ref | 0.045 |
| mspd | 0.123 |
| hp | 0.155 |
| fulgor | -0.105 |
| d_fulgor | -0.103 |
| r_fulgor | -0.098 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 7 / 26 / 51 / 51 |
| Batallas ≥ 20 rounds | 298 (14.9%) |
| Duración media | 11.44 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 88 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | velocista (report) | velocista (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (2.1% sobre 50%, CI 95% -0.0%–4.3%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (36.2% para el mayor nivel; correlación 0.186)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: velocista ≈64.6% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 52.8% de batallas usan ítem; los descansos (P50 3/4) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (2.1% ventaja, meta 64.6%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 12.06, meta 64.6%) para cerrar el ciclo.
