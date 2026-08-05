# Combat Simulation Report
Generated: 2026-08-05 02:25:48 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 15.4 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 937 (93.7%) |
| Timeouts (draws) | 63 (6.3%) |
| Avg rounds (all) | 12.8 |
| Avg rounds (KO only) | 10.2 |
| Rounds P50 / P90 / Max | 7 / 33 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 159 |
| Avg rounds | 15.4 |
| P50 / P90 | 10 / 45 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 538/1000 |
| Winrate | 53.8% |
| Advantage over 50% | 3.8% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 77 | 142 | 54.2% |  |
| Asesino | 57 | 144 | 39.6% |  |
| Esquivo | 66 | 141 | 46.8% |  |
| Equilibrado | 71 | 126 | 56.3% |  |
| Extremista ATK | 64 | 145 | 44.1% |  |
| Extremista DEF | 73 | 140 | 52.1% |  |
| Extremista ASPD | 62 | 128 | 48.4% |  |
| Extremista REF | 68 | 145 | 46.9% |  |
| Velocista | 81 | 145 | 55.9% |  |
| Berserker | 75 | 166 | 45.2% |  |
| Guardian | 84 | 135 | 62.2% | YES |
| Estratega | 91 | 156 | 58.3% |  |
| Gladiador | 69 | 137 | 50.4% |  |
| Magus | 61 | 150 | 40.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.5 | 1 |
| Heal applied | 91.2 | - |
| Rests | 6.7 | 3 |
| Advances | 4.4 | - |
| Retreats | 0.2 | - |
| Battles with item use | 54.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 33.44 (avg 45.54) |
| ASPD spread (stddev) | 31.68 (avg 54.84) |
| Equipment tier A | 272 (13.6%) |
| Equipment tier B | 447 (22.4%) |
| Equipment tier C | 510 (25.5%) |
| Equipment tier E | 771 (38.6%) |
| Level 100-199 | 478 |
| Level 200-299 | 530 |
| Level 300-399 | 494 |
| Level 400-500 | 498 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 621 |
| cortante | 597 |
| desarmado | 190 |
| perforante | 592 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 624 | 47.4% |
| ligera | 8 | 37.5% |
| media | 58 | 48.3% |
| total | 1310 | 51.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 56 | 41.1% |
| 3+ | 1944 | 50.2% |
Set bonus active: 50.2% (1944) vs inactive 41.1% (56)

### Amulet
With amulet: 0.0% (0) vs without 50.0% (2000)

### Shield
With shield: 50.0% (1199) vs without 49.8% (801)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 243 | 67.5% |
| B | 409 | 58.9% |
| C | 464 | 48.9% |
| E | 694 | 41.4% |
| desarmado | 190 | 42.1% |

