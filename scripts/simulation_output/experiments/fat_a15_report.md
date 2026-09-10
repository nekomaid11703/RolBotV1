# Combat Simulation Report
Generated: 2026-08-05 03:13:52 | 2000 simulations | Max 20 rounds

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
| KO victories | 1714 (85.7%) |
| Timeouts (draws) | 286 (14.3%) |
| Avg rounds (all) | 9.4 |
| Avg rounds (KO only) | 7.4 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 309 |
| Avg rounds | 10.1 |
| P50 / P90 | 8 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1046/2000 |
| Winrate | 52.3% |
| Advantage over 50% | 2.3% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 195 | 296 | 65.9% | YES |
| Asesino | 123 | 299 | 41.1% |  |
| Esquivo | 140 | 283 | 49.5% |  |
| Equilibrado | 152 | 280 | 54.3% |  |
| Extremista ATK | 122 | 295 | 41.4% |  |
| Extremista DEF | 162 | 271 | 59.8% |  |
| Extremista ASPD | 125 | 290 | 43.1% |  |
| Extremista REF | 146 | 308 | 47.4% |  |
| Velocista | 167 | 318 | 52.5% |  |
| Berserker | 130 | 293 | 44.4% |  |
| Guardian | 163 | 254 | 64.2% |  |
| Estratega | 150 | 284 | 52.8% |  |
| Gladiador | 123 | 257 | 47.9% |  |
| Magus | 102 | 272 | 37.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.3 | 1 |
| Heal applied | 78.1 | - |
| Rests | 4.2 | 3 |
| Advances | 4.3 | - |
| Retreats | 0.1 | - |
| Battles with item use | 50.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.7% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.18 (avg 47.09) |
| ASPD spread (stddev) | 31.41 (avg 53.09) |
| Equipment tier A | 478 (11.9%) |
| Equipment tier B | 802 (20.1%) |
| Equipment tier C | 1052 (26.3%) |
| Equipment tier E | 1668 (41.7%) |
| Level 100-199 | 1032 |
| Level 200-299 | 1113 |
| Level 300-399 | 961 |
| Level 400-500 | 894 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1159 |
| cortante | 1187 |
| desarmado | 413 |
| perforante | 1241 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1286 | 50.2% |
| ligera | 17 | 35.3% |
| media | 124 | 43.5% |
| total | 2573 | 50.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 91 | 46.2% |
| 3+ | 3909 | 50.1% |
Set bonus active: 50.1% (3909) vs inactive 46.2% (91)

### Amulet
With amulet: 50.1% (1606) vs without 50.0% (2394)

### Shield
With shield: 49.2% (2444) vs without 51.2% (1556)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 430 | 70.7% |
| B | 720 | 59.7% |
| C | 950 | 49.3% |
| E | 1487 | 41.6% |
| desarmado | 413 | 43.3% |

