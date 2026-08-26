# Combat Simulation Report
Generated: 2026-08-05 03:22:37 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.3 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 908 (90.8%) |
| Timeouts (draws) | 92 (9.2%) |
| Avg rounds (all) | 7.2 |
| Avg rounds (KO only) | 5.8 |
| Rounds P50 / P90 / Max | 5 / 18 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 257 |
| Avg rounds | 7.3 |
| P50 / P90 | 5 / 17 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 476/1000 |
| Winrate | 47.6% |
| Advantage over 50% | -2.4% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 101 | 149 | 67.8% |  |
| Asesino | 58 | 151 | 38.4% |  |
| Esquivo | 76 | 146 | 52.1% |  |
| Equilibrado | 74 | 141 | 52.5% |  |
| Extremista ATK | 63 | 158 | 39.9% |  |
| Extremista DEF | 85 | 131 | 64.9% |  |
| Extremista ASPD | 51 | 114 | 44.7% |  |
| Extremista REF | 67 | 150 | 44.7% |  |
| Velocista | 96 | 130 | 73.8% | YES |
| Berserker | 59 | 154 | 38.3% |  |
| Guardian | 75 | 138 | 54.3% |  |
| Estratega | 67 | 126 | 53.2% |  |
| Gladiador | 68 | 148 | 45.9% |  |
| Magus | 59 | 164 | 36.0% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.0 | 0 |
| Heal applied | 58.3 | - |
| Rests | 3.0 | 2 |
| Advances | 3.7 | - |
| Retreats | 0.0 | - |
| Battles with item use | 40.6% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.48 (avg 48.16) |
| ASPD spread (stddev) | 31.11 (avg 52.38) |
| Equipment tier C | 2000 (100.0%) |
| Level 100-199 | 519 |
| Level 200-299 | 563 |
| Level 300-399 | 489 |
| Level 400-500 | 429 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 584 |
| cortante | 599 |
| desarmado | 211 |
| perforante | 606 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1074 | 50.9% |
| ligera | 195 | 46.7% |
| media | 194 | 40.7% |
| total | 537 | 52.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 44 | 40.9% |
| 3+ | 1956 | 50.2% |
Set bonus active: 50.2% (1956) vs inactive 40.9% (44)

### Amulet
With amulet: 53.4% (818) vs without 47.5% (1182)

### Shield
With shield: 52.3% (1214) vs without 46.3% (786)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| C | 1789 | 51.0% |
| desarmado | 211 | 41.2% |

