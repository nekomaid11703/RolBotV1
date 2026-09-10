# Combat Simulation Report
Generated: 2026-08-05 03:22:23 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.4 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 940 (94.0%) |
| Timeouts (draws) | 60 (6.0%) |
| Avg rounds (all) | 5.5 |
| Avg rounds (KO only) | 4.5 |
| Rounds P50 / P90 / Max | 4 / 12 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 143 |
| Avg rounds | 5.4 |
| P50 / P90 | 4 / 13 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 462/1000 |
| Winrate | 46.2% |
| Advantage over 50% | -3.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 85 | 118 | 72.0% |  |
| Asesino | 64 | 160 | 40.0% |  |
| Esquivo | 79 | 150 | 52.7% |  |
| Equilibrado | 78 | 131 | 59.5% |  |
| Extremista ATK | 69 | 177 | 39.0% |  |
| Extremista DEF | 92 | 140 | 65.7% |  |
| Extremista ASPD | 45 | 146 | 30.8% |  |
| Extremista REF | 49 | 138 | 35.5% |  |
| Velocista | 80 | 127 | 63.0% |  |
| Berserker | 67 | 159 | 42.1% |  |
| Guardian | 95 | 130 | 73.1% | YES |
| Estratega | 70 | 149 | 47.0% |  |
| Gladiador | 64 | 137 | 46.7% |  |
| Magus | 63 | 138 | 45.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 32.0 | - |
| Rests | 3.5 | 2 |
| Advances | 2.6 | - |
| Retreats | 0.0 | - |
| Battles with item use | 24.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.1% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 33.13 (avg 50.34) |
| ASPD spread (stddev) | 31.66 (avg 55.67) |
| Equipment tier A | 258 (12.9%) |
| Equipment tier B | 403 (20.2%) |
| Equipment tier C | 501 (25.1%) |
| Equipment tier E | 838 (41.9%) |
| Level 100-199 | 534 |
| Level 200-299 | 564 |
| Level 300-399 | 475 |
| Level 400-500 | 427 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 603 |
| cortante | 604 |
| desarmado | 198 |
| perforante | 595 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 478 | 53.8% |
| ligera | 516 | 48.8% |
| media | 514 | 44.9% |
| total | 492 | 52.8% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 2000 | 50.0% |
Set bonus active: 0.0% (0) vs inactive 50.0% (2000)

### Amulet
With amulet: 51.5% (802) vs without 49.0% (1198)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 231 | 63.2% |
| B | 369 | 59.1% |
| C | 456 | 51.5% |
| E | 746 | 42.8% |
| desarmado | 198 | 41.4% |

