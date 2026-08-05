# Combat Simulation Report
Generated: 2026-08-05 03:22:18 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 8.6 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 905 (90.5%) |
| Timeouts (draws) | 95 (9.5%) |
| Avg rounds (all) | 7.4 |
| Avg rounds (KO only) | 5.9 |
| Rounds P50 / P90 / Max | 5 / 19 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 142 |
| Avg rounds | 8.6 |
| P50 / P90 | 6 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 501/1000 |
| Winrate | 50.1% |
| Advantage over 50% | 0.1% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 96 | 149 | 64.4% | YES |
| Asesino | 56 | 141 | 39.7% |  |
| Esquivo | 64 | 143 | 44.8% |  |
| Equilibrado | 91 | 142 | 64.1% |  |
| Extremista ATK | 62 | 152 | 40.8% |  |
| Extremista DEF | 90 | 141 | 63.8% |  |
| Extremista ASPD | 49 | 132 | 37.1% |  |
| Extremista REF | 60 | 137 | 43.8% |  |
| Velocista | 93 | 154 | 60.4% |  |
| Berserker | 60 | 147 | 40.8% |  |
| Guardian | 75 | 132 | 56.8% |  |
| Estratega | 78 | 144 | 54.2% |  |
| Gladiador | 74 | 138 | 53.6% |  |
| Magus | 52 | 148 | 35.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 58.0 | - |
| Rests | 2.7 | 1 |
| Advances | 3.9 | - |
| Retreats | 0.1 | - |
| Battles with item use | 43.9% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.39 (avg 47.02) |
| ASPD spread (stddev) | 31.31 (avg 52.49) |
| Equipment tier A | 264 (13.2%) |
| Equipment tier B | 373 (18.6%) |
| Equipment tier C | 500 (25.0%) |
| Equipment tier E | 863 (43.1%) |
| Level 100-199 | 517 |
| Level 200-299 | 549 |
| Level 300-399 | 489 |
| Level 400-500 | 445 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 598 |
| cortante | 611 |
| desarmado | 189 |
| perforante | 602 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2000 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 50.0% |
Set bonus active: 50.0% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 51.0% (781) vs without 49.4% (1219)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 236 | 67.4% |
| B | 344 | 59.6% |
| C | 454 | 51.5% |
| E | 777 | 41.7% |
| desarmado | 189 | 41.3% |

