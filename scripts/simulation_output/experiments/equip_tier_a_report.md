# Combat Simulation Report
Generated: 2026-08-05 02:26:29 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.3 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 960 (96.0%) |
| Timeouts (draws) | 40 (4.0%) |
| Avg rounds (all) | 9.2 |
| Avg rounds (KO only) | 7.4 |
| Rounds P50 / P90 / Max | 5 / 19 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 261 |
| Avg rounds | 10.3 |
| P50 / P90 | 5 / 22 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 522/1000 |
| Winrate | 52.2% |
| Advantage over 50% | 2.2% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 85 | 154 | 55.2% |  |
| Asesino | 48 | 132 | 36.4% |  |
| Esquivo | 74 | 141 | 52.5% |  |
| Equilibrado | 105 | 169 | 62.1% |  |
| Extremista ATK | 58 | 152 | 38.2% |  |
| Extremista DEF | 58 | 123 | 47.2% |  |
| Extremista ASPD | 54 | 141 | 38.3% |  |
| Extremista REF | 61 | 122 | 50.0% |  |
| Velocista | 90 | 137 | 65.7% | YES |
| Berserker | 64 | 150 | 42.7% |  |
| Guardian | 90 | 149 | 60.4% |  |
| Estratega | 73 | 138 | 52.9% |  |
| Gladiador | 73 | 141 | 51.8% |  |
| Magus | 67 | 151 | 44.4% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 73.3 | - |
| Rests | 4.4 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.1 | - |
| Battles with item use | 45.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 91.1% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 31.99 (avg 48.32) |
| ASPD spread (stddev) | 30.78 (avg 53.63) |
| Equipment tier A | 2000 (100.0%) |
| Level 100-199 | 469 |
| Level 200-299 | 555 |
| Level 300-399 | 497 |
| Level 400-500 | 479 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 621 |
| cortante | 599 |
| desarmado | 178 |
| perforante | 602 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 623 | 47.4% |
| ligera | 12 | 58.3% |
| media | 59 | 50.8% |
| total | 1306 | 51.1% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 56 | 53.6% |
| 3+ | 1944 | 49.9% |
Set bonus active: 49.9% (1944) vs inactive 53.6% (56)

### Amulet
With amulet: 51.7% (807) vs without 48.9% (1193)

### Shield
With shield: 48.1% (1175) vs without 52.7% (825)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 1822 | 51.6% |
| desarmado | 178 | 33.1% |

