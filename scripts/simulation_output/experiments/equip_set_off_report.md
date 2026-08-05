# Combat Simulation Report
Generated: 2026-08-05 02:26:12 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.3 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 958 (95.8%) |
| Timeouts (draws) | 42 (4.2%) |
| Avg rounds (all) | 9.2 |
| Avg rounds (KO only) | 7.4 |
| Rounds P50 / P90 / Max | 5 / 20 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 136 |
| Avg rounds | 10.3 |
| P50 / P90 | 6 / 31 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 505/1000 |
| Winrate | 50.5% |
| Advantage over 50% | 0.5% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 101 | 139 | 72.7% | YES |
| Asesino | 49 | 134 | 36.6% |  |
| Esquivo | 74 | 145 | 51.0% |  |
| Equilibrado | 96 | 150 | 64.0% |  |
| Extremista ATK | 56 | 140 | 40.0% |  |
| Extremista DEF | 92 | 141 | 65.2% |  |
| Extremista ASPD | 54 | 143 | 37.8% |  |
| Extremista REF | 48 | 141 | 34.0% |  |
| Velocista | 72 | 138 | 52.2% |  |
| Berserker | 62 | 148 | 41.9% |  |
| Guardian | 105 | 153 | 68.6% |  |
| Estratega | 66 | 135 | 48.9% |  |
| Gladiador | 60 | 141 | 42.6% |  |
| Magus | 65 | 152 | 42.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.8 | 0 |
| Heal applied | 49.6 | - |
| Rests | 7.0 | 4 |
| Advances | 2.8 | - |
| Retreats | 0.1 | - |
| Battles with item use | 31.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.4% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.57 (avg 49.04) |
| ASPD spread (stddev) | 31.11 (avg 55.65) |
| Equipment tier A | 251 (12.6%) |
| Equipment tier B | 441 (22.1%) |
| Equipment tier C | 516 (25.8%) |
| Equipment tier E | 792 (39.6%) |
| Level 100-199 | 507 |
| Level 200-299 | 573 |
| Level 300-399 | 482 |
| Level 400-500 | 438 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 618 |
| cortante | 565 |
| desarmado | 212 |
| perforante | 605 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 633 | 49.9% |
| ligera | 135 | 45.2% |
| media | 350 | 50.9% |
| total | 882 | 50.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 2000 | 50.0% |
Set bonus active: 0.0% (0) vs inactive 50.0% (2000)

### Amulet
With amulet: 48.6% (772) vs without 50.9% (1228)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 222 | 72.1% |
| B | 398 | 57.3% |
| C | 457 | 48.6% |
| E | 711 | 41.6% |
| desarmado | 212 | 44.3% |

