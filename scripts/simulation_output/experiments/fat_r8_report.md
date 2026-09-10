# Combat Simulation Report
Generated: 2026-08-05 03:14:14 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.6 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1671 (83.5%) |
| Timeouts (draws) | 329 (16.4%) |
| Avg rounds (all) | 9.7 |
| Avg rounds (KO only) | 7.4 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 291 |
| Avg rounds | 10.6 |
| P50 / P90 | 8 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1010/2000 |
| Winrate | 50.5% |
| Advantage over 50% | 0.5% |
| Draws | 3 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 170 | 274 | 62.0% |  |
| Asesino | 99 | 254 | 39.0% |  |
| Esquivo | 143 | 294 | 48.6% |  |
| Equilibrado | 166 | 279 | 59.5% |  |
| Extremista ATK | 111 | 271 | 41.0% |  |
| Extremista DEF | 192 | 307 | 62.5% |  |
| Extremista ASPD | 117 | 306 | 38.2% |  |
| Extremista REF | 112 | 260 | 43.1% |  |
| Velocista | 160 | 289 | 55.4% |  |
| Berserker | 128 | 294 | 43.5% |  |
| Guardian | 197 | 301 | 65.4% | YES |
| Estratega | 155 | 304 | 51.0% |  |
| Gladiador | 132 | 274 | 48.2% |  |
| Magus | 115 | 293 | 39.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.3 | 1 |
| Heal applied | 79.2 | - |
| Rests | 4.2 | 3 |
| Advances | 4.2 | - |
| Retreats | 0.1 | - |
| Battles with item use | 51.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.6% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.27 (avg 47.02) |
| ASPD spread (stddev) | 31.36 (avg 53.10) |
| Equipment tier A | 498 (12.4%) |
| Equipment tier B | 843 (21.1%) |
| Equipment tier C | 1034 (25.9%) |
| Equipment tier E | 1625 (40.6%) |
| Level 100-199 | 982 |
| Level 200-299 | 1123 |
| Level 300-399 | 956 |
| Level 400-500 | 939 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1177 |
| cortante | 1164 |
| desarmado | 414 |
| perforante | 1245 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1274 | 48.4% |
| ligera | 13 | 38.5% |
| media | 110 | 50.9% |
| ninguna | 1 | 0.0% |
| total | 2602 | 50.7% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 1 | 0.0% |
| 1-2 | 89 | 39.3% |
| 3+ | 3910 | 50.2% |
Set bonus active: 50.2% (3910) vs inactive 38.9% (90)

### Amulet
With amulet: 51.1% (1566) vs without 49.2% (2434)

### Shield
With shield: 49.8% (2432) vs without 50.1% (1568)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 438 | 67.6% |
| B | 757 | 59.0% |
| C | 922 | 49.7% |
| E | 1469 | 41.4% |
| desarmado | 414 | 45.4% |