### Nature by level bracket
- **100-199**: contundente: 280, cortante: 300, desarmado: 118, perforante: 334
- **200-299**: contundente: 347, cortante: 327, desarmado: 108, perforante: 331
- **300-399**: contundente: 270, cortante: 276, desarmado: 93, perforante: 322
- **400-500**: contundente: 262, cortante: 284, desarmado: 94, perforante: 254

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 42.3% | 948 | 52.4% | 3052 | -10.1pp |
| d_fulgor | 41.9% | 937 | 52.5% | 3063 | -10.5pp |
| r_fulgor | 42.5% | 937 | 52.3% | 3063 | -9.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 20.4 | 0 | 128 | 6 | 17 | 29 |
| Asesino | 60.8 | 0 | 128 | 41 | 61 | 84 |
| Esquivo | 18.0 | 0 | 128 | 0 | 14 | 23 |
| Equilibrado | 32.7 | 0 | 128 | 19 | 31 | 46 |
| Extremista ATK | 58.2 | 0 | 128 | 46 | 56 | 80 |
| Extremista DEF | 8.3 | 0 | 128 | 0 | 0 | 11 |
| Extremista ASPD | 50.3 | 8 | 128 | 26 | 46 | 71 |
| Extremista REF | 27.0 | 0 | 128 | 11 | 19 | 36 |
| Velocista | 25.6 | 0 | 128 | 10 | 18 | 34 |
| Berserker | 60.7 | 0 | 128 | 46 | 61 | 84 |
| Guardian | 13.0 | 0 | 128 | 0 | 7 | 19 |
| Estratega | 31.8 | 0 | 128 | 17 | 22 | 44 |
| Gladiador | 47.4 | 0 | 128 | 26 | 46 | 64 |
| Magus | 45.3 | 10 | 128 | 19 | 39 | 64 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 309 | 309 | 100.0% |
| Asesino | 274 | 274 | 100.0% |
| Esquivo | 1228 | 1228 | 100.0% |
| Equilibrado | 915 | 915 | 100.0% |
| Extremista ATK | 172 | 172 | 100.0% |
| Extremista DEF | 232 | 232 | 100.0% |
| Extremista ASPD | 240 | 240 | 100.0% |
| Extremista REF | 283 | 283 | 100.0% |
| Velocista | 501 | 501 | 100.0% |
| Berserker | 281 | 281 | 100.0% |
| Guardian | 355 | 355 | 100.0% |
| Estratega | 420 | 420 | 100.0% |
| Gladiador | 265 | 265 | 100.0% |
| Magus | 557 | 557 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 67 | 2080 | 3.2% |
| Asesino | 23 | 1185 | 1.9% |
| Esquivo | 531 | 2153 | 24.7% |
| Equilibrado | 110 | 2000 | 5.5% |
| Extremista ATK | 120 | 1482 | 8.1% |
| Extremista DEF | 391 | 1872 | 20.9% |
| Extremista ASPD | 214 | 1652 | 13.0% |
| Extremista REF | 1362 | 2018 | 67.5% |
| Velocista | 0 | 1293 | 0.0% |
| Berserker | 145 | 1602 | 9.1% |
| Guardian | 4 | 1806 | 0.2% |
| Estratega | 1035 | 2022 | 51.2% |
| Gladiador | 457 | 1405 | 32.5% |
| Magus | 232 | 1683 | 13.8% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 12 | 14 | 13 | 16 | 10 | 10 | 11 | 10 | 7 | 10 | 14 | 13 | 9 | 15 |
| 5 | 23 | 21 | 17 | 23 | 19 | 20 | 18 | 14 | 13 | 18 | 23 | 18 | 17 | 22 |
| 10 | 27 | 22 | 20 | 25 | 19 | 25 | 18 | 13 | 16 | 19 | 27 | 17 | 18 | 23 |
| 15 | 29 | 22 | 21 | 26 | 19 | 29 | 18 | 12 | 16 | 19 | 30 | 17 | 18 | 23 |
| 20 | 29 | 23 | 23 | 27 | 19 | 30 | 19 | 13 | 16 | 19 | 30 | 17 | 18 | 23 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 81.8% | 60.0% | 56.0% | 80.0% | 63.6% | 78.6% | 53.8% | 66.7% | 76.2% | 55.0% | 60.0% | 66.7% | 86.4% |
| Asesino | 18.2% | 50.0% | 58.3% | 50.0% | 45.2% | 16.7% | 40.0% | 48.0% | 25.0% | 55.0% | 33.3% | 46.7% | 55.6% | 42.9% |
| Esquivo | 40.0% | 41.7% | 50.0% | 63.6% | 68.2% | 36.8% | 55.0% | 50.0% | 45.5% | 40.9% | 23.1% | 52.0% | 50.0% | 62.5% |
| Equilibrado | 44.0% | 50.0% | 36.4% | 50.0% | 79.3% | 50.0% | 63.6% | 54.2% | 73.3% | 65.2% | 35.3% | 42.1% | 50.0% | 60.0% |
| Extremista ATK | 20.0% | 54.8% | 31.8% | 20.7% | 50.0% | 34.8% | 56.5% | 50.0% | 41.2% | 45.5% | 21.4% | 35.3% | 53.3% | 52.2% |
| Extremista DEF | 36.4% | 83.3% | 63.2% | 50.0% | 65.2% | 50.0% | 47.4% | 68.4% | 52.4% | 60.0% | 57.7% | 53.8% | 68.2% | 73.1% |
| Extremista ASPD | 21.4% | 60.0% | 45.0% | 36.4% | 43.5% | 52.6% | 50.0% | 33.3% | 30.8% | 42.9% | 38.1% | 47.8% | 40.9% | 55.0% |
| Extremista REF | 46.2% | 52.0% | 50.0% | 45.8% | 50.0% | 31.6% | 66.7% | 50.0% | 43.8% | 40.0% | 31.8% | 52.4% | 50.0% | 52.9% |
| Velocista | 33.3% | 75.0% | 54.5% | 26.7% | 58.8% | 47.6% | 69.2% | 56.3% | 50.0% | 75.0% | 11.1% | 38.9% | 64.7% | 68.2% |
| Berserker | 23.8% | 45.0% | 59.1% | 34.8% | 54.5% | 40.0% | 57.1% | 60.0% | 25.0% | 50.0% | 26.1% | 35.0% | 52.9% | 61.1% |
| Guardian | 45.0% | 66.7% | 76.9% | 64.7% | 78.6% | 42.3% | 61.9% | 68.2% | 88.9% | 73.9% | 50.0% | 50.0% | 57.9% | 85.7% |
| Estratega | 40.0% | 53.3% | 48.0% | 57.9% | 64.7% | 46.2% | 52.2% | 47.6% | 61.1% | 65.0% | 50.0% | 50.0% | 56.3% | 43.8% |
| Gladiador | 33.3% | 44.4% | 50.0% | 50.0% | 46.7% | 31.8% | 59.1% | 50.0% | 35.3% | 47.1% | 42.1% | 43.8% | 50.0% | 88.9% |
| Magus | 13.6% | 57.1% | 37.5% | 40.0% | 47.8% | 26.9% | 45.0% | 47.1% | 31.8% | 38.9% | 14.3% | 56.3% | 11.1% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.9% | 701 |
| 16-30 | 50.2% | 1025 |
| 31-50 | 51.7% | 724 |
| 51-70 | 53.2% | 417 |
| 71-100 | 48.8% | 1133 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 27.0% | 37 |
| 16-30 | 33.7% | 933 |
| 31-50 | 45.8% | 1477 |
| 51-70 | 59.2% | 606 |
| 71-100 | 67.6% | 947 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.8% | 520 |
| 16-30 | 46.8% | 797 |
| 31-50 | 47.5% | 769 |
| 51-70 | 48.7% | 503 |
| 71-100 | 54.1% | 1411 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.9% | 947 |
| 16-30 | 44.1% | 992 |
| 31-50 | 53.0% | 749 |
| 51-70 | 59.3% | 420 |
| 71-100 | 58.3% | 892 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.9% | 1635 |
| 16-30 | 43.3% | 1112 |
| 31-50 | 52.1% | 591 |
| 51-70 | 71.1% | 266 |
| 71-100 | 68.2% | 396 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 3266 |
| 16-30 | 43.0% | 449 |
| 31-50 | 42.9% | 212 |
| 51-70 | 39.7% | 68 |
| 71-100 | 20.0% | 5 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.8% | 3271 |
| 16-30 | 43.7% | 455 |
| 31-50 | 39.8% | 211 |
| 51-70 | 37.0% | 54 |
| 71-100 | 44.4% | 9 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 3259 |
| 16-30 | 44.4% | 450 |
| 31-50 | 40.4% | 223 |
| 51-70 | 35.5% | 62 |
| 71-100 | 33.3% | 6 |
