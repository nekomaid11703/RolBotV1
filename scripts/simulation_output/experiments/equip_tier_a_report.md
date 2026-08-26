# Combat Simulation Report
Generated: 2026-08-05 03:22:39 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.9 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 932 (93.2%) |
| Timeouts (draws) | 68 (6.8%) |
| Avg rounds (all) | 6.0 |
| Avg rounds (KO only) | 4.9 |
| Rounds P50 / P90 / Max | 4 / 15 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 252 |
| Avg rounds | 6.9 |
| P50 / P90 | 4 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 503/1000 |
| Winrate | 50.3% |
| Advantage over 50% | 0.3% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 80 | 145 | 55.2% |  |
| Asesino | 66 | 146 | 45.2% |  |
| Esquivo | 67 | 134 | 50.0% |  |
| Equilibrado | 76 | 143 | 53.1% |  |
| Extremista ATK | 62 | 142 | 43.7% |  |
| Extremista DEF | 79 | 148 | 53.4% |  |
| Extremista ASPD | 61 | 143 | 42.7% |  |
| Extremista REF | 47 | 120 | 39.2% |  |
| Velocista | 110 | 167 | 65.9% | YES |
| Berserker | 59 | 135 | 43.7% |  |
| Guardian | 80 | 141 | 56.7% |  |
| Estratega | 70 | 132 | 53.0% |  |
| Gladiador | 86 | 156 | 55.1% |  |
| Magus | 57 | 148 | 38.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.8 | 0 |
| Heal applied | 51.6 | - |
| Rests | 2.2 | 1 |
| Advances | 3.3 | - |
| Retreats | 0.1 | - |
| Battles with item use | 38.3% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.8% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.28 (avg 48.20) |
| ASPD spread (stddev) | 31.35 (avg 54.12) |
| Equipment tier A | 2000 (100.0%) |
| Level 100-199 | 460 |
| Level 200-299 | 574 |
| Level 300-399 | 481 |
| Level 400-500 | 485 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 596 |
| cortante | 628 |
| desarmado | 205 |
| perforante | 571 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1091 | 49.4% |
| ligera | 210 | 50.5% |
| media | 176 | 47.2% |
| total | 523 | 52.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 36 | 33.3% |
| 3+ | 1964 | 50.3% |
Set bonus active: 50.3% (1964) vs inactive 33.3% (36)

### Amulet
With amulet: 48.9% (830) vs without 50.8% (1170)

### Shield
With shield: 51.2% (1238) vs without 48.0% (762)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 1795 | 51.6% |
| desarmado | 205 | 35.6% |