### Nature by level bracket
- **100-199**: contundente: 152, cortante: 174, desarmado: 54, perforante: 137
- **200-299**: contundente: 164, cortante: 165, desarmado: 45, perforante: 175
- **300-399**: contundente: 141, cortante: 151, desarmado: 46, perforante: 151
- **400-500**: contundente: 141, cortante: 121, desarmado: 44, perforante: 139

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 42.2% | 490 | 52.5% | 1510 | -10.3pp |
| d_fulgor | 42.1% | 489 | 52.5% | 1511 | -10.4pp |
| r_fulgor | 43.0% | 488 | 52.2% | 1512 | -9.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 15.8 | 0 | 128 | 0 | 11 | 19 |
| Asesino | 53.7 | 0 | 128 | 32 | 49 | 76 |
| Esquivo | 16.8 | 0 | 128 | 0 | 14 | 20 |
| Equilibrado | 33.7 | 0 | 128 | 12 | 34 | 47 |
| Extremista ATK | 52.2 | 0 | 128 | 19 | 52 | 69 |
| Extremista DEF | 6.8 | 0 | 128 | 0 | 0 | 8 |
| Extremista ASPD | 46.4 | 0 | 128 | 20 | 46 | 66 |
| Extremista REF | 27.6 | 0 | 128 | 9 | 22 | 35 |
| Velocista | 23.6 | 0 | 128 | 9 | 16 | 29 |
| Berserker | 57.5 | 0 | 128 | 46 | 56 | 72 |
| Guardian | 13.5 | 0 | 128 | 0 | 9 | 19 |
| Estratega | 28.7 | 0 | 128 | 14 | 19 | 35 |
| Gladiador | 45.7 | 0 | 128 | 19 | 43 | 68 |
| Magus | 44.8 | 10 | 128 | 20 | 39 | 57 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 151 | 151 | 100.0% |
| Asesino | 127 | 127 | 100.0% |
| Esquivo | 547 | 547 | 100.0% |
| Equilibrado | 203 | 203 | 100.0% |
| Extremista ATK | 147 | 147 | 100.0% |
| Extremista DEF | 149 | 149 | 100.0% |
| Extremista ASPD | 68 | 68 | 100.0% |
| Extremista REF | 142 | 142 | 100.0% |
| Velocista | 178 | 178 | 100.0% |
| Berserker | 107 | 107 | 100.0% |
| Guardian | 141 | 141 | 100.0% |
| Estratega | 193 | 193 | 100.0% |
| Gladiador | 40 | 40 | 100.0% |
| Magus | 263 | 263 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 44 | 791 | 5.6% |
| Asesino | 7 | 419 | 1.7% |
| Esquivo | 214 | 874 | 24.5% |
| Equilibrado | 20 | 516 | 3.9% |
| Extremista ATK | 51 | 567 | 9.0% |
| Extremista DEF | 250 | 866 | 28.9% |
| Extremista ASPD | 56 | 451 | 12.4% |
| Extremista REF | 582 | 819 | 71.1% |
| Velocista | 0 | 426 | 0.0% |
| Berserker | 58 | 556 | 10.4% |
| Guardian | 2 | 759 | 0.3% |
| Estratega | 395 | 717 | 55.1% |
| Gladiador | 181 | 445 | 40.7% |
| Magus | 116 | 708 | 16.4% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 17 | 12 | 15 | 9 | 10 | 9 | 9 | 8 | 10 | 15 | 15 | 10 | 18 |
| 5 | 25 | 22 | 16 | 22 | 17 | 18 | 16 | 12 | 13 | 17 | 23 | 18 | 18 | 23 |
| 10 | 27 | 22 | 18 | 24 | 17 | 22 | 16 | 10 | 17 | 17 | 25 | 17 | 18 | 23 |
| 15 | 28 | 22 | 23 | 24 | 18 | 26 | 16 | 10 | 17 | 17 | 26 | 17 | 19 | 23 |
| 20 | 27 | 22 | 24 | 25 | 18 | 28 | 16 | 10 | 19 | 17 | 27 | 17 | 19 | 23 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 50.0% | 85.7% | 36.4% | 87.5% | 41.7% | 100.0% | 57.1% | 41.2% | 100.0% | 71.4% | 54.5% | 75.0% | 72.7% |
| Asesino | 50.0% | 50.0% | 54.5% | 40.0% | 42.9% | 16.7% | 37.5% | 41.7% | 23.5% | 25.0% | 41.7% | 23.1% | 36.4% | 77.8% |
| Esquivo | 14.3% | 45.5% | 50.0% | 30.0% | 55.6% | 25.0% | 70.0% | 75.0% | 42.9% | 62.5% | 40.0% | 43.8% | 40.0% | 57.1% |
| Equilibrado | 63.6% | 60.0% | 70.0% | 50.0% | 58.3% | 62.5% | 71.4% | 87.5% | 63.6% | 68.8% | 50.0% | 44.4% | 57.1% | 70.0% |
| Extremista ATK | 12.5% | 57.1% | 44.4% | 41.7% | 50.0% | 26.7% | 55.6% | 36.4% | 25.0% | 20.0% | 50.0% | 40.0% | 33.3% | 70.0% |
| Extremista DEF | 58.3% | 83.3% | 75.0% | 37.5% | 73.3% | 50.0% | 83.3% | 66.7% | 62.5% | 66.7% | 50.0% | 71.4% | 57.1% | 63.6% |
| Extremista ASPD | 0.0% | 62.5% | 30.0% | 28.6% | 44.4% | 16.7% | 50.0% | 42.9% | 36.4% | 50.0% | 28.6% | 16.7% | 37.5% | 55.6% |
| Extremista REF | 42.9% | 58.3% | 25.0% | 12.5% | 63.6% | 33.3% | 57.1% | 50.0% | 45.5% | 36.4% | 50.0% | 60.0% | 25.0% | 75.0% |
| Velocista | 58.8% | 76.5% | 57.1% | 36.4% | 75.0% | 37.5% | 63.6% | 54.5% | 50.0% | 70.0% | 50.0% | 50.0% | 66.7% | 83.3% |
| Berserker | 0.0% | 75.0% | 37.5% | 31.3% | 80.0% | 33.3% | 50.0% | 63.6% | 30.0% | 50.0% | 0.0% | 41.7% | 11.1% | 61.5% |
| Guardian | 28.6% | 58.3% | 60.0% | 50.0% | 50.0% | 50.0% | 71.4% | 50.0% | 50.0% | 100.0% | 50.0% | 50.0% | 70.0% | 63.6% |
| Estratega | 45.5% | 76.9% | 56.3% | 55.6% | 60.0% | 28.6% | 83.3% | 40.0% | 50.0% | 58.3% | 50.0% | 50.0% | 54.5% | 46.2% |
| Gladiador | 25.0% | 63.6% | 60.0% | 42.9% | 66.7% | 42.9% | 62.5% | 75.0% | 33.3% | 88.9% | 30.0% | 45.5% | 50.0% | 62.5% |
| Magus | 27.3% | 22.2% | 42.9% | 30.0% | 30.0% | 36.4% | 44.4% | 25.0% | 16.7% | 38.5% | 36.4% | 53.8% | 37.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.6% | 368 |
| 16-30 | 53.2% | 502 |
| 31-50 | 52.8% | 362 |
| 51-70 | 50.3% | 193 |
| 71-100 | 47.0% | 575 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.4% | 11 |
| 16-30 | 36.1% | 415 |
| 31-50 | 43.3% | 780 |
| 51-70 | 62.4% | 290 |
| 71-100 | 64.9% | 504 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.6% | 273 |
| 16-30 | 45.0% | 409 |
| 31-50 | 50.0% | 350 |
| 51-70 | 54.3% | 269 |
| 71-100 | 50.6% | 699 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.1% | 505 |
| 16-30 | 43.3% | 473 |
| 31-50 | 49.9% | 387 |
| 51-70 | 59.3% | 221 |
| 71-100 | 58.7% | 414 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.9% | 828 |
| 16-30 | 45.0% | 544 |
| 31-50 | 46.1% | 297 |
| 51-70 | 73.3% | 146 |
| 71-100 | 75.1% | 185 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 1614 |
| 16-30 | 42.7% | 232 |
| 31-50 | 52.1% | 119 |
| 51-70 | 29.0% | 31 |
| 71-100 | 25.0% | 4 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 1612 |
| 16-30 | 44.9% | 236 |
| 31-50 | 44.5% | 128 |
| 51-70 | 28.6% | 21 |
| 71-100 | 66.7% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.5% | 1608 |
| 16-30 | 44.8% | 239 |
| 31-50 | 46.8% | 109 |
| 51-70 | 35.0% | 40 |
| 71-100 | 0.0% | 4 |
