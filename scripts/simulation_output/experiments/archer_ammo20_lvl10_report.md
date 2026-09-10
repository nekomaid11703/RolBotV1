# Combat Simulation Report
Generated: 2026-08-06 19:47:14 | 10000 simulations | Max 20 rounds

Config: numSims=10000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.8 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.1 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 10000 |
| KO victories | 9573 (95.7%) |
| Timeouts (draws) | 427 (4.3%) |
| Avg rounds (all) | 6.4 |
| Avg rounds (KO only) | 5.7 |
| Rounds P50 / P90 / Max | 5 / 13 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 4292 |
| Avg rounds | 6.8 |
| P50 / P90 | 5 / 15 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 4467/10000 |
| Winrate | 44.7% |
| Advantage over 50% | -5.3% |
| Draws | 5 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 941 | 1425 | 66.0% | YES |
| Asesino | 461 | 1484 | 31.1% |  |
| Esquivo | 390 | 1406 | 27.7% |  |
| Equilibrado | 542 | 1422 | 38.1% |  |
| Extremista ATK | 854 | 1488 | 57.4% |  |
| Extremista DEF | 954 | 1450 | 65.8% |  |
| Extremista ASPD | 784 | 1424 | 55.1% |  |
| Extremista REF | 816 | 1429 | 57.1% |  |
| Velocista | 233 | 1405 | 16.6% |  |
| Berserker | 854 | 1457 | 58.6% |  |
| Guardian | 718 | 1380 | 52.0% |  |
| Estratega | 904 | 1425 | 63.4% |  |
| Gladiador | 912 | 1393 | 65.5% |  |
| Magus | 632 | 1412 | 44.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 32.3 | - |
| Rests | 3.8 | 3 |
| Advances | 4.0 | - |
| Retreats | 0.7 | - |
| Battles with item use | 27.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.1% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.55 (avg 49.31) |
| ASPD spread (stddev) | 31.42 (avg 55.52) |
| Equipment tier A | 826 (4.1%) |
| Equipment tier B | 8747 (43.7%) |
| Equipment tier C | 3252 (16.3%) |
| Equipment tier D | 5348 (26.7%) |
| Equipment tier S | 1827 (9.1%) |
| Level 100-199 | 4450 |
| Level 200-299 | 4985 |
| Level 300-399 | 5140 |
| Level 400-500 | 5425 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 4510 |
| cortante | 4507 |
| desarmado | 1986 |
| perforante | 8997 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 6433 | 49.0% |
| ligera | 78 | 44.9% |
| media | 645 | 44.5% |
| ninguna | 2 | 50.0% |
| total | 12842 | 50.8% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 2 | 50.0% |
| 1-2 | 445 | 43.6% |
| 3+ | 19553 | 50.1% |
Set bonus active: 50.1% (19553) vs inactive 43.6% (447)

### Amulet
With amulet: 51.0% (7937) vs without 49.3% (12063)

### Shield
With shield: 50.0% (12104) vs without 49.9% (7896)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 750 | 59.2% |
| B | 7847 | 53.4% |
| C | 2910 | 47.5% |
| D | 4857 | 45.1% |
| S | 1650 | 64.4% |
| desarmado | 1986 | 36.5% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 3991 | 49.9% |
| adamantita | 861 | 64.8% |
| bronce | 4017 | 43.3% |
| desarmado | 1986 | 36.5% |
| filo_estelar | 789 | 64.0% |
| hierro | 4009 | 47.2% |
| mitril | 2140 | 59.8% |
| titanio | 2207 | 59.1% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 4347 | 59.5% |
| mitico | 1650 | 64.4% |
| ninguno | 1986 | 36.5% |
| poco_comun | 12017 | 46.8% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 4479 | 49.9% |
| adamantita | 936 | 49.8% |
| bronce | 4329 | 50.4% |
| filo_estelar | 942 | 49.2% |
| hierro | 4415 | 49.9% |
| mitril | 2465 | 49.1% |
| ninguno | 3 | 66.7% |
| titanio | 2431 | 50.7% |

