# Combat Simulation Report
Generated: 2026-08-05 03:17:49 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 8.7 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1741 (87.1%) |
| Timeouts (draws) | 259 (12.9%) |
| Avg rounds (all) | 8.5 |
| Avg rounds (KO only) | 6.7 |
| Rounds P50 / P90 / Max | 6 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 303 |
| Avg rounds | 8.7 |
| P50 / P90 | 6 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1012/2000 |
| Winrate | 50.6% |
| Advantage over 50% | 0.6% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 189 | 279 | 67.7% | YES |
| Asesino | 99 | 265 | 37.4% |  |
| Esquivo | 142 | 299 | 47.5% |  |
| Equilibrado | 162 | 286 | 56.6% |  |
| Extremista ATK | 107 | 280 | 38.2% |  |
| Extremista DEF | 211 | 322 | 65.5% |  |
| Extremista ASPD | 135 | 316 | 42.7% |  |
| Extremista REF | 141 | 297 | 47.5% |  |
| Velocista | 157 | 280 | 56.1% |  |
| Berserker | 116 | 283 | 41.0% |  |
| Guardian | 170 | 281 | 60.5% |  |
| Estratega | 127 | 242 | 52.5% |  |
| Gladiador | 127 | 279 | 45.5% |  |
| Magus | 116 | 291 | 39.9% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 67.6 | - |
| Rests | 3.6 | 2 |
| Advances | 4.1 | - |
| Retreats | 0.1 | - |
| Battles with item use | 46.2% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.3% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.01 (avg 47.37) |
| ASPD spread (stddev) | 31.53 (avg 53.25) |
| Equipment tier A | 534 (13.4%) |
| Equipment tier B | 810 (20.3%) |
| Equipment tier C | 1049 (26.2%) |
| Equipment tier E | 1607 (40.2%) |
| Level 100-199 | 1010 |
| Level 200-299 | 1073 |
| Level 300-399 | 943 |
| Level 400-500 | 974 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1193 |
| cortante | 1189 |
| desarmado | 390 |
| perforante | 1228 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1328 | 50.0% |
| ligera | 16 | 37.5% |
| media | 116 | 54.3% |
| total | 2540 | 49.8% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 74 | 44.6% |
| 3+ | 3926 | 50.1% |
Set bonus active: 50.1% (3926) vs inactive 44.6% (74)

### Amulet
With amulet: 50.8% (1592) vs without 49.4% (2408)

### Shield
With shield: 49.6% (2393) vs without 50.5% (1607)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 485 | 72.2% |
| B | 727 | 55.8% |
| C | 938 | 48.7% |
| E | 1460 | 41.2% |
| desarmado | 390 | 47.2% |

