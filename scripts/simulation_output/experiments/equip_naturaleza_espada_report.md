# Combat Simulation Report
Generated: 2026-08-05 03:22:28 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.9 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 951 (95.1%) |
| Timeouts (draws) | 49 (4.9%) |
| Avg rounds (all) | 6.0 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 13 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 150 |
| Avg rounds | 5.9 |
| P50 / P90 | 4 / 13 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 492/1000 |
| Winrate | 49.2% |
| Advantage over 50% | -0.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 109 | 158 | 69.0% | YES |
| Asesino | 57 | 133 | 42.9% |  |
| Esquivo | 62 | 141 | 44.0% |  |
| Equilibrado | 70 | 125 | 56.0% |  |
| Extremista ATK | 68 | 146 | 46.6% |  |
| Extremista DEF | 94 | 158 | 59.5% |  |
| Extremista ASPD | 51 | 140 | 36.4% |  |
| Extremista REF | 61 | 148 | 41.2% |  |
| Velocista | 87 | 127 | 68.5% |  |
| Berserker | 66 | 150 | 44.0% |  |
| Guardian | 80 | 141 | 56.7% |  |
| Estratega | 79 | 156 | 50.6% |  |
| Gladiador | 62 | 137 | 45.3% |  |
| Magus | 54 | 140 | 38.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.0 | 0 |
| Heal applied | 56.7 | - |
| Rests | 2.1 | 1 |
| Advances | 3.4 | - |
| Retreats | 0.0 | - |
| Battles with item use | 41.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.71 (avg 48.03) |
| ASPD spread (stddev) | 31.36 (avg 54.42) |
| Equipment tier A | 255 (12.8%) |
| Equipment tier B | 439 (21.9%) |
| Equipment tier C | 543 (27.2%) |
| Equipment tier E | 763 (38.1%) |
| Level 100-199 | 455 |
| Level 200-299 | 533 |
| Level 300-399 | 531 |
| Level 400-500 | 481 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| cortante | 2000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1106 | 49.3% |
| ligera | 211 | 43.1% |
| media | 189 | 46.0% |
| ninguna | 1 | 100.0% |
| total | 493 | 56.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 1 | 100.0% |
| 1-2 | 42 | 40.5% |
| 3+ | 1957 | 50.2% |
Set bonus active: 50.2% (1957) vs inactive 41.9% (43)

### Amulet
With amulet: 52.0% (766) vs without 48.8% (1234)

### Shield
With shield: 49.4% (1183) vs without 50.9% (817)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 255 | 66.7% |
| B | 439 | 56.3% |
| C | 543 | 49.0% |
| E | 763 | 41.5% |

