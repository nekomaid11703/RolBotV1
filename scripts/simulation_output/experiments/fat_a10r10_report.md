# Combat Simulation Report
Generated: 2026-08-05 03:14:21 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1712 (85.6%) |
| Timeouts (draws) | 288 (14.4%) |
| Avg rounds (all) | 9.2 |
| Avg rounds (KO only) | 7.3 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 313 |
| Avg rounds | 10.1 |
| P50 / P90 | 7 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1024/2000 |
| Winrate | 51.2% |
| Advantage over 50% | 1.2% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 180 | 281 | 64.1% |  |
| Asesino | 115 | 303 | 38.0% |  |
| Esquivo | 150 | 274 | 54.7% |  |
| Equilibrado | 147 | 267 | 55.1% |  |
| Extremista ATK | 136 | 294 | 46.3% |  |
| Extremista DEF | 161 | 258 | 62.4% |  |
| Extremista ASPD | 118 | 311 | 37.9% |  |
| Extremista REF | 93 | 259 | 35.9% |  |
| Velocista | 165 | 311 | 53.1% |  |
| Berserker | 124 | 284 | 43.7% |  |
| Guardian | 196 | 299 | 65.6% | YES |
| Estratega | 162 | 296 | 54.7% |  |
| Gladiador | 132 | 286 | 46.2% |  |
| Magus | 119 | 277 | 43.0% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.3 | 1 |
| Heal applied | 83.3 | - |
| Rests | 3.9 | 3 |
| Advances | 4.1 | - |
| Retreats | 0.1 | - |
| Battles with item use | 50.0% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.76 (avg 48.91) |
| ASPD spread (stddev) | 31.52 (avg 55.01) |
| Equipment tier A | 549 (13.7%) |
| Equipment tier B | 861 (21.5%) |
| Equipment tier C | 1033 (25.8%) |
| Equipment tier E | 1557 (38.9%) |
| Level 100-199 | 923 |
| Level 200-299 | 1078 |
| Level 300-399 | 997 |
| Level 400-500 | 1002 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1163 |
| cortante | 1230 |
| desarmado | 379 |
| perforante | 1228 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1313 | 48.4% |
| ligera | 20 | 55.0% |
| media | 133 | 44.4% |
| total | 2534 | 51.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 87 | 41.4% |
| 3+ | 3913 | 50.1% |
Set bonus active: 50.1% (3913) vs inactive 41.4% (87)

### Amulet
With amulet: 51.4% (1576) vs without 49.0% (2424)

### Shield
With shield: 49.6% (2439) vs without 50.5% (1561)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 498 | 68.9% |
| B | 783 | 59.5% |
| C | 935 | 48.3% |
| E | 1405 | 41.3% |
| desarmado | 379 | 41.4% |

