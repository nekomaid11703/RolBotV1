# Combat Simulation Report
Generated: 2026-08-05 03:14:29 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.0 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1691 (84.5%) |
| Timeouts (draws) | 309 (15.4%) |
| Avg rounds (all) | 9.3 |
| Avg rounds (KO only) | 7.2 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 299 |
| Avg rounds | 10.0 |
| P50 / P90 | 7 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1049/2000 |
| Winrate | 52.4% |
| Advantage over 50% | 2.4% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 165 | 245 | 67.3% | YES |
| Asesino | 118 | 313 | 37.7% |  |
| Esquivo | 167 | 338 | 49.4% |  |
| Equilibrado | 167 | 302 | 55.3% |  |
| Extremista ATK | 89 | 241 | 36.9% |  |
| Extremista DEF | 180 | 286 | 62.9% |  |
| Extremista ASPD | 107 | 271 | 39.5% |  |
| Extremista REF | 111 | 267 | 41.6% |  |
| Velocista | 171 | 295 | 58.0% |  |
| Berserker | 124 | 293 | 42.3% |  |
| Guardian | 173 | 282 | 61.3% |  |
| Estratega | 172 | 310 | 55.5% |  |
| Gladiador | 157 | 295 | 53.2% |  |
| Magus | 97 | 262 | 37.0% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.2 | 0 |
| Heal applied | 74.8 | - |
| Rests | 4.0 | 3 |
| Advances | 4.1 | - |
| Retreats | 0.1 | - |
| Battles with item use | 48.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.03 (avg 46.94) |
| ASPD spread (stddev) | 30.89 (avg 52.66) |
| Equipment tier A | 465 (11.6%) |
| Equipment tier B | 844 (21.1%) |
| Equipment tier C | 1023 (25.6%) |
| Equipment tier E | 1668 (41.7%) |
| Level 100-199 | 996 |
| Level 200-299 | 1097 |
| Level 300-399 | 985 |
| Level 400-500 | 922 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1216 |
| cortante | 1194 |
| desarmado | 381 |
| perforante | 1209 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1319 | 51.9% |
| ligera | 23 | 43.5% |
| media | 122 | 45.9% |
| total | 2536 | 49.2% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 101 | 49.5% |
| 3+ | 3899 | 50.0% |
Set bonus active: 50.0% (3899) vs inactive 49.5% (101)

### Amulet
With amulet: 52.4% (1604) vs without 48.3% (2396)

### Shield
With shield: 50.9% (2395) vs without 48.6% (1605)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 427 | 72.1% |
| B | 760 | 60.9% |
| C | 911 | 47.1% |
| E | 1521 | 42.4% |
| desarmado | 381 | 40.2% |

