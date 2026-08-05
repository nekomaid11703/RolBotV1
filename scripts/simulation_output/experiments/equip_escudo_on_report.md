# Combat Simulation Report
Generated: 2026-08-05 02:25:59 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 13.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.1 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 943 (94.3%) |
| Timeouts (draws) | 57 (5.7%) |
| Avg rounds (all) | 12.1 |
| Avg rounds (KO only) | 9.7 |
| Rounds P50 / P90 / Max | 7 / 30 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 148 |
| Avg rounds | 13.1 |
| P50 / P90 | 8 / 31 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 554/1000 |
| Winrate | 55.4% |
| Advantage over 50% | 5.4% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 80 | 132 | 60.6% | YES |
| Asesino | 57 | 155 | 36.8% |  |
| Esquivo | 65 | 136 | 47.8% |  |
| Equilibrado | 85 | 152 | 55.9% |  |
| Extremista ATK | 66 | 148 | 44.6% |  |
| Extremista DEF | 84 | 149 | 56.4% |  |
| Extremista ASPD | 51 | 119 | 42.9% |  |
| Extremista REF | 72 | 140 | 51.4% |  |
| Velocista | 86 | 143 | 60.1% |  |
| Berserker | 63 | 155 | 40.6% |  |
| Guardian | 78 | 140 | 55.7% |  |
| Estratega | 69 | 132 | 52.3% |  |
| Gladiador | 81 | 147 | 55.1% |  |
| Magus | 62 | 152 | 40.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.4 | 1 |
| Heal applied | 85.5 | - |
| Rests | 6.3 | 3 |
| Advances | 4.2 | - |
| Retreats | 0.2 | - |
| Battles with item use | 51.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.22 (avg 48.34) |
| ASPD spread (stddev) | 31.10 (avg 53.44) |
| Equipment tier A | 269 (13.5%) |
| Equipment tier B | 405 (20.3%) |
| Equipment tier C | 548 (27.4%) |
| Equipment tier E | 778 (38.9%) |
| Level 100-199 | 472 |
| Level 200-299 | 561 |
| Level 300-399 | 495 |
| Level 400-500 | 472 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 591 |
| cortante | 574 |
| desarmado | 219 |
| perforante | 616 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 724 | 50.1% |
| total | 1276 | 49.8% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 10 | 40.0% |
| 3+ | 1990 | 50.0% |
Set bonus active: 50.0% (1990) vs inactive 40.0% (10)

### Amulet
With amulet: 49.9% (822) vs without 50.0% (1178)

### Shield
With shield: 50.0% (2000) vs without 0.0% (0)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 235 | 73.6% |
| B | 355 | 61.1% |
| C | 496 | 47.6% |
| E | 695 | 41.3% |
| desarmado | 219 | 39.3% |

