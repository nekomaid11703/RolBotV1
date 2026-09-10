# Combat Simulation Report
Generated: 2026-08-05 03:17:10 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.7 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1837 (91.8%) |
| Timeouts (draws) | 163 (8.2%) |
| Avg rounds (all) | 7.4 |
| Avg rounds (KO only) | 6.1 |
| Rounds P50 / P90 / Max | 5 / 18 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 324 |
| Avg rounds | 7.7 |
| P50 / P90 | 6 / 19 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1010/2000 |
| Winrate | 50.5% |
| Advantage over 50% | 0.5% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 164 | 263 | 62.4% |  |
| Asesino | 92 | 278 | 33.1% |  |
| Esquivo | 138 | 287 | 48.1% |  |
| Equilibrado | 165 | 282 | 58.5% |  |
| Extremista ATK | 110 | 277 | 39.7% |  |
| Extremista DEF | 185 | 290 | 63.8% | YES |
| Extremista ASPD | 113 | 268 | 42.2% |  |
| Extremista REF | 135 | 319 | 42.3% |  |
| Velocista | 171 | 286 | 59.8% |  |
| Berserker | 136 | 323 | 42.1% |  |
| Guardian | 177 | 283 | 62.5% |  |
| Estratega | 120 | 247 | 48.6% |  |
| Gladiador | 166 | 303 | 54.8% |  |
| Magus | 126 | 294 | 42.9% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 59.4 | - |
| Rests | 2.8 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.1 | - |
| Battles with item use | 43.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.38 (avg 48.31) |
| ASPD spread (stddev) | 31.22 (avg 53.78) |
| Equipment tier A | 515 (12.9%) |
| Equipment tier B | 843 (21.1%) |
| Equipment tier C | 1075 (26.9%) |
| Equipment tier E | 1567 (39.2%) |
| Level 100-199 | 953 |
| Level 200-299 | 1084 |
| Level 300-399 | 1042 |
| Level 400-500 | 921 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1164 |
| cortante | 1232 |
| desarmado | 378 |
| perforante | 1226 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1282 | 48.3% |
| ligera | 15 | 53.3% |
| media | 133 | 42.9% |
| total | 2570 | 51.1% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 87 | 37.9% |
| 3+ | 3913 | 50.2% |
Set bonus active: 50.2% (3913) vs inactive 37.9% (87)

### Amulet
With amulet: 49.5% (1559) vs without 50.2% (2441)

### Shield
With shield: 50.3% (2405) vs without 49.5% (1595)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 466 | 67.6% |
| B | 759 | 58.0% |
| C | 980 | 50.5% |
| E | 1417 | 41.3% |
| desarmado | 378 | 43.1% |

