# Combat Simulation Report
Generated: 2026-08-05 03:13:34 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 9.8 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1714 (85.7%) |
| Timeouts (draws) | 286 (14.3%) |
| Avg rounds (all) | 9.3 |
| Avg rounds (KO only) | 7.4 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 306 |
| Avg rounds | 9.8 |
| P50 / P90 | 7 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1072/2000 |
| Winrate | 53.6% |
| Advantage over 50% | 3.6% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 206 | 302 | 68.2% | YES |
| Asesino | 101 | 290 | 34.8% |  |
| Esquivo | 131 | 260 | 50.4% |  |
| Equilibrado | 155 | 287 | 54.0% |  |
| Extremista ATK | 116 | 291 | 39.9% |  |
| Extremista DEF | 192 | 300 | 64.0% |  |
| Extremista ASPD | 117 | 292 | 40.1% |  |
| Extremista REF | 135 | 296 | 45.6% |  |
| Velocista | 151 | 282 | 53.5% |  |
| Berserker | 111 | 289 | 38.4% |  |
| Guardian | 164 | 267 | 61.4% |  |
| Estratega | 150 | 275 | 54.5% |  |
| Gladiador | 143 | 284 | 50.4% |  |
| Magus | 127 | 285 | 44.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.2 | 1 |
| Heal applied | 77.0 | - |
| Rests | 4.0 | 3 |
| Advances | 4.3 | - |
| Retreats | 0.1 | - |
| Battles with item use | 50.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 91.4% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.19 (avg 47.76) |
| ASPD spread (stddev) | 31.25 (avg 53.41) |
| Equipment tier A | 489 (12.2%) |
| Equipment tier B | 827 (20.7%) |
| Equipment tier C | 1033 (25.8%) |
| Equipment tier E | 1651 (41.3%) |
| Level 100-199 | 996 |
| Level 200-299 | 1100 |
| Level 300-399 | 979 |
| Level 400-500 | 925 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1218 |
| cortante | 1224 |
| desarmado | 345 |
| perforante | 1213 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1324 | 50.4% |
| ligera | 18 | 33.3% |
| media | 119 | 46.2% |
| total | 2539 | 50.1% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 109 | 54.1% |
| 3+ | 3891 | 49.9% |
Set bonus active: 49.9% (3891) vs inactive 54.1% (109)

### Amulet
With amulet: 51.6% (1620) vs without 48.9% (2380)

### Shield
With shield: 49.6% (2409) vs without 50.6% (1591)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 441 | 69.6% |
| B | 759 | 57.4% |
| C | 946 | 51.5% |
| E | 1509 | 42.5% |
| desarmado | 345 | 36.8% |

