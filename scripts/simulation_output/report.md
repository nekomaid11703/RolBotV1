# Combat Simulation Report
Generated: 2026-08-06 18:58:08 | 10000 simulations | Max 20 rounds

Config: numSims=10000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.9 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 10000 |
| KO victories | 9545 (95.5%) |
| Timeouts (draws) | 455 (4.5%) |
| Avg rounds (all) | 6.5 |
| Avg rounds (KO only) | 5.8 |
| Rounds P50 / P90 / Max | 5 / 14 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 1254 |
| Avg rounds | 6.9 |
| P50 / P90 | 5 / 15 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 4856/10000 |
| Winrate | 48.6% |
| Advantage over 50% | -1.4% |
| Draws | 4 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 970 | 1480 | 65.5% | YES |
| Asesino | 448 | 1485 | 30.2% |  |
| Esquivo | 373 | 1421 | 26.2% |  |
| Equilibrado | 585 | 1419 | 41.2% |  |
| Extremista ATK | 861 | 1496 | 57.6% |  |
| Extremista DEF | 932 | 1448 | 64.4% |  |
| Extremista ASPD | 770 | 1392 | 55.3% |  |
| Extremista REF | 810 | 1410 | 57.4% |  |
| Velocista | 236 | 1362 | 17.3% |  |
| Berserker | 830 | 1392 | 59.6% |  |
| Guardian | 740 | 1425 | 51.9% |  |
| Estratega | 841 | 1392 | 60.4% |  |
| Gladiador | 958 | 1464 | 65.4% |  |
| Magus | 642 | 1414 | 45.4% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 31.3 | - |
| Rests | 3.8 | 3 |
| Advances | 4.1 | - |
| Retreats | 0.7 | - |
| Battles with item use | 28.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.3% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.30 (avg 47.90) |
| ASPD spread (stddev) | 31.16 (avg 53.66) |
| Equipment tier A | 737 (3.7%) |
| Equipment tier B | 8404 (42.0%) |
| Equipment tier C | 3369 (16.8%) |
| Equipment tier D | 5750 (28.7%) |
| Equipment tier S | 1740 (8.7%) |
| Level 100-199 | 4746 |
| Level 200-299 | 5545 |
| Level 300-399 | 4946 |
| Level 400-500 | 4763 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 4443 |
| cortante | 4426 |
| desarmado | 1938 |
| perforante | 9193 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 6405 | 48.9% |
| ligera | 79 | 32.9% |
| media | 679 | 44.9% |
| total | 12837 | 50.9% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 452 | 44.2% |
| 3+ | 19548 | 50.1% |
Set bonus active: 50.1% (19548) vs inactive 44.2% (452)

### Amulet
With amulet: 51.1% (7902) vs without 49.2% (12098)

### Shield
With shield: 50.8% (12011) vs without 48.7% (7989)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 667 | 63.7% |
| B | 7622 | 54.6% |
| C | 3016 | 47.1% |
| D | 5197 | 41.8% |
| S | 1560 | 68.5% |
| desarmado | 1938 | 38.4% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 4049 | 49.4% |
| adamantita | 788 | 68.1% |
| bronce | 4014 | 43.1% |
| desarmado | 1938 | 38.4% |
| filo_estelar | 772 | 68.9% |
| hierro | 3972 | 46.5% |
| mitril | 2283 | 58.9% |
| titanio | 2184 | 57.7% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 4467 | 58.3% |
| mitico | 1560 | 68.5% |
| ninguno | 1938 | 38.4% |
| poco_comun | 12035 | 46.3% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 4456 | 48.9% |
| adamantita | 977 | 51.2% |
| bronce | 4379 | 50.0% |
| filo_estelar | 971 | 49.8% |
| hierro | 4436 | 50.0% |
| mitril | 2389 | 50.7% |
| ninguno | 1 | 0.0% |
| titanio | 2391 | 50.9% |