### Nature by level bracket
- **100-199**: contundente: 254, cortante: 307, desarmado: 90, perforante: 302
- **200-299**: contundente: 333, cortante: 311, desarmado: 109, perforante: 331
- **300-399**: contundente: 301, cortante: 345, desarmado: 96, perforante: 300
- **400-500**: contundente: 276, cortante: 269, desarmado: 83, perforante: 293

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 42.3% | 887 | 52.1% | 3113 | -9.9pp |
| d_fulgor | 42.8% | 880 | 52.0% | 3120 | -9.1pp |
| r_fulgor | 43.0% | 886 | 51.9% | 3114 | -8.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 18.5 | 0 | 128 | 6 | 14 | 24 |
| Asesino | 58.8 | 0 | 128 | 44 | 59 | 78 |
| Esquivo | 18.6 | 0 | 128 | 0 | 14 | 27 |
| Equilibrado | 32.8 | 0 | 128 | 19 | 28 | 46 |
| Extremista ATK | 57.7 | 0 | 128 | 42 | 52 | 78 |
| Extremista DEF | 8.7 | 0 | 128 | 0 | 0 | 12 |
| Extremista ASPD | 47.6 | 8 | 128 | 21 | 45 | 66 |
| Extremista REF | 28.1 | 0 | 128 | 14 | 20 | 36 |
| Velocista | 22.4 | 0 | 128 | 10 | 17 | 26 |
| Berserker | 63.1 | 0 | 128 | 46 | 59 | 83 |
| Guardian | 11.8 | 0 | 128 | 0 | 5 | 16 |
| Estratega | 31.8 | 0 | 128 | 12 | 22 | 43 |
| Gladiador | 47.7 | 0 | 128 | 29 | 46 | 64 |
| Magus | 46.2 | 10 | 128 | 24 | 41 | 59 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 250 | 250 | 100.0% |
| Asesino | 165 | 165 | 100.0% |
| Esquivo | 915 | 915 | 100.0% |
| Equilibrado | 598 | 598 | 100.0% |
| Extremista ATK | 206 | 206 | 100.0% |
| Extremista DEF | 247 | 247 | 100.0% |
| Extremista ASPD | 201 | 201 | 100.0% |
| Extremista REF | 251 | 251 | 100.0% |
| Velocista | 324 | 324 | 100.0% |
| Berserker | 122 | 122 | 100.0% |
| Guardian | 519 | 519 | 100.0% |
| Estratega | 263 | 263 | 100.0% |
| Gladiador | 284 | 284 | 100.0% |
| Magus | 333 | 333 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 57 | 1432 | 4.0% |
| Asesino | 8 | 744 | 1.1% |
| Esquivo | 427 | 1564 | 27.3% |
| Equilibrado | 41 | 1221 | 3.4% |
| Extremista ATK | 119 | 1131 | 10.5% |
| Extremista DEF | 411 | 1466 | 28.0% |
| Extremista ASPD | 113 | 1044 | 10.8% |
| Extremista REF | 1165 | 1658 | 70.3% |
| Velocista | 0 | 740 | 0.0% |
| Berserker | 138 | 1180 | 11.7% |
| Guardian | 4 | 1797 | 0.2% |
| Estratega | 643 | 1200 | 53.6% |
| Gladiador | 564 | 1258 | 44.8% |
| Magus | 144 | 1072 | 13.4% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 15 | 15 | 15 | 10 | 10 | 11 | 10 | 7 | 11 | 12 | 14 | 9 | 16 |
| 5 | 25 | 20 | 17 | 22 | 17 | 18 | 18 | 13 | 12 | 18 | 21 | 17 | 17 | 20 |
| 10 | 28 | 20 | 19 | 24 | 17 | 22 | 18 | 13 | 15 | 18 | 24 | 16 | 17 | 20 |
| 15 | 29 | 20 | 20 | 25 | 17 | 25 | 19 | 13 | 15 | 18 | 25 | 16 | 17 | 20 |
| 20 | 29 | 20 | 21 | 25 | 17 | 26 | 19 | 13 | 15 | 18 | 25 | 16 | 18 | 20 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 89.5% | 41.2% | 44.4% | 69.2% | 55.0% | 78.6% | 50.0% | 78.3% | 56.5% | 57.1% | 60.0% | 63.6% | 65.2% |
| Asesino | 10.5% | 50.0% | 55.0% | 36.0% | 33.3% | 21.4% | 31.3% | 27.3% | 21.1% | 56.3% | 25.9% | 50.0% | 21.7% | 32.0% |
| Esquivo | 47.1% | 45.0% | 50.0% | 59.1% | 61.1% | 52.9% | 37.5% | 53.6% | 28.6% | 72.7% | 37.0% | 34.8% | 34.8% | 54.5% |
| Equilibrado | 55.6% | 64.0% | 40.9% | 50.0% | 73.9% | 60.0% | 80.0% | 53.8% | 47.4% | 50.0% | 57.9% | 53.3% | 52.4% | 87.0% |
| Extremista ATK | 30.8% | 66.7% | 38.9% | 26.1% | 50.0% | 4.2% | 48.0% | 61.1% | 33.3% | 40.9% | 25.0% | 46.2% | 45.0% | 62.5% |
| Extremista DEF | 45.0% | 78.6% | 47.1% | 40.0% | 95.8% | 50.0% | 72.0% | 78.6% | 44.4% | 81.3% | 40.9% | 56.3% | 60.7% | 73.3% |
| Extremista ASPD | 21.4% | 68.8% | 62.5% | 20.0% | 52.0% | 28.0% | 50.0% | 47.4% | 42.1% | 40.0% | 14.3% | 53.3% | 46.2% | 41.7% |
| Extremista REF | 50.0% | 72.7% | 46.4% | 46.2% | 38.9% | 21.4% | 52.6% | 50.0% | 31.0% | 47.6% | 29.4% | 42.1% | 27.3% | 42.9% |
| Velocista | 21.7% | 78.9% | 71.4% | 52.6% | 66.7% | 55.6% | 57.9% | 69.0% | 50.0% | 67.7% | 47.6% | 73.3% | 55.0% | 68.2% |
| Berserker | 43.5% | 43.8% | 27.3% | 50.0% | 59.1% | 18.8% | 60.0% | 52.4% | 32.3% | 50.0% | 16.7% | 48.3% | 26.3% | 66.7% |
| Guardian | 42.9% | 74.1% | 63.0% | 42.1% | 75.0% | 59.1% | 85.7% | 70.6% | 52.4% | 83.3% | 50.0% | 62.5% | 54.5% | 58.8% |
| Estratega | 40.0% | 50.0% | 65.2% | 46.7% | 53.8% | 43.8% | 46.7% | 57.9% | 26.7% | 51.7% | 37.5% | 50.0% | 41.2% | 58.8% |
| Gladiador | 36.4% | 78.3% | 65.2% | 47.6% | 55.0% | 39.3% | 53.8% | 72.7% | 45.0% | 73.7% | 45.5% | 58.8% | 50.0% | 50.0% |
| Magus | 34.8% | 68.0% | 45.5% | 13.0% | 37.5% | 26.7% | 58.3% | 57.1% | 31.8% | 33.3% | 41.2% | 41.2% | 50.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.2% | 650 |
| 16-30 | 51.7% | 1032 |
| 31-50 | 53.0% | 702 |
| 51-70 | 49.8% | 402 |
| 71-100 | 47.7% | 1214 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 19.4% | 36 |
| 16-30 | 34.3% | 865 |
| 31-50 | 45.1% | 1477 |
| 51-70 | 57.5% | 635 |
| 71-100 | 67.2% | 987 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.7% | 469 |
| 16-30 | 44.6% | 803 |
| 31-50 | 48.9% | 759 |
| 51-70 | 53.0% | 540 |
| 71-100 | 52.5% | 1429 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.4% | 889 |
| 16-30 | 44.1% | 974 |
| 31-50 | 50.4% | 713 |
| 51-70 | 60.5% | 496 |
| 71-100 | 56.4% | 928 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.9% | 1580 |
| 16-30 | 43.0% | 1116 |
| 31-50 | 47.6% | 676 |
| 51-70 | 77.2% | 276 |
| 71-100 | 77.6% | 352 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.2% | 3300 |
| 16-30 | 44.4% | 392 |
| 31-50 | 42.2% | 244 |
| 51-70 | 45.8% | 59 |
| 71-100 | 60.0% | 5 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 3297 |
| 16-30 | 42.6% | 394 |
| 31-50 | 42.5% | 240 |
| 51-70 | 46.8% | 62 |
| 71-100 | 57.1% | 7 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.2% | 3298 |
| 16-30 | 44.1% | 397 |
| 31-50 | 43.6% | 236 |
| 51-70 | 44.4% | 63 |
| 71-100 | 33.3% | 6 |
