# Combat Simulation Report
Generated: 2026-08-05 02:26:25 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 16.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 942 (94.2%) |
| Timeouts (draws) | 58 (5.8%) |
| Avg rounds (all) | 15.1 |
| Avg rounds (KO only) | 12.9 |
| Rounds P50 / P90 / Max | 10 / 37 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 265 |
| Avg rounds | 16.1 |
| P50 / P90 | 10 / 41 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 540/1000 |
| Winrate | 54.0% |
| Advantage over 50% | 4.0% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 80 | 132 | 60.6% | YES |
| Asesino | 57 | 130 | 43.8% |  |
| Esquivo | 75 | 133 | 56.4% |  |
| Equilibrado | 84 | 145 | 57.9% |  |
| Extremista ATK | 59 | 142 | 41.5% |  |
| Extremista DEF | 71 | 144 | 49.3% |  |
| Extremista ASPD | 62 | 153 | 40.5% |  |
| Extremista REF | 79 | 157 | 50.3% |  |
| Velocista | 84 | 149 | 56.4% |  |
| Berserker | 66 | 159 | 41.5% |  |
| Guardian | 80 | 135 | 59.3% |  |
| Estratega | 64 | 115 | 55.7% |  |
| Gladiador | 85 | 163 | 52.1% |  |
| Magus | 54 | 143 | 37.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.7 | 1 |
| Heal applied | 108.2 | - |
| Rests | 8.3 | 4 |
| Advances | 4.6 | - |
| Retreats | 0.3 | - |
| Battles with item use | 58.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 88.4% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.83 (avg 48.50) |
| ASPD spread (stddev) | 31.46 (avg 54.18) |
| Equipment tier E | 2000 (100.0%) |
| Level 100-199 | 490 |
| Level 200-299 | 523 |
| Level 300-399 | 515 |
| Level 400-500 | 472 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 594 |
| cortante | 602 |
| desarmado | 231 |
| perforante | 573 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 636 | 47.0% |
| ligera | 12 | 41.7% |
| media | 64 | 60.9% |
| total | 1288 | 51.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 47 | 44.7% |
| 3+ | 1953 | 50.1% |
Set bonus active: 50.1% (1953) vs inactive 44.7% (47)

### Amulet
With amulet: 51.6% (788) vs without 48.9% (1212)

### Shield
With shield: 51.8% (1204) vs without 47.2% (796)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| E | 1769 | 51.0% |
| desarmado | 231 | 42.4% |