### Nature by level bracket
- **100-199**: contundente: 302, cortante: 307, desarmado: 90, perforante: 311
- **200-299**: contundente: 325, cortante: 326, desarmado: 110, perforante: 312
- **300-399**: contundente: 287, cortante: 276, desarmado: 88, perforante: 292
- **400-500**: contundente: 279, cortante: 280, desarmado: 102, perforante: 313

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 39.7% | 958 | 53.2% | 3042 | -13.6pp |
| d_fulgor | 40.3% | 966 | 53.1% | 3034 | -12.8pp |
| r_fulgor | 40.6% | 963 | 52.9% | 3037 | -12.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 20.0 | 0 | 128 | 6 | 15 | 28 |
| Asesino | 60.7 | 0 | 128 | 46 | 55 | 84 |
| Esquivo | 16.9 | 0 | 128 | 0 | 12 | 24 |
| Equilibrado | 35.1 | 0 | 128 | 19 | 33 | 48 |
| Extremista ATK | 55.2 | 0 | 128 | 39 | 51 | 74 |
| Extremista DEF | 7.7 | 0 | 128 | 0 | 0 | 9 |
| Extremista ASPD | 44.3 | 0 | 128 | 19 | 41 | 62 |
| Extremista REF | 28.3 | 0 | 128 | 10 | 19 | 43 |
| Velocista | 24.0 | 0 | 128 | 10 | 17 | 29 |
| Berserker | 55.5 | 0 | 128 | 31 | 52 | 77 |
| Guardian | 14.4 | 0 | 128 | 0 | 8 | 19 |
| Estratega | 32.0 | 0 | 128 | 16 | 21 | 46 |
| Gladiador | 48.3 | 0 | 128 | 23 | 46 | 65 |
| Magus | 45.1 | 6 | 128 | 24 | 42 | 59 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 210 | 210 | 100.0% |
| Asesino | 262 | 262 | 100.0% |
| Esquivo | 1655 | 1655 | 100.0% |
| Equilibrado | 758 | 758 | 100.0% |
| Extremista ATK | 217 | 217 | 100.0% |
| Extremista DEF | 409 | 409 | 100.0% |
| Extremista ASPD | 315 | 315 | 100.0% |
| Extremista REF | 331 | 331 | 100.0% |
| Velocista | 459 | 459 | 100.0% |
| Berserker | 115 | 115 | 100.0% |
| Guardian | 462 | 462 | 100.0% |
| Estratega | 287 | 287 | 100.0% |
| Gladiador | 146 | 146 | 100.0% |
| Magus | 370 | 370 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 38 | 1692 | 2.2% |
| Asesino | 2 | 883 | 0.2% |
| Esquivo | 423 | 2349 | 18.0% |
| Equilibrado | 84 | 1668 | 5.0% |
| Extremista ATK | 134 | 1366 | 9.8% |
| Extremista DEF | 569 | 2213 | 25.7% |
| Extremista ASPD | 158 | 1580 | 10.0% |
| Extremista REF | 1149 | 1753 | 65.5% |
| Velocista | 0 | 1052 | 0.0% |
| Berserker | 128 | 1184 | 10.8% |
| Guardian | 1 | 1820 | 0.1% |
| Estratega | 852 | 1437 | 59.3% |
| Gladiador | 419 | 1218 | 34.4% |
| Magus | 253 | 1289 | 19.6% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 13 | 14 | 16 | 10 | 9 | 10 | 11 | 7 | 10 | 13 | 13 | 9 | 16 |
| 5 | 24 | 21 | 18 | 23 | 18 | 18 | 17 | 14 | 13 | 18 | 22 | 16 | 17 | 22 |
| 10 | 27 | 20 | 21 | 25 | 19 | 23 | 17 | 13 | 16 | 18 | 25 | 15 | 17 | 22 |
| 15 | 28 | 21 | 24 | 25 | 19 | 26 | 17 | 13 | 17 | 18 | 27 | 15 | 17 | 22 |
| 20 | 29 | 21 | 25 | 26 | 19 | 28 | 17 | 14 | 17 | 19 | 28 | 15 | 17 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 78.9% | 73.9% | 50.0% | 95.2% | 62.5% | 72.0% | 68.0% | 52.9% | 84.2% | 46.2% | 60.0% | 66.7% | 73.7% |
| Asesino | 21.1% | 50.0% | 26.3% | 46.2% | 31.8% | 35.0% | 62.5% | 42.1% | 28.6% | 44.4% | 26.7% | 20.0% | 44.4% | 42.9% |
| Esquivo | 21.7% | 73.7% | 50.0% | 64.7% | 45.0% | 31.0% | 57.7% | 50.0% | 33.3% | 60.0% | 39.1% | 43.8% | 50.0% | 55.0% |
| Equilibrado | 50.0% | 53.8% | 35.3% | 50.0% | 75.0% | 44.0% | 76.2% | 61.1% | 40.7% | 63.2% | 44.4% | 50.0% | 81.0% | 70.8% |
| Extremista ATK | 4.8% | 68.2% | 55.0% | 25.0% | 50.0% | 9.1% | 52.6% | 37.5% | 40.0% | 38.1% | 36.4% | 40.0% | 39.3% | 46.7% |
| Extremista DEF | 37.5% | 65.0% | 69.0% | 56.0% | 90.9% | 50.0% | 66.7% | 80.8% | 57.1% | 85.0% | 52.0% | 71.4% | 57.1% | 83.3% |
| Extremista ASPD | 28.0% | 37.5% | 42.3% | 23.8% | 47.4% | 33.3% | 50.0% | 44.0% | 37.5% | 62.5% | 40.0% | 36.8% | 41.4% | 62.5% |
| Extremista REF | 32.0% | 57.9% | 50.0% | 38.9% | 62.5% | 19.2% | 56.0% | 50.0% | 44.4% | 53.3% | 22.2% | 53.3% | 71.4% | 57.9% |
| Velocista | 47.1% | 71.4% | 66.7% | 59.3% | 60.0% | 42.9% | 62.5% | 55.6% | 50.0% | 59.1% | 21.7% | 52.2% | 65.0% | 73.7% |
| Berserker | 15.8% | 55.6% | 40.0% | 36.8% | 61.9% | 15.0% | 37.5% | 46.7% | 40.9% | 50.0% | 29.2% | 40.0% | 50.0% | 55.6% |
| Guardian | 53.8% | 73.3% | 60.9% | 55.6% | 63.6% | 48.0% | 60.0% | 77.8% | 78.3% | 70.8% | 50.0% | 46.7% | 45.0% | 58.3% |
| Estratega | 40.0% | 80.0% | 56.3% | 50.0% | 60.0% | 28.6% | 63.2% | 46.7% | 47.8% | 60.0% | 53.3% | 50.0% | 68.4% | 41.2% |
| Gladiador | 33.3% | 55.6% | 50.0% | 19.0% | 60.7% | 42.9% | 58.6% | 28.6% | 35.0% | 50.0% | 55.0% | 31.6% | 50.0% | 60.0% |
| Magus | 26.3% | 57.1% | 45.0% | 29.2% | 53.3% | 16.7% | 37.5% | 42.1% | 26.3% | 44.4% | 41.7% | 58.8% | 40.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.9% | 664 |
| 16-30 | 52.7% | 1047 |
| 31-50 | 55.7% | 705 |
| 51-70 | 50.0% | 438 |
| 71-100 | 46.2% | 1146 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 16.7% | 30 |
| 16-30 | 35.3% | 883 |
| 31-50 | 42.0% | 1432 |
| 51-70 | 60.9% | 617 |
| 71-100 | 67.9% | 1038 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 553 |
| 16-30 | 44.5% | 760 |
| 31-50 | 49.6% | 730 |
| 51-70 | 48.0% | 519 |
| 71-100 | 53.4% | 1438 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.5% | 925 |
| 16-30 | 43.3% | 1029 |
| 31-50 | 50.4% | 716 |
| 51-70 | 58.1% | 458 |
| 71-100 | 60.1% | 872 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.6% | 1646 |
| 16-30 | 42.6% | 1050 |
| 31-50 | 49.8% | 663 |
| 51-70 | 74.8% | 278 |
| 71-100 | 72.7% | 363 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 3238 |
| 16-30 | 41.0% | 417 |
| 31-50 | 36.2% | 271 |
| 51-70 | 50.0% | 68 |
| 71-100 | 66.7% | 6 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 3228 |
| 16-30 | 41.3% | 431 |
| 31-50 | 40.0% | 270 |
| 51-70 | 47.8% | 69 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 3235 |
| 16-30 | 42.8% | 435 |
| 31-50 | 37.7% | 252 |
| 51-70 | 46.7% | 75 |
| 71-100 | 66.7% | 3 |
