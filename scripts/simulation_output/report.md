# Combat Simulation Report
Generated: 2026-08-05 02:25:03 | 2000 simulations | Max 50 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 12.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1912 (95.6%) |
| Timeouts (draws) | 88 (4.4%) |
| Avg rounds (all) | 11.4 |
| Avg rounds (KO only) | 9.6 |
| Rounds P50 / P90 / Max | 7 / 26 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 296 |
| Avg rounds | 12.1 |
| P50 / P90 | 7 / 25 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1043/2000 |
| Winrate | 52.1% |
| Advantage over 50% | 2.1% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 181 | 296 | 61.1% |  |
| Asesino | 128 | 285 | 44.9% |  |
| Esquivo | 152 | 289 | 52.6% |  |
| Equilibrado | 159 | 307 | 51.8% |  |
| Extremista ATK | 115 | 292 | 39.4% |  |
| Extremista DEF | 147 | 275 | 53.5% |  |
| Extremista ASPD | 112 | 280 | 40.0% |  |
| Extremista REF | 124 | 296 | 41.9% |  |
| Velocista | 179 | 285 | 62.8% | YES |
| Berserker | 116 | 283 | 41.0% |  |
| Guardian | 143 | 256 | 55.9% |  |
| Estratega | 161 | 293 | 54.9% |  |
| Gladiador | 153 | 285 | 53.7% |  |
| Magus | 130 | 278 | 46.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.4 | 1 |
| Heal applied | 86.7 | - |
| Rests | 5.7 | 3 |
| Advances | 4.4 | - |
| Retreats | 0.2 | - |
| Battles with item use | 52.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.36 (avg 47.42) |
| ASPD spread (stddev) | 31.03 (avg 53.30) |
| Equipment tier A | 464 (11.6%) |
| Equipment tier B | 839 (21.0%) |
| Equipment tier C | 1057 (26.4%) |
| Equipment tier E | 1640 (41.0%) |
| Level 100-199 | 954 |
| Level 200-299 | 1152 |
| Level 300-399 | 979 |
| Level 400-500 | 915 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1204 |
| cortante | 1188 |
| desarmado | 378 |
| perforante | 1230 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1269 | 48.1% |
| ligera | 19 | 47.4% |
| media | 115 | 47.8% |
| ninguna | 1 | 100.0% |
| total | 2596 | 51.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 1 | 100.0% |
| 1-2 | 94 | 50.0% |
| 3+ | 3905 | 50.0% |
Set bonus active: 50.0% (3905) vs inactive 50.5% (95)

### Amulet
With amulet: 51.3% (1644) vs without 49.1% (2356)

### Shield
With shield: 49.7% (2417) vs without 50.5% (1583)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 422 | 70.1% |
| B | 763 | 61.3% |
| C | 963 | 51.3% |
| E | 1474 | 40.9% |
| desarmado | 378 | 36.8% |

