# Combat Simulation Report
Generated: 2026-08-05 00:34:53 | 2000 simulations | Max 50 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.7 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1983 (99.2%) |
| Timeouts (draws) | 17 (0.8%) |
| Avg rounds (all) | 6.4 |
| Avg rounds (KO only) | 6.0 |
| Rounds P50 / P90 / Max | 5 / 11 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 473 |
| Avg rounds | 7.7 |
| P50 / P90 | 5 / 16 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 847/2000 |
| Winrate | 42.4% |
| Advantage over 50% | 0.0% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 184 | 297 | 62.0% |  |
| Asesino | 140 | 290 | 48.3% |  |
| Esquivo | 172 | 289 | 59.5% |  |
| Equilibrado | 163 | 269 | 60.6% |  |
| Extremista ATK | 103 | 286 | 36.0% |  |
| Extremista DEF | 183 | 277 | 66.1% |  |
| Extremista ASPD | 93 | 291 | 32.0% |  |
| Extremista REF | 123 | 296 | 41.6% |  |
| Velocista | 202 | 305 | 66.2% | YES |
| Berserker | 79 | 300 | 26.3% |  |
| Guardian | 170 | 279 | 60.9% |  |
| Estratega | 137 | 279 | 49.1% |  |
| Gladiador | 135 | 277 | 48.7% |  |
| Magus | 116 | 265 | 43.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 34.3 | - |
| Rests | 5.4 | 4 |
| Advances | 1.4 | - |
| Retreats | 0.0 | - |
| Battles with item use | 17.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.3% |
| Armor presence | 89.0% |
| ATK spread (stddev) | 26.48 (avg 46.15) |
| ASPD spread (stddev) | 22.87 (avg 46.44) |
| Equipment tier T1 | 1132 (28.3%) |
| Equipment tier T2 | 1665 (41.6%) |
| Equipment tier T3 | 1198 (29.9%) |
| Equipment tier T4 | 5 (0.1%) |
| Level 100-199 | 1132 |
| Level 200-299 | 1094 |
| Level 300-399 | 1123 |
| Level 400-500 | 651 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 5 |
| cortante | 1481 |
| desarmado | 428 |
| perforante | 2086 |

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 52.2% | 2088 | 47.6% | 1912 | 4.6pp |
| d_fulgor | 52.3% | 2061 | 47.6% | 1939 | 4.7pp |
| r_fulgor | 52.5% | 1998 | 47.5% | 2002 | 5.0pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 29.6 | 0 | 56 | 27 | 31 | 40 |
| Asesino | 40.6 | 0 | 87 | 34 | 40 | 40 |
| Esquivo | 22.2 | 0 | 56 | 0 | 27 | 40 |
| Equilibrado | 28.1 | 0 | 57 | 21 | 30 | 40 |
| Extremista ATK | 44.7 | 0 | 90 | 27 | 40 | 62 |
| Extremista DEF | 12.1 | 0 | 49 | 0 | 0 | 24 |
| Extremista ASPD | 37.6 | 0 | 76 | 27 | 40 | 41 |
| Extremista REF | 27.1 | 0 | 52 | 22 | 27 | 34 |
| Velocista | 31.1 | 0 | 50 | 27 | 34 | 40 |
| Berserker | 42.5 | 0 | 88 | 27 | 40 | 59 |
| Guardian | 22.1 | 0 | 50 | 0 | 27 | 36 |
| Estratega | 32.2 | 0 | 63 | 27 | 35 | 40 |
| Gladiador | 35.6 | 0 | 66 | 27 | 40 | 40 |
| Magus | 35.9 | 0 | 66 | 30 | 40 | 40 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 181 | 181 | 100.0% |
| Asesino | 180 | 180 | 100.0% |
| Esquivo | 910 | 910 | 100.0% |
| Equilibrado | 670 | 670 | 100.0% |
| Extremista ATK | 43 | 43 | 100.0% |
| Extremista DEF | 553 | 553 | 100.0% |
| Extremista ASPD | 28 | 28 | 100.0% |
| Extremista REF | 113 | 113 | 100.0% |
| Velocista | 334 | 334 | 100.0% |
| Berserker | 28 | 28 | 100.0% |
| Guardian | 201 | 201 | 100.0% |
| Estratega | 280 | 280 | 100.0% |
| Gladiador | 292 | 292 | 100.0% |
| Magus | 211 | 211 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 0 | 1531 | 0.0% |
| Asesino | 0 | 1196 | 0.0% |
| Esquivo | 303 | 1996 | 15.2% |
| Equilibrado | 1 | 1611 | 0.1% |
| Extremista ATK | 0 | 1106 | 0.0% |
| Extremista DEF | 416 | 2040 | 20.4% |
| Extremista ASPD | 66 | 1125 | 5.9% |
| Extremista REF | 803 | 1450 | 55.4% |
| Velocista | 0 | 1328 | 0.0% |
| Berserker | 0 | 1121 | 0.0% |
| Guardian | 0 | 1630 | 0.0% |
| Estratega | 555 | 1611 | 34.5% |
| Gladiador | 188 | 1463 | 12.9% |
| Magus | 47 | 1325 | 3.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 29 | 24 | 26 | 24 | 29 | 25 | 20 | 19 | 13 | 28 | 23 | 28 | 27 | 30 |
| 5 | 33 | 33 | 31 | 32 | 36 | 28 | 24 | 22 | 22 | 34 | 27 | 32 | 33 | 36 |
| 10 | 34 | 34 | 33 | 33 | 36 | 27 | 24 | 22 | 23 | 34 | 29 | 33 | 34 | 37 |
| 15 | 34 | 34 | 34 | 33 | 36 | 28 | 24 | 22 | 23 | 34 | 30 | 33 | 34 | 37 |
| 20 | 34 | 34 | 34 | 33 | 36 | 28 | 24 | 22 | 23 | 34 | 30 | 33 | 34 | 37 |
| 25 | 34 | 34 | 34 | 33 | 36 | 28 | 24 | 22 | 23 | 34 | 30 | 33 | 34 | 37 |
| 30 | 34 | 34 | 34 | 33 | 36 | 28 | 24 | 22 | 23 | 34 | 30 | 33 | 34 | 37 |
| 40 | 34 | 34 | 34 | 33 | 36 | 28 | 24 | 22 | 23 | 34 | 30 | 33 | 34 | 37 |
| 50 | 34 | 34 | 34 | 33 | 36 | 29 | 24 | 22 | 23 | 34 | 30 | 34 | 35 | 37 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 90.0% | 55.0% | 63.6% | 75.0% | 21.4% | 88.0% | 53.6% | 43.5% | 77.3% | 38.1% | 50.0% | 69.6% | 78.9% |
| Asesino | 10.0% | 50.0% | 43.5% | 18.8% | 61.9% | 26.3% | 82.6% | 60.0% | 21.1% | 89.3% | 38.5% | 56.5% | 38.1% | 44.0% |
| Esquivo | 45.0% | 56.5% | 50.0% | 55.0% | 80.0% | 75.0% | 53.3% | 62.5% | 57.7% | 77.8% | 50.0% | 42.9% | 63.6% | 68.2% |
| Equilibrado | 36.4% | 81.3% | 45.0% | 50.0% | 78.6% | 72.2% | 75.0% | 52.9% | 66.7% | 78.9% | 36.4% | 63.6% | 48.3% | 86.7% |
| Extremista ATK | 25.0% | 38.1% | 20.0% | 21.4% | 50.0% | 3.6% | 63.2% | 55.6% | 33.3% | 66.7% | 16.7% | 43.5% | 36.4% | 31.6% |
| Extremista DEF | 78.6% | 73.7% | 25.0% | 27.8% | 96.4% | 50.0% | 72.2% | 77.8% | 41.7% | 90.0% | 65.2% | 61.5% | 64.3% | 82.6% |
| Extremista ASPD | 12.0% | 17.4% | 46.7% | 25.0% | 36.8% | 27.8% | 50.0% | 70.0% | 7.7% | 52.6% | 14.3% | 18.8% | 62.5% | 33.3% |
| Extremista REF | 46.4% | 40.0% | 37.5% | 47.1% | 44.4% | 22.2% | 30.0% | 50.0% | 37.5% | 60.7% | 28.6% | 35.3% | 37.5% | 57.1% |
| Velocista | 56.5% | 78.9% | 42.3% | 33.3% | 66.7% | 58.3% | 92.3% | 62.5% | 50.0% | 95.5% | 55.0% | 81.0% | 83.3% | 70.0% |
| Berserker | 22.7% | 10.7% | 22.2% | 21.1% | 33.3% | 10.0% | 47.4% | 39.3% | 4.5% | 50.0% | 28.0% | 25.0% | 23.5% | 44.4% |
| Guardian | 61.9% | 61.5% | 50.0% | 63.6% | 83.3% | 34.8% | 85.7% | 71.4% | 45.0% | 72.0% | 50.0% | 46.7% | 60.0% | 55.6% |
| Estratega | 50.0% | 43.5% | 57.1% | 36.4% | 56.5% | 38.5% | 81.3% | 64.7% | 19.0% | 75.0% | 53.3% | 50.0% | 27.8% | 40.0% |
| Gladiador | 30.4% | 61.9% | 36.4% | 51.7% | 63.6% | 35.7% | 37.5% | 62.5% | 16.7% | 76.5% | 40.0% | 72.2% | 50.0% | 38.9% |
| Magus | 21.1% | 56.0% | 31.8% | 13.3% | 68.4% | 17.4% | 66.7% | 42.9% | 30.0% | 55.6% | 44.4% | 60.0% | 61.1% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 338 |
| 16-30 | 51.1% | 1059 |
| 31-50 | 49.4% | 1144 |
| 51-70 | 52.7% | 676 |
| 71-100 | 46.1% | 783 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 28.9% | 700 |
| 16-30 | 47.3% | 1327 |
| 31-50 | 54.1% | 1036 |
| 51-70 | 63.8% | 447 |
| 71-100 | 66.3% | 490 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.0% | 162 |
| 16-30 | 46.4% | 1032 |
| 31-50 | 49.9% | 1273 |
| 51-70 | 53.8% | 884 |
| 71-100 | 48.7% | 649 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.3% | 555 |
| 16-30 | 44.2% | 1302 |
| 31-50 | 51.7% | 1186 |
| 51-70 | 61.3% | 519 |
| 71-100 | 56.6% | 438 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.3% | 667 |
| 16-30 | 43.2% | 1450 |
| 31-50 | 44.9% | 1213 |
| 51-70 | 78.7% | 475 |
| 71-100 | 77.9% | 195 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.1% | 2730 |
| 16-30 | 54.3% | 1221 |
| 31-50 | 49.0% | 49 |
| 51-70 | 0.0% | 0 |
| 71-100 | 0.0% | 0 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.8% | 2761 |
| 16-30 | 55.1% | 1190 |
| 31-50 | 49.0% | 49 |
| 51-70 | 0.0% | 0 |
| 71-100 | 0.0% | 0 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.6% | 2822 |
| 16-30 | 53.4% | 1111 |
| 31-50 | 53.7% | 67 |
| 51-70 | 0.0% | 0 |
| 71-100 | 0.0% | 0 |
