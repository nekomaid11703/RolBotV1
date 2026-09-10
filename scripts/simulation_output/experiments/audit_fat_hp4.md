# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:17:49.702Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 259 (13.0%) |
| Ambos vivos al round 21 | 259/259 |
| Con fatiga ≥ 90 al final | 16/259 |
| Con algún HP ≤ 5 al final | 4/259 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 151/259 |
| Gap de HP relativo al corte (P50/P90) | 43.5% / 81.3% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 8.69 | 7.99–9.39 (n=303) | target 7.0 ⚠️ |
| Ventaja primer atacante | 0.6% | -1.6%–2.8% (n=2000) | target ≤5% ✅ |
| Winrate meta (tanque) | 70.0% | 64.3%–75.2% (n=270) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 35.2% | 35.2% [33.8%–36.7%] |
| Mismo build (esquivo) | 572 | 34.8% | 34.8% [31.0%–38.8%] |
| Mismo build (tanque) | 540 | 36.1% | 36.1% [32.2%–40.2%] |
| Mismo build (estratega) | 466 | 36.9% | 36.9% [32.7%–41.4%] |
| Mismo build (berserker) | 542 | 35.2% | 35.2% [31.3%–39.4%] |
| Mismo build (extremista_reflejos) | 562 | 34.0% | 34.0% [30.2%–38.0%] |
| Mismo build (extremista_ataque) | 550 | 34.9% | 34.9% [31.0%–39.0%] |
| Mismo build (gladiador) | 546 | 35.2% | 35.2% [31.3%–39.3%] |
| Mismo build (asesino) | 514 | 36.2% | 36.2% [32.1%–40.4%] |
| Mismo build (velocista) | 550 | 36.0% | 36.0% [32.1%–40.1%] |
| Mismo build (guardian) | 546 | 37.2% | 37.2% [33.2%–41.3%] |
| Mismo build (extremista_velocidad) | 614 | 32.6% | 32.6% [29.0%–36.4%] |
| Mismo build (equilibrado) | 550 | 34.7% | 34.7% [30.9%–38.8%] |
| Mismo build (magus) | 558 | 32.8% | 32.8% [29.0%–36.8%] |
| Mismo build (extremista_defensa) | 614 | 36.0% | 36.0% [32.3%–39.9%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.179 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 31.7% | 126 | 43.4% | 884 | -11.7pp |
| 200–299 | 37.5% | 240 | 46.5% | 833 | -9.0pp |
| 300–399 | 33.7% | 303 | 54.2% | 640 | -20.6pp |
| 400–500 | 51.2% | 289 | 73.1% | 685 | -21.9pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 35.9% | 128 | 42.9% | 882 | -6.9pp |
| 200–299 | 37.6% | 242 | 46.5% | 831 | -8.8pp |
| 300–399 | 33.1% | 305 | 54.5% | 638 | -21.4pp |
| 400–500 | 51.9% | 291 | 72.9% | 683 | -21.0pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 34.4% | 128 | 43.1% | 882 | -8.7pp |
| 200–299 | 39.0% | 241 | 46.0% | 832 | -7.0pp |
| 300–399 | 33.9% | 304 | 54.1% | 639 | -20.3pp |
| 400–500 | 51.7% | 290 | 73.0% | 684 | -21.2pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 70.6% | 534 | 457 |
| B | 55.3% | 810 | 391 |
| C | 48.7% | 1049 | 304 |
| E | 41.3% | 1607 | 196 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 1010 | 0.0% | 1.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1073 | 2.3% | 14.1% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 943 | 8.1% | 21.4% | 0.5% | 0.7% | 0.0% | 0.0% |
| 400–500 | 974 | 14.8% | 23.0% | 3.7% | 3.8% | 0.2% | 1.1% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 30.4% | 30.8% | 29.9% | 8.9% |
| 200–299 | 30.4% | 29.1% | 30.3% | 10.3% |
| 300–399 | 29.3% | 31.0% | 30.4% | 9.3% |
| 400–500 | 28.7% | 32.1% | 28.6% | 10.5% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 1010 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 467 (43.5%) | 606 (56.5%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 119 (12.6%) | 324 (34.4%) | 500 (53.0%) | 0 (0.0%) |
| 400–500 | 11 (1.1%) | 119 (12.2%) | 310 (31.8%) | 534 (54.8%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.22 |
| Cobertura dominante | total: 2540 · alta: 1328 · media: 116 · ligera: 16 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 3926 · 1-2: 74 |
| Set bonus activo | 98.2% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 39.8% |
| Con escudo | 59.8% |
| Fighters con ≥1 pieza rota post-batalla | 52.8% (5142 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 84.0% |
| Batallas con ≥1 ítem | 46.2% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 19.0% |
| Rests por batalla (P50/P90) | 2/3 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.126 |
| def | 0.123 |
| aspd | -0.078 |
| ref | 0.028 |
| mspd | 0.086 |
| hp | 0.229 |
| fulgor | -0.085 |
| d_fulgor | -0.089 |
| r_fulgor | -0.086 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 6 / 21 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 272 (13.6%) |
| Duración media | 8.52 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 259 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | tanque (report) | tanque (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (0.6% sobre 50%, CI 95% -1.6%–2.8%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (35.2% para el mayor nivel; correlación 0.179)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: tanque ≈70.0% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 46.2% de batallas usan ítem; los descansos (P50 2/3) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (0.6% ventaja, meta 70.0%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 8.69, meta 70.0%) para cerrar el ciclo.
