# Combat Simulation Report
Generated: 2026-08-05 03:22:35 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 9.3 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 847 (84.7%) |
| Timeouts (draws) | 153 (15.3%) |
| Avg rounds (all) | 9.1 |
| Avg rounds (KO only) | 6.9 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 280 |
| Avg rounds | 9.3 |
| P50 / P90 | 7 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 472/1000 |
| Winrate | 47.2% |
| Advantage over 50% | -2.8% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 99 | 151 | 65.6% |  |
| Asesino | 67 | 150 | 44.7% |  |
| Esquivo | 63 | 134 | 47.0% |  |
| Equilibrado | 84 | 163 | 51.5% |  |
| Extremista ATK | 44 | 131 | 33.6% |  |
| Extremista DEF | 94 | 158 | 59.5% |  |
| Extremista ASPD | 56 | 135 | 41.5% |  |
| Extremista REF | 72 | 155 | 46.5% |  |
| Velocista | 81 | 145 | 55.9% |  |
| Berserker | 54 | 132 | 40.9% |  |
| Guardian | 86 | 127 | 67.7% | YES |
| Estratega | 71 | 136 | 52.2% |  |
| Gladiador | 67 | 138 | 48.6% |  |
| Magus | 61 | 145 | 42.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.2 | 0 |
| Heal applied | 64.1 | - |
| Rests | 3.9 | 2 |
| Advances | 3.7 | - |
| Retreats | 0.1 | - |
| Battles with item use | 47.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.03 (avg 47.72) |
| ASPD spread (stddev) | 31.44 (avg 54.33) |
| Equipment tier E | 2000 (100.0%) |
| Level 100-199 | 452 |
| Level 200-299 | 534 |
| Level 300-399 | 497 |
| Level 400-500 | 517 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 595 |
| cortante | 612 |
| desarmado | 199 |
| perforante | 594 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1118 | 50.0% |
| ligera | 172 | 46.5% |
| media | 215 | 46.5% |
| total | 495 | 52.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 48 | 41.7% |
| 3+ | 1952 | 50.2% |
Set bonus active: 50.2% (1952) vs inactive 41.7% (48)

### Amulet
With amulet: 50.3% (801) vs without 49.7% (1199)

### Shield
With shield: 50.2% (1210) vs without 49.6% (790)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| E | 1801 | 50.5% |
| desarmado | 199 | 45.2% |