### Nature by level bracket
- **100-199**: contundente: 1044, cortante: 986, desarmado: 393, perforante: 2027
- **200-299**: contundente: 1082, cortante: 1099, desarmado: 521, perforante: 2283
- **300-399**: contundente: 1147, cortante: 1194, desarmado: 531, perforante: 2268
- **400-500**: contundente: 1237, cortante: 1228, desarmado: 541, perforante: 2419

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 44.5% | 4893 | 51.8% | 15107 | -7.3pp |
| d_fulgor | 44.7% | 4900 | 51.7% | 15100 | -6.9pp |
| r_fulgor | 44.3% | 4897 | 51.8% | 15103 | -7.5pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 20.6 | 1 | 148 | 10 | 16 | 27 |
| Asesino | 44.2 | 1 | 176 | 19 | 41 | 65 |
| Esquivo | 21.8 | 1 | 141 | 11 | 17 | 28 |
| Equilibrado | 31.2 | 1 | 153 | 17 | 27 | 40 |
| Extremista ATK | 54.6 | 1 | 178 | 31 | 54 | 74 |
| Extremista DEF | 19.2 | 0 | 151 | 8 | 16 | 26 |
| Extremista ASPD | 44.2 | 1 | 179 | 19 | 41 | 64 |
| Extremista REF | 25.3 | 1 | 154 | 11 | 20 | 34 |
| Velocista | 24.9 | 1 | 132 | 13 | 21 | 31 |
| Berserker | 53.4 | 1 | 183 | 31 | 50 | 74 |
| Guardian | 18.4 | 0 | 145 | 8 | 14 | 23 |
| Estratega | 29.1 | 1 | 160 | 15 | 25 | 38 |
| Gladiador | 45.6 | 1 | 180 | 23 | 44 | 64 |
| Magus | 39.4 | 1 | 177 | 18 | 36 | 53 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 30 | 30 | 100.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 30 | 30 | 100.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 780 | 6502 | 12.0% |
| Asesino | 408 | 4230 | 9.6% |
| Esquivo | 2986 | 5237 | 57.0% |
| Equilibrado | 1437 | 5827 | 24.7% |
| Extremista ATK | 472 | 4293 | 11.0% |
| Extremista DEF | 1825 | 7208 | 25.3% |
| Extremista ASPD | 469 | 4149 | 11.3% |
| Extremista REF | 4400 | 5588 | 78.7% |
| Velocista | 557 | 4960 | 11.2% |
| Berserker | 651 | 4161 | 15.6% |
| Guardian | 1279 | 8292 | 15.4% |
| Estratega | 3793 | 5180 | 73.2% |
| Gladiador | 1532 | 3512 | 43.6% |
| Magus | 1377 | 4550 | 30.3% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 47 | 60 | 55 | 15 | 18 | 13 | 13 | 104 | 14 | 43 | 15 | 11 | 25 |
| 5 | 39 | 52 | 65 | 63 | 25 | 31 | 23 | 20 | 111 | 24 | 55 | 23 | 23 | 33 |
| 10 | 41 | 52 | 65 | 63 | 26 | 34 | 23 | 19 | 111 | 24 | 55 | 23 | 23 | 33 |
| 15 | 41 | 52 | 66 | 63 | 26 | 36 | 23 | 19 | 111 | 24 | 56 | 23 | 23 | 33 |
| 20 | 41 | 52 | 66 | 63 | 26 | 37 | 23 | 19 | 112 | 24 | 56 | 23 | 23 | 33 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 49.0% | 86.5% | 78.1% | 78.6% | 61.7% | 62.5% | 65.3% | 51.5% | 93.3% | 70.6% | 64.8% | 41.3% | 48.5% | 71.6% |
| Asesino | 13.5% | 50.0% | 57.0% | 51.0% | 25.0% | 19.3% | 21.7% | 21.4% | 80.4% | 16.3% | 21.4% | 19.8% | 11.0% | 28.6% |
| Esquivo | 21.9% | 43.0% | 50.0% | 38.1% | 17.7% | 11.1% | 19.7% | 20.8% | 76.9% | 18.4% | 30.1% | 9.9% | 15.4% | 22.2% |
| Equilibrado | 21.4% | 49.0% | 61.9% | 50.0% | 38.2% | 30.0% | 40.6% | 26.3% | 74.5% | 19.0% | 38.4% | 22.9% | 21.6% | 40.0% |
| Extremista ATK | 38.3% | 75.0% | 82.3% | 61.8% | 50.0% | 38.6% | 56.1% | 52.2% | 92.4% | 40.4% | 46.8% | 46.6% | 53.2% | 73.8% |
| Extremista DEF | 37.5% | 80.7% | 88.9% | 70.0% | 61.4% | 48.9% | 67.8% | 62.9% | 89.4% | 61.6% | 67.3% | 54.4% | 54.1% | 67.5% |
| Extremista ASPD | 34.7% | 78.3% | 80.3% | 59.4% | 43.9% | 32.2% | 50.0% | 55.4% | 86.2% | 44.3% | 48.2% | 49.0% | 35.3% | 69.9% |
| Extremista REF | 48.5% | 78.6% | 79.2% | 73.7% | 47.8% | 37.1% | 44.6% | 50.0% | 89.2% | 42.7% | 52.0% | 43.8% | 40.4% | 66.1% |
| Velocista | 6.7% | 19.6% | 23.1% | 25.5% | 7.6% | 10.6% | 13.8% | 10.8% | 50.0% | 9.4% | 18.9% | 9.0% | 4.9% | 21.6% |
| Berserker | 29.4% | 83.7% | 81.6% | 81.0% | 59.6% | 38.4% | 55.7% | 57.3% | 90.6% | 50.0% | 46.8% | 47.5% | 49.5% | 66.0% |
| Guardian | 34.3% | 78.6% | 69.9% | 61.6% | 53.2% | 32.7% | 51.8% | 48.0% | 81.1% | 53.2% | 50.0% | 38.1% | 28.6% | 49.0% |
| Estratega | 58.7% | 80.2% | 90.1% | 77.1% | 53.4% | 44.7% | 50.0% | 56.2% | 91.0% | 52.5% | 61.9% | 50.0% | 48.1% | 70.2% |
| Gladiador | 51.5% | 89.0% | 84.6% | 78.4% | 46.8% | 45.9% | 64.7% | 59.6% | 95.1% | 50.5% | 71.4% | 51.9% | 50.0% | 73.5% |
| Magus | 28.4% | 71.4% | 77.8% | 60.0% | 26.2% | 32.5% | 30.1% | 33.9% | 78.4% | 34.0% | 51.0% | 29.8% | 26.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.1% | 3109 |
| 16-30 | 47.9% | 5042 |
| 31-50 | 49.6% | 3563 |
| 51-70 | 49.2% | 2083 |
| 71-100 | 53.6% | 6203 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.1% | 159 |
| 16-30 | 44.0% | 4059 |
| 31-50 | 48.5% | 7388 |
| 51-70 | 52.4% | 3242 |
| 71-100 | 55.5% | 5152 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.5% | 2326 |
| 16-30 | 49.8% | 3702 |
| 31-50 | 46.4% | 3589 |
| 51-70 | 45.2% | 2684 |
| 71-100 | 51.1% | 7699 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.7% | 4254 |
| 16-30 | 48.8% | 4712 |
| 31-50 | 48.6% | 3800 |
| 51-70 | 47.8% | 2432 |
| 71-100 | 51.0% | 4802 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 59.2% | 7588 |
| 16-30 | 52.6% | 5493 |
| 31-50 | 46.4% | 3393 |
| 51-70 | 33.5% | 1514 |
| 71-100 | 26.4% | 2012 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.5% | 16004 |
| 16-30 | 44.0% | 2196 |
| 31-50 | 42.5% | 1383 |
| 51-70 | 46.0% | 378 |
| 71-100 | 51.3% | 39 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 16011 |
| 16-30 | 44.6% | 2175 |
| 31-50 | 43.0% | 1398 |
| 51-70 | 45.0% | 382 |
| 71-100 | 41.2% | 34 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 16045 |
| 16-30 | 44.7% | 2123 |
| 31-50 | 41.7% | 1421 |
| 51-70 | 50.1% | 379 |
| 71-100 | 43.8% | 32 |
