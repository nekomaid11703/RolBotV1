# Combat Simulation Report
Generated: 2026-08-05 03:22:14 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.3 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 904 (90.4%) |
| Timeouts (draws) | 96 (9.6%) |
| Avg rounds (all) | 7.0 |
| Avg rounds (KO only) | 5.6 |
| Rounds P50 / P90 / Max | 4 / 20 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 154 |
| Avg rounds | 7.3 |
| P50 / P90 | 5 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 484/1000 |
| Winrate | 48.4% |
| Advantage over 50% | -1.6% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 90 | 143 | 62.9% | YES |
| Asesino | 63 | 135 | 46.7% |  |
| Esquivo | 66 | 148 | 44.6% |  |
| Equilibrado | 84 | 143 | 58.7% |  |
| Extremista ATK | 50 | 129 | 38.8% |  |
| Extremista DEF | 94 | 156 | 60.3% |  |
| Extremista ASPD | 46 | 127 | 36.2% |  |
| Extremista REF | 57 | 123 | 46.3% |  |
| Velocista | 90 | 154 | 58.4% |  |
| Berserker | 58 | 146 | 39.7% |  |
| Guardian | 91 | 147 | 61.9% |  |
| Estratega | 64 | 137 | 46.7% |  |
| Gladiador | 81 | 150 | 54.0% |  |
| Magus | 66 | 162 | 40.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.0 | 0 |
| Heal applied | 55.9 | - |
| Rests | 2.9 | 1 |
| Advances | 3.0 | - |
| Retreats | 0.1 | - |
| Battles with item use | 41.2% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.3% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.48 (avg 47.34) |
| ASPD spread (stddev) | 30.93 (avg 53.41) |
| Equipment tier A | 276 (13.8%) |
| Equipment tier B | 405 (20.3%) |
| Equipment tier C | 494 (24.7%) |
| Equipment tier E | 825 (41.3%) |
| Level 100-199 | 472 |
| Level 200-299 | 566 |
| Level 300-399 | 481 |
| Level 400-500 | 481 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 590 |
| cortante | 591 |
| desarmado | 195 |
| perforante | 624 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| ligera | 2000 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 50.0% |
Set bonus active: 50.0% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 51.0% (843) vs without 49.3% (1157)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 256 | 69.9% |
| B | 369 | 55.8% |
| C | 447 | 49.7% |
| E | 733 | 42.6% |
| desarmado | 195 | 41.5% |