### Nature by level bracket
- **100-199**: contundente: 139, cortante: 145, desarmado: 37, perforante: 131
- **200-299**: contundente: 159, cortante: 168, desarmado: 56, perforante: 151
- **300-399**: contundente: 141, cortante: 144, desarmado: 55, perforante: 157
- **400-500**: contundente: 156, cortante: 155, desarmado: 51, perforante: 155

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 42.7% | 501 | 52.4% | 1499 | -9.7pp |
| d_fulgor | 42.5% | 496 | 52.4% | 1504 | -9.9pp |
| r_fulgor | 42.6% | 491 | 52.4% | 1509 | -9.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 14.5 | 0 | 48 | 6 | 18 | 19 |
| Asesino | 43.6 | 0 | 83 | 19 | 49 | 56 |
| Esquivo | 12.1 | 0 | 41 | 0 | 14 | 19 |
| Equilibrado | 22.6 | 0 | 61 | 15 | 19 | 33 |
| Extremista ATK | 43.9 | 19 | 82 | 19 | 50 | 59 |
| Extremista DEF | 4.6 | 0 | 62 | 0 | 0 | 7 |
| Extremista ASPD | 34.5 | 0 | 79 | 19 | 29 | 49 |
| Extremista REF | 20.6 | 0 | 64 | 14 | 19 | 24 |
| Velocista | 16.8 | 0 | 43 | 11 | 18 | 19 |
| Berserker | 40.9 | 0 | 80 | 19 | 47 | 56 |
| Guardian | 9.9 | 0 | 41 | 0 | 10 | 19 |
| Estratega | 20.3 | 0 | 63 | 14 | 19 | 24 |
| Gladiador | 35.3 | 14 | 79 | 19 | 22 | 53 |
| Magus | 32.2 | 0 | 80 | 19 | 19 | 48 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 188 | 188 | 100.0% |
| Asesino | 177 | 177 | 100.0% |
| Esquivo | 702 | 702 | 100.0% |
| Equilibrado | 497 | 497 | 100.0% |
| Extremista ATK | 65 | 65 | 100.0% |
| Extremista DEF | 148 | 148 | 100.0% |
| Extremista ASPD | 94 | 94 | 100.0% |
| Extremista REF | 120 | 120 | 100.0% |
| Velocista | 367 | 367 | 100.0% |
| Berserker | 75 | 75 | 100.0% |
| Guardian | 313 | 313 | 100.0% |
| Estratega | 293 | 293 | 100.0% |
| Gladiador | 178 | 178 | 100.0% |
| Magus | 218 | 218 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 28 | 1168 | 2.4% |
| Asesino | 1 | 576 | 0.2% |
| Esquivo | 202 | 1032 | 19.6% |
| Equilibrado | 53 | 1112 | 4.8% |
| Extremista ATK | 51 | 618 | 8.3% |
| Extremista DEF | 231 | 1130 | 20.4% |
| Extremista ASPD | 104 | 736 | 14.1% |
| Extremista REF | 700 | 989 | 70.8% |
| Velocista | 0 | 738 | 0.0% |
| Berserker | 108 | 648 | 16.7% |
| Guardian | 0 | 1102 | 0.0% |
| Estratega | 448 | 970 | 46.2% |
| Gladiador | 256 | 784 | 32.7% |
| Magus | 102 | 660 | 15.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 14 | 16 | 14 | 17 | 11 | 13 | 12 | 9 | 6 | 12 | 16 | 15 | 12 | 18 |
| 5 | 25 | 23 | 18 | 25 | 19 | 22 | 19 | 13 | 13 | 19 | 24 | 19 | 20 | 23 |
| 10 | 28 | 23 | 21 | 29 | 19 | 27 | 19 | 12 | 16 | 19 | 28 | 17 | 19 | 23 |
| 15 | 29 | 24 | 23 | 30 | 19 | 30 | 19 | 13 | 15 | 19 | 31 | 17 | 20 | 23 |
| 20 | 29 | 24 | 24 | 30 | 20 | 32 | 19 | 13 | 15 | 20 | 31 | 18 | 21 | 24 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 100.0% | 63.6% | 40.0% | 84.6% | 77.8% | 88.9% | 53.8% | 42.9% | 68.8% | 41.7% | 56.3% | 83.3% | 75.0% |
| Asesino | 0.0% | 50.0% | 42.9% | 50.0% | 90.0% | 50.0% | 33.3% | 50.0% | 50.0% | 60.0% | 22.2% | 0.0% | 30.0% | 53.3% |
| Esquivo | 36.4% | 57.1% | 50.0% | 53.3% | 44.4% | 30.0% | 57.1% | 54.5% | 55.6% | 50.0% | 33.3% | 60.0% | 66.7% | 12.5% |
| Equilibrado | 60.0% | 50.0% | 46.7% | 50.0% | 62.5% | 57.1% | 66.7% | 54.5% | 54.5% | 45.5% | 45.5% | 45.5% | 40.0% | 46.7% |
| Extremista ATK | 15.4% | 10.0% | 55.6% | 37.5% | 50.0% | 0.0% | 33.3% | 58.3% | 25.0% | 57.1% | 12.5% | 37.5% | 14.3% | 50.0% |
| Extremista DEF | 22.2% | 50.0% | 70.0% | 42.9% | 100.0% | 50.0% | 75.0% | 71.4% | 69.2% | 57.1% | 20.0% | 57.1% | 66.7% | 87.5% |
| Extremista ASPD | 11.1% | 66.7% | 42.9% | 33.3% | 66.7% | 25.0% | 50.0% | 16.7% | 18.2% | 70.0% | 20.0% | 87.5% | 12.5% | 75.0% |
| Extremista REF | 46.2% | 50.0% | 45.5% | 45.5% | 41.7% | 28.6% | 83.3% | 50.0% | 38.5% | 42.9% | 50.0% | 33.3% | 53.8% | 44.4% |
| Velocista | 57.1% | 50.0% | 44.4% | 45.5% | 75.0% | 30.8% | 81.8% | 61.5% | 50.0% | 85.7% | 37.5% | 41.2% | 81.8% | 83.3% |
| Berserker | 31.3% | 40.0% | 50.0% | 54.5% | 42.9% | 42.9% | 30.0% | 57.1% | 14.3% | 50.0% | 12.5% | 20.0% | 37.5% | 63.6% |
| Guardian | 58.3% | 77.8% | 66.7% | 45.5% | 87.5% | 80.0% | 80.0% | 50.0% | 62.5% | 87.5% | 50.0% | 62.5% | 80.0% | 85.7% |
| Estratega | 43.8% | 100.0% | 40.0% | 54.5% | 62.5% | 42.9% | 12.5% | 66.7% | 58.8% | 80.0% | 37.5% | 50.0% | 42.9% | 66.7% |
| Gladiador | 16.7% | 70.0% | 33.3% | 60.0% | 85.7% | 33.3% | 87.5% | 46.2% | 18.2% | 62.5% | 20.0% | 57.1% | 50.0% | 53.8% |
| Magus | 25.0% | 46.7% | 87.5% | 53.3% | 50.0% | 12.5% | 25.0% | 55.6% | 16.7% | 36.4% | 14.3% | 33.3% | 46.2% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.1% | 346 |
| 16-30 | 51.0% | 492 |
| 31-50 | 55.4% | 361 |
| 51-70 | 52.2% | 232 |
| 71-100 | 45.2% | 569 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.8% | 16 |
| 16-30 | 38.2% | 403 |
| 31-50 | 41.1% | 750 |
| 51-70 | 57.3% | 316 |
| 71-100 | 67.8% | 515 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.8% | 239 |
| 16-30 | 48.5% | 390 |
| 31-50 | 46.3% | 374 |
| 51-70 | 52.1% | 259 |
| 71-100 | 51.9% | 738 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.7% | 450 |
| 16-30 | 44.1% | 447 |
| 31-50 | 47.8% | 383 |
| 51-70 | 58.3% | 247 |
| 71-100 | 57.9% | 473 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.9% | 767 |
| 16-30 | 40.0% | 563 |
| 31-50 | 50.6% | 318 |
| 51-70 | 71.2% | 156 |
| 71-100 | 72.4% | 196 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 1615 |
| 16-30 | 50.0% | 190 |
| 31-50 | 39.6% | 154 |
| 51-70 | 17.9% | 39 |
| 71-100 | 50.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 1610 |
| 16-30 | 49.0% | 202 |
| 31-50 | 35.5% | 141 |
| 51-70 | 27.3% | 44 |
| 71-100 | 0.0% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.1% | 1609 |
| 16-30 | 48.1% | 187 |
| 31-50 | 35.7% | 168 |
| 51-70 | 34.4% | 32 |
| 71-100 | 0.0% | 4 |
