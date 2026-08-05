# Combat Simulation Report
Generated: 2026-08-05 02:26:17 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.4 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 967 (96.7%) |
| Timeouts (draws) | 33 (3.3%) |
| Avg rounds (all) | 9.7 |
| Avg rounds (KO only) | 8.2 |
| Rounds P50 / P90 / Max | 6 / 19 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 152 |
| Avg rounds | 10.4 |
| P50 / P90 | 6 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 475/1000 |
| Winrate | 47.5% |
| Advantage over 50% | -2.5% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 95 | 140 | 67.9% | YES |
| Asesino | 50 | 145 | 34.5% |  |
| Esquivo | 100 | 166 | 60.2% |  |
| Equilibrado | 73 | 139 | 52.5% |  |
| Extremista ATK | 58 | 146 | 39.7% |  |
| Extremista DEF | 66 | 138 | 47.8% |  |
| Extremista ASPD | 58 | 133 | 43.6% |  |
| Extremista REF | 74 | 158 | 46.8% |  |
| Velocista | 91 | 140 | 65.0% |  |
| Berserker | 54 | 152 | 35.5% |  |
| Guardian | 78 | 143 | 54.5% |  |
| Estratega | 75 | 133 | 56.4% |  |
| Gladiador | 70 | 129 | 54.3% |  |
| Magus | 57 | 138 | 41.3% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.4 | 1 |
| Heal applied | 88.7 | - |
| Rests | 4.7 | 2 |
| Advances | 4.1 | - |
| Retreats | 0.1 | - |
| Battles with item use | 50.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.55 (avg 47.60) |
| ASPD spread (stddev) | 31.37 (avg 53.50) |
| Equipment tier A | 255 (12.8%) |
| Equipment tier B | 434 (21.7%) |
| Equipment tier C | 513 (25.7%) |
| Equipment tier E | 798 (39.9%) |
| Level 100-199 | 482 |
| Level 200-299 | 524 |
| Level 300-399 | 520 |
| Level 400-500 | 474 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| cortante | 2000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 648 | 48.3% |
| ligera | 5 | 20.0% |
| media | 78 | 39.7% |
| total | 1269 | 51.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 48 | 45.8% |
| 3+ | 1952 | 50.1% |
Set bonus active: 50.1% (1952) vs inactive 45.8% (48)

### Amulet
With amulet: 50.4% (789) vs without 49.6% (1211)

### Shield
With shield: 50.6% (1221) vs without 48.9% (779)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 255 | 71.0% |
| B | 434 | 55.3% |
| C | 513 | 47.2% |
| E | 798 | 42.1% |

