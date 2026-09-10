# Combat Simulation Report
Generated: 2026-08-05 03:22:11 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 8.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 922 (92.2%) |
| Timeouts (draws) | 78 (7.8%) |
| Avg rounds (all) | 7.0 |
| Avg rounds (KO only) | 5.9 |
| Rounds P50 / P90 / Max | 5 / 16 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 170 |
| Avg rounds | 8.1 |
| P50 / P90 | 6 / 20 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 534/1000 |
| Winrate | 53.4% |
| Advantage over 50% | 3.4% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 111 | 155 | 71.6% | YES |
| Asesino | 68 | 150 | 45.3% |  |
| Esquivo | 46 | 132 | 34.8% |  |
| Equilibrado | 69 | 141 | 48.9% |  |
| Extremista ATK | 57 | 137 | 41.6% |  |
| Extremista DEF | 78 | 119 | 65.5% |  |
| Extremista ASPD | 54 | 143 | 37.8% |  |
| Extremista REF | 69 | 151 | 45.7% |  |
| Velocista | 89 | 150 | 59.3% |  |
| Berserker | 63 | 155 | 40.6% |  |
| Guardian | 82 | 138 | 59.4% |  |
| Estratega | 79 | 146 | 54.1% |  |
| Gladiador | 80 | 140 | 57.1% |  |
| Magus | 54 | 143 | 37.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 61.2 | - |
| Rests | 2.8 | 2 |
| Advances | 3.6 | - |
| Retreats | 0.1 | - |
| Battles with item use | 44.0% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.6% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.71 (avg 48.65) |
| ASPD spread (stddev) | 31.20 (avg 54.98) |
| Equipment tier A | 277 (13.9%) |
| Equipment tier B | 424 (21.2%) |
| Equipment tier C | 524 (26.2%) |
| Equipment tier E | 775 (38.8%) |
| Level 100-199 | 461 |
| Level 200-299 | 544 |
| Level 300-399 | 518 |
| Level 400-500 | 477 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 592 |
| cortante | 607 |
| desarmado | 208 |
| perforante | 593 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1503 | 50.6% |
| total | 497 | 47.9% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 8 | 37.5% |
| 3+ | 1992 | 50.0% |
Set bonus active: 50.0% (1992) vs inactive 37.5% (8)

### Amulet
With amulet: 52.6% (775) vs without 48.2% (1225)

### Shield
With shield: 50.0% (2000) vs without 0.0% (0)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 248 | 66.9% |
| B | 381 | 56.4% |
| C | 469 | 51.0% |
| E | 694 | 41.2% |
| desarmado | 208 | 44.7% |