### Nature by level bracket
- **100-199**: contundente: 158, cortante: 129, desarmado: 48, perforante: 143
- **200-299**: contundente: 153, cortante: 166, desarmado: 57, perforante: 154
- **300-399**: contundente: 159, cortante: 155, desarmado: 41, perforante: 139
- **400-500**: contundente: 151, cortante: 147, desarmado: 44, perforante: 156

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.0% | 512 | 53.0% | 1488 | -12.0pp |
| d_fulgor | 41.0% | 512 | 53.0% | 1488 | -12.0pp |
| r_fulgor | 40.5% | 513 | 53.2% | 1487 | -12.6pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 11.5 | 0 | 128 | 0 | 7 | 17 |
| Asesino | 56.1 | 0 | 128 | 39 | 55 | 76 |
| Esquivo | 12.4 | 0 | 128 | 0 | 0 | 19 |
| Equilibrado | 22.4 | 0 | 128 | 0 | 19 | 32 |
| Extremista ATK | 57.0 | 0 | 128 | 44 | 58 | 75 |
| Extremista DEF | 4.3 | 0 | 96 | 0 | 0 | 0 |
| Extremista ASPD | 42.5 | 9 | 128 | 19 | 37 | 56 |
| Extremista REF | 23.2 | 0 | 128 | 6 | 18 | 33 |
| Velocista | 18.3 | 0 | 128 | 6 | 13 | 20 |
| Berserker | 62.0 | 0 | 128 | 46 | 60 | 84 |
| Guardian | 10.9 | 0 | 128 | 0 | 3 | 14 |
| Estratega | 26.8 | 0 | 128 | 13 | 19 | 34 |
| Gladiador | 45.0 | 0 | 128 | 19 | 40 | 62 |
| Magus | 45.0 | 9 | 128 | 24 | 38 | 61 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 316 | 316 | 100.0% |
| Asesino | 273 | 273 | 100.0% |
| Esquivo | 1475 | 1475 | 100.0% |
| Equilibrado | 849 | 849 | 100.0% |
| Extremista ATK | 353 | 353 | 100.0% |
| Extremista DEF | 292 | 292 | 100.0% |
| Extremista ASPD | 65 | 65 | 100.0% |
| Extremista REF | 169 | 169 | 100.0% |
| Velocista | 952 | 952 | 100.0% |
| Berserker | 173 | 173 | 100.0% |
| Guardian | 607 | 607 | 100.0% |
| Estratega | 607 | 607 | 100.0% |
| Gladiador | 277 | 277 | 100.0% |
| Magus | 296 | 296 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 6 | 1538 | 0.4% |
| Asesino | 10 | 763 | 1.3% |
| Esquivo | 394 | 2055 | 19.2% |
| Equilibrado | 35 | 1605 | 2.2% |
| Extremista ATK | 103 | 1084 | 9.5% |
| Extremista DEF | 430 | 1894 | 22.7% |
| Extremista ASPD | 76 | 802 | 9.5% |
| Extremista REF | 895 | 1241 | 72.1% |
| Velocista | 0 | 1548 | 0.0% |
| Berserker | 99 | 995 | 9.9% |
| Guardian | 2 | 1490 | 0.1% |
| Estratega | 731 | 1615 | 45.3% |
| Gladiador | 227 | 853 | 26.6% |
| Magus | 236 | 1092 | 21.6% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 14 | 15 | 15 | 11 | 11 | 10 | 10 | 5 | 10 | 12 | 12 | 9 | 18 |
| 5 | 24 | 21 | 18 | 23 | 20 | 20 | 18 | 13 | 11 | 19 | 21 | 16 | 17 | 24 |
| 10 | 28 | 21 | 20 | 27 | 21 | 24 | 18 | 12 | 16 | 19 | 25 | 15 | 17 | 24 |
| 15 | 30 | 21 | 24 | 27 | 21 | 28 | 18 | 12 | 16 | 20 | 26 | 15 | 18 | 24 |
| 20 | 30 | 21 | 25 | 27 | 22 | 30 | 19 | 13 | 16 | 20 | 26 | 16 | 18 | 25 |
| 25 | 30 | 21 | 26 | 27 | 22 | 30 | 19 | 13 | 16 | 20 | 26 | 16 | 18 | 25 |
| 30 | 29 | 21 | 26 | 27 | 22 | 30 | 18 | 13 | 15 | 20 | 26 | 16 | 19 | 25 |
| 40 | 29 | 22 | 28 | 27 | 23 | 29 | 18 | 14 | 15 | 20 | 26 | 16 | 19 | 25 |
| 50 | 29 | 22 | 29 | 27 | 23 | 28 | 19 | 14 | 15 | 20 | 26 | 17 | 19 | 25 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 90.9% | 62.5% | 45.5% | 71.4% | 44.4% | 44.4% | 50.0% | 22.2% | 64.7% | 0.0% | 61.5% | 50.0% | 61.5% |
| Asesino | 9.1% | 50.0% | 16.7% | 62.5% | 12.5% | 33.3% | 54.5% | 75.0% | 40.0% | 21.4% | 9.1% | 50.0% | 62.5% | 45.5% |
| Esquivo | 37.5% | 83.3% | 50.0% | 25.0% | 88.9% | 25.0% | 50.0% | 55.6% | 40.0% | 60.0% | 38.5% | 37.5% | 18.2% | 70.0% |
| Equilibrado | 54.5% | 37.5% | 75.0% | 50.0% | 80.0% | 50.0% | 100.0% | 50.0% | 45.5% | 58.3% | 36.4% | 42.9% | 66.7% | 69.2% |
| Extremista ATK | 28.6% | 87.5% | 11.1% | 20.0% | 50.0% | 30.0% | 63.6% | 46.7% | 0.0% | 62.5% | 29.4% | 44.4% | 50.0% | 75.0% |
| Extremista DEF | 55.6% | 66.7% | 75.0% | 50.0% | 70.0% | 50.0% | 42.9% | 42.9% | 58.3% | 71.4% | 40.0% | 18.2% | 50.0% | 22.2% |
| Extremista ASPD | 55.6% | 45.5% | 50.0% | 0.0% | 36.4% | 57.1% | 50.0% | 50.0% | 33.3% | 63.6% | 60.0% | 44.4% | 71.4% | 42.9% |
| Extremista REF | 50.0% | 25.0% | 44.4% | 50.0% | 53.3% | 57.1% | 50.0% | 50.0% | 53.3% | 37.5% | 25.0% | 42.9% | 30.0% | 81.8% |
| Velocista | 66.7% | 60.0% | 60.0% | 54.5% | 100.0% | 41.7% | 66.7% | 46.7% | 50.0% | 60.0% | 71.4% | 46.2% | 50.0% | 52.6% |
| Berserker | 35.3% | 78.6% | 40.0% | 41.7% | 37.5% | 28.6% | 36.4% | 62.5% | 40.0% | 50.0% | 50.0% | 35.7% | 25.0% | 69.2% |
| Guardian | 100.0% | 90.9% | 61.5% | 63.6% | 70.6% | 60.0% | 40.0% | 75.0% | 28.6% | 50.0% | 50.0% | 46.2% | 77.8% | 37.5% |
| Estratega | 38.5% | 50.0% | 62.5% | 57.1% | 55.6% | 81.8% | 55.6% | 57.1% | 53.8% | 64.3% | 53.8% | 50.0% | 69.2% | 71.4% |
| Gladiador | 50.0% | 37.5% | 81.8% | 33.3% | 50.0% | 50.0% | 28.6% | 70.0% | 50.0% | 75.0% | 22.2% | 30.8% | 50.0% | 61.5% |
| Magus | 38.5% | 54.5% | 30.0% | 30.8% | 25.0% | 77.8% | 57.1% | 18.2% | 47.4% | 30.8% | 62.5% | 28.6% | 38.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.9% | 507 |
| 16-30 | 48.8% | 414 |
| 31-50 | 56.0% | 309 |
| 51-70 | 49.2% | 185 |
| 71-100 | 50.4% | 585 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 22.2% | 9 |
| 16-30 | 34.3% | 423 |
| 31-50 | 47.8% | 776 |
| 51-70 | 57.9% | 290 |
| 71-100 | 62.4% | 502 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.0% | 245 |
| 16-30 | 44.3% | 379 |
| 31-50 | 48.3% | 356 |
| 51-70 | 53.0% | 266 |
| 71-100 | 55.0% | 754 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.7% | 422 |
| 16-30 | 43.5% | 504 |
| 31-50 | 49.2% | 358 |
| 51-70 | 59.4% | 239 |
| 71-100 | 60.0% | 477 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.6% | 796 |
| 16-30 | 42.1% | 542 |
| 31-50 | 49.8% | 319 |
| 51-70 | 76.6% | 128 |
| 71-100 | 70.2% | 215 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.1% | 1590 |
| 16-30 | 41.9% | 222 |
| 31-50 | 39.9% | 148 |
| 51-70 | 47.1% | 34 |
| 71-100 | 33.3% | 6 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 1602 |
| 16-30 | 38.2% | 220 |
| 31-50 | 45.5% | 143 |
| 51-70 | 33.3% | 30 |
| 71-100 | 40.0% | 5 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 1595 |
| 16-30 | 42.9% | 224 |
| 31-50 | 44.0% | 141 |
| 51-70 | 45.9% | 37 |
| 71-100 | 0.0% | 3 |