### Nature by level bracket
- **100-199**: contundente: 171, cortante: 156, desarmado: 54, perforante: 153
- **200-299**: contundente: 164, cortante: 167, desarmado: 70, perforante: 163
- **300-399**: contundente: 134, cortante: 151, desarmado: 39, perforante: 151
- **400-500**: contundente: 134, cortante: 130, desarmado: 35, perforante: 128

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 39.2% | 503 | 53.6% | 1497 | -14.5pp |
| d_fulgor | 40.1% | 501 | 53.3% | 1499 | -13.2pp |
| r_fulgor | 40.2% | 505 | 53.3% | 1495 | -13.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 25.6 | 0 | 128 | 10 | 19 | 35 |
| Asesino | 67.1 | 0 | 128 | 38 | 74 | 88 |
| Esquivo | 21.9 | 0 | 128 | 0 | 18 | 33 |
| Equilibrado | 37.4 | 0 | 128 | 19 | 31 | 50 |
| Extremista ATK | 63.5 | 0 | 128 | 46 | 65 | 84 |
| Extremista DEF | 6.9 | 0 | 96 | 0 | 0 | 8 |
| Extremista ASPD | 59.1 | 8 | 128 | 34 | 56 | 84 |
| Extremista REF | 33.4 | 0 | 128 | 14 | 25 | 46 |
| Velocista | 30.6 | 0 | 128 | 14 | 23 | 39 |
| Berserker | 61.1 | 0 | 128 | 46 | 56 | 84 |
| Guardian | 15.4 | 0 | 128 | 0 | 13 | 21 |
| Estratega | 32.2 | 0 | 128 | 15 | 20 | 45 |
| Gladiador | 55.3 | 0 | 128 | 34 | 53 | 77 |
| Magus | 49.2 | 14 | 128 | 30 | 46 | 67 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 137 | 137 | 100.0% |
| Asesino | 101 | 101 | 100.0% |
| Esquivo | 422 | 422 | 100.0% |
| Equilibrado | 328 | 328 | 100.0% |
| Extremista ATK | 103 | 103 | 100.0% |
| Extremista DEF | 83 | 83 | 100.0% |
| Extremista ASPD | 49 | 49 | 100.0% |
| Extremista REF | 30 | 30 | 100.0% |
| Velocista | 152 | 152 | 100.0% |
| Berserker | 29 | 29 | 100.0% |
| Guardian | 235 | 235 | 100.0% |
| Estratega | 99 | 99 | 100.0% |
| Gladiador | 21 | 21 | 100.0% |
| Magus | 149 | 149 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 6 | 530 | 1.1% |
| Asesino | 0 | 361 | 0.0% |
| Esquivo | 128 | 644 | 19.9% |
| Equilibrado | 48 | 610 | 7.9% |
| Extremista ATK | 78 | 574 | 13.6% |
| Extremista DEF | 127 | 558 | 22.8% |
| Extremista ASPD | 71 | 463 | 15.3% |
| Extremista REF | 342 | 501 | 68.3% |
| Velocista | 0 | 306 | 0.0% |
| Berserker | 117 | 526 | 22.2% |
| Guardian | 0 | 631 | 0.0% |
| Estratega | 426 | 663 | 64.3% |
| Gladiador | 163 | 350 | 46.6% |
| Magus | 92 | 450 | 20.4% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 18 | 18 | 18 | 14 | 9 | 11 | 12 | 7 | 13 | 16 | 15 | 11 | 16 |
| 5 | 25 | 24 | 23 | 23 | 19 | 19 | 14 | 14 | 12 | 18 | 23 | 18 | 16 | 20 |
| 10 | 26 | 24 | 25 | 25 | 20 | 23 | 14 | 15 | 12 | 18 | 25 | 18 | 16 | 21 |
| 15 | 26 | 25 | 27 | 26 | 20 | 24 | 15 | 15 | 12 | 19 | 26 | 18 | 16 | 22 |
| 20 | 26 | 25 | 28 | 28 | 20 | 24 | 15 | 15 | 12 | 19 | 29 | 18 | 16 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 100.0% | 33.3% | 100.0% | 83.3% | 80.0% | 77.8% | 75.0% | 0.0% | 78.6% | 60.0% | 90.0% | 71.4% | 90.9% |
| Asesino | 0.0% | 50.0% | 41.7% | 55.6% | 53.3% | 18.2% | 62.5% | 50.0% | 14.3% | 42.9% | 42.9% | 0.0% | 40.0% | 54.5% |
| Esquivo | 66.7% | 58.3% | 50.0% | 37.5% | 46.7% | 12.5% | 72.7% | 60.0% | 63.6% | 58.3% | 33.3% | 46.2% | 64.3% | 55.6% |
| Equilibrado | 0.0% | 44.4% | 62.5% | 50.0% | 75.0% | 53.3% | 83.3% | 55.6% | 71.4% | 88.9% | 54.5% | 72.7% | 63.6% | 12.5% |
| Extremista ATK | 16.7% | 46.7% | 53.3% | 25.0% | 50.0% | 7.1% | 50.0% | 57.1% | 27.3% | 50.0% | 0.0% | 40.0% | 57.1% | 53.8% |
| Extremista DEF | 20.0% | 81.8% | 87.5% | 46.7% | 92.9% | 50.0% | 78.6% | 100.0% | 62.5% | 75.0% | 18.2% | 85.7% | 83.3% | 66.7% |
| Extremista ASPD | 22.2% | 37.5% | 27.3% | 16.7% | 50.0% | 21.4% | 50.0% | 50.0% | 22.2% | 54.5% | 12.5% | 25.0% | 11.1% | 14.3% |
| Extremista REF | 25.0% | 50.0% | 40.0% | 44.4% | 42.9% | 0.0% | 50.0% | 50.0% | 25.0% | 45.5% | 11.1% | 23.5% | 30.0% | 42.9% |
| Velocista | 100.0% | 85.7% | 36.4% | 28.6% | 72.7% | 37.5% | 77.8% | 75.0% | 50.0% | 42.9% | 33.3% | 50.0% | 72.7% | 77.8% |
| Berserker | 21.4% | 57.1% | 41.7% | 11.1% | 50.0% | 25.0% | 45.5% | 54.5% | 57.1% | 50.0% | 21.4% | 42.9% | 37.5% | 64.3% |
| Guardian | 40.0% | 57.1% | 66.7% | 45.5% | 100.0% | 81.8% | 87.5% | 88.9% | 66.7% | 78.6% | 50.0% | 81.8% | 77.8% | 72.7% |
| Estratega | 10.0% | 100.0% | 53.8% | 27.3% | 60.0% | 14.3% | 75.0% | 76.5% | 50.0% | 57.1% | 18.2% | 50.0% | 50.0% | 18.2% |
| Gladiador | 28.6% | 60.0% | 35.7% | 36.4% | 42.9% | 16.7% | 88.9% | 70.0% | 27.3% | 62.5% | 22.2% | 50.0% | 50.0% | 62.5% |
| Magus | 9.1% | 45.5% | 44.4% | 87.5% | 46.2% | 33.3% | 85.7% | 57.1% | 22.2% | 35.7% | 27.3% | 81.8% | 37.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 306 |
| 16-30 | 52.9% | 499 |
| 31-50 | 52.0% | 344 |
| 51-70 | 51.5% | 194 |
| 71-100 | 45.4% | 657 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 33.2% | 690 |
| 16-30 | 47.1% | 501 |
| 31-50 | 58.6% | 324 |
| 51-70 | 67.1% | 152 |
| 71-100 | 73.0% | 333 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 60.8% | 227 |
| 16-30 | 47.1% | 382 |
| 31-50 | 47.6% | 359 |
| 51-70 | 52.2% | 247 |
| 71-100 | 48.7% | 785 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.9% | 437 |
| 16-30 | 48.2% | 508 |
| 31-50 | 47.8% | 356 |
| 51-70 | 56.5% | 232 |
| 71-100 | 56.1% | 467 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.1% | 779 |
| 16-30 | 43.2% | 563 |
| 31-50 | 43.5% | 324 |
| 51-70 | 85.0% | 147 |
| 71-100 | 74.9% | 187 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.6% | 1598 |
| 16-30 | 38.6% | 223 |
| 31-50 | 45.0% | 131 |
| 51-70 | 30.8% | 39 |
| 71-100 | 33.3% | 9 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1600 |
| 16-30 | 37.8% | 222 |
| 31-50 | 45.9% | 133 |
| 51-70 | 40.5% | 37 |
| 71-100 | 12.5% | 8 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1596 |
| 16-30 | 40.2% | 214 |
| 31-50 | 42.3% | 137 |
| 51-70 | 37.5% | 48 |
| 71-100 | 20.0% | 5 |