### Nature by level bracket
- **100-199**: contundente: 291, cortante: 309, desarmado: 83, perforante: 313
- **200-299**: contundente: 337, cortante: 355, desarmado: 90, perforante: 318
- **300-399**: contundente: 300, cortante: 285, desarmado: 80, perforante: 314
- **400-500**: contundente: 290, cortante: 275, desarmado: 92, perforante: 268

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 38.5% | 955 | 53.6% | 3045 | -15.0pp |
| d_fulgor | 39.0% | 951 | 53.4% | 3049 | -14.4pp |
| r_fulgor | 39.0% | 945 | 53.4% | 3055 | -14.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 21.1 | 0 | 128 | 5 | 15 | 28 |
| Asesino | 56.1 | 0 | 128 | 45 | 56 | 70 |
| Esquivo | 20.1 | 0 | 128 | 0 | 12 | 29 |
| Equilibrado | 32.6 | 0 | 128 | 16 | 29 | 45 |
| Extremista ATK | 55.8 | 0 | 128 | 46 | 51 | 73 |
| Extremista DEF | 10.8 | 0 | 128 | 0 | 0 | 14 |
| Extremista ASPD | 47.9 | 9 | 128 | 23 | 46 | 66 |
| Extremista REF | 25.8 | 0 | 128 | 11 | 19 | 35 |
| Velocista | 24.4 | 0 | 128 | 11 | 19 | 32 |
| Berserker | 57.7 | 0 | 128 | 39 | 60 | 79 |
| Guardian | 13.1 | 0 | 128 | 0 | 7 | 19 |
| Estratega | 30.7 | 0 | 128 | 19 | 24 | 39 |
| Gladiador | 47.4 | 0 | 128 | 19 | 45 | 63 |
| Magus | 47.5 | 8 | 128 | 21 | 45 | 73 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 367 | 367 | 100.0% |
| Asesino | 289 | 289 | 100.0% |
| Esquivo | 1208 | 1208 | 100.0% |
| Equilibrado | 884 | 884 | 100.0% |
| Extremista ATK | 253 | 253 | 100.0% |
| Extremista DEF | 183 | 183 | 100.0% |
| Extremista ASPD | 243 | 243 | 100.0% |
| Extremista REF | 189 | 189 | 100.0% |
| Velocista | 571 | 571 | 100.0% |
| Berserker | 183 | 183 | 100.0% |
| Guardian | 352 | 352 | 100.0% |
| Estratega | 404 | 404 | 100.0% |
| Gladiador | 232 | 232 | 100.0% |
| Magus | 396 | 396 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 78 | 2202 | 3.5% |
| Asesino | 14 | 1273 | 1.1% |
| Esquivo | 445 | 1932 | 23.0% |
| Equilibrado | 93 | 1932 | 4.8% |
| Extremista ATK | 166 | 1632 | 10.2% |
| Extremista DEF | 398 | 1968 | 20.2% |
| Extremista ASPD | 85 | 1525 | 5.6% |
| Extremista REF | 1358 | 1870 | 72.6% |
| Velocista | 0 | 1475 | 0.0% |
| Berserker | 119 | 1480 | 8.0% |
| Guardian | 8 | 2035 | 0.4% |
| Estratega | 1121 | 2013 | 55.7% |
| Gladiador | 471 | 1351 | 34.9% |
| Magus | 282 | 1576 | 17.9% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 16 | 13 | 16 | 9 | 10 | 10 | 9 | 6 | 11 | 14 | 13 | 9 | 16 |
| 5 | 24 | 22 | 17 | 23 | 18 | 19 | 19 | 14 | 12 | 20 | 22 | 18 | 18 | 23 |
| 10 | 28 | 21 | 21 | 26 | 18 | 24 | 19 | 12 | 16 | 20 | 25 | 17 | 18 | 22 |
| 15 | 30 | 22 | 23 | 26 | 19 | 27 | 19 | 12 | 16 | 20 | 27 | 17 | 18 | 22 |
| 20 | 30 | 22 | 24 | 26 | 19 | 28 | 19 | 12 | 16 | 21 | 29 | 17 | 18 | 23 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 84.6% | 42.1% | 69.2% | 88.2% | 63.3% | 60.0% | 64.7% | 69.6% | 84.0% | 70.8% | 55.6% | 66.7% | 68.8% |
| Asesino | 15.4% | 50.0% | 14.3% | 36.8% | 57.1% | 4.5% | 37.5% | 50.0% | 28.6% | 46.9% | 21.4% | 39.1% | 27.3% | 56.0% |
| Esquivo | 57.9% | 85.7% | 50.0% | 68.4% | 42.9% | 33.3% | 31.3% | 47.1% | 54.2% | 59.1% | 36.4% | 50.0% | 37.5% | 43.8% |
| Equilibrado | 30.8% | 63.2% | 31.6% | 50.0% | 80.0% | 55.6% | 77.8% | 53.3% | 33.3% | 69.2% | 42.9% | 33.3% | 63.6% | 66.7% |
| Extremista ATK | 11.8% | 42.9% | 57.1% | 20.0% | 50.0% | 40.7% | 61.5% | 37.5% | 30.0% | 54.5% | 33.3% | 33.3% | 47.4% | 52.6% |
| Extremista DEF | 36.7% | 95.5% | 66.7% | 44.4% | 59.3% | 50.0% | 73.9% | 78.6% | 43.8% | 81.8% | 40.9% | 68.4% | 70.0% | 75.0% |
| Extremista ASPD | 40.0% | 62.5% | 68.8% | 22.2% | 38.5% | 26.1% | 50.0% | 53.8% | 26.7% | 37.9% | 17.6% | 40.9% | 45.0% | 29.4% |
| Extremista REF | 35.3% | 50.0% | 52.9% | 46.7% | 62.5% | 21.4% | 46.2% | 50.0% | 45.0% | 75.0% | 40.0% | 36.4% | 30.4% | 52.6% |
| Velocista | 30.4% | 71.4% | 45.8% | 66.7% | 70.0% | 56.3% | 73.3% | 55.0% | 50.0% | 41.7% | 34.8% | 47.6% | 59.3% | 54.5% |
| Berserker | 16.0% | 53.1% | 40.9% | 30.8% | 45.5% | 18.2% | 62.1% | 25.0% | 58.3% | 50.0% | 21.1% | 50.0% | 27.8% | 42.1% |
| Guardian | 29.2% | 78.6% | 63.6% | 53.6% | 66.7% | 59.1% | 82.4% | 60.0% | 65.2% | 78.9% | 50.0% | 60.0% | 61.1% | 66.7% |
| Estratega | 44.4% | 60.9% | 50.0% | 66.7% | 66.7% | 31.6% | 59.1% | 63.6% | 52.4% | 50.0% | 40.0% | 50.0% | 65.0% | 55.0% |
| Gladiador | 33.3% | 72.7% | 62.5% | 36.4% | 52.6% | 30.0% | 55.0% | 69.6% | 40.7% | 72.2% | 38.9% | 35.0% | 50.0% | 47.8% |
| Magus | 31.3% | 44.0% | 56.3% | 33.3% | 47.4% | 25.0% | 70.6% | 47.4% | 45.5% | 57.9% | 33.3% | 45.0% | 52.2% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.2% | 668 |
| 16-30 | 53.4% | 1025 |
| 31-50 | 54.0% | 722 |
| 51-70 | 48.8% | 424 |
| 71-100 | 47.6% | 1161 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 9.4% | 32 |
| 16-30 | 34.6% | 937 |
| 31-50 | 46.0% | 1427 |
| 51-70 | 56.7% | 616 |
| 71-100 | 67.4% | 988 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.5% | 480 |
| 16-30 | 44.8% | 820 |
| 31-50 | 48.3% | 766 |
| 51-70 | 50.8% | 516 |
| 71-100 | 53.1% | 1418 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.4% | 949 |
| 16-30 | 43.1% | 982 |
| 31-50 | 53.4% | 717 |
| 51-70 | 60.2% | 455 |
| 71-100 | 58.6% | 897 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.1% | 1643 |
| 16-30 | 46.0% | 1059 |
| 31-50 | 51.4% | 634 |
| 51-70 | 71.7% | 297 |
| 71-100 | 67.6% | 367 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 3249 |
| 16-30 | 39.6% | 465 |
| 31-50 | 42.7% | 227 |
| 51-70 | 32.1% | 56 |
| 71-100 | 33.3% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 3260 |
| 16-30 | 35.5% | 445 |
| 31-50 | 46.7% | 242 |
| 51-70 | 28.8% | 52 |
| 71-100 | 100.0% | 1 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 3258 |
| 16-30 | 37.1% | 445 |
| 31-50 | 44.7% | 235 |
| 51-70 | 34.5% | 58 |
| 71-100 | 50.0% | 4 |