### Nature by level bracket
- **100-199**: contundente: 138, cortante: 132, desarmado: 47, perforante: 155
- **200-299**: contundente: 159, cortante: 180, desarmado: 65, perforante: 162
- **300-399**: contundente: 145, cortante: 144, desarmado: 45, perforante: 147
- **400-500**: contundente: 148, cortante: 135, desarmado: 38, perforante: 160

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 47.8% | 477 | 50.7% | 1523 | -2.9pp |
| d_fulgor | 48.3% | 462 | 50.5% | 1538 | -2.3pp |
| r_fulgor | 49.0% | 457 | 50.3% | 1543 | -1.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.4 | 0 | 128 | 4 | 14 | 25 |
| Asesino | 62.8 | 19 | 128 | 46 | 66 | 80 |
| Esquivo | 16.0 | 0 | 128 | 0 | 9 | 22 |
| Equilibrado | 27.7 | 0 | 128 | 12 | 26 | 42 |
| Extremista ATK | 54.1 | 0 | 128 | 28 | 50 | 75 |
| Extremista DEF | 7.8 | 0 | 128 | 0 | 0 | 8 |
| Extremista ASPD | 48.7 | 0 | 128 | 19 | 46 | 76 |
| Extremista REF | 20.5 | 0 | 128 | 8 | 18 | 23 |
| Velocista | 22.1 | 0 | 128 | 9 | 15 | 26 |
| Berserker | 50.4 | 0 | 111 | 19 | 50 | 70 |
| Guardian | 13.6 | 0 | 128 | 0 | 7 | 17 |
| Estratega | 27.0 | 0 | 128 | 14 | 19 | 31 |
| Gladiador | 48.9 | 0 | 128 | 29 | 46 | 62 |
| Magus | 46.3 | 0 | 128 | 19 | 37 | 62 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 91 | 91 | 100.0% |
| Asesino | 126 | 126 | 100.0% |
| Esquivo | 483 | 483 | 100.0% |
| Equilibrado | 571 | 571 | 100.0% |
| Extremista ATK | 33 | 33 | 100.0% |
| Extremista DEF | 83 | 83 | 100.0% |
| Extremista ASPD | 21 | 21 | 100.0% |
| Extremista REF | 15 | 15 | 100.0% |
| Velocista | 284 | 284 | 100.0% |
| Berserker | 108 | 108 | 100.0% |
| Guardian | 210 | 210 | 100.0% |
| Estratega | 188 | 188 | 100.0% |
| Gladiador | 137 | 137 | 100.0% |
| Magus | 293 | 293 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 42 | 861 | 4.9% |
| Asesino | 14 | 368 | 3.8% |
| Esquivo | 184 | 796 | 23.1% |
| Equilibrado | 52 | 1011 | 5.1% |
| Extremista ATK | 28 | 458 | 6.1% |
| Extremista DEF | 168 | 873 | 19.2% |
| Extremista ASPD | 21 | 414 | 5.1% |
| Extremista REF | 410 | 535 | 76.6% |
| Velocista | 0 | 494 | 0.0% |
| Berserker | 89 | 539 | 16.5% |
| Guardian | 1 | 853 | 0.1% |
| Estratega | 426 | 800 | 53.3% |
| Gladiador | 186 | 564 | 33.0% |
| Magus | 90 | 644 | 14.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 17 | 18 | 17 | 19 | 11 | 13 | 15 | 11 | 8 | 12 | 17 | 16 | 13 | 20 |
| 5 | 25 | 24 | 19 | 25 | 17 | 19 | 20 | 13 | 16 | 19 | 24 | 18 | 19 | 25 |
| 10 | 27 | 24 | 21 | 27 | 17 | 23 | 20 | 13 | 18 | 19 | 27 | 17 | 19 | 25 |
| 15 | 28 | 25 | 23 | 28 | 18 | 24 | 20 | 13 | 18 | 19 | 28 | 17 | 20 | 26 |
| 20 | 29 | 25 | 23 | 29 | 18 | 26 | 20 | 13 | 18 | 19 | 28 | 17 | 20 | 26 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 54.5% | 66.7% | 62.5% | 75.0% | 45.5% | 71.4% | 50.0% | 47.1% | 71.4% | 57.1% | 75.0% | 76.9% | 85.7% |
| Asesino | 45.5% | 50.0% | 50.0% | 40.0% | 55.6% | 16.7% | 72.7% | 50.0% | 42.9% | 56.3% | 33.3% | 50.0% | 20.0% | 53.8% |
| Esquivo | 33.3% | 50.0% | 50.0% | 41.7% | 12.5% | 45.5% | 54.5% | 75.0% | 57.1% | 36.4% | 50.0% | 43.8% | 12.5% | 54.5% |
| Equilibrado | 37.5% | 60.0% | 58.3% | 50.0% | 83.3% | 75.0% | 66.7% | 63.6% | 37.5% | 55.6% | 54.5% | 42.9% | 60.0% | 76.9% |
| Extremista ATK | 25.0% | 44.4% | 87.5% | 16.7% | 50.0% | 50.0% | 33.3% | 28.6% | 8.3% | 30.0% | 11.1% | 50.0% | 54.5% | 81.8% |
| Extremista DEF | 54.5% | 83.3% | 54.5% | 25.0% | 50.0% | 50.0% | 75.0% | 80.0% | 63.6% | 71.4% | 55.6% | 66.7% | 60.0% | 73.3% |
| Extremista ASPD | 28.6% | 27.3% | 45.5% | 33.3% | 66.7% | 25.0% | 50.0% | 28.6% | 21.4% | 66.7% | 25.0% | 20.0% | 46.2% | 33.3% |
| Extremista REF | 50.0% | 50.0% | 25.0% | 36.4% | 71.4% | 20.0% | 71.4% | 50.0% | 72.7% | 27.3% | 33.3% | 28.6% | 62.5% | 36.4% |
| Velocista | 52.9% | 57.1% | 42.9% | 62.5% | 91.7% | 36.4% | 78.6% | 27.3% | 50.0% | 80.0% | 44.4% | 60.0% | 55.6% | 66.7% |
| Berserker | 28.6% | 43.8% | 63.6% | 44.4% | 70.0% | 28.6% | 33.3% | 72.7% | 20.0% | 50.0% | 0.0% | 22.2% | 36.4% | 45.5% |
| Guardian | 42.9% | 66.7% | 50.0% | 45.5% | 88.9% | 44.4% | 75.0% | 66.7% | 55.6% | 100.0% | 50.0% | 72.7% | 46.7% | 66.7% |
| Estratega | 25.0% | 50.0% | 56.3% | 57.1% | 50.0% | 33.3% | 80.0% | 71.4% | 40.0% | 77.8% | 27.3% | 50.0% | 33.3% | 36.4% |
| Gladiador | 23.1% | 80.0% | 87.5% | 40.0% | 45.5% | 40.0% | 53.8% | 37.5% | 44.4% | 63.6% | 53.3% | 66.7% | 50.0% | 73.3% |
| Magus | 14.3% | 46.2% | 45.5% | 23.1% | 18.2% | 26.7% | 66.7% | 63.6% | 33.3% | 54.5% | 33.3% | 63.6% | 26.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.2% | 345 |
| 16-30 | 51.1% | 532 |
| 31-50 | 56.2% | 347 |
| 51-70 | 50.5% | 200 |
| 71-100 | 46.7% | 576 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 22.2% | 9 |
| 16-30 | 40.3% | 409 |
| 31-50 | 43.3% | 755 |
| 51-70 | 52.7% | 292 |
| 71-100 | 65.8% | 535 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.9% | 232 |
| 16-30 | 41.0% | 407 |
| 31-50 | 55.3% | 367 |
| 51-70 | 55.6% | 297 |
| 71-100 | 49.8% | 697 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.7% | 430 |
| 16-30 | 42.8% | 502 |
| 31-50 | 50.0% | 376 |
| 51-70 | 57.4% | 265 |
| 71-100 | 57.1% | 427 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.6% | 787 |
| 16-30 | 40.8% | 542 |
| 31-50 | 41.3% | 327 |
| 51-70 | 82.3% | 147 |
| 71-100 | 75.1% | 197 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 1626 |
| 16-30 | 44.3% | 219 |
| 31-50 | 57.0% | 128 |
| 51-70 | 48.0% | 25 |
| 71-100 | 100.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 1632 |
| 16-30 | 44.9% | 216 |
| 31-50 | 56.9% | 123 |
| 51-70 | 48.0% | 25 |
| 71-100 | 50.0% | 4 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.9% | 1624 |
| 16-30 | 45.9% | 222 |
| 31-50 | 58.3% | 127 |
| 51-70 | 48.0% | 25 |
| 71-100 | 50.0% | 2 |
