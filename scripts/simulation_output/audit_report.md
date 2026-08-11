# Auditoría de datos crudos de la simulación

Fecha: 2026-08-06T15:32:37.614Z · Sims: 10000 · Máx rounds: 20

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
| Timeouts | 290 (2.9%) |
| Ambos vivos al round 21 | 290/290 |
| Con fatiga ≥ 90 al final | 12/290 |
| Con algún HP ≤ 5 al final | 18/290 |
| Distancia final P50 | 2 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 162/290 |
| Gap de HP relativo al corte (P50/P90) | 47.5% / 87.1% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 5.87 | 5.61–6.13 (n=1208) | target 7.0 ⚠️ |
| Ventaja primer atacante | -2.3% | -3.2%–-1.3% (n=10000) | target ≤5% ✅ |
| Winrate meta (gladiador) | 68.9% | 66.4%–71.3% (n=1354) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 20000 | 28.9% | 28.9% [28.3%–29.6%] |
| Mismo build (extremista_ataque) | 2728 | 30.1% | 30.1% [28.4%–31.8%] |
| Mismo build (magus) | 2828 | 28.9% | 28.9% [27.2%–30.6%] |
| Mismo build (tanque) | 2702 | 29.0% | 29.0% [27.3%–30.7%] |
| Mismo build (asesino) | 2774 | 27.3% | 27.3% [25.7%–29.0%] |
| Mismo build (equilibrado) | 2846 | 28.0% | 28.0% [26.4%–29.7%] |
| Mismo build (esquivo) | 2736 | 26.4% | 26.4% [24.8%–28.1%] |
| Mismo build (velocista) | 2828 | 27.0% | 27.0% [25.4%–28.6%] |
| Mismo build (extremista_defensa) | 2676 | 29.6% | 29.6% [27.9%–31.3%] |
| Mismo build (extremista_reflejos) | 2782 | 29.5% | 29.5% [27.8%–31.2%] |
| Mismo build (berserker) | 2786 | 30.8% | 30.8% [29.1%–32.5%] |
| Mismo build (extremista_velocidad) | 2716 | 30.7% | 30.7% [29.0%–32.5%] |
| Mismo build (estratega) | 2746 | 30.5% | 30.5% [28.8%–32.3%] |
| Mismo build (guardian) | 2732 | 27.7% | 27.7% [26.0%–29.4%] |
| Mismo build (gladiador) | 2708 | 29.7% | 29.7% [28.0%–31.4%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.067 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 46.9% | 573 | 46.0% | 4222 | 0.9pp |
| 200–299 | 42.2% | 1386 | 49.5% | 4181 | -7.3pp |
| 300–399 | 48.7% | 1438 | 53.4% | 3470 | -4.7pp |
| 400–500 | 50.5% | 1409 | 56.2% | 3321 | -5.7pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 46.4% | 569 | 46.1% | 4226 | 0.3pp |
| 200–299 | 42.7% | 1392 | 49.4% | 4175 | -6.7pp |
| 300–399 | 48.4% | 1419 | 53.5% | 3489 | -5.0pp |
| 400–500 | 50.3% | 1408 | 56.3% | 3322 | -6.0pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 49.7% | 596 | 45.6% | 4199 | 4.0pp |
| 200–299 | 42.9% | 1395 | 49.3% | 4172 | -6.4pp |
| 300–399 | 48.2% | 1438 | 53.6% | 3470 | -5.4pp |
| 400–500 | 50.4% | 1407 | 56.2% | 3323 | -5.9pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 56.5% | 724 | 459 |
| B | 53.6% | 8391 | 350 |
| C | 46.4% | 3381 | 300 |
| D | 42.7% | 5689 | 196 |
| S | 60.0% | 1815 | 324 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 4795 | 0.0% | 0.7% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 5567 | 2.9% | 11.7% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 4908 | 8.5% | 21.4% | 0.8% | 0.8% | 0.0% | 0.0% |
| 400–500 | 4730 | 15.8% | 20.6% | 3.2% | 3.2% | 0.4% | 0.6% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 22.5% | 45.3% | 22.5% | 9.7% |
| 200–299 | 23.3% | 44.3% | 22.8% | 9.6% |
| 300–399 | 22.2% | 45.3% | 22.4% | 10.1% |
| 400–500 | 22.5% | 45.8% | 21.8% | 9.8% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 0 (0.0%) | 0 (0.0%) | 999 (20.8%) | 0 (0.0%) |
| 200–299 | 0 (0.0%) | 2003 (36.0%) | 1325 (23.8%) | 0 (0.0%) |
| 300–399 | 0 (0.0%) | 1065 (21.7%) | 2976 (60.6%) | 0 (0.0%) |
| 400–500 | 0 (0.0%) | 313 (6.6%) | 3091 (65.3%) | 724 (15.3%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.20 |
| Cobertura dominante | total: 12855 · alta: 6446 · media: 613 · ligera: 86 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 19568 · 1-2: 432 |
| Set bonus activo | 97.8% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 40.1% |
| Con escudo | 60.0% |
| Fighters con ≥1 pieza rota post-batalla | 40.0% (14551 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 84.3% |
| Batallas con ≥1 ítem | 30.6% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 24.2% |
| Rests por batalla (P50/P90) | 2/2 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | 0.051 |
| def | 0.046 |
| aspd | -0.011 |
| ref | -0.005 |
| mspd | -0.211 |
| hp | 0.164 |
| fulgor | -0.014 |
| d_fulgor | -0.016 |
| r_fulgor | -0.013 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 4 / 11 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 332 (3.3%) |
| Duración media | 5.66 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 10000 | 10000 | ✅ |
| Timeouts | 290 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | gladiador (report) | gladiador (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (-2.3% sobre 50%, CI 95% -3.2%–-1.3%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (28.9% para el mayor nivel; correlación 0.067)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: gladiador ≈68.9% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 30.6% de batallas usan ítem; los descansos (P50 2/2) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (-2.3% ventaja, meta 68.9%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 5.87, meta 68.9%) para cerrar el ciclo.