### Nature by level bracket
- **100-199**: cortante: 455
- **200-299**: cortante: 533
- **300-399**: cortante: 531
- **400-500**: cortante: 481

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 40.0% | 458 | 53.0% | 1542 | -13.0pp |
| d_fulgor | 39.7% | 463 | 53.1% | 1537 | -13.3pp |
| r_fulgor | 41.4% | 454 | 52.5% | 1546 | -11.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 28.4 | 0 | 73 | 20 | 28 | 39 |
| Asesino | 72.2 | 0 | 110 | 62 | 76 | 90 |
| Esquivo | 25.9 | 0 | 70 | 0 | 30 | 44 |
| Equilibrado | 42.5 | 0 | 101 | 27 | 51 | 59 |
| Extremista ATK | 73.4 | 0 | 107 | 62 | 72 | 93 |
| Extremista DEF | 9.5 | 0 | 82 | 0 | 0 | 16 |
| Extremista ASPD | 66.5 | 16 | 112 | 48 | 75 | 88 |
| Extremista REF | 36.2 | 0 | 99 | 23 | 34 | 47 |
| Velocista | 33.5 | 0 | 76 | 21 | 31 | 42 |
| Berserker | 77.5 | 35 | 110 | 64 | 78 | 89 |
| Guardian | 15.9 | 0 | 71 | 0 | 0 | 29 |
| Estratega | 41.8 | 0 | 100 | 28 | 39 | 53 |
| Gladiador | 64.9 | 24 | 110 | 45 | 66 | 86 |
| Magus | 64.0 | 22 | 109 | 37 | 72 | 84 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 61 | 61 | 100.0% |
| Asesino | 77 | 77 | 100.0% |
| Esquivo | 532 | 532 | 100.0% |
| Equilibrado | 138 | 138 | 100.0% |
| Extremista ATK | 40 | 40 | 100.0% |
| Extremista DEF | 65 | 65 | 100.0% |
| Extremista ASPD | 67 | 67 | 100.0% |
| Extremista REF | 153 | 153 | 100.0% |
| Velocista | 149 | 149 | 100.0% |
| Berserker | 76 | 76 | 100.0% |
| Guardian | 138 | 138 | 100.0% |
| Estratega | 316 | 316 | 100.0% |
| Gladiador | 101 | 101 | 100.0% |
| Magus | 188 | 188 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 12 | 667 | 1.8% |
| Asesino | 5 | 235 | 2.1% |
| Esquivo | 99 | 712 | 13.9% |
| Equilibrado | 10 | 368 | 2.7% |
| Extremista ATK | 33 | 348 | 9.5% |
| Extremista DEF | 124 | 726 | 17.1% |
| Extremista ASPD | 98 | 430 | 22.8% |
| Extremista REF | 288 | 518 | 55.6% |
| Velocista | 0 | 272 | 0.0% |
| Berserker | 58 | 398 | 14.6% |
| Guardian | 0 | 620 | 0.0% |
| Estratega | 245 | 690 | 35.5% |
| Gladiador | 111 | 388 | 28.6% |
| Magus | 67 | 440 | 15.2% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 14 | 14 | 14 | 14 | 10 | 11 | 10 | 10 | 5 | 12 | 16 | 16 | 11 | 15 |
| 5 | 23 | 20 | 18 | 19 | 17 | 19 | 16 | 14 | 10 | 19 | 22 | 19 | 17 | 19 |
| 10 | 26 | 20 | 23 | 21 | 17 | 24 | 16 | 14 | 12 | 19 | 24 | 19 | 17 | 20 |
| 15 | 27 | 20 | 24 | 21 | 17 | 26 | 16 | 14 | 12 | 19 | 24 | 19 | 18 | 20 |
| 20 | 27 | 20 | 25 | 21 | 17 | 27 | 16 | 14 | 12 | 20 | 25 | 20 | 18 | 20 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 60.0% | 66.7% | 66.7% | 83.3% | 53.8% | 84.6% | 60.0% | 66.7% | 84.2% | 66.7% | 56.3% | 85.7% | 72.7% |
| Asesino | 40.0% | 50.0% | 66.7% | 28.6% | 52.9% | 25.0% | 50.0% | 53.8% | 37.5% | 16.7% | 33.3% | 46.2% | 42.9% | 40.0% |
| Esquivo | 33.3% | 33.3% | 50.0% | 40.0% | 55.6% | 36.4% | 60.0% | 75.0% | 42.9% | 30.0% | 33.3% | 60.0% | 40.0% | 41.2% |
| Equilibrado | 33.3% | 71.4% | 60.0% | 50.0% | 50.0% | 37.5% | 83.3% | 64.3% | 38.5% | 87.5% | 30.0% | 50.0% | 87.5% | 66.7% |
| Extremista ATK | 16.7% | 47.1% | 44.4% | 50.0% | 50.0% | 60.0% | 60.0% | 71.4% | 0.0% | 40.0% | 30.8% | 57.1% | 42.9% | 61.5% |
| Extremista DEF | 46.2% | 75.0% | 63.6% | 62.5% | 40.0% | 50.0% | 77.8% | 69.2% | 25.0% | 46.2% | 27.3% | 90.0% | 87.5% | 88.9% |
| Extremista ASPD | 15.4% | 50.0% | 40.0% | 16.7% | 40.0% | 22.2% | 50.0% | 27.3% | 11.1% | 63.6% | 45.5% | 42.1% | 50.0% | 54.5% |
| Extremista REF | 40.0% | 46.2% | 25.0% | 35.7% | 28.6% | 30.8% | 72.7% | 50.0% | 22.2% | 70.0% | 50.0% | 16.7% | 37.5% | 36.4% |
| Velocista | 33.3% | 62.5% | 57.1% | 61.5% | 100.0% | 75.0% | 88.9% | 77.8% | 50.0% | 100.0% | 33.3% | 60.0% | 91.7% | 90.0% |
| Berserker | 15.8% | 83.3% | 70.0% | 12.5% | 60.0% | 53.8% | 36.4% | 30.0% | 0.0% | 50.0% | 45.5% | 58.3% | 50.0% | 40.0% |
| Guardian | 33.3% | 66.7% | 66.7% | 70.0% | 69.2% | 72.7% | 54.5% | 50.0% | 66.7% | 54.5% | 50.0% | 37.5% | 40.0% | 50.0% |
| Estratega | 43.8% | 53.8% | 40.0% | 50.0% | 42.9% | 10.0% | 57.9% | 83.3% | 40.0% | 41.7% | 62.5% | 50.0% | 55.6% | 84.6% |
| Gladiador | 14.3% | 57.1% | 60.0% | 12.5% | 57.1% | 12.5% | 50.0% | 62.5% | 8.3% | 50.0% | 60.0% | 44.4% | 50.0% | 80.0% |
| Magus | 27.3% | 60.0% | 58.8% | 33.3% | 38.5% | 11.1% | 45.5% | 63.6% | 10.0% | 60.0% | 50.0% | 15.4% | 20.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.6% | 336 |
| 16-30 | 53.4% | 521 |
| 31-50 | 52.9% | 340 |
| 51-70 | 50.7% | 207 |
| 71-100 | 48.2% | 596 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 14.3% | 14 |
| 16-30 | 38.2% | 406 |
| 31-50 | 42.6% | 735 |
| 51-70 | 55.5% | 310 |
| 71-100 | 66.9% | 535 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.4% | 233 |
| 16-30 | 46.6% | 388 |
| 31-50 | 51.0% | 361 |
| 51-70 | 53.6% | 278 |
| 71-100 | 51.1% | 740 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.8% | 446 |
| 16-30 | 45.8% | 472 |
| 31-50 | 50.3% | 378 |
| 51-70 | 56.3% | 231 |
| 71-100 | 55.8% | 473 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.0% | 791 |
| 16-30 | 39.5% | 569 |
| 31-50 | 47.3% | 313 |
| 51-70 | 80.3% | 152 |
| 71-100 | 80.6% | 175 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 1630 |
| 16-30 | 40.9% | 215 |
| 31-50 | 45.5% | 112 |
| 51-70 | 35.0% | 40 |
| 71-100 | 0.0% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 1622 |
| 16-30 | 41.9% | 215 |
| 31-50 | 40.2% | 127 |
| 51-70 | 35.3% | 34 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.8% | 1628 |
| 16-30 | 42.0% | 200 |
| 31-50 | 46.3% | 134 |
| 51-70 | 29.4% | 34 |
| 71-100 | 0.0% | 4 |
