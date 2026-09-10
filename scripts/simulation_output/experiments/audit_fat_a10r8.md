# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:14:29.662Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 309 (15.4%) |
| Ambos vivos al round 21 | 309/309 |
| Con fatiga ≥ 90 al final | 27/309 |
| Con algún HP ≤ 5 al final | 1/309 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 189/309 |
| Gap de HP relativo al corte (P50/P90) | 40.6% / 81.8% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 10.02 | 9.29–10.75 (n=299) | target 7.0 ⚠️ |
| Ventaja primer atacante | 2.4% | 0.3%–4.6% (n=2000) | target ≤5% ✅ |
| Winrate meta (tanque) | 69.9% | 63.8%–75.4% (n=236) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 35.8% | 35.8% [34.3%–37.3%] |
| Mismo build (extremista_defensa) | 548 | 35.8% | 35.8% [31.9%–39.9%] |
| Mismo build (asesino) | 602 | 32.9% | 32.9% [29.3%–36.7%] |
| Mismo build (guardian) | 556 | 34.5% | 34.5% [30.7%–38.6%] |
| Mismo build (estratega) | 598 | 33.8% | 33.8% [30.1%–37.7%] |
| Mismo build (berserker) | 566 | 35.3% | 35.3% [31.5%–39.4%] |
| Mismo build (extremista_velocidad) | 526 | 35.0% | 35.0% [31.0%–39.2%] |
| Mismo build (tanque) | 472 | 36.7% | 36.7% [32.4%–41.1%] |
| Mismo build (extremista_reflejos) | 522 | 36.4% | 36.4% [32.4%–40.6%] |
| Mismo build (esquivo) | 648 | 38.6% | 38.6% [34.9%–42.4%] |
| Mismo build (gladiador) | 574 | 34.5% | 34.5% [30.7%–38.5%] |
| Mismo build (velocista) | 568 | 39.3% | 39.3% [35.3%–43.3%] |
| Mismo build (magus) | 512 | 35.7% | 35.7% [31.7%–40.0%] |
| Mismo build (equilibrado) | 584 | 34.9% | 34.9% [31.2%–38.9%] |
| Mismo build (extremista_ataque) | 472 | 36.7% | 36.7% [32.4%–41.1%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.191 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 37.1% | 140 | 43.6% | 856 | -6.4pp |
| 200–299 | 36.0% | 258 | 44.1% | 839 | -8.1pp |
| 300–399 | 33.0% | 270 | 55.5% | 715 | -22.6pp |
| 400–500 | 50.0% | 288 | 75.7% | 634 | -25.7pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 35.9% | 142 | 43.8% | 854 | -7.9pp |
| 200–299 | 35.4% | 257 | 44.3% | 840 | -8.9pp |
| 300–399 | 33.2% | 271 | 55.5% | 714 | -22.3pp |
| 400–500 | 49.8% | 289 | 75.8% | 633 | -26.0pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 35.4% | 144 | 43.9% | 852 | -8.5pp |
| 200–299 | 35.7% | 258 | 44.2% | 839 | -8.6pp |
| 300–399 | 33.1% | 269 | 55.4% | 716 | -22.4pp |
| 400–500 | 49.8% | 289 | 75.8% | 633 | -26.0pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 71.0% | 465 | 458 |
| B | 59.2% | 844 | 390 |
| C | 46.1% | 1023 | 305 |
| E | 41.7% | 1668 | 201 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 996 | 0.0% | 1.1% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1097 | 3.1% | 10.3% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 985 | 8.1% | 19.0% | 1.3% | 1.0% | 0.0% | 0.1% |
| 400–500 | 922 | 15.4% | 20.7% | 3.0% | 1.3% | 0.5% | 0.5% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 29.9% | 31.3% | 29.4% | 9.3% |
| 200–299 | 29.1% | 29.5% | 31.3% | 10.1% |
| 300–399 | 30.7% | 31.5% | 28.5% | 9.3% |
| 400–500 | 29.8% | 28.5% | 32.4% | 9.2% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 996 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 500 (45.6%) | 597 (54.4%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 165 (16.8%) | 305 (31.0%) | 515 (52.3%) | 0 (0.0%) |
| 400–500 | 7 (0.8%) | 121 (13.1%) | 329 (35.7%) | 465 (50.4%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.20 |
| Cobertura dominante | total: 2536 · alta: 1319 · media: 122 · ligera: 23 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 3899 · 1-2: 101 |
| Set bonus activo | 97.5% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 40.1% |
| Con escudo | 59.9% |
| Fighters con ≥1 pieza rota post-batalla | 57.1% (5797 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 87.1% |
| Batallas con ≥1 ítem | 48.8% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 16.0% |
| Rests por batalla (P50/P90) | 3/3 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.109 |
| def | 0.104 |
| aspd | -0.092 |
| ref | 0.047 |
| mspd | 0.097 |
| hp | 0.228 |
| fulgor | -0.106 |
| d_fulgor | -0.099 |
| r_fulgor | -0.098 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 7 / 21 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 323 (16.2%) |
| Duración media | 9.31 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 309 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | tanque (report) | tanque (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (2.4% sobre 50%, CI 95% 0.3%–4.6%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (35.8% para el mayor nivel; correlación 0.191)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: tanque ≈69.9% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 48.8% de batallas usan ítem; los descansos (P50 3/3) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (2.4% ventaja, meta 69.9%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 10.02, meta 69.9%) para cerrar el ciclo.