### Nature by level bracket
- **100-199**: contundente: 147, cortante: 151, desarmado: 66, perforante: 126
- **200-299**: contundente: 164, cortante: 157, desarmado: 62, perforante: 140
- **300-399**: contundente: 151, cortante: 143, desarmado: 55, perforante: 166
- **400-500**: contundente: 132, cortante: 151, desarmado: 48, perforante: 141

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.1% | 511 | 53.1% | 1489 | -12.0pp |
| d_fulgor | 40.5% | 518 | 53.3% | 1482 | -12.8pp |
| r_fulgor | 40.7% | 509 | 53.2% | 1491 | -12.5pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 11.7 | 0 | 47 | 0 | 14 | 19 |
| Asesino | 39.7 | 0 | 76 | 19 | 38 | 59 |
| Esquivo | 12.3 | 0 | 42 | 0 | 14 | 19 |
| Equilibrado | 22.0 | 0 | 58 | 19 | 19 | 30 |
| Extremista ATK | 36.7 | 0 | 82 | 19 | 34 | 54 |
| Extremista DEF | 4.0 | 0 | 53 | 0 | 0 | 0 |
| Extremista ASPD | 33.4 | 0 | 79 | 19 | 19 | 50 |
| Extremista REF | 19.1 | 0 | 62 | 12 | 19 | 21 |
| Velocista | 15.9 | 0 | 36 | 9 | 18 | 19 |
| Berserker | 40.0 | 0 | 80 | 19 | 41 | 55 |
| Guardian | 7.6 | 0 | 49 | 0 | 0 | 16 |
| Estratega | 23.2 | 0 | 69 | 17 | 19 | 29 |
| Gladiador | 33.8 | 0 | 80 | 19 | 23 | 49 |
| Magus | 31.5 | 0 | 76 | 19 | 19 | 43 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 416 | 416 | 100.0% |
| Asesino | 272 | 272 | 100.0% |
| Esquivo | 1713 | 1713 | 100.0% |
| Equilibrado | 1238 | 1238 | 100.0% |
| Extremista ATK | 101 | 101 | 100.0% |
| Extremista DEF | 472 | 472 | 100.0% |
| Extremista ASPD | 407 | 407 | 100.0% |
| Extremista REF | 239 | 239 | 100.0% |
| Velocista | 527 | 527 | 100.0% |
| Berserker | 259 | 259 | 100.0% |
| Guardian | 618 | 618 | 100.0% |
| Estratega | 500 | 500 | 100.0% |
| Gladiador | 374 | 374 | 100.0% |
| Magus | 50 | 50 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 10 | 1814 | 0.6% |
| Asesino | 1 | 811 | 0.1% |
| Esquivo | 392 | 2295 | 17.1% |
| Equilibrado | 63 | 2154 | 2.9% |
| Extremista ATK | 127 | 1289 | 9.9% |
| Extremista DEF | 486 | 2411 | 20.2% |
| Extremista ASPD | 150 | 1608 | 9.3% |
| Extremista REF | 1145 | 1682 | 68.1% |
| Velocista | 0 | 1268 | 0.0% |
| Berserker | 102 | 1279 | 8.0% |
| Guardian | 12 | 2122 | 0.6% |
| Estratega | 670 | 1577 | 42.5% |
| Gladiador | 447 | 1511 | 29.6% |
| Magus | 185 | 894 | 20.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 15 | 12 | 15 | 9 | 9 | 11 | 10 | 6 | 11 | 15 | 15 | 9 | 16 |
| 5 | 24 | 24 | 17 | 25 | 19 | 20 | 20 | 14 | 13 | 20 | 25 | 20 | 19 | 23 |
| 10 | 30 | 24 | 20 | 30 | 20 | 27 | 20 | 13 | 16 | 21 | 29 | 19 | 18 | 22 |
| 15 | 32 | 25 | 24 | 30 | 20 | 30 | 20 | 13 | 16 | 22 | 31 | 18 | 19 | 22 |
| 20 | 34 | 25 | 24 | 30 | 20 | 32 | 20 | 13 | 16 | 22 | 32 | 19 | 20 | 22 |
| 25 | 33 | 26 | 26 | 33 | 20 | 33 | 20 | 13 | 18 | 23 | 32 | 19 | 20 | 22 |
| 30 | 33 | 26 | 26 | 33 | 21 | 33 | 21 | 13 | 18 | 23 | 32 | 19 | 20 | 22 |
| 40 | 31 | 26 | 26 | 34 | 21 | 31 | 22 | 13 | 19 | 24 | 31 | 19 | 21 | 22 |
| 50 | 31 | 26 | 27 | 35 | 21 | 30 | 22 | 13 | 21 | 24 | 31 | 20 | 21 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 83.3% | 46.7% | 50.0% | 58.3% | 63.6% | 100.0% | 66.7% | 50.0% | 88.9% | 41.7% | 45.5% | 41.7% | 71.4% |
| Asesino | 16.7% | 50.0% | 30.0% | 16.7% | 62.5% | 50.0% | 50.0% | 54.5% | 46.2% | 44.4% | 16.7% | 80.0% | 18.2% | 71.4% |
| Esquivo | 53.3% | 70.0% | 50.0% | 14.3% | 75.0% | 38.5% | 71.4% | 63.6% | 57.1% | 57.1% | 46.7% | 83.3% | 62.5% | 50.0% |
| Equilibrado | 50.0% | 83.3% | 85.7% | 50.0% | 66.7% | 64.3% | 77.8% | 53.3% | 45.5% | 75.0% | 50.0% | 25.0% | 36.4% | 66.7% |
| Extremista ATK | 41.7% | 37.5% | 25.0% | 33.3% | 50.0% | 25.0% | 28.6% | 70.0% | 45.5% | 46.7% | 25.0% | 12.5% | 58.3% | 61.5% |
| Extremista DEF | 36.4% | 50.0% | 61.5% | 35.7% | 75.0% | 50.0% | 52.6% | 80.0% | 27.3% | 37.5% | 37.5% | 33.3% | 53.8% | 100.0% |
| Extremista ASPD | 0.0% | 50.0% | 28.6% | 22.2% | 71.4% | 47.4% | 50.0% | 16.7% | 50.0% | 50.0% | 50.0% | 55.6% | 40.0% | 41.7% |
| Extremista REF | 33.3% | 45.5% | 36.4% | 46.7% | 30.0% | 20.0% | 83.3% | 50.0% | 62.5% | 68.8% | 40.0% | 37.5% | 40.0% | 66.7% |
| Velocista | 50.0% | 53.8% | 42.9% | 54.5% | 54.5% | 72.7% | 50.0% | 37.5% | 50.0% | 61.5% | 50.0% | 54.5% | 91.7% | 60.0% |
| Berserker | 11.1% | 55.6% | 42.9% | 25.0% | 53.3% | 62.5% | 50.0% | 31.3% | 38.5% | 50.0% | 36.4% | 25.0% | 54.5% | 47.1% |
| Guardian | 58.3% | 83.3% | 53.3% | 50.0% | 75.0% | 62.5% | 50.0% | 60.0% | 50.0% | 63.6% | 50.0% | 63.6% | 45.5% | 66.7% |
| Estratega | 54.5% | 20.0% | 16.7% | 75.0% | 87.5% | 66.7% | 44.4% | 62.5% | 45.5% | 75.0% | 36.4% | 50.0% | 70.0% | 62.5% |
| Gladiador | 58.3% | 81.8% | 37.5% | 63.6% | 41.7% | 46.2% | 60.0% | 60.0% | 8.3% | 45.5% | 54.5% | 30.0% | 50.0% | 84.6% |
| Magus | 28.6% | 28.6% | 50.0% | 33.3% | 38.5% | 0.0% | 58.3% | 33.3% | 40.0% | 52.9% | 33.3% | 37.5% | 15.4% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.2% | 357 |
| 16-30 | 54.4% | 496 |
| 31-50 | 53.0% | 315 |
| 51-70 | 54.6% | 216 |
| 71-100 | 48.4% | 616 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 30.0% | 20 |
| 16-30 | 35.4% | 427 |
| 31-50 | 46.0% | 757 |
| 51-70 | 62.5% | 312 |
| 71-100 | 62.0% | 484 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.0% | 245 |
| 16-30 | 44.9% | 396 |
| 31-50 | 54.9% | 370 |
| 51-70 | 49.8% | 251 |
| 71-100 | 53.0% | 738 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.2% | 455 |
| 16-30 | 42.4% | 505 |
| 31-50 | 49.4% | 391 |
| 51-70 | 60.9% | 235 |
| 71-100 | 64.5% | 414 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.3% | 795 |
| 16-30 | 47.2% | 572 |
| 31-50 | 55.2% | 310 |
| 51-70 | 77.2% | 145 |
| 71-100 | 66.9% | 178 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 1590 |
| 16-30 | 38.8% | 242 |
| 31-50 | 46.6% | 133 |
| 51-70 | 40.6% | 32 |
| 71-100 | 33.3% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 1599 |
| 16-30 | 39.9% | 223 |
| 31-50 | 44.4% | 133 |
| 51-70 | 37.2% | 43 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 1586 |
| 16-30 | 42.5% | 226 |
| 31-50 | 40.1% | 152 |
| 51-70 | 50.0% | 32 |
| 71-100 | 50.0% | 4 |