### Nature by level bracket
- **100-199**: contundente: 251, cortante: 309, desarmado: 82, perforante: 281
- **200-299**: contundente: 325, cortante: 327, desarmado: 105, perforante: 321
- **300-399**: contundente: 291, cortante: 299, desarmado: 101, perforante: 306
- **400-500**: contundente: 296, cortante: 295, desarmado: 91, perforante: 320

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 39.7% | 963 | 53.2% | 3037 | -13.5pp |
| d_fulgor | 39.4% | 972 | 53.3% | 3028 | -13.9pp |
| r_fulgor | 39.3% | 967 | 53.3% | 3033 | -14.0pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.8 | 0 | 128 | 7 | 14 | 27 |
| Asesino | 63.0 | 0 | 128 | 46 | 63 | 84 |
| Esquivo | 22.0 | 0 | 128 | 0 | 15 | 34 |
| Equilibrado | 33.3 | 0 | 128 | 19 | 31 | 46 |
| Extremista ATK | 57.4 | 0 | 128 | 46 | 54 | 74 |
| Extremista DEF | 8.4 | 0 | 128 | 0 | 0 | 8 |
| Extremista ASPD | 51.3 | 9 | 128 | 26 | 46 | 69 |
| Extremista REF | 28.9 | 0 | 128 | 14 | 19 | 35 |
| Velocista | 24.1 | 0 | 128 | 10 | 17 | 31 |
| Berserker | 58.8 | 0 | 128 | 46 | 61 | 75 |
| Guardian | 15.0 | 0 | 128 | 0 | 11 | 20 |
| Estratega | 33.2 | 0 | 128 | 18 | 23 | 46 |
| Gladiador | 51.2 | 0 | 128 | 25 | 49 | 65 |
| Magus | 46.1 | 0 | 128 | 22 | 45 | 64 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 365 | 365 | 100.0% |
| Asesino | 223 | 223 | 100.0% |
| Esquivo | 985 | 985 | 100.0% |
| Equilibrado | 695 | 695 | 100.0% |
| Extremista ATK | 42 | 42 | 100.0% |
| Extremista DEF | 239 | 239 | 100.0% |
| Extremista ASPD | 220 | 220 | 100.0% |
| Extremista REF | 181 | 181 | 100.0% |
| Velocista | 525 | 525 | 100.0% |
| Berserker | 145 | 145 | 100.0% |
| Guardian | 587 | 587 | 100.0% |
| Estratega | 527 | 527 | 100.0% |
| Gladiador | 253 | 253 | 100.0% |
| Magus | 369 | 369 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 36 | 2017 | 1.8% |
| Asesino | 9 | 1147 | 0.8% |
| Esquivo | 593 | 1819 | 32.6% |
| Equilibrado | 56 | 1838 | 3.0% |
| Extremista ATK | 121 | 1423 | 8.5% |
| Extremista DEF | 462 | 1766 | 26.2% |
| Extremista ASPD | 102 | 1687 | 6.0% |
| Extremista REF | 1244 | 1744 | 71.3% |
| Velocista | 0 | 1516 | 0.0% |
| Berserker | 177 | 1439 | 12.3% |
| Guardian | 6 | 2181 | 0.3% |
| Estratega | 1135 | 2196 | 51.7% |
| Gladiador | 571 | 1620 | 35.2% |
| Magus | 266 | 1586 | 16.8% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 15 | 12 | 17 | 10 | 10 | 10 | 10 | 5 | 10 | 15 | 14 | 11 | 17 |
| 5 | 24 | 22 | 15 | 24 | 19 | 19 | 18 | 13 | 13 | 19 | 23 | 19 | 18 | 23 |
| 10 | 28 | 22 | 18 | 27 | 20 | 24 | 18 | 11 | 17 | 19 | 26 | 18 | 18 | 24 |
| 15 | 30 | 22 | 20 | 28 | 20 | 27 | 19 | 11 | 17 | 19 | 29 | 18 | 19 | 24 |
| 20 | 30 | 22 | 22 | 28 | 20 | 29 | 19 | 12 | 17 | 19 | 30 | 18 | 20 | 24 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 78.9% | 65.0% | 41.2% | 75.0% | 53.3% | 76.0% | 61.9% | 83.3% | 61.9% | 54.5% | 60.0% | 47.8% | 69.0% |
| Asesino | 21.1% | 50.0% | 37.1% | 34.6% | 65.0% | 15.4% | 20.0% | 54.5% | 25.0% | 26.3% | 28.0% | 40.9% | 52.4% | 44.4% |
| Esquivo | 35.0% | 62.9% | 50.0% | 42.9% | 55.0% | 52.6% | 79.2% | 60.0% | 53.3% | 80.0% | 38.1% | 66.7% | 47.8% | 33.3% |
| Equilibrado | 52.9% | 65.4% | 57.1% | 50.0% | 59.1% | 41.7% | 53.8% | 79.2% | 50.0% | 66.7% | 47.1% | 30.0% | 45.0% | 58.8% |
| Extremista ATK | 25.0% | 35.0% | 45.0% | 40.9% | 50.0% | 5.9% | 60.0% | 81.3% | 43.5% | 53.8% | 39.1% | 31.6% | 56.3% | 68.2% |
| Extremista DEF | 46.7% | 84.6% | 47.4% | 58.3% | 94.1% | 50.0% | 69.2% | 66.7% | 68.0% | 81.0% | 22.7% | 65.2% | 59.1% | 72.2% |
| Extremista ASPD | 24.0% | 80.0% | 20.8% | 46.2% | 40.0% | 30.8% | 50.0% | 38.9% | 34.6% | 44.4% | 11.5% | 18.5% | 55.6% | 60.0% |
| Extremista REF | 38.1% | 45.5% | 40.0% | 20.8% | 18.8% | 33.3% | 61.1% | 50.0% | 44.4% | 36.8% | 15.8% | 37.5% | 30.4% | 35.3% |
| Velocista | 16.7% | 75.0% | 46.7% | 50.0% | 56.5% | 32.0% | 65.4% | 55.6% | 50.0% | 64.7% | 41.7% | 42.9% | 81.5% | 68.2% |
| Berserker | 38.1% | 73.7% | 20.0% | 33.3% | 46.2% | 19.0% | 55.6% | 63.2% | 35.3% | 50.0% | 28.6% | 40.0% | 72.2% | 42.1% |
| Guardian | 45.5% | 72.0% | 61.9% | 52.9% | 60.9% | 77.3% | 88.5% | 84.2% | 58.3% | 71.4% | 50.0% | 52.4% | 62.5% | 72.7% |
| Estratega | 40.0% | 59.1% | 33.3% | 70.0% | 68.4% | 34.8% | 81.5% | 62.5% | 57.1% | 60.0% | 42.9% | 50.0% | 47.1% | 53.3% |
| Gladiador | 52.2% | 47.6% | 52.2% | 55.0% | 43.8% | 40.9% | 44.4% | 69.6% | 18.5% | 27.8% | 37.5% | 52.9% | 50.0% | 55.0% |
| Magus | 31.0% | 55.6% | 66.7% | 41.2% | 31.8% | 27.8% | 40.0% | 64.7% | 31.8% | 57.9% | 27.3% | 46.7% | 45.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.2% | 651 |
| 16-30 | 49.8% | 1026 |
| 31-50 | 53.7% | 671 |
| 51-70 | 52.5% | 400 |
| 71-100 | 49.2% | 1252 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 6.9% | 29 |
| 16-30 | 32.3% | 854 |
| 31-50 | 43.9% | 1460 |
| 51-70 | 59.8% | 649 |
| 71-100 | 68.6% | 1008 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.1% | 448 |
| 16-30 | 45.5% | 800 |
| 31-50 | 50.3% | 727 |
| 51-70 | 46.7% | 505 |
| 71-100 | 52.8% | 1520 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.8% | 929 |
| 16-30 | 43.5% | 944 |
| 31-50 | 50.7% | 744 |
| 51-70 | 59.0% | 459 |
| 71-100 | 58.5% | 924 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.5% | 1527 |
| 16-30 | 45.9% | 1121 |
| 31-50 | 50.2% | 651 |
| 51-70 | 70.5% | 302 |
| 71-100 | 70.2% | 399 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 3224 |
| 16-30 | 40.1% | 444 |
| 31-50 | 43.0% | 256 |
| 51-70 | 33.8% | 65 |
| 71-100 | 27.3% | 11 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 3216 |
| 16-30 | 39.4% | 462 |
| 31-50 | 44.0% | 243 |
| 51-70 | 30.7% | 75 |
| 71-100 | 25.0% | 4 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 3230 |
| 16-30 | 40.2% | 438 |
| 31-50 | 43.2% | 259 |
| 51-70 | 24.6% | 65 |
| 71-100 | 37.5% | 8 |