### Nature by level bracket
- **100-199**: contundente: 299, cortante: 297, desarmado: 97, perforante: 289
- **200-299**: contundente: 316, cortante: 346, desarmado: 114, perforante: 347
- **300-399**: contundente: 298, cortante: 284, desarmado: 94, perforante: 280
- **400-500**: contundente: 264, cortante: 237, desarmado: 109, perforante: 329

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.5% | 937 | 52.5% | 3063 | -11.0pp |
| d_fulgor | 41.1% | 937 | 52.6% | 3063 | -11.5pp |
| r_fulgor | 41.0% | 952 | 52.7% | 3048 | -11.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 18.0 | 0 | 128 | 5 | 13 | 22 |
| Asesino | 61.8 | 0 | 128 | 46 | 62 | 84 |
| Esquivo | 19.4 | 0 | 128 | 0 | 13 | 29 |
| Equilibrado | 33.7 | 0 | 128 | 18 | 28 | 46 |
| Extremista ATK | 57.4 | 0 | 128 | 42 | 52 | 78 |
| Extremista DEF | 8.0 | 0 | 128 | 0 | 0 | 9 |
| Extremista ASPD | 45.5 | 0 | 128 | 19 | 36 | 63 |
| Extremista REF | 27.9 | 0 | 128 | 12 | 19 | 35 |
| Velocista | 24.6 | 0 | 128 | 10 | 18 | 31 |
| Berserker | 58.4 | 0 | 128 | 46 | 56 | 72 |
| Guardian | 13.6 | 0 | 128 | 0 | 8 | 19 |
| Estratega | 30.0 | 0 | 128 | 15 | 23 | 38 |
| Gladiador | 48.6 | 0 | 128 | 30 | 46 | 58 |
| Magus | 41.9 | 0 | 128 | 19 | 37 | 58 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 430 | 430 | 100.0% |
| Asesino | 169 | 169 | 100.0% |
| Esquivo | 1626 | 1626 | 100.0% |
| Equilibrado | 729 | 729 | 100.0% |
| Extremista ATK | 229 | 229 | 100.0% |
| Extremista DEF | 179 | 179 | 100.0% |
| Extremista ASPD | 249 | 249 | 100.0% |
| Extremista REF | 204 | 204 | 100.0% |
| Velocista | 709 | 709 | 100.0% |
| Berserker | 275 | 275 | 100.0% |
| Guardian | 586 | 586 | 100.0% |
| Estratega | 387 | 387 | 100.0% |
| Gladiador | 190 | 190 | 100.0% |
| Magus | 565 | 565 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 28 | 2405 | 1.2% |
| Asesino | 0 | 982 | 0.0% |
| Esquivo | 474 | 2418 | 19.6% |
| Equilibrado | 72 | 1760 | 4.1% |
| Extremista ATK | 192 | 1610 | 11.9% |
| Extremista DEF | 548 | 1915 | 28.6% |
| Extremista ASPD | 179 | 1667 | 10.7% |
| Extremista REF | 1258 | 1811 | 69.5% |
| Velocista | 0 | 1377 | 0.0% |
| Berserker | 161 | 1515 | 10.6% |
| Guardian | 18 | 2444 | 0.7% |
| Estratega | 1093 | 2001 | 54.6% |
| Gladiador | 644 | 1495 | 43.1% |
| Magus | 351 | 2004 | 17.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 14 | 15 | 14 | 16 | 10 | 9 | 10 | 10 | 6 | 11 | 15 | 13 | 9 | 16 |
| 5 | 25 | 22 | 18 | 24 | 18 | 18 | 17 | 14 | 12 | 19 | 24 | 17 | 17 | 22 |
| 10 | 29 | 22 | 21 | 26 | 18 | 23 | 17 | 12 | 15 | 20 | 27 | 16 | 17 | 22 |
| 15 | 30 | 22 | 23 | 26 | 19 | 26 | 17 | 12 | 15 | 20 | 29 | 17 | 17 | 23 |
| 20 | 31 | 22 | 25 | 27 | 19 | 28 | 17 | 12 | 15 | 20 | 30 | 17 | 18 | 23 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 64.3% | 62.5% | 38.1% | 66.7% | 72.7% | 80.0% | 55.6% | 52.9% | 88.9% | 56.5% | 58.8% | 50.0% | 78.9% |
| Asesino | 35.7% | 50.0% | 23.1% | 23.5% | 50.0% | 10.0% | 55.0% | 66.7% | 40.0% | 35.3% | 30.0% | 34.4% | 23.1% | 68.4% |
| Esquivo | 37.5% | 76.9% | 45.0% | 50.0% | 72.7% | 21.7% | 57.1% | 29.4% | 47.8% | 62.5% | 40.0% | 59.1% | 41.2% | 52.2% |
| Equilibrado | 61.9% | 76.5% | 50.0% | 50.0% | 59.1% | 43.5% | 82.6% | 64.7% | 53.8% | 78.3% | 54.5% | 54.5% | 42.9% | 57.9% |
| Extremista ATK | 33.3% | 50.0% | 27.3% | 40.9% | 50.0% | 30.4% | 56.5% | 42.1% | 23.1% | 31.6% | 23.5% | 56.3% | 58.8% | 50.0% |
| Extremista DEF | 27.3% | 90.0% | 78.3% | 56.5% | 69.6% | 50.0% | 81.5% | 75.0% | 46.2% | 69.6% | 31.8% | 57.1% | 61.9% | 81.8% |
| Extremista ASPD | 20.0% | 45.0% | 42.9% | 17.4% | 43.5% | 18.5% | 50.0% | 56.0% | 39.3% | 52.2% | 10.5% | 50.0% | 33.3% | 52.0% |
| Extremista REF | 44.4% | 33.3% | 70.6% | 35.3% | 57.9% | 25.0% | 44.0% | 50.0% | 48.0% | 30.8% | 25.0% | 43.8% | 66.7% | 40.0% |
| Velocista | 47.1% | 60.0% | 52.2% | 46.2% | 76.9% | 53.8% | 60.7% | 52.0% | 50.0% | 77.8% | 24.0% | 56.5% | 60.9% | 65.2% |
| Berserker | 11.1% | 64.7% | 37.5% | 21.7% | 68.4% | 30.4% | 47.8% | 69.2% | 22.2% | 50.0% | 13.0% | 41.4% | 62.5% | 73.9% |
| Guardian | 43.5% | 70.0% | 60.0% | 45.5% | 76.5% | 68.2% | 84.2% | 75.0% | 76.0% | 87.0% | 50.0% | 66.7% | 57.1% | 61.9% |
| Estratega | 41.2% | 65.6% | 40.9% | 45.5% | 43.8% | 42.9% | 50.0% | 56.3% | 43.5% | 58.6% | 33.3% | 50.0% | 70.4% | 52.2% |
| Gladiador | 50.0% | 76.9% | 58.8% | 57.1% | 41.2% | 38.1% | 66.7% | 33.3% | 39.1% | 37.5% | 42.9% | 29.6% | 50.0% | 64.3% |
| Magus | 21.1% | 31.6% | 47.8% | 42.1% | 50.0% | 18.2% | 48.0% | 60.0% | 34.8% | 26.1% | 33.3% | 47.8% | 35.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.1% | 712 |
| 16-30 | 49.1% | 1039 |
| 31-50 | 53.8% | 689 |
| 51-70 | 49.8% | 418 |
| 71-100 | 48.2% | 1142 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 34.3% | 35 |
| 16-30 | 33.8% | 863 |
| 31-50 | 43.7% | 1471 |
| 51-70 | 60.3% | 622 |
| 71-100 | 66.9% | 1009 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 55.2% | 509 |
| 16-30 | 42.5% | 809 |
| 31-50 | 49.7% | 731 |
| 51-70 | 49.6% | 536 |
| 71-100 | 52.5% | 1415 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.2% | 920 |
| 16-30 | 42.4% | 986 |
| 31-50 | 52.0% | 723 |
| 51-70 | 57.0% | 479 |
| 71-100 | 59.8% | 892 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.3% | 1602 |
| 16-30 | 43.3% | 1100 |
| 31-50 | 48.8% | 641 |
| 51-70 | 77.2% | 267 |
| 71-100 | 71.0% | 390 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 3244 |
| 16-30 | 43.1% | 450 |
| 31-50 | 38.9% | 239 |
| 51-70 | 48.4% | 62 |
| 71-100 | 80.0% | 5 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.8% | 3246 |
| 16-30 | 41.3% | 433 |
| 31-50 | 41.0% | 249 |
| 51-70 | 45.5% | 66 |
| 71-100 | 66.7% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.8% | 3255 |
| 16-30 | 44.7% | 414 |
| 31-50 | 35.9% | 262 |
| 51-70 | 47.0% | 66 |
| 71-100 | 33.3% | 3 |