### Nature by level bracket
- **100-199**: contundente: 149, cortante: 159, desarmado: 49, perforante: 150
- **200-299**: contundente: 174, cortante: 138, desarmado: 69, perforante: 192
- **300-399**: contundente: 145, cortante: 148, desarmado: 52, perforante: 137
- **400-500**: contundente: 150, cortante: 120, desarmado: 42, perforante: 126

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 38.6% | 492 | 53.7% | 1508 | -15.1pp |
| d_fulgor | 38.1% | 494 | 53.9% | 1506 | -15.9pp |
| r_fulgor | 37.7% | 478 | 53.9% | 1522 | -16.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.0 | 0 | 128 | 6 | 13 | 25 |
| Asesino | 60.7 | 0 | 128 | 46 | 57 | 83 |
| Esquivo | 17.4 | 0 | 128 | 0 | 14 | 24 |
| Equilibrado | 37.1 | 0 | 128 | 19 | 35 | 53 |
| Extremista ATK | 70.2 | 0 | 128 | 50 | 78 | 85 |
| Extremista DEF | 5.6 | 0 | 128 | 0 | 0 | 0 |
| Extremista ASPD | 53.3 | 0 | 128 | 26 | 46 | 82 |
| Extremista REF | 29.2 | 0 | 128 | 8 | 19 | 39 |
| Velocista | 26.1 | 0 | 128 | 13 | 21 | 30 |
| Berserker | 62.3 | 0 | 128 | 46 | 59 | 84 |
| Guardian | 10.9 | 0 | 128 | 0 | 0 | 18 |
| Estratega | 35.0 | 0 | 128 | 18 | 24 | 46 |
| Gladiador | 56.1 | 0 | 128 | 41 | 49 | 81 |
| Magus | 48.7 | 0 | 128 | 27 | 46 | 70 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 407 | 407 | 100.0% |
| Asesino | 76 | 76 | 100.0% |
| Esquivo | 1007 | 1007 | 100.0% |
| Equilibrado | 687 | 687 | 100.0% |
| Extremista ATK | 12 | 12 | 100.0% |
| Extremista DEF | 579 | 579 | 100.0% |
| Extremista ASPD | 105 | 105 | 100.0% |
| Extremista REF | 69 | 69 | 100.0% |
| Velocista | 668 | 668 | 100.0% |
| Berserker | 88 | 88 | 100.0% |
| Guardian | 840 | 840 | 100.0% |
| Estratega | 125 | 125 | 100.0% |
| Gladiador | 176 | 176 | 100.0% |
| Magus | 303 | 303 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 55 | 1129 | 4.9% |
| Asesino | 12 | 461 | 2.6% |
| Esquivo | 294 | 1458 | 20.2% |
| Equilibrado | 17 | 1109 | 1.5% |
| Extremista ATK | 55 | 621 | 8.9% |
| Extremista DEF | 295 | 1450 | 20.3% |
| Extremista ASPD | 35 | 691 | 5.1% |
| Extremista REF | 673 | 979 | 68.7% |
| Velocista | 0 | 1035 | 0.0% |
| Berserker | 121 | 799 | 15.1% |
| Guardian | 11 | 1853 | 0.6% |
| Estratega | 466 | 842 | 55.3% |
| Gladiador | 394 | 900 | 43.8% |
| Magus | 136 | 870 | 15.6% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 17 | 16 | 17 | 13 | 10 | 9 | 9 | 5 | 11 | 17 | 16 | 11 | 18 |
| 5 | 26 | 23 | 21 | 25 | 21 | 21 | 15 | 13 | 10 | 19 | 24 | 20 | 16 | 23 |
| 10 | 29 | 24 | 24 | 28 | 22 | 25 | 16 | 13 | 11 | 20 | 26 | 20 | 16 | 24 |
| 15 | 29 | 24 | 26 | 29 | 21 | 26 | 17 | 14 | 11 | 20 | 27 | 21 | 16 | 25 |
| 20 | 29 | 24 | 27 | 30 | 22 | 27 | 17 | 13 | 12 | 20 | 28 | 21 | 17 | 25 |
| 25 | 29 | 25 | 28 | 31 | 22 | 27 | 17 | 14 | 12 | 21 | 28 | 22 | 17 | 25 |
| 30 | 28 | 25 | 28 | 31 | 22 | 27 | 17 | 14 | 12 | 21 | 28 | 22 | 17 | 26 |
| 40 | 28 | 25 | 29 | 32 | 22 | 27 | 18 | 14 | 12 | 21 | 27 | 22 | 18 | 27 |
| 50 | 28 | 25 | 30 | 33 | 22 | 26 | 18 | 14 | 13 | 22 | 27 | 22 | 18 | 28 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 90.9% | 85.7% | 44.4% | 84.6% | 55.6% | 80.0% | 80.0% | 75.0% | 100.0% | 66.7% | 61.5% | 66.7% | 72.7% |
| Asesino | 9.1% | 50.0% | 55.6% | 28.6% | 55.6% | 0.0% | 50.0% | 33.3% | 42.9% | 50.0% | 16.7% | 43.8% | 44.4% | 30.8% |
| Esquivo | 14.3% | 44.4% | 50.0% | 25.0% | 54.5% | 75.0% | 70.0% | 75.0% | 35.7% | 58.3% | 46.2% | 60.0% | 55.6% | 25.0% |
| Equilibrado | 55.6% | 71.4% | 75.0% | 50.0% | 58.3% | 75.0% | 70.0% | 92.3% | 57.1% | 66.7% | 45.5% | 75.0% | 33.3% | 87.5% |
| Extremista ATK | 15.4% | 44.4% | 45.5% | 41.7% | 50.0% | 0.0% | 50.0% | 55.6% | 60.0% | 16.7% | 10.0% | 40.0% | 50.0% | 64.3% |
| Extremista DEF | 44.4% | 100.0% | 25.0% | 25.0% | 100.0% | 50.0% | 90.9% | 66.7% | 71.4% | 85.7% | 40.0% | 77.8% | 84.6% | 84.6% |
| Extremista ASPD | 20.0% | 50.0% | 30.0% | 30.0% | 50.0% | 9.1% | 50.0% | 36.4% | 41.2% | 41.7% | 11.1% | 55.6% | 50.0% | 44.4% |
| Extremista REF | 20.0% | 66.7% | 25.0% | 7.7% | 44.4% | 33.3% | 63.6% | 50.0% | 27.3% | 40.0% | 14.3% | 40.0% | 62.5% | 33.3% |
| Velocista | 25.0% | 57.1% | 64.3% | 42.9% | 40.0% | 28.6% | 58.8% | 72.7% | 50.0% | 77.8% | 33.3% | 33.3% | 66.7% | 75.0% |
| Berserker | 0.0% | 50.0% | 41.7% | 33.3% | 83.3% | 14.3% | 58.3% | 60.0% | 22.2% | 50.0% | 9.1% | 36.4% | 71.4% | 46.2% |
| Guardian | 33.3% | 83.3% | 53.8% | 54.5% | 90.0% | 60.0% | 88.9% | 85.7% | 66.7% | 90.9% | 50.0% | 57.1% | 54.5% | 100.0% |
| Estratega | 38.5% | 56.3% | 40.0% | 25.0% | 60.0% | 22.2% | 44.4% | 60.0% | 66.7% | 63.6% | 42.9% | 50.0% | 25.0% | 100.0% |
| Gladiador | 33.3% | 55.6% | 44.4% | 66.7% | 50.0% | 15.4% | 50.0% | 37.5% | 33.3% | 28.6% | 45.5% | 75.0% | 50.0% | 33.3% |
| Magus | 27.3% | 69.2% | 75.0% | 12.5% | 35.7% | 15.4% | 55.6% | 66.7% | 25.0% | 53.8% | 0.0% | 0.0% | 66.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 321 |
| 16-30 | 51.7% | 499 |
| 31-50 | 50.5% | 364 |
| 51-70 | 46.3% | 201 |
| 71-100 | 48.8% | 615 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 31.3% | 656 |
| 16-30 | 43.3% | 485 |
| 31-50 | 61.3% | 305 |
| 51-70 | 75.8% | 165 |
| 71-100 | 70.2% | 389 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 54.8% | 230 |
| 16-30 | 45.4% | 361 |
| 31-50 | 51.8% | 371 |
| 51-70 | 48.9% | 264 |
| 71-100 | 50.3% | 774 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.9% | 394 |
| 16-30 | 42.3% | 515 |
| 31-50 | 47.7% | 369 |
| 51-70 | 64.2% | 243 |
| 71-100 | 57.8% | 479 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.9% | 738 |
| 16-30 | 43.8% | 560 |
| 31-50 | 57.4% | 357 |
| 51-70 | 77.1% | 153 |
| 71-100 | 67.7% | 192 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.0% | 1596 |
| 16-30 | 41.6% | 238 |
| 31-50 | 35.2% | 128 |
| 51-70 | 29.0% | 31 |
| 71-100 | 14.3% | 7 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.6% | 1600 |
| 16-30 | 34.6% | 237 |
| 31-50 | 39.5% | 119 |
| 51-70 | 30.8% | 39 |
| 71-100 | 20.0% | 5 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.0% | 1613 |
| 16-30 | 41.8% | 220 |
| 31-50 | 30.7% | 127 |
| 51-70 | 37.1% | 35 |
| 71-100 | 20.0% | 5 |
