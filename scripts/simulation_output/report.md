# Combat Simulation Report
Generated: 2026-08-05 00:37:43 | 2000 simulations | Max 50 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.1 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.1 | FAIL |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1984 (99.2%) |
| Timeouts (draws) | 16 (0.8%) |
| Avg rounds (all) | 6.3 |
| Avg rounds (KO only) | 6.0 |
| Rounds P50 / P90 / Max | 5 / 11 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 463 |
| Avg rounds | 7.1 |
| P50 / P90 | 5 / 13 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 848/2000 |
| Winrate | 42.4% |
| Advantage over 50% | -7.6% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 129 | 250 | 51.6% |  |
| Asesino | 125 | 279 | 44.8% |  |
| Esquivo | 173 | 290 | 59.7% |  |
| Equilibrado | 183 | 311 | 58.8% |  |
| Extremista ATK | 94 | 298 | 31.5% |  |
| Extremista DEF | 203 | 304 | 66.8% |  |
| Extremista ASPD | 88 | 274 | 32.1% |  |
| Extremista REF | 105 | 261 | 40.2% |  |
| Velocista | 194 | 285 | 68.1% | YES |
| Berserker | 88 | 272 | 32.4% |  |
| Guardian | 176 | 278 | 63.3% |  |
| Estratega | 161 | 303 | 53.1% |  |
| Gladiador | 150 | 299 | 50.2% |  |
| Magus | 131 | 296 | 44.3% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 33.6 | - |
| Rests | 5.4 | 4 |
| Advances | 1.4 | - |
| Retreats | 0.0 | - |
| Battles with item use | 16.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.9% |
| Armor presence | 89.1% |
| ATK spread (stddev) | 26.18 (avg 45.46) |
| ASPD spread (stddev) | 22.89 (avg 45.97) |
| Equipment tier T1 | 1130 (28.2%) |
| Equipment tier T2 | 1710 (42.8%) |
| Equipment tier T3 | 1159 (29.0%) |
| Equipment tier T4 | 1 (0.0%) |
| Level 100-199 | 1130 |
| Level 200-299 | 1132 |
| Level 300-399 | 1103 |
| Level 400-500 | 635 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1 |
| cortante | 1532 |
| desarmado | 403 |
| perforante | 2064 |

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 53.1% | 2062 | 46.7% | 1938 | 6.3pp |
| d_fulgor | 53.4% | 2047 | 46.4% | 1953 | 7.1pp |
| r_fulgor | 53.7% | 2001 | 46.3% | 1999 | 7.4pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.6 | 0 | 50 | 23 | 28 | 40 |
| Asesino | 40.2 | 0 | 86 | 27 | 40 | 45 |
| Esquivo | 23.9 | 0 | 46 | 0 | 27 | 40 |
| Equilibrado | 30.0 | 0 | 72 | 27 | 38 | 40 |
| Extremista ATK | 44.7 | 0 | 90 | 27 | 40 | 57 |
| Extremista DEF | 11.4 | 0 | 40 | 0 | 0 | 23 |
| Extremista ASPD | 37.0 | 0 | 69 | 27 | 40 | 43 |
| Extremista REF | 27.4 | 0 | 46 | 23 | 27 | 35 |
| Velocista | 31.9 | 0 | 60 | 27 | 35 | 40 |
| Berserker | 43.6 | 0 | 89 | 27 | 40 | 58 |
| Guardian | 21.6 | 0 | 53 | 0 | 26 | 33 |
| Estratega | 31.2 | 0 | 63 | 27 | 33 | 40 |
| Gladiador | 36.4 | 0 | 77 | 30 | 40 | 40 |
| Magus | 36.5 | 0 | 61 | 30 | 40 | 40 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 148 | 148 | 100.0% |
| Asesino | 77 | 77 | 100.0% |
| Esquivo | 978 | 978 | 100.0% |
| Equilibrado | 648 | 648 | 100.0% |
| Extremista ATK | 89 | 89 | 100.0% |
| Extremista DEF | 607 | 607 | 100.0% |
| Extremista ASPD | 50 | 50 | 100.0% |
| Extremista REF | 33 | 33 | 100.0% |
| Velocista | 343 | 343 | 100.0% |
| Berserker | 65 | 65 | 100.0% |
| Guardian | 183 | 183 | 100.0% |
| Estratega | 332 | 332 | 100.0% |
| Gladiador | 289 | 289 | 100.0% |
| Magus | 243 | 243 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 1 | 1436 | 0.1% |
| Asesino | 0 | 1066 | 0.0% |
| Esquivo | 297 | 1947 | 15.3% |
| Equilibrado | 22 | 1893 | 1.2% |
| Extremista ATK | 0 | 1139 | 0.0% |
| Extremista DEF | 487 | 2296 | 21.2% |
| Extremista ASPD | 59 | 1078 | 5.5% |
| Extremista REF | 833 | 1283 | 64.9% |
| Velocista | 0 | 1149 | 0.0% |
| Berserker | 0 | 984 | 0.0% |
| Guardian | 0 | 1606 | 0.0% |
| Estratega | 408 | 1646 | 24.8% |
| Gladiador | 210 | 1599 | 13.1% |
| Magus | 83 | 1388 | 6.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 30 | 25 | 24 | 24 | 27 | 27 | 19 | 20 | 11 | 23 | 23 | 30 | 27 | 24 |
| 5 | 34 | 33 | 30 | 32 | 33 | 29 | 24 | 23 | 20 | 30 | 27 | 34 | 33 | 31 |
| 10 | 34 | 34 | 32 | 34 | 34 | 30 | 25 | 23 | 21 | 31 | 28 | 34 | 34 | 31 |
| 15 | 34 | 34 | 32 | 34 | 34 | 30 | 25 | 23 | 21 | 31 | 30 | 34 | 34 | 31 |
| 20 | 34 | 34 | 33 | 34 | 34 | 30 | 25 | 23 | 21 | 31 | 30 | 34 | 34 | 31 |
| 25 | 34 | 34 | 33 | 34 | 34 | 31 | 25 | 23 | 21 | 31 | 30 | 34 | 34 | 31 |
| 30 | 34 | 34 | 33 | 34 | 34 | 31 | 25 | 23 | 21 | 31 | 30 | 34 | 34 | 31 |
| 40 | 34 | 34 | 33 | 34 | 34 | 31 | 25 | 23 | 21 | 31 | 30 | 35 | 34 | 31 |
| 50 | 34 | 34 | 33 | 34 | 34 | 31 | 25 | 23 | 21 | 31 | 30 | 35 | 34 | 31 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 68.8% | 35.0% | 23.1% | 85.0% | 38.9% | 72.2% | 59.1% | 36.8% | 58.8% | 29.4% | 44.4% | 40.0% | 65.2% |
| Asesino | 31.3% | 50.0% | 53.8% | 36.4% | 70.6% | 38.5% | 58.3% | 61.1% | 18.5% | 77.3% | 5.9% | 34.8% | 42.9% | 52.4% |
| Esquivo | 65.0% | 46.2% | 50.0% | 60.0% | 81.3% | 54.1% | 57.9% | 53.3% | 44.4% | 84.2% | 70.8% | 52.4% | 45.0% | 78.9% |
| Equilibrado | 76.9% | 63.6% | 40.0% | 50.0% | 67.6% | 44.4% | 88.0% | 76.9% | 45.5% | 75.0% | 40.9% | 54.2% | 47.4% | 62.5% |
| Extremista ATK | 15.0% | 29.4% | 18.8% | 32.4% | 50.0% | 12.5% | 57.1% | 50.0% | 0.0% | 50.0% | 11.1% | 36.8% | 42.9% | 22.2% |
| Extremista DEF | 61.1% | 61.5% | 45.9% | 55.6% | 87.5% | 50.0% | 88.9% | 73.9% | 28.6% | 88.2% | 56.3% | 64.0% | 96.3% | 76.9% |
| Extremista ASPD | 27.8% | 41.7% | 42.1% | 12.0% | 42.9% | 11.1% | 50.0% | 45.8% | 20.0% | 45.0% | 18.2% | 33.3% | 31.0% | 36.4% |
| Extremista REF | 40.9% | 38.9% | 46.7% | 23.1% | 50.0% | 26.1% | 54.2% | 50.0% | 30.0% | 25.0% | 35.3% | 44.0% | 30.4% | 64.7% |
| Velocista | 63.2% | 81.5% | 55.6% | 54.5% | 100.0% | 71.4% | 80.0% | 70.0% | 50.0% | 100.0% | 52.2% | 65.0% | 61.3% | 66.7% |
| Berserker | 41.2% | 22.7% | 15.8% | 25.0% | 50.0% | 11.8% | 55.0% | 75.0% | 0.0% | 50.0% | 5.9% | 30.0% | 11.1% | 36.0% |
| Guardian | 70.6% | 94.1% | 29.2% | 59.1% | 88.9% | 43.8% | 81.8% | 64.7% | 47.8% | 94.1% | 50.0% | 73.7% | 57.1% | 52.4% |
| Estratega | 55.6% | 65.2% | 47.6% | 45.8% | 63.2% | 36.0% | 66.7% | 56.0% | 35.0% | 70.0% | 26.3% | 50.0% | 77.8% | 52.4% |
| Gladiador | 60.0% | 57.1% | 55.0% | 52.6% | 57.1% | 3.7% | 69.0% | 69.6% | 38.7% | 88.9% | 42.9% | 22.2% | 50.0% | 50.0% |
| Magus | 34.8% | 47.6% | 21.1% | 37.5% | 77.8% | 23.1% | 63.6% | 35.3% | 33.3% | 64.0% | 47.6% | 47.6% | 50.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 55.3% | 347 |
| 16-30 | 47.5% | 1086 |
| 31-50 | 51.6% | 1153 |
| 51-70 | 53.3% | 683 |
| 71-100 | 45.6% | 731 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 29.7% | 731 |
| 16-30 | 48.6% | 1283 |
| 31-50 | 51.7% | 1056 |
| 51-70 | 65.9% | 466 |
| 71-100 | 65.9% | 464 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 62.3% | 175 |
| 16-30 | 46.3% | 1061 |
| 31-50 | 50.1% | 1245 |
| 51-70 | 50.2% | 884 |
| 71-100 | 52.3% | 635 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.4% | 568 |
| 16-30 | 43.8% | 1302 |
| 31-50 | 51.8% | 1140 |
| 51-70 | 62.8% | 584 |
| 71-100 | 58.6% | 406 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.5% | 656 |
| 16-30 | 42.9% | 1488 |
| 31-50 | 45.4% | 1178 |
| 51-70 | 77.3% | 484 |
| 71-100 | 82.5% | 194 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.1% | 2764 |
| 16-30 | 56.9% | 1194 |
| 31-50 | 42.9% | 42 |
| 51-70 | 0.0% | 0 |
| 71-100 | 0.0% | 0 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.9% | 2797 |
| 16-30 | 57.7% | 1161 |
| 31-50 | 42.9% | 42 |
| 51-70 | 0.0% | 0 |
| 71-100 | 0.0% | 0 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.2% | 2823 |
| 16-30 | 54.3% | 1112 |
| 31-50 | 52.3% | 65 |
| 51-70 | 0.0% | 0 |
| 71-100 | 0.0% | 0 |