### Nature by level bracket
- **100-199**: cortante: 482
- **200-299**: cortante: 524
- **300-399**: cortante: 520
- **400-500**: cortante: 474

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 40.4% | 498 | 53.1% | 1502 | -12.8pp |
| d_fulgor | 38.8% | 500 | 53.7% | 1500 | -14.9pp |
| r_fulgor | 39.4% | 502 | 53.5% | 1498 | -14.0pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 22.9 | 0 | 73 | 0 | 21 | 34 |
| Asesino | 73.5 | 0 | 115 | 60 | 76 | 93 |
| Esquivo | 19.6 | 0 | 83 | 0 | 17 | 38 |
| Equilibrado | 39.3 | 0 | 96 | 21 | 41 | 62 |
| Extremista ATK | 77.0 | 0 | 114 | 62 | 78 | 90 |
| Extremista DEF | 5.3 | 0 | 73 | 0 | 0 | 0 |
| Extremista ASPD | 70.3 | 22 | 113 | 56 | 75 | 88 |
| Extremista REF | 35.5 | 0 | 102 | 20 | 30 | 44 |
| Velocista | 33.0 | 0 | 73 | 22 | 30 | 42 |
| Berserker | 75.0 | 0 | 113 | 64 | 78 | 89 |
| Guardian | 16.3 | 0 | 75 | 0 | 11 | 31 |
| Estratega | 38.8 | 0 | 101 | 26 | 35 | 48 |
| Gladiador | 66.3 | 23 | 110 | 47 | 69 | 78 |
| Magus | 59.1 | 0 | 110 | 38 | 65 | 76 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 345 | 345 | 100.0% |
| Asesino | 101 | 101 | 100.0% |
| Esquivo | 1396 | 1396 | 100.0% |
| Equilibrado | 814 | 814 | 100.0% |
| Extremista ATK | 111 | 111 | 100.0% |
| Extremista DEF | 455 | 455 | 100.0% |
| Extremista ASPD | 129 | 129 | 100.0% |
| Extremista REF | 145 | 145 | 100.0% |
| Velocista | 411 | 411 | 100.0% |
| Berserker | 178 | 178 | 100.0% |
| Guardian | 233 | 233 | 100.0% |
| Estratega | 263 | 263 | 100.0% |
| Gladiador | 205 | 205 | 100.0% |
| Magus | 341 | 341 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 37 | 1070 | 3.5% |
| Asesino | 8 | 414 | 1.9% |
| Esquivo | 226 | 1733 | 13.0% |
| Equilibrado | 38 | 1242 | 3.1% |
| Extremista ATK | 71 | 651 | 10.9% |
| Extremista DEF | 319 | 1569 | 20.3% |
| Extremista ASPD | 107 | 595 | 18.0% |
| Extremista REF | 650 | 920 | 70.7% |
| Velocista | 0 | 648 | 0.0% |
| Berserker | 93 | 790 | 11.8% |
| Guardian | 2 | 1153 | 0.2% |
| Estratega | 353 | 784 | 45.0% |
| Gladiador | 220 | 606 | 36.3% |
| Magus | 132 | 736 | 17.9% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 14 | 11 | 18 | 9 | 9 | 10 | 10 | 7 | 10 | 14 | 14 | 10 | 15 |
| 5 | 25 | 21 | 17 | 25 | 18 | 19 | 18 | 14 | 13 | 17 | 23 | 18 | 17 | 22 |
| 10 | 29 | 21 | 20 | 28 | 18 | 24 | 18 | 12 | 16 | 17 | 26 | 17 | 18 | 22 |
| 15 | 30 | 21 | 22 | 28 | 18 | 27 | 18 | 12 | 16 | 17 | 29 | 17 | 18 | 23 |
| 20 | 30 | 21 | 23 | 29 | 18 | 29 | 18 | 12 | 16 | 18 | 28 | 18 | 18 | 23 |
| 25 | 30 | 21 | 24 | 30 | 18 | 29 | 18 | 12 | 19 | 18 | 28 | 18 | 18 | 24 |
| 30 | 30 | 21 | 25 | 31 | 18 | 28 | 18 | 12 | 19 | 18 | 28 | 18 | 18 | 25 |
| 40 | 30 | 21 | 26 | 32 | 18 | 28 | 18 | 12 | 19 | 19 | 27 | 19 | 18 | 25 |
| 50 | 30 | 21 | 28 | 34 | 18 | 28 | 18 | 12 | 19 | 19 | 27 | 19 | 18 | 25 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 75.0% | 41.7% | 66.7% | 84.6% | 66.7% | 90.0% | 72.7% | 61.5% | 70.0% | 55.6% | 60.0% | 76.9% | 77.8% |
| Asesino | 25.0% | 50.0% | 46.7% | 36.4% | 50.0% | 14.3% | 33.3% | 16.7% | 12.5% | 25.0% | 30.0% | 40.0% | 0.0% | 54.5% |
| Esquivo | 58.3% | 53.3% | 50.0% | 61.5% | 60.0% | 53.3% | 71.4% | 81.8% | 53.8% | 68.8% | 63.6% | 71.4% | 60.0% | 50.0% |
| Equilibrado | 33.3% | 63.6% | 38.5% | 50.0% | 57.1% | 66.7% | 85.7% | 70.0% | 33.3% | 53.3% | 37.5% | 42.9% | 50.0% | 62.5% |
| Extremista ATK | 15.4% | 50.0% | 40.0% | 42.9% | 50.0% | 40.0% | 50.0% | 66.7% | 7.7% | 80.0% | 11.1% | 28.6% | 40.0% | 80.0% |
| Extremista DEF | 33.3% | 85.7% | 46.7% | 33.3% | 60.0% | 50.0% | 20.0% | 66.7% | 22.2% | 68.8% | 36.4% | 14.3% | 55.6% | 42.9% |
| Extremista ASPD | 10.0% | 66.7% | 28.6% | 14.3% | 50.0% | 80.0% | 50.0% | 58.3% | 33.3% | 33.3% | 42.9% | 71.4% | 20.0% | 63.6% |
| Extremista REF | 27.3% | 83.3% | 18.2% | 30.0% | 33.3% | 33.3% | 41.7% | 50.0% | 30.8% | 90.9% | 45.5% | 33.3% | 54.5% | 88.9% |
| Velocista | 38.5% | 87.5% | 46.2% | 66.7% | 92.3% | 77.8% | 66.7% | 69.2% | 50.0% | 86.7% | 57.9% | 40.0% | 25.0% | 70.0% |
| Berserker | 30.0% | 75.0% | 31.3% | 46.7% | 20.0% | 31.3% | 66.7% | 9.1% | 13.3% | 50.0% | 37.5% | 11.1% | 66.7% | 28.6% |
| Guardian | 33.3% | 70.0% | 36.4% | 62.5% | 88.9% | 63.6% | 57.1% | 54.5% | 42.1% | 62.5% | 50.0% | 44.4% | 44.4% | 71.4% |
| Estratega | 40.0% | 60.0% | 28.6% | 57.1% | 71.4% | 85.7% | 28.6% | 66.7% | 60.0% | 88.9% | 55.6% | 50.0% | 41.7% | 37.5% |
| Gladiador | 23.1% | 100.0% | 40.0% | 50.0% | 60.0% | 44.4% | 80.0% | 45.5% | 75.0% | 33.3% | 55.6% | 58.3% | 50.0% | 61.5% |
| Magus | 22.2% | 45.5% | 50.0% | 37.5% | 20.0% | 57.1% | 36.4% | 11.1% | 30.0% | 71.4% | 28.6% | 62.5% | 38.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.0% | 347 |
| 16-30 | 52.5% | 516 |
| 31-50 | 54.5% | 336 |
| 51-70 | 49.6% | 228 |
| 71-100 | 46.9% | 573 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 27.3% | 22 |
| 16-30 | 34.6% | 436 |
| 31-50 | 44.8% | 752 |
| 51-70 | 63.3% | 294 |
| 71-100 | 64.3% | 496 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.4% | 261 |
| 16-30 | 44.8% | 388 |
| 31-50 | 47.1% | 361 |
| 51-70 | 54.1% | 279 |
| 71-100 | 54.6% | 711 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.6% | 429 |
| 16-30 | 38.3% | 501 |
| 31-50 | 53.1% | 386 |
| 51-70 | 62.0% | 237 |
| 71-100 | 62.9% | 447 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.8% | 773 |
| 16-30 | 43.3% | 589 |
| 31-50 | 50.5% | 305 |
| 51-70 | 78.7% | 150 |
| 71-100 | 77.0% | 183 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1600 |
| 16-30 | 36.8% | 220 |
| 31-50 | 47.8% | 136 |
| 51-70 | 32.5% | 40 |
| 71-100 | 50.0% | 4 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 1591 |
| 16-30 | 35.0% | 234 |
| 31-50 | 49.6% | 135 |
| 51-70 | 36.8% | 38 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.8% | 1592 |
| 16-30 | 35.2% | 227 |
| 31-50 | 42.6% | 141 |
| 51-70 | 48.6% | 37 |
| 71-100 | 33.3% | 3 |