### Nature by level bracket
- **100-199**: contundente: 293, cortante: 298, desarmado: 93, perforante: 312
- **200-299**: contundente: 343, cortante: 319, desarmado: 111, perforante: 324
- **300-399**: contundente: 281, cortante: 302, desarmado: 92, perforante: 310
- **400-500**: contundente: 299, cortante: 275, desarmado: 85, perforante: 263

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 39.5% | 956 | 53.2% | 3044 | -13.7pp |
| d_fulgor | 39.2% | 959 | 53.3% | 3041 | -14.1pp |
| r_fulgor | 39.2% | 960 | 53.4% | 3040 | -14.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.1 | 0 | 128 | 3 | 14 | 26 |
| Asesino | 59.4 | 0 | 128 | 40 | 55 | 78 |
| Esquivo | 15.9 | 0 | 128 | 0 | 12 | 21 |
| Equilibrado | 34.8 | 0 | 128 | 19 | 30 | 50 |
| Extremista ATK | 54.2 | 0 | 128 | 42 | 54 | 72 |
| Extremista DEF | 9.0 | 0 | 128 | 0 | 0 | 14 |
| Extremista ASPD | 49.6 | 0 | 128 | 21 | 46 | 67 |
| Extremista REF | 22.5 | 0 | 128 | 9 | 17 | 28 |
| Velocista | 24.6 | 0 | 128 | 10 | 18 | 32 |
| Berserker | 59.0 | 0 | 128 | 46 | 58 | 78 |
| Guardian | 13.7 | 0 | 128 | 0 | 7 | 19 |
| Estratega | 30.3 | 0 | 128 | 17 | 23 | 42 |
| Gladiador | 49.5 | 0 | 128 | 19 | 46 | 69 |
| Magus | 41.7 | 0 | 128 | 19 | 36 | 58 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 288 | 288 | 100.0% |
| Asesino | 430 | 430 | 100.0% |
| Esquivo | 1559 | 1559 | 100.0% |
| Equilibrado | 1032 | 1032 | 100.0% |
| Extremista ATK | 184 | 184 | 100.0% |
| Extremista DEF | 418 | 418 | 100.0% |
| Extremista ASPD | 81 | 81 | 100.0% |
| Extremista REF | 188 | 188 | 100.0% |
| Velocista | 611 | 611 | 100.0% |
| Berserker | 100 | 100 | 100.0% |
| Guardian | 478 | 478 | 100.0% |
| Estratega | 520 | 520 | 100.0% |
| Gladiador | 232 | 232 | 100.0% |
| Magus | 260 | 260 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 53 | 1712 | 3.1% |
| Asesino | 14 | 1425 | 1.0% |
| Esquivo | 634 | 2512 | 25.2% |
| Equilibrado | 83 | 2063 | 4.0% |
| Extremista ATK | 119 | 1212 | 9.8% |
| Extremista DEF | 453 | 2055 | 22.0% |
| Extremista ASPD | 128 | 1277 | 10.0% |
| Extremista REF | 1289 | 1782 | 72.3% |
| Velocista | 0 | 1433 | 0.0% |
| Berserker | 118 | 1612 | 7.3% |
| Guardian | 6 | 2140 | 0.3% |
| Estratega | 1261 | 2244 | 56.2% |
| Gladiador | 514 | 1492 | 34.5% |
| Magus | 176 | 1291 | 13.6% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 16 | 14 | 17 | 11 | 10 | 9 | 9 | 7 | 10 | 15 | 13 | 9 | 15 |
| 5 | 24 | 22 | 17 | 24 | 19 | 19 | 17 | 14 | 13 | 19 | 24 | 17 | 18 | 22 |
| 10 | 27 | 23 | 21 | 26 | 19 | 24 | 16 | 12 | 16 | 19 | 26 | 17 | 19 | 22 |
| 15 | 29 | 23 | 23 | 26 | 19 | 28 | 16 | 12 | 16 | 19 | 29 | 17 | 19 | 22 |
| 20 | 29 | 24 | 24 | 27 | 19 | 30 | 16 | 12 | 17 | 20 | 30 | 18 | 19 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 82.4% | 82.4% | 40.9% | 82.4% | 72.2% | 82.4% | 92.3% | 46.2% | 88.2% | 45.0% | 68.4% | 53.8% | 66.7% |
| Asesino | 17.6% | 50.0% | 34.6% | 44.0% | 40.0% | 21.1% | 45.5% | 45.5% | 26.1% | 52.4% | 20.8% | 40.9% | 32.1% | 52.0% |
| Esquivo | 17.6% | 65.4% | 50.0% | 54.5% | 63.2% | 30.8% | 53.8% | 60.0% | 51.7% | 60.0% | 32.0% | 31.8% | 50.0% | 58.3% |
| Equilibrado | 59.1% | 56.0% | 45.5% | 50.0% | 63.6% | 40.0% | 79.2% | 50.0% | 42.1% | 64.7% | 50.0% | 44.0% | 68.0% | 59.1% |
| Extremista ATK | 17.6% | 60.0% | 36.8% | 36.4% | 50.0% | 31.3% | 58.3% | 50.0% | 22.2% | 42.9% | 35.0% | 15.8% | 36.0% | 43.8% |
| Extremista DEF | 27.8% | 78.9% | 69.2% | 60.0% | 68.8% | 50.0% | 75.0% | 72.2% | 50.0% | 66.7% | 57.1% | 73.9% | 59.1% | 77.8% |
| Extremista ASPD | 17.6% | 54.5% | 46.2% | 20.8% | 41.7% | 25.0% | 50.0% | 46.2% | 50.0% | 40.9% | 15.0% | 52.9% | 35.5% | 63.2% |
| Extremista REF | 7.7% | 54.5% | 40.0% | 50.0% | 50.0% | 27.8% | 53.8% | 50.0% | 55.6% | 35.0% | 31.8% | 31.8% | 26.1% | 75.0% |
| Velocista | 53.8% | 73.9% | 48.3% | 57.9% | 77.8% | 50.0% | 50.0% | 44.4% | 50.0% | 73.3% | 63.6% | 34.8% | 63.6% | 66.7% |
| Berserker | 11.8% | 47.6% | 40.0% | 35.3% | 57.1% | 33.3% | 59.1% | 65.0% | 26.7% | 50.0% | 34.8% | 37.5% | 31.3% | 66.7% |
| Guardian | 55.0% | 79.2% | 68.0% | 50.0% | 65.0% | 42.9% | 85.0% | 68.2% | 36.4% | 65.2% | 50.0% | 53.6% | 56.5% | 83.3% |
| Estratega | 31.6% | 59.1% | 68.2% | 56.0% | 84.2% | 26.1% | 47.1% | 63.6% | 65.2% | 62.5% | 46.4% | 50.0% | 56.5% | 61.9% |
| Gladiador | 46.2% | 67.9% | 50.0% | 32.0% | 64.0% | 40.9% | 64.5% | 73.9% | 36.4% | 62.5% | 43.5% | 43.5% | 50.0% | 64.3% |
| Magus | 33.3% | 48.0% | 41.7% | 40.9% | 56.3% | 22.2% | 36.8% | 25.0% | 33.3% | 33.3% | 16.7% | 38.1% | 35.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.3% | 676 |
| 16-30 | 52.5% | 1061 |
| 31-50 | 53.9% | 720 |
| 51-70 | 50.1% | 411 |
| 71-100 | 47.8% | 1132 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 27.8% | 36 |
| 16-30 | 33.1% | 861 |
| 31-50 | 44.1% | 1508 |
| 51-70 | 64.5% | 606 |
| 71-100 | 65.4% | 989 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 496 |
| 16-30 | 44.9% | 804 |
| 31-50 | 49.1% | 774 |
| 51-70 | 49.0% | 571 |
| 71-100 | 53.4% | 1355 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.7% | 911 |
| 16-30 | 42.2% | 937 |
| 31-50 | 50.3% | 751 |
| 51-70 | 57.5% | 457 |
| 71-100 | 61.7% | 944 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.2% | 1564 |
| 16-30 | 42.9% | 1111 |
| 31-50 | 51.4% | 624 |
| 51-70 | 73.6% | 311 |
| 71-100 | 71.8% | 390 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 3234 |
| 16-30 | 39.4% | 462 |
| 31-50 | 43.0% | 228 |
| 51-70 | 37.7% | 69 |
| 71-100 | 14.3% | 7 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 3251 |
| 16-30 | 38.0% | 445 |
| 31-50 | 45.3% | 234 |
| 51-70 | 29.5% | 61 |
| 71-100 | 55.6% | 9 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 3244 |
| 16-30 | 38.1% | 443 |
| 31-50 | 44.8% | 250 |
| 51-70 | 29.8% | 57 |
| 71-100 | 16.7% | 6 |