### Nature by level bracket
- **100-199**: contundente: 278, cortante: 287, desarmado: 97, perforante: 292
- **200-299**: contundente: 355, cortante: 336, desarmado: 101, perforante: 360
- **300-399**: contundente: 290, cortante: 283, desarmado: 103, perforante: 303
- **400-500**: contundente: 281, cortante: 282, desarmado: 77, perforante: 275

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 39.2% | 948 | 53.3% | 3052 | -14.1pp |
| d_fulgor | 38.9% | 950 | 53.4% | 3050 | -14.5pp |
| r_fulgor | 39.1% | 946 | 53.4% | 3054 | -14.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 14.4 | 0 | 128 | 0 | 9 | 19 |
| Asesino | 63.1 | 0 | 128 | 46 | 63 | 80 |
| Esquivo | 14.2 | 0 | 128 | 0 | 8 | 20 |
| Equilibrado | 28.5 | 0 | 128 | 14 | 20 | 42 |
| Extremista ATK | 58.6 | 0 | 128 | 46 | 56 | 78 |
| Extremista DEF | 6.6 | 0 | 128 | 0 | 0 | 5 |
| Extremista ASPD | 45.5 | 0 | 128 | 19 | 46 | 63 |
| Extremista REF | 24.0 | 0 | 128 | 10 | 16 | 31 |
| Velocista | 23.9 | 0 | 128 | 10 | 16 | 27 |
| Berserker | 58.5 | 0 | 128 | 41 | 58 | 79 |
| Guardian | 11.7 | 0 | 128 | 0 | 3 | 18 |
| Estratega | 27.3 | 0 | 128 | 12 | 19 | 40 |
| Gladiador | 49.3 | 0 | 128 | 29 | 46 | 62 |
| Magus | 48.0 | 0 | 128 | 27 | 44 | 63 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 1092 | 1092 | 100.0% |
| Asesino | 239 | 239 | 100.0% |
| Esquivo | 1918 | 1918 | 100.0% |
| Equilibrado | 1738 | 1738 | 100.0% |
| Extremista ATK | 307 | 307 | 100.0% |
| Extremista DEF | 573 | 573 | 100.0% |
| Extremista ASPD | 91 | 91 | 100.0% |
| Extremista REF | 404 | 404 | 100.0% |
| Velocista | 1318 | 1318 | 100.0% |
| Berserker | 72 | 72 | 100.0% |
| Guardian | 894 | 894 | 100.0% |
| Estratega | 660 | 660 | 100.0% |
| Gladiador | 500 | 500 | 100.0% |
| Magus | 580 | 580 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 76 | 3291 | 2.3% |
| Asesino | 26 | 1113 | 2.3% |
| Esquivo | 792 | 3071 | 25.8% |
| Equilibrado | 93 | 3008 | 3.1% |
| Extremista ATK | 198 | 1795 | 11.0% |
| Extremista DEF | 808 | 3083 | 26.2% |
| Extremista ASPD | 126 | 1494 | 8.4% |
| Extremista REF | 1598 | 2285 | 69.9% |
| Velocista | 0 | 1969 | 0.0% |
| Berserker | 168 | 1369 | 12.3% |
| Guardian | 10 | 3093 | 0.3% |
| Estratega | 1306 | 2530 | 51.6% |
| Gladiador | 565 | 1733 | 32.6% |
| Magus | 350 | 1864 | 18.8% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 12 | 13 | 13 | 17 | 11 | 9 | 9 | 8 | 7 | 10 | 15 | 13 | 9 | 18 |
| 5 | 24 | 21 | 16 | 24 | 19 | 18 | 17 | 13 | 13 | 18 | 23 | 18 | 17 | 24 |
| 10 | 28 | 21 | 18 | 25 | 19 | 23 | 17 | 11 | 17 | 19 | 26 | 16 | 18 | 24 |
| 15 | 30 | 21 | 20 | 26 | 20 | 26 | 17 | 11 | 18 | 19 | 27 | 16 | 18 | 24 |
| 20 | 31 | 21 | 21 | 26 | 20 | 28 | 17 | 11 | 18 | 19 | 30 | 17 | 18 | 25 |
| 25 | 31 | 21 | 21 | 26 | 20 | 28 | 17 | 11 | 19 | 19 | 30 | 17 | 18 | 25 |
| 30 | 30 | 22 | 22 | 26 | 20 | 28 | 17 | 11 | 18 | 19 | 30 | 17 | 19 | 26 |
| 40 | 30 | 22 | 22 | 27 | 20 | 28 | 17 | 12 | 19 | 19 | 30 | 18 | 19 | 26 |
| 50 | 30 | 22 | 23 | 27 | 20 | 27 | 17 | 12 | 19 | 19 | 30 | 19 | 19 | 26 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 47.6% | 54.2% | 59.3% | 70.8% | 72.4% | 66.7% | 83.3% | 54.2% | 81.0% | 60.0% | 42.9% | 45.0% | 66.7% |
| Asesino | 52.4% | 50.0% | 45.5% | 52.9% | 63.2% | 46.7% | 50.0% | 51.7% | 9.1% | 40.0% | 31.3% | 52.2% | 37.0% | 50.0% |
| Esquivo | 45.8% | 54.5% | 50.0% | 57.9% | 56.5% | 47.4% | 45.0% | 75.9% | 37.5% | 44.4% | 50.0% | 36.8% | 68.4% | 51.7% |
| Equilibrado | 40.7% | 47.1% | 42.1% | 50.0% | 52.4% | 52.4% | 75.0% | 41.4% | 55.6% | 66.7% | 64.3% | 46.2% | 51.9% | 46.7% |
| Extremista ATK | 29.2% | 36.8% | 43.5% | 47.6% | 50.0% | 45.8% | 46.4% | 50.0% | 26.3% | 46.7% | 23.1% | 24.0% | 38.1% | 41.7% |
| Extremista DEF | 27.6% | 53.3% | 52.6% | 47.6% | 54.2% | 50.0% | 84.6% | 73.7% | 21.1% | 77.8% | 62.5% | 47.6% | 60.9% | 61.1% |
| Extremista ASPD | 33.3% | 50.0% | 55.0% | 25.0% | 53.6% | 15.4% | 50.0% | 61.9% | 38.9% | 42.9% | 18.2% | 29.4% | 22.2% | 50.0% |
| Extremista REF | 16.7% | 48.3% | 24.1% | 58.6% | 50.0% | 26.3% | 38.1% | 50.0% | 27.3% | 68.4% | 38.9% | 53.3% | 40.0% | 44.4% |
| Velocista | 45.8% | 90.9% | 62.5% | 44.4% | 73.7% | 78.9% | 61.1% | 72.7% | 50.0% | 64.7% | 61.8% | 60.0% | 42.9% | 70.6% |
| Berserker | 19.0% | 60.0% | 55.6% | 33.3% | 53.3% | 22.2% | 57.1% | 31.6% | 35.3% | 50.0% | 11.8% | 40.7% | 39.3% | 56.7% |
| Guardian | 40.0% | 68.8% | 50.0% | 35.7% | 76.9% | 37.5% | 81.8% | 61.1% | 38.2% | 88.2% | 50.0% | 55.6% | 68.8% | 40.0% |
| Estratega | 57.1% | 47.8% | 63.2% | 53.8% | 76.0% | 52.4% | 70.6% | 46.7% | 40.0% | 59.3% | 44.4% | 50.0% | 61.1% | 41.2% |
| Gladiador | 55.0% | 63.0% | 31.6% | 48.1% | 61.9% | 39.1% | 77.8% | 60.0% | 57.1% | 60.7% | 31.3% | 38.9% | 50.0% | 71.4% |
| Magus | 33.3% | 50.0% | 48.3% | 53.3% | 58.3% | 38.9% | 50.0% | 55.6% | 29.4% | 43.3% | 60.0% | 58.8% | 28.6% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.1% | 663 |
| 16-30 | 50.0% | 1085 |
| 31-50 | 55.5% | 690 |
| 51-70 | 47.7% | 390 |
| 71-100 | 50.3% | 1172 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 25.9% | 27 |
| 16-30 | 34.6% | 863 |
| 31-50 | 47.3% | 1519 |
| 51-70 | 60.2% | 588 |
| 71-100 | 61.9% | 1003 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.4% | 474 |
| 16-30 | 43.8% | 810 |
| 31-50 | 49.9% | 771 |
| 51-70 | 47.8% | 558 |
| 71-100 | 56.1% | 1387 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 39.1% | 900 |
| 16-30 | 44.3% | 978 |
| 31-50 | 51.3% | 725 |
| 51-70 | 60.5% | 483 |
| 71-100 | 60.3% | 914 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.5% | 1627 |
| 16-30 | 45.3% | 1084 |
| 31-50 | 49.4% | 627 |
| 51-70 | 70.8% | 267 |
| 71-100 | 76.5% | 395 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 3237 |
| 16-30 | 40.7% | 442 |
| 31-50 | 42.2% | 256 |
| 51-70 | 23.3% | 60 |
| 71-100 | 60.0% | 5 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.6% | 3235 |
| 16-30 | 37.4% | 454 |
| 31-50 | 43.6% | 241 |
| 51-70 | 33.3% | 66 |
| 71-100 | 25.0% | 4 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 3245 |
| 16-30 | 39.0% | 433 |
| 31-50 | 41.1% | 263 |
| 51-70 | 33.3% | 54 |
| 71-100 | 80.0% | 5 |