### Nature by level bracket
- **100-199**: contundente: 1064, cortante: 1073, desarmado: 449, perforante: 2160
- **200-299**: contundente: 1205, cortante: 1202, desarmado: 543, perforante: 2595
- **300-399**: contundente: 1124, cortante: 1097, desarmado: 478, perforante: 2247
- **400-500**: contundente: 1050, cortante: 1054, desarmado: 468, perforante: 2191

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 46.2% | 4879 | 51.2% | 15121 | -5.1pp |
| d_fulgor | 46.1% | 4875 | 51.2% | 15125 | -5.2pp |
| r_fulgor | 46.1% | 4845 | 51.2% | 15155 | -5.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.4 | 1 | 145 | 9 | 16 | 25 |
| Asesino | 40.4 | 0 | 180 | 17 | 35 | 58 |
| Esquivo | 21.0 | 1 | 137 | 10 | 17 | 26 |
| Equilibrado | 29.9 | 1 | 155 | 15 | 24 | 38 |
| Extremista ATK | 52.7 | 1 | 185 | 30 | 50 | 72 |
| Extremista DEF | 17.3 | 1 | 139 | 7 | 13 | 24 |
| Extremista ASPD | 42.3 | 1 | 179 | 19 | 38 | 59 |
| Extremista REF | 24.4 | 1 | 174 | 10 | 20 | 32 |
| Velocista | 24.9 | 1 | 140 | 13 | 22 | 32 |
| Berserker | 53.2 | 1 | 175 | 27 | 52 | 73 |
| Guardian | 17.5 | 0 | 141 | 8 | 14 | 22 |
| Estratega | 27.9 | 1 | 154 | 13 | 23 | 37 |
| Gladiador | 46.2 | 1 | 177 | 24 | 44 | 64 |
| Magus | 40.0 | 1 | 177 | 20 | 35 | 55 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 4 | 4 | 100.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 1 | 1 | 100.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 1320 | 7023 | 18.8% |
| Asesino | 704 | 4456 | 15.8% |
| Esquivo | 3357 | 5503 | 61.0% |
| Equilibrado | 1806 | 5940 | 30.4% |
| Extremista ATK | 648 | 4074 | 15.9% |
| Extremista DEF | 2026 | 7271 | 27.9% |
| Extremista ASPD | 687 | 4067 | 16.9% |
| Extremista REF | 4282 | 5329 | 80.4% |
| Velocista | 859 | 4652 | 18.5% |
| Berserker | 638 | 3647 | 17.5% |
| Guardian | 1689 | 8449 | 20.0% |
| Estratega | 3537 | 4908 | 72.1% |
| Gladiador | 1678 | 3722 | 45.1% |
| Magus | 1484 | 4370 | 34.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 47 | 58 | 55 | 14 | 16 | 13 | 12 | 101 | 15 | 45 | 14 | 11 | 24 |
| 5 | 38 | 53 | 62 | 62 | 24 | 28 | 22 | 19 | 106 | 25 | 57 | 22 | 22 | 31 |
| 10 | 40 | 53 | 63 | 62 | 25 | 32 | 22 | 18 | 107 | 25 | 58 | 22 | 22 | 30 |
| 15 | 41 | 53 | 64 | 62 | 25 | 33 | 22 | 18 | 107 | 25 | 58 | 22 | 22 | 30 |
| 20 | 40 | 53 | 64 | 62 | 25 | 33 | 22 | 18 | 107 | 25 | 58 | 22 | 22 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 88.6% | 75.7% | 76.6% | 67.6% | 51.2% | 68.5% | 62.0% | 90.4% | 61.5% | 68.9% | 51.9% | 45.1% | 67.9% |
| Asesino | 11.4% | 50.0% | 66.9% | 34.7% | 17.2% | 13.0% | 22.6% | 18.1% | 72.4% | 16.8% | 31.6% | 21.6% | 15.2% | 28.9% |
| Esquivo | 24.3% | 33.1% | 50.0% | 33.0% | 17.0% | 14.0% | 12.5% | 21.5% | 76.9% | 16.5% | 25.5% | 17.9% | 10.4% | 25.6% |
| Equilibrado | 23.4% | 65.3% | 67.0% | 50.0% | 27.4% | 26.3% | 39.8% | 33.3% | 77.7% | 30.8% | 42.1% | 28.7% | 24.2% | 42.6% |
| Extremista ATK | 32.4% | 82.8% | 83.0% | 72.6% | 50.0% | 44.4% | 53.7% | 46.7% | 88.0% | 49.1% | 47.5% | 41.6% | 43.0% | 73.3% |
| Extremista DEF | 48.8% | 87.0% | 86.0% | 73.7% | 54.6% | 50.0% | 56.9% | 63.0% | 94.5% | 52.9% | 56.3% | 64.4% | 46.4% | 69.7% |
| Extremista ASPD | 31.5% | 77.4% | 87.5% | 60.2% | 46.3% | 43.1% | 50.0% | 48.0% | 86.5% | 52.3% | 41.9% | 47.1% | 52.5% | 56.5% |
| Extremista REF | 38.0% | 81.9% | 78.5% | 66.7% | 53.3% | 37.0% | 52.0% | 50.0% | 95.1% | 47.5% | 57.4% | 47.8% | 45.6% | 58.1% |
| Velocista | 9.6% | 27.6% | 23.1% | 22.3% | 12.0% | 5.5% | 13.5% | 4.9% | 50.0% | 10.8% | 19.1% | 10.1% | 3.2% | 21.9% |
| Berserker | 38.5% | 83.2% | 83.5% | 69.2% | 50.9% | 47.1% | 47.7% | 52.5% | 89.2% | 50.0% | 52.1% | 51.1% | 43.4% | 69.4% |
| Guardian | 31.1% | 68.4% | 74.5% | 57.9% | 52.5% | 43.8% | 58.1% | 42.6% | 80.9% | 47.9% | 50.0% | 42.0% | 23.1% | 57.8% |
| Estratega | 47.2% | 78.4% | 82.1% | 71.3% | 58.4% | 35.6% | 52.9% | 51.1% | 89.9% | 48.9% | 58.0% | 50.0% | 48.0% | 68.2% |
| Gladiador | 54.9% | 84.8% | 89.6% | 75.8% | 56.1% | 53.6% | 47.5% | 54.4% | 96.8% | 56.6% | 76.9% | 52.0% | 50.0% | 71.2% |
| Magus | 32.1% | 71.1% | 74.4% | 57.4% | 26.7% | 30.3% | 43.5% | 41.9% | 78.1% | 30.6% | 42.2% | 31.8% | 28.8% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.5% | 3381 |
| 16-30 | 46.6% | 5088 |
| 31-50 | 50.2% | 3535 |
| 51-70 | 52.2% | 2127 |
| 71-100 | 55.7% | 5869 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 34.7% | 144 |
| 16-30 | 42.2% | 4337 |
| 31-50 | 48.2% | 7396 |
| 51-70 | 53.7% | 3040 |
| 71-100 | 57.4% | 5083 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 2459 |
| 16-30 | 47.5% | 3866 |
| 31-50 | 45.0% | 3812 |
| 51-70 | 47.4% | 2735 |
| 71-100 | 54.3% | 7128 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.3% | 4594 |
| 16-30 | 48.6% | 4817 |
| 31-50 | 48.3% | 3769 |
| 51-70 | 49.3% | 2324 |
| 71-100 | 53.9% | 4496 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.1% | 7960 |
| 16-30 | 52.8% | 5508 |
| 31-50 | 49.6% | 3239 |
| 51-70 | 35.3% | 1411 |
| 71-100 | 27.9% | 1882 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.8% | 16106 |
| 16-30 | 43.9% | 2300 |
| 31-50 | 50.2% | 1254 |
| 51-70 | 48.6% | 315 |
| 71-100 | 60.0% | 25 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.8% | 16124 |
| 16-30 | 44.7% | 2257 |
| 31-50 | 49.9% | 1298 |
| 51-70 | 47.4% | 287 |
| 71-100 | 50.0% | 34 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.8% | 16128 |
| 16-30 | 44.8% | 2262 |
| 31-50 | 49.7% | 1287 |
| 51-70 | 49.7% | 298 |
| 71-100 | 40.0% | 25 |