### Nature by level bracket
- **100-199**: contundente: 142, cortante: 131, desarmado: 53, perforante: 134
- **200-299**: contundente: 167, cortante: 170, desarmado: 58, perforante: 179
- **300-399**: contundente: 126, cortante: 173, desarmado: 61, perforante: 121
- **400-500**: contundente: 161, cortante: 154, desarmado: 33, perforante: 137

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.0% | 478 | 52.8% | 1522 | -11.8pp |
| d_fulgor | 41.3% | 475 | 52.7% | 1525 | -11.5pp |
| r_fulgor | 42.2% | 472 | 52.4% | 1528 | -10.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 20.5 | 0 | 128 | 6 | 10 | 23 |
| Asesino | 91.5 | 25 | 128 | 67 | 93 | 128 |
| Esquivo | 25.3 | 0 | 128 | 0 | 14 | 40 |
| Equilibrado | 37.5 | 0 | 128 | 13 | 31 | 55 |
| Extremista ATK | 83.3 | 0 | 128 | 56 | 83 | 113 |
| Extremista DEF | 9.0 | 0 | 128 | 0 | 0 | 5 |
| Extremista ASPD | 66.8 | 7 | 128 | 39 | 68 | 90 |
| Extremista REF | 41.5 | 0 | 128 | 11 | 19 | 56 |
| Velocista | 33.0 | 0 | 128 | 11 | 21 | 46 |
| Berserker | 78.9 | 0 | 128 | 50 | 71 | 106 |
| Guardian | 18.3 | 0 | 128 | 0 | 6 | 16 |
| Estratega | 42.0 | 5 | 128 | 17 | 34 | 51 |
| Gladiador | 75.2 | 14 | 128 | 47 | 68 | 106 |
| Magus | 60.4 | 12 | 128 | 34 | 53 | 78 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 168 | 168 | 100.0% |
| Asesino | 18 | 18 | 100.0% |
| Esquivo | 315 | 315 | 100.0% |
| Equilibrado | 242 | 242 | 100.0% |
| Extremista ATK | 145 | 145 | 100.0% |
| Extremista DEF | 89 | 89 | 100.0% |
| Extremista ASPD | 36 | 36 | 100.0% |
| Extremista REF | 68 | 68 | 100.0% |
| Velocista | 192 | 192 | 100.0% |
| Berserker | 154 | 154 | 100.0% |
| Guardian | 150 | 150 | 100.0% |
| Estratega | 170 | 170 | 100.0% |
| Gladiador | 133 | 133 | 100.0% |
| Magus | 243 | 243 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 36 | 665 | 5.4% |
| Asesino | 1 | 164 | 0.6% |
| Esquivo | 145 | 545 | 26.6% |
| Equilibrado | 20 | 533 | 3.8% |
| Extremista ATK | 88 | 481 | 18.3% |
| Extremista DEF | 124 | 623 | 19.9% |
| Extremista ASPD | 43 | 465 | 9.2% |
| Extremista REF | 299 | 448 | 66.7% |
| Velocista | 0 | 369 | 0.0% |
| Berserker | 52 | 493 | 10.5% |
| Guardian | 2 | 605 | 0.3% |
| Estratega | 245 | 525 | 46.7% |
| Gladiador | 143 | 537 | 26.6% |
| Magus | 81 | 528 | 15.3% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 15 | 11 | 16 | 11 | 9 | 11 | 11 | 6 | 9 | 16 | 12 | 10 | 16 |
| 5 | 22 | 19 | 15 | 21 | 17 | 17 | 17 | 12 | 10 | 16 | 23 | 16 | 16 | 20 |
| 10 | 24 | 19 | 18 | 22 | 17 | 21 | 17 | 11 | 14 | 16 | 25 | 17 | 17 | 21 |
| 15 | 24 | 19 | 20 | 22 | 17 | 24 | 16 | 12 | 14 | 16 | 26 | 17 | 17 | 22 |
| 20 | 24 | 19 | 23 | 22 | 17 | 25 | 16 | 12 | 14 | 17 | 27 | 17 | 18 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 58.3% | 30.0% | 66.7% | 83.3% | 72.7% | 80.0% | 83.3% | 21.4% | 75.0% | 27.3% | 42.1% | 50.0% | 63.6% |
| Asesino | 41.7% | 50.0% | 60.0% | 57.1% | 60.0% | 20.0% | 50.0% | 28.6% | 41.7% | 33.3% | 33.3% | 28.6% | 46.2% | 53.8% |
| Esquivo | 70.0% | 40.0% | 50.0% | 54.5% | 50.0% | 80.0% | 44.4% | 42.9% | 43.8% | 77.8% | 54.5% | 12.5% | 11.1% | 62.5% |
| Equilibrado | 33.3% | 42.9% | 45.5% | 50.0% | 22.2% | 66.7% | 62.5% | 78.6% | 60.0% | 53.8% | 42.9% | 42.9% | 61.5% | 80.0% |
| Extremista ATK | 16.7% | 40.0% | 50.0% | 77.8% | 50.0% | 29.4% | 53.8% | 54.5% | 33.3% | 70.0% | 25.0% | 55.6% | 20.0% | 50.0% |
| Extremista DEF | 27.3% | 80.0% | 20.0% | 33.3% | 70.6% | 50.0% | 33.3% | 83.3% | 58.3% | 60.0% | 53.3% | 75.0% | 54.5% | 64.3% |
| Extremista ASPD | 20.0% | 50.0% | 55.6% | 37.5% | 46.2% | 66.7% | 50.0% | 25.0% | 7.7% | 57.1% | 55.6% | 45.5% | 60.0% | 50.0% |
| Extremista REF | 16.7% | 71.4% | 57.1% | 21.4% | 45.5% | 16.7% | 75.0% | 50.0% | 38.5% | 40.0% | 33.3% | 0.0% | 30.0% | 33.3% |
| Velocista | 78.6% | 58.3% | 56.3% | 40.0% | 66.7% | 41.7% | 92.3% | 61.5% | 50.0% | 62.5% | 66.7% | 85.7% | 64.7% | 83.3% |
| Berserker | 25.0% | 66.7% | 22.2% | 46.2% | 30.0% | 40.0% | 42.9% | 60.0% | 37.5% | 50.0% | 40.0% | 52.6% | 33.3% | 83.3% |
| Guardian | 72.7% | 66.7% | 45.5% | 57.1% | 75.0% | 46.7% | 44.4% | 66.7% | 33.3% | 60.0% | 50.0% | 0.0% | 70.0% | 55.6% |
| Estratega | 57.9% | 71.4% | 87.5% | 57.1% | 44.4% | 25.0% | 54.5% | 100.0% | 14.3% | 47.4% | 100.0% | 50.0% | 42.9% | 66.7% |
| Gladiador | 50.0% | 53.8% | 88.9% | 38.5% | 80.0% | 45.5% | 40.0% | 70.0% | 35.3% | 66.7% | 30.0% | 57.1% | 50.0% | 75.0% |
| Magus | 36.4% | 46.2% | 37.5% | 20.0% | 50.0% | 35.7% | 50.0% | 66.7% | 16.7% | 16.7% | 44.4% | 33.3% | 25.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.4% | 304 |
| 16-30 | 50.3% | 537 |
| 31-50 | 56.6% | 362 |
| 51-70 | 48.7% | 199 |
| 71-100 | 48.5% | 598 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 21.4% | 14 |
| 16-30 | 39.0% | 403 |
| 31-50 | 46.5% | 777 |
| 51-70 | 55.8% | 285 |
| 71-100 | 61.4% | 521 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.7% | 253 |
| 16-30 | 47.5% | 377 |
| 31-50 | 51.4% | 352 |
| 51-70 | 50.3% | 294 |
| 71-100 | 52.3% | 724 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.6% | 463 |
| 16-30 | 41.3% | 501 |
| 31-50 | 52.4% | 380 |
| 51-70 | 62.2% | 233 |
| 71-100 | 56.3% | 423 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.8% | 792 |
| 16-30 | 41.8% | 545 |
| 31-50 | 46.5% | 314 |
| 51-70 | 78.6% | 140 |
| 71-100 | 77.0% | 209 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 1605 |
| 16-30 | 41.7% | 223 |
| 31-50 | 41.4% | 133 |
| 51-70 | 27.0% | 37 |
| 71-100 | 0.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.1% | 1605 |
| 16-30 | 44.7% | 228 |
| 31-50 | 38.9% | 126 |
| 51-70 | 30.0% | 40 |
| 71-100 | 100.0% | 1 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 1598 |
| 16-30 | 44.0% | 232 |
| 31-50 | 38.4% | 138 |
| 51-70 | 26.7% | 30 |
| 71-100 | 50.0% | 2 |