### Nature by level bracket
- **100-199**: contundente: 135, cortante: 145, desarmado: 52, perforante: 140
- **200-299**: contundente: 182, cortante: 161, desarmado: 55, perforante: 163
- **300-399**: contundente: 150, cortante: 119, desarmado: 59, perforante: 167
- **400-500**: contundente: 124, cortante: 149, desarmado: 53, perforante: 146

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 38.6% | 477 | 53.5% | 1523 | -14.9pp |
| d_fulgor | 40.2% | 478 | 53.0% | 1522 | -12.9pp |
| r_fulgor | 39.9% | 479 | 53.1% | 1521 | -13.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 16.7 | 0 | 128 | 5 | 12 | 19 |
| Asesino | 57.5 | 0 | 128 | 46 | 54 | 80 |
| Esquivo | 15.2 | 0 | 128 | 0 | 11 | 20 |
| Equilibrado | 31.5 | 0 | 128 | 17 | 28 | 43 |
| Extremista ATK | 59.8 | 0 | 128 | 46 | 53 | 75 |
| Extremista DEF | 3.9 | 0 | 128 | 0 | 0 | 0 |
| Extremista ASPD | 51.2 | 8 | 128 | 29 | 48 | 71 |
| Extremista REF | 31.9 | 0 | 128 | 17 | 22 | 46 |
| Velocista | 21.8 | 0 | 128 | 8 | 16 | 26 |
| Berserker | 60.1 | 0 | 128 | 42 | 52 | 76 |
| Guardian | 8.1 | 0 | 128 | 0 | 0 | 14 |
| Estratega | 29.3 | 0 | 128 | 14 | 23 | 41 |
| Gladiador | 46.3 | 0 | 128 | 26 | 43 | 60 |
| Magus | 42.4 | 0 | 128 | 19 | 35 | 53 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 493 | 493 | 100.0% |
| Asesino | 97 | 97 | 100.0% |
| Esquivo | 1705 | 1705 | 100.0% |
| Equilibrado | 782 | 782 | 100.0% |
| Extremista ATK | 154 | 154 | 100.0% |
| Extremista DEF | 655 | 655 | 100.0% |
| Extremista ASPD | 218 | 218 | 100.0% |
| Extremista REF | 97 | 97 | 100.0% |
| Velocista | 817 | 817 | 100.0% |
| Berserker | 149 | 149 | 100.0% |
| Guardian | 539 | 539 | 100.0% |
| Estratega | 173 | 173 | 100.0% |
| Gladiador | 604 | 604 | 100.0% |
| Magus | 485 | 485 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 14 | 1417 | 1.0% |
| Asesino | 3 | 623 | 0.5% |
| Esquivo | 314 | 2182 | 14.4% |
| Equilibrado | 27 | 1402 | 1.9% |
| Extremista ATK | 140 | 848 | 16.5% |
| Extremista DEF | 298 | 1974 | 15.1% |
| Extremista ASPD | 144 | 803 | 17.9% |
| Extremista REF | 655 | 879 | 74.5% |
| Velocista | 0 | 1173 | 0.0% |
| Berserker | 99 | 811 | 12.2% |
| Guardian | 1 | 1906 | 0.1% |
| Estratega | 575 | 990 | 58.1% |
| Gladiador | 339 | 1261 | 26.9% |
| Magus | 184 | 1087 | 16.9% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 15 | 14 | 15 | 12 | 9 | 10 | 10 | 6 | 10 | 14 | 13 | 8 | 16 |
| 5 | 23 | 22 | 17 | 23 | 21 | 19 | 18 | 15 | 12 | 17 | 22 | 16 | 18 | 23 |
| 10 | 27 | 22 | 19 | 27 | 21 | 25 | 17 | 13 | 15 | 18 | 26 | 15 | 18 | 22 |
| 15 | 29 | 22 | 22 | 28 | 22 | 29 | 17 | 13 | 15 | 19 | 28 | 16 | 19 | 23 |
| 20 | 29 | 22 | 24 | 28 | 22 | 32 | 17 | 14 | 15 | 19 | 29 | 16 | 19 | 23 |
| 25 | 29 | 22 | 25 | 28 | 22 | 32 | 17 | 14 | 15 | 19 | 30 | 17 | 19 | 24 |
| 30 | 29 | 23 | 26 | 29 | 22 | 32 | 17 | 14 | 17 | 19 | 29 | 17 | 19 | 25 |
| 40 | 29 | 23 | 26 | 29 | 23 | 30 | 18 | 14 | 17 | 19 | 28 | 18 | 20 | 26 |
| 50 | 28 | 23 | 27 | 30 | 23 | 30 | 18 | 14 | 17 | 19 | 28 | 18 | 21 | 26 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 70.0% | 80.0% | 44.4% | 83.3% | 62.5% | 63.6% | 83.3% | 37.5% | 66.7% | 83.3% | 37.5% | 38.5% | 44.4% |
| Asesino | 30.0% | 50.0% | 37.5% | 44.4% | 33.3% | 28.6% | 50.0% | 38.5% | 8.3% | 41.2% | 33.3% | 53.8% | 37.5% | 33.3% |
| Esquivo | 20.0% | 62.5% | 50.0% | 57.1% | 42.9% | 13.3% | 60.0% | 72.7% | 41.7% | 55.6% | 61.9% | 55.6% | 33.3% | 22.2% |
| Equilibrado | 55.6% | 55.6% | 42.9% | 50.0% | 83.3% | 55.6% | 75.0% | 30.0% | 42.9% | 75.0% | 50.0% | 52.9% | 58.8% | 77.8% |
| Extremista ATK | 16.7% | 66.7% | 57.1% | 16.7% | 50.0% | 36.4% | 66.7% | 42.9% | 50.0% | 37.5% | 27.3% | 50.0% | 44.4% | 75.0% |
| Extremista DEF | 37.5% | 71.4% | 80.0% | 44.4% | 63.6% | 50.0% | 62.5% | 62.5% | 50.0% | 78.6% | 16.7% | 50.0% | 46.7% | 50.0% |
| Extremista ASPD | 36.4% | 50.0% | 40.0% | 25.0% | 33.3% | 37.5% | 50.0% | 28.6% | 25.0% | 75.0% | 50.0% | 42.9% | 25.0% | 70.0% |
| Extremista REF | 16.7% | 61.5% | 27.3% | 70.0% | 57.1% | 37.5% | 71.4% | 50.0% | 45.5% | 43.8% | 37.5% | 50.0% | 60.0% | 72.7% |
| Velocista | 62.5% | 91.7% | 58.3% | 57.1% | 50.0% | 50.0% | 75.0% | 54.5% | 50.0% | 92.9% | 54.5% | 41.7% | 50.0% | 50.0% |
| Berserker | 33.3% | 58.8% | 44.4% | 25.0% | 62.5% | 21.4% | 25.0% | 56.3% | 7.1% | 50.0% | 0.0% | 63.6% | 25.0% | 54.5% |
| Guardian | 16.7% | 66.7% | 38.1% | 50.0% | 72.7% | 83.3% | 50.0% | 62.5% | 45.5% | 100.0% | 50.0% | 60.0% | 45.5% | 100.0% |
| Estratega | 62.5% | 46.2% | 44.4% | 47.1% | 50.0% | 50.0% | 57.1% | 50.0% | 58.3% | 36.4% | 40.0% | 50.0% | 61.5% | 77.8% |
| Gladiador | 61.5% | 62.5% | 66.7% | 41.2% | 55.6% | 53.3% | 75.0% | 40.0% | 50.0% | 75.0% | 54.5% | 38.5% | 50.0% | 66.7% |
| Magus | 55.6% | 66.7% | 77.8% | 22.2% | 25.0% | 50.0% | 30.0% | 27.3% | 50.0% | 45.5% | 0.0% | 22.2% | 33.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.4% | 319 |
| 16-30 | 52.4% | 500 |
| 31-50 | 56.7% | 388 |
| 51-70 | 44.7% | 199 |
| 71-100 | 50.3% | 594 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 27.3% | 11 |
| 16-30 | 34.4% | 425 |
| 31-50 | 47.0% | 759 |
| 51-70 | 59.1% | 298 |
| 71-100 | 62.5% | 507 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.3% | 254 |
| 16-30 | 42.8% | 395 |
| 31-50 | 45.9% | 355 |
| 51-70 | 50.5% | 305 |
| 71-100 | 57.6% | 691 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.1% | 456 |
| 16-30 | 44.7% | 494 |
| 31-50 | 48.9% | 368 |
| 51-70 | 57.6% | 236 |
| 71-100 | 62.6% | 446 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.7% | 790 |
| 16-30 | 45.4% | 538 |
| 31-50 | 52.6% | 329 |
| 51-70 | 65.0% | 143 |
| 71-100 | 72.0% | 200 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 1626 |
| 16-30 | 37.0% | 219 |
| 31-50 | 41.1% | 124 |
| 51-70 | 50.0% | 28 |
| 71-100 | 66.7% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 1623 |
| 16-30 | 40.5% | 215 |
| 31-50 | 37.7% | 130 |
| 51-70 | 44.8% | 29 |
| 71-100 | 66.7% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 1627 |
| 16-30 | 37.4% | 214 |
| 31-50 | 40.8% | 120 |
| 51-70 | 48.6% | 37 |
| 71-100 | 50.0% | 2 |