### Nature by level bracket
- **100-199**: contundente: 134, cortante: 131, desarmado: 45, perforante: 151
- **200-299**: contundente: 153, cortante: 189, desarmado: 59, perforante: 143
- **300-399**: contundente: 155, cortante: 156, desarmado: 55, perforante: 152
- **400-500**: contundente: 150, cortante: 131, desarmado: 49, perforante: 147

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 40.2% | 475 | 53.0% | 1525 | -12.8pp |
| d_fulgor | 38.7% | 473 | 53.4% | 1527 | -14.7pp |
| r_fulgor | 39.7% | 479 | 53.2% | 1521 | -13.5pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 20.7 | 0 | 128 | 9 | 16 | 25 |
| Asesino | 56.7 | 0 | 128 | 41 | 53 | 77 |
| Esquivo | 15.9 | 0 | 128 | 0 | 10 | 18 |
| Equilibrado | 32.0 | 0 | 128 | 15 | 27 | 46 |
| Extremista ATK | 55.5 | 0 | 128 | 46 | 50 | 76 |
| Extremista DEF | 10.5 | 0 | 128 | 0 | 0 | 14 |
| Extremista ASPD | 46.7 | 10 | 128 | 19 | 45 | 70 |
| Extremista REF | 25.7 | 0 | 128 | 9 | 16 | 36 |
| Velocista | 21.3 | 0 | 128 | 10 | 14 | 24 |
| Berserker | 59.6 | 0 | 128 | 46 | 65 | 80 |
| Guardian | 10.5 | 0 | 128 | 0 | 0 | 18 |
| Estratega | 32.5 | 0 | 128 | 14 | 23 | 44 |
| Gladiador | 50.3 | 0 | 128 | 30 | 48 | 65 |
| Magus | 50.5 | 0 | 128 | 28 | 47 | 61 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 132 | 132 | 100.0% |
| Asesino | 153 | 153 | 100.0% |
| Esquivo | 425 | 425 | 100.0% |
| Equilibrado | 455 | 455 | 100.0% |
| Extremista ATK | 79 | 79 | 100.0% |
| Extremista DEF | 108 | 108 | 100.0% |
| Extremista ASPD | 89 | 89 | 100.0% |
| Extremista REF | 51 | 51 | 100.0% |
| Velocista | 142 | 142 | 100.0% |
| Berserker | 28 | 28 | 100.0% |
| Guardian | 101 | 101 | 100.0% |
| Estratega | 146 | 146 | 100.0% |
| Gladiador | 107 | 107 | 100.0% |
| Magus | 188 | 188 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 5 | 718 | 0.7% |
| Asesino | 0 | 421 | 0.0% |
| Esquivo | 171 | 731 | 23.4% |
| Equilibrado | 33 | 788 | 4.2% |
| Extremista ATK | 53 | 490 | 10.8% |
| Extremista DEF | 97 | 584 | 16.6% |
| Extremista ASPD | 35 | 422 | 8.3% |
| Extremista REF | 463 | 637 | 72.7% |
| Velocista | 0 | 479 | 0.0% |
| Berserker | 53 | 532 | 10.0% |
| Guardian | 0 | 752 | 0.0% |
| Estratega | 384 | 697 | 55.1% |
| Gladiador | 246 | 594 | 41.4% |
| Magus | 97 | 646 | 15.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 17 | 13 | 16 | 16 | 11 | 12 | 9 | 14 | 6 | 10 | 16 | 12 | 12 | 20 |
| 5 | 26 | 19 | 19 | 22 | 18 | 20 | 15 | 16 | 12 | 17 | 23 | 16 | 19 | 24 |
| 10 | 29 | 20 | 20 | 24 | 19 | 24 | 15 | 15 | 14 | 17 | 25 | 15 | 19 | 24 |
| 15 | 29 | 20 | 21 | 24 | 19 | 26 | 16 | 15 | 14 | 17 | 26 | 15 | 19 | 25 |
| 20 | 29 | 20 | 23 | 24 | 19 | 27 | 16 | 15 | 14 | 16 | 26 | 15 | 19 | 25 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 81.8% | 75.0% | 30.0% | 85.7% | 80.0% | 94.4% | 83.3% | 80.0% | 85.7% | 66.7% | 41.2% | 50.0% | 87.5% |
| Asesino | 18.2% | 50.0% | 62.5% | 58.3% | 30.0% | 40.0% | 46.7% | 45.5% | 42.9% | 58.3% | 33.3% | 40.0% | 71.4% | 44.4% |
| Esquivo | 25.0% | 37.5% | 50.0% | 40.0% | 50.0% | 0.0% | 33.3% | 46.2% | 18.2% | 50.0% | 20.0% | 45.5% | 0.0% | 55.6% |
| Equilibrado | 70.0% | 41.7% | 60.0% | 50.0% | 50.0% | 27.3% | 75.0% | 70.0% | 40.0% | 50.0% | 50.0% | 16.7% | 38.5% | 70.0% |
| Extremista ATK | 14.3% | 70.0% | 50.0% | 50.0% | 50.0% | 16.7% | 55.6% | 30.0% | 12.5% | 40.0% | 54.5% | 57.1% | 16.7% | 72.7% |
| Extremista DEF | 20.0% | 60.0% | 100.0% | 72.7% | 83.3% | 33.3% | 77.8% | 88.9% | 22.2% | 75.0% | 62.5% | 66.7% | 60.0% | 80.0% |
| Extremista ASPD | 5.6% | 53.3% | 66.7% | 25.0% | 44.4% | 22.2% | 50.0% | 37.5% | 12.5% | 61.5% | 16.7% | 66.7% | 20.0% | 33.3% |
| Extremista REF | 16.7% | 54.5% | 53.8% | 30.0% | 70.0% | 11.1% | 62.5% | 50.0% | 45.5% | 57.1% | 16.7% | 61.5% | 33.3% | 75.0% |
| Velocista | 20.0% | 57.1% | 81.8% | 60.0% | 87.5% | 77.8% | 87.5% | 54.5% | 50.0% | 50.0% | 33.3% | 50.0% | 53.3% | 73.3% |
| Berserker | 14.3% | 41.7% | 50.0% | 50.0% | 60.0% | 25.0% | 38.5% | 42.9% | 50.0% | 50.0% | 18.2% | 14.3% | 41.7% | 53.8% |
| Guardian | 33.3% | 66.7% | 80.0% | 50.0% | 45.5% | 37.5% | 83.3% | 83.3% | 66.7% | 81.8% | 50.0% | 50.0% | 53.3% | 75.0% |
| Estratega | 58.8% | 60.0% | 54.5% | 83.3% | 42.9% | 33.3% | 33.3% | 38.5% | 50.0% | 85.7% | 50.0% | 50.0% | 55.6% | 50.0% |
| Gladiador | 50.0% | 28.6% | 100.0% | 61.5% | 83.3% | 40.0% | 80.0% | 66.7% | 46.7% | 58.3% | 46.7% | 44.4% | 50.0% | 58.3% |
| Magus | 12.5% | 55.6% | 44.4% | 30.0% | 27.3% | 20.0% | 66.7% | 25.0% | 26.7% | 46.2% | 25.0% | 50.0% | 41.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.5% | 336 |
| 16-30 | 52.2% | 498 |
| 31-50 | 47.5% | 358 |
| 51-70 | 50.0% | 198 |
| 71-100 | 50.3% | 610 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 38.5% | 13 |
| 16-30 | 34.6% | 419 |
| 31-50 | 45.6% | 767 |
| 51-70 | 56.3% | 327 |
| 71-100 | 66.5% | 474 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 210 |
| 16-30 | 42.0% | 410 |
| 31-50 | 48.9% | 360 |
| 51-70 | 50.7% | 276 |
| 71-100 | 54.2% | 744 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.7% | 443 |
| 16-30 | 45.9% | 510 |
| 31-50 | 50.9% | 350 |
| 51-70 | 55.3% | 226 |
| 71-100 | 58.0% | 471 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.9% | 746 |
| 16-30 | 42.9% | 602 |
| 31-50 | 49.1% | 350 |
| 51-70 | 73.0% | 122 |
| 71-100 | 72.2% | 180 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 1616 |
| 16-30 | 41.0% | 222 |
| 31-50 | 37.0% | 138 |
| 51-70 | 47.6% | 21 |
| 71-100 | 66.7% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 1612 |
| 16-30 | 39.4% | 216 |
| 31-50 | 37.0% | 135 |
| 51-70 | 47.1% | 34 |
| 71-100 | 66.7% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1615 |
| 16-30 | 38.3% | 227 |
| 31-50 | 42.9% | 126 |
| 51-70 | 34.5% | 29 |
| 71-100 | 66.7% | 3 |