### Nature by level bracket
- **100-199**: contundente: 150, cortante: 128, desarmado: 40, perforante: 151
- **200-299**: contundente: 163, cortante: 160, desarmado: 40, perforante: 192
- **300-399**: contundente: 153, cortante: 164, desarmado: 48, perforante: 132
- **400-500**: contundente: 155, cortante: 147, desarmado: 50, perforante: 127

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 40.4% | 485 | 53.1% | 1515 | -12.7pp |
| d_fulgor | 40.0% | 473 | 53.1% | 1527 | -13.2pp |
| r_fulgor | 40.4% | 478 | 53.0% | 1522 | -12.6pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 18.7 | 0 | 128 | 0 | 8 | 22 |
| Asesino | 73.7 | 0 | 128 | 50 | 68 | 93 |
| Esquivo | 15.4 | 0 | 128 | 0 | 0 | 17 |
| Equilibrado | 45.0 | 0 | 128 | 20 | 39 | 61 |
| Extremista ATK | 82.5 | 0 | 128 | 60 | 83 | 108 |
| Extremista DEF | 7.8 | 0 | 128 | 0 | 0 | 0 |
| Extremista ASPD | 65.3 | 10 | 128 | 20 | 60 | 97 |
| Extremista REF | 35.0 | 0 | 128 | 8 | 20 | 49 |
| Velocista | 26.9 | 0 | 128 | 8 | 16 | 37 |
| Berserker | 78.3 | 0 | 128 | 50 | 69 | 108 |
| Guardian | 15.3 | 0 | 128 | 0 | 0 | 14 |
| Estratega | 44.1 | 0 | 128 | 12 | 33 | 57 |
| Gladiador | 65.2 | 0 | 128 | 40 | 56 | 89 |
| Magus | 70.5 | 0 | 128 | 36 | 65 | 97 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 256 | 256 | 100.0% |
| Asesino | 177 | 177 | 100.0% |
| Esquivo | 1402 | 1402 | 100.0% |
| Equilibrado | 545 | 545 | 100.0% |
| Extremista ATK | 132 | 132 | 100.0% |
| Extremista DEF | 320 | 320 | 100.0% |
| Extremista ASPD | 54 | 54 | 100.0% |
| Extremista REF | 164 | 164 | 100.0% |
| Velocista | 584 | 584 | 100.0% |
| Berserker | 96 | 96 | 100.0% |
| Guardian | 387 | 387 | 100.0% |
| Estratega | 361 | 361 | 100.0% |
| Gladiador | 172 | 172 | 100.0% |
| Magus | 144 | 144 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 13 | 1308 | 1.0% |
| Asesino | 3 | 449 | 0.7% |
| Esquivo | 216 | 1691 | 12.8% |
| Equilibrado | 15 | 934 | 1.6% |
| Extremista ATK | 32 | 772 | 4.1% |
| Extremista DEF | 245 | 1222 | 20.0% |
| Extremista ASPD | 33 | 544 | 6.1% |
| Extremista REF | 422 | 667 | 63.3% |
| Velocista | 0 | 884 | 0.0% |
| Berserker | 94 | 686 | 13.7% |
| Guardian | 9 | 1112 | 0.8% |
| Estratega | 422 | 962 | 43.9% |
| Gladiador | 130 | 546 | 23.8% |
| Magus | 90 | 664 | 13.6% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 12 | 14 | 13 | 14 | 11 | 11 | 9 | 10 | 6 | 9 | 14 | 14 | 9 | 15 |
| 5 | 24 | 20 | 17 | 22 | 18 | 19 | 17 | 14 | 12 | 16 | 22 | 18 | 17 | 20 |
| 10 | 27 | 20 | 20 | 25 | 19 | 22 | 17 | 13 | 14 | 16 | 25 | 16 | 17 | 20 |
| 15 | 28 | 20 | 22 | 25 | 19 | 26 | 17 | 13 | 14 | 16 | 26 | 17 | 17 | 20 |
| 20 | 28 | 20 | 23 | 25 | 19 | 27 | 17 | 13 | 14 | 16 | 27 | 17 | 18 | 20 |
| 25 | 28 | 21 | 24 | 25 | 19 | 27 | 17 | 13 | 14 | 16 | 27 | 17 | 18 | 20 |
| 30 | 28 | 21 | 25 | 25 | 19 | 27 | 17 | 13 | 13 | 16 | 26 | 17 | 18 | 20 |
| 40 | 27 | 21 | 26 | 25 | 20 | 27 | 17 | 13 | 13 | 16 | 26 | 17 | 18 | 20 |
| 50 | 27 | 21 | 27 | 25 | 20 | 27 | 17 | 13 | 14 | 16 | 26 | 17 | 18 | 20 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 40.0% | 40.0% | 42.9% | 90.0% | 63.6% | 81.8% | 60.0% | 36.8% | 88.9% | 60.0% | 25.0% | 38.9% | 69.2% |
| Asesino | 60.0% | 50.0% | 33.3% | 37.5% | 41.7% | 22.2% | 38.5% | 35.7% | 22.2% | 16.7% | 40.0% | 50.0% | 30.0% | 50.0% |
| Esquivo | 60.0% | 66.7% | 50.0% | 36.4% | 72.7% | 50.0% | 63.6% | 66.7% | 46.2% | 40.0% | 50.0% | 100.0% | 25.0% | 55.6% |
| Equilibrado | 57.1% | 62.5% | 63.6% | 50.0% | 64.7% | 80.0% | 66.7% | 71.4% | 33.3% | 77.8% | 45.5% | 76.9% | 75.0% | 50.0% |
| Extremista ATK | 10.0% | 58.3% | 27.3% | 35.3% | 50.0% | 50.0% | 63.6% | 33.3% | 18.2% | 45.5% | 38.5% | 25.0% | 20.0% | 46.7% |
| Extremista DEF | 36.4% | 77.8% | 50.0% | 20.0% | 50.0% | 50.0% | 50.0% | 50.0% | 55.6% | 75.0% | 16.7% | 18.2% | 50.0% | 42.9% |
| Extremista ASPD | 18.2% | 61.5% | 36.4% | 33.3% | 36.4% | 50.0% | 50.0% | 22.2% | 0.0% | 30.0% | 25.0% | 60.0% | 40.0% | 71.4% |
| Extremista REF | 40.0% | 64.3% | 33.3% | 28.6% | 66.7% | 50.0% | 77.8% | 50.0% | 50.0% | 42.9% | 36.4% | 0.0% | 66.7% | 44.4% |
| Velocista | 63.2% | 77.8% | 53.8% | 66.7% | 81.8% | 44.4% | 100.0% | 50.0% | 50.0% | 58.3% | 71.4% | 40.0% | 100.0% | 80.0% |
| Berserker | 11.1% | 83.3% | 60.0% | 22.2% | 54.5% | 25.0% | 70.0% | 57.1% | 41.7% | 50.0% | 18.2% | 37.5% | 14.3% | 60.0% |
| Guardian | 40.0% | 60.0% | 50.0% | 54.5% | 61.5% | 83.3% | 75.0% | 63.6% | 28.6% | 81.8% | 50.0% | 72.7% | 77.8% | 50.0% |
| Estratega | 75.0% | 50.0% | 0.0% | 23.1% | 75.0% | 81.8% | 40.0% | 100.0% | 60.0% | 62.5% | 27.3% | 50.0% | 64.3% | 33.3% |
| Gladiador | 61.1% | 70.0% | 75.0% | 25.0% | 80.0% | 50.0% | 60.0% | 33.3% | 0.0% | 85.7% | 22.2% | 35.7% | 50.0% | 75.0% |
| Magus | 30.8% | 50.0% | 44.4% | 50.0% | 53.3% | 57.1% | 28.6% | 55.6% | 20.0% | 40.0% | 50.0% | 66.7% | 25.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.1% | 304 |
| 16-30 | 51.7% | 509 |
| 31-50 | 57.0% | 381 |
| 51-70 | 54.5% | 220 |
| 71-100 | 45.4% | 586 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 37.5% | 24 |
| 16-30 | 37.2% | 406 |
| 31-50 | 46.7% | 756 |
| 51-70 | 56.4% | 314 |
| 71-100 | 62.0% | 500 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.7% | 247 |
| 16-30 | 44.3% | 377 |
| 31-50 | 55.1% | 396 |
| 51-70 | 53.7% | 268 |
| 71-100 | 51.7% | 712 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.2% | 465 |
| 16-30 | 42.4% | 490 |
| 31-50 | 52.4% | 391 |
| 51-70 | 59.1% | 232 |
| 71-100 | 60.2% | 422 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.7% | 819 |
| 16-30 | 43.0% | 526 |
| 31-50 | 48.4% | 310 |
| 51-70 | 78.4% | 153 |
| 71-100 | 76.0% | 192 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.7% | 1610 |
| 16-30 | 41.2% | 211 |
| 31-50 | 39.3% | 145 |
| 51-70 | 25.0% | 32 |
| 71-100 | 0.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 1612 |
| 16-30 | 44.5% | 218 |
| 31-50 | 39.1% | 133 |
| 51-70 | 29.4% | 34 |
| 71-100 | 0.0% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1623 |
| 16-30 | 44.0% | 200 |
| 31-50 | 35.8% | 134 |
| 51-70 | 37.8% | 37 |
| 71-100 | 0.0% | 6 |