### Nature by level bracket
- **100-199**: contundente: 150, cortante: 146, desarmado: 57, perforante: 166
- **200-299**: contundente: 157, cortante: 181, desarmado: 58, perforante: 167
- **300-399**: contundente: 155, cortante: 147, desarmado: 51, perforante: 136
- **400-500**: contundente: 122, cortante: 125, desarmado: 45, perforante: 137

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.4% | 454 | 52.5% | 1546 | -11.0pp |
| d_fulgor | 41.7% | 448 | 52.3% | 1552 | -10.6pp |
| r_fulgor | 41.7% | 463 | 52.4% | 1537 | -10.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 21.0 | 0 | 57 | 6 | 18 | 35 |
| Asesino | 52.4 | 0 | 97 | 46 | 48 | 60 |
| Esquivo | 16.1 | 0 | 61 | 0 | 12 | 30 |
| Equilibrado | 33.7 | 0 | 83 | 24 | 35 | 46 |
| Extremista ATK | 53.1 | 0 | 94 | 46 | 49 | 68 |
| Extremista DEF | 5.7 | 0 | 64 | 0 | 0 | 0 |
| Extremista ASPD | 44.2 | 11 | 91 | 34 | 46 | 50 |
| Extremista REF | 24.8 | 0 | 82 | 10 | 23 | 37 |
| Velocista | 26.2 | 0 | 60 | 11 | 24 | 46 |
| Berserker | 54.8 | 0 | 96 | 46 | 50 | 68 |
| Guardian | 10.4 | 0 | 55 | 0 | 0 | 19 |
| Estratega | 32.3 | 0 | 79 | 20 | 36 | 46 |
| Gladiador | 54.4 | 0 | 92 | 46 | 48 | 67 |
| Magus | 45.0 | 12 | 93 | 37 | 46 | 54 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 34 | 34 | 100.0% |
| Asesino | 98 | 98 | 100.0% |
| Esquivo | 703 | 703 | 100.0% |
| Equilibrado | 397 | 397 | 100.0% |
| Extremista ATK | 68 | 68 | 100.0% |
| Extremista DEF | 121 | 121 | 100.0% |
| Extremista ASPD | 108 | 108 | 100.0% |
| Extremista REF | 158 | 158 | 100.0% |
| Velocista | 234 | 234 | 100.0% |
| Berserker | 9 | 9 | 100.0% |
| Guardian | 314 | 314 | 100.0% |
| Estratega | 259 | 259 | 100.0% |
| Gladiador | 82 | 82 | 100.0% |
| Magus | 201 | 201 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 9 | 747 | 1.2% |
| Asesino | 3 | 358 | 0.8% |
| Esquivo | 138 | 941 | 14.7% |
| Equilibrado | 42 | 724 | 5.8% |
| Extremista ATK | 65 | 568 | 11.4% |
| Extremista DEF | 196 | 751 | 26.1% |
| Extremista ASPD | 39 | 452 | 8.6% |
| Extremista REF | 468 | 751 | 62.3% |
| Velocista | 0 | 378 | 0.0% |
| Berserker | 31 | 503 | 6.2% |
| Guardian | 7 | 867 | 0.8% |
| Estratega | 239 | 652 | 36.7% |
| Gladiador | 140 | 546 | 25.6% |
| Magus | 107 | 631 | 17.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 14 | 13 | 18 | 9 | 11 | 12 | 11 | 5 | 10 | 16 | 15 | 11 | 17 |
| 5 | 24 | 19 | 18 | 25 | 17 | 22 | 18 | 15 | 10 | 17 | 24 | 20 | 18 | 24 |
| 10 | 27 | 19 | 21 | 27 | 17 | 25 | 18 | 14 | 12 | 17 | 27 | 20 | 18 | 24 |
| 15 | 29 | 19 | 23 | 27 | 17 | 27 | 18 | 14 | 12 | 17 | 29 | 19 | 18 | 24 |
| 20 | 29 | 20 | 23 | 28 | 17 | 28 | 19 | 14 | 12 | 17 | 30 | 20 | 18 | 25 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 80.0% | 57.1% | 36.4% | 76.5% | 62.5% | 69.2% | 85.7% | 0.0% | 83.3% | 50.0% | 76.9% | 69.2% | 81.8% |
| Asesino | 20.0% | 50.0% | 30.0% | 33.3% | 40.0% | 11.1% | 37.5% | 30.0% | 22.2% | 40.0% | 57.1% | 71.4% | 23.1% | 76.9% |
| Esquivo | 42.9% | 70.0% | 50.0% | 77.8% | 70.0% | 9.1% | 50.0% | 45.5% | 44.4% | 58.3% | 40.0% | 71.4% | 42.9% | 60.0% |
| Equilibrado | 63.6% | 66.7% | 22.2% | 50.0% | 66.7% | 55.6% | 75.0% | 35.7% | 42.9% | 37.5% | 57.1% | 33.3% | 55.6% | 55.6% |
| Extremista ATK | 23.5% | 60.0% | 30.0% | 33.3% | 50.0% | 33.3% | 66.7% | 43.8% | 14.3% | 60.0% | 33.3% | 36.4% | 37.5% | 60.0% |
| Extremista DEF | 37.5% | 88.9% | 90.9% | 44.4% | 66.7% | 50.0% | 71.4% | 80.0% | 25.0% | 100.0% | 42.9% | 55.6% | 90.0% | 69.2% |
| Extremista ASPD | 30.8% | 62.5% | 50.0% | 25.0% | 33.3% | 28.6% | 50.0% | 57.1% | 11.1% | 44.4% | 62.5% | 66.7% | 50.0% | 63.6% |
| Extremista REF | 14.3% | 70.0% | 54.5% | 57.1% | 56.3% | 20.0% | 42.9% | 50.0% | 28.6% | 41.2% | 16.7% | 0.0% | 55.6% | 66.7% |
| Velocista | 100.0% | 77.8% | 55.6% | 57.1% | 85.7% | 75.0% | 88.9% | 71.4% | 50.0% | 81.8% | 66.7% | 83.3% | 70.0% | 75.0% |
| Berserker | 16.7% | 60.0% | 41.7% | 62.5% | 40.0% | 0.0% | 55.6% | 58.8% | 18.2% | 50.0% | 18.2% | 14.3% | 28.6% | 54.5% |
| Guardian | 50.0% | 42.9% | 60.0% | 42.9% | 66.7% | 57.1% | 37.5% | 83.3% | 33.3% | 81.8% | 50.0% | 20.0% | 42.9% | 63.6% |
| Estratega | 23.1% | 28.6% | 28.6% | 66.7% | 63.6% | 44.4% | 33.3% | 100.0% | 16.7% | 85.7% | 80.0% | 50.0% | 66.7% | 75.0% |
| Gladiador | 30.8% | 76.9% | 57.1% | 44.4% | 62.5% | 10.0% | 50.0% | 44.4% | 30.0% | 71.4% | 57.1% | 33.3% | 50.0% | 46.2% |
| Magus | 18.2% | 23.1% | 40.0% | 44.4% | 40.0% | 30.8% | 36.4% | 33.3% | 25.0% | 45.5% | 36.4% | 25.0% | 53.8% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.8% | 343 |
| 16-30 | 54.9% | 494 |
| 31-50 | 57.1% | 350 |
| 51-70 | 46.3% | 203 |
| 71-100 | 45.4% | 610 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 13.8% | 29 |
| 16-30 | 37.6% | 442 |
| 31-50 | 43.8% | 744 |
| 51-70 | 57.1% | 294 |
| 71-100 | 68.2% | 491 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.5% | 273 |
| 16-30 | 40.2% | 396 |
| 31-50 | 54.1% | 375 |
| 51-70 | 54.2% | 264 |
| 71-100 | 51.9% | 692 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.6% | 480 |
| 16-30 | 45.0% | 489 |
| 31-50 | 45.5% | 376 |
| 51-70 | 53.9% | 232 |
| 71-100 | 62.4% | 423 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.0% | 844 |
| 16-30 | 40.3% | 541 |
| 31-50 | 48.2% | 301 |
| 51-70 | 72.3% | 141 |
| 71-100 | 84.4% | 173 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.6% | 1660 |
| 16-30 | 43.4% | 205 |
| 31-50 | 44.0% | 100 |
| 51-70 | 22.6% | 31 |
| 71-100 | 50.0% | 4 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 1657 |
| 16-30 | 44.3% | 194 |
| 31-50 | 41.4% | 116 |
| 51-70 | 22.2% | 27 |
| 71-100 | 33.3% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.5% | 1663 |
| 16-30 | 44.3% | 201 |
| 31-50 | 44.7% | 103 |
| 51-70 | 22.2% | 27 |
| 71-100 | 33.3% | 6 |
