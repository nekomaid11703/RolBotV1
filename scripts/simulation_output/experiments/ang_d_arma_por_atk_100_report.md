# Combat Simulation Report
Generated: 2026-08-07 18:02:40 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.0 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1951 (97.5%) |
| Timeouts (draws) | 49 (2.4%) |
| Avg rounds (all) | 5.7 |
| Avg rounds (KO only) | 5.3 |
| Rounds P50 / P90 / Max | 4 / 11 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 225 |
| Avg rounds | 6.0 |
| P50 / P90 | 5 / 11 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 946/2000 |
| Winrate | 47.3% |
| Advantage over 50% | -2.7% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 191 | 286 | 66.8% |  |
| Asesino | 93 | 291 | 32.0% |  |
| Esquivo | 95 | 306 | 31.0% |  |
| Equilibrado | 105 | 290 | 36.2% |  |
| Extremista ATK | 166 | 281 | 59.1% |  |
| Extremista DEF | 224 | 317 | 70.7% | YES |
| Extremista ASPD | 142 | 267 | 53.2% |  |
| Extremista REF | 156 | 271 | 57.6% |  |
| Velocista | 47 | 284 | 16.5% |  |
| Berserker | 157 | 278 | 56.5% |  |
| Guardian | 142 | 274 | 51.8% |  |
| Estratega | 169 | 283 | 59.7% |  |
| Gladiador | 184 | 293 | 62.8% |  |
| Magus | 129 | 279 | 46.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 27.8 | - |
| Rests | 3.1 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.7 | - |
| Battles with item use | 24.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.6% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.22 (avg 47.20) |
| ASPD spread (stddev) | 31.23 (avg 52.54) |
| Equipment tier A | 137 (3.4%) |
| Equipment tier B | 1661 (41.5%) |
| Equipment tier C | 679 (17.0%) |
| Equipment tier D | 1180 (29.5%) |
| Equipment tier S | 343 (8.6%) |
| Level 100-199 | 983 |
| Level 200-299 | 1104 |
| Level 300-399 | 990 |
| Level 400-500 | 923 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 869 |
| cortante | 907 |
| desarmado | 415 |
| perforante | 1809 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1301 | 49.8% |
| ligera | 16 | 50.0% |
| media | 122 | 51.6% |
| total | 2561 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 86 | 48.8% |
| 3+ | 3914 | 50.0% |
Set bonus active: 50.0% (3914) vs inactive 48.8% (86)

### Amulet
With amulet: 50.9% (1610) vs without 49.4% (2390)

### Shield
With shield: 51.1% (2403) vs without 48.3% (1597)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 119 | 62.2% |
| B | 1476 | 56.4% |
| C | 614 | 48.5% |
| D | 1068 | 40.7% |
| S | 308 | 73.1% |
| desarmado | 415 | 32.5% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 848 | 50.7% |
| adamantita | 163 | 74.8% |
| bronce | 829 | 45.2% |
| desarmado | 415 | 32.5% |
| filo_estelar | 145 | 71.0% |
| hierro | 770 | 43.1% |
| mitril | 408 | 63.5% |
| titanio | 422 | 57.8% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 830 | 60.6% |
| mitico | 308 | 73.1% |
| ninguno | 415 | 32.5% |
| poco_comun | 2447 | 46.5% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 864 | 50.3% |
| adamantita | 180 | 52.2% |
| bronce | 871 | 47.8% |
| filo_estelar | 187 | 49.2% |
| hierro | 925 | 49.7% |
| mitril | 484 | 53.5% |
| titanio | 489 | 49.9% |

### Nature by level bracket
- **100-199**: contundente: 215, cortante: 238, desarmado: 92, perforante: 438
- **200-299**: contundente: 233, cortante: 263, desarmado: 105, perforante: 503
- **300-399**: contundente: 219, cortante: 213, desarmado: 110, perforante: 448
- **400-500**: contundente: 202, cortante: 193, desarmado: 108, perforante: 420

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 49.1% | 928 | 50.3% | 3072 | -1.1pp |
| d_fulgor | 48.6% | 921 | 50.4% | 3079 | -1.8pp |
| r_fulgor | 49.5% | 918 | 50.2% | 3082 | -0.7pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 24.6 | 1 | 137 | 11 | 22 | 34 |
| Asesino | 41.8 | 1 | 142 | 12 | 37 | 68 |
| Esquivo | 26.0 | 1 | 143 | 13 | 22 | 33 |
| Equilibrado | 36.9 | 1 | 153 | 20 | 35 | 46 |
| Extremista ATK | 53.6 | 1 | 183 | 18 | 50 | 82 |
| Extremista DEF | 22.6 | 1 | 132 | 12 | 19 | 31 |
| Extremista ASPD | 50.7 | 1 | 174 | 22 | 46 | 75 |
| Extremista REF | 31.8 | 0 | 140 | 15 | 29 | 43 |
| Velocista | 32.0 | 1 | 111 | 17 | 29 | 41 |
| Berserker | 54.4 | 1 | 184 | 20 | 56 | 82 |
| Guardian | 23.4 | 1 | 116 | 10 | 20 | 32 |
| Estratega | 33.7 | 1 | 128 | 16 | 32 | 46 |
| Gladiador | 50.9 | 1 | 169 | 21 | 49 | 75 |
| Magus | 46.1 | 1 | 174 | 13 | 42 | 70 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 4 | 4 | 100.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
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
| Tanque | 136 | 1084 | 12.5% |
| Asesino | 64 | 746 | 8.6% |
| Esquivo | 477 | 848 | 56.3% |
| Equilibrado | 270 | 988 | 27.3% |
| Extremista ATK | 153 | 654 | 23.4% |
| Extremista DEF | 361 | 1221 | 29.6% |
| Extremista ASPD | 127 | 666 | 19.1% |
| Extremista REF | 750 | 894 | 83.9% |
| Velocista | 145 | 846 | 17.1% |
| Berserker | 108 | 651 | 16.6% |
| Guardian | 135 | 1169 | 11.5% |
| Estratega | 675 | 886 | 76.2% |
| Gladiador | 234 | 673 | 34.8% |
| Magus | 224 | 759 | 29.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 22 | 51 | 58 | 50 | 14 | 16 | 15 | 12 | 102 | 15 | 43 | 14 | 9 | 21 |
| 5 | 37 | 55 | 63 | 56 | 23 | 29 | 23 | 17 | 105 | 24 | 55 | 22 | 20 | 28 |
| 10 | 39 | 55 | 63 | 57 | 24 | 32 | 22 | 16 | 105 | 25 | 55 | 22 | 20 | 28 |
| 15 | 39 | 55 | 63 | 57 | 24 | 33 | 22 | 16 | 105 | 25 | 57 | 22 | 20 | 28 |
| 20 | 38 | 55 | 63 | 56 | 24 | 33 | 22 | 16 | 105 | 25 | 57 | 22 | 20 | 28 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 95.7% | 75.0% | 78.6% | 64.7% | 39.1% | 83.3% | 52.2% | 90.9% | 68.4% | 63.6% | 63.2% | 53.6% | 64.3% |
| Asesino | 4.3% | 50.0% | 46.7% | 57.1% | 16.7% | 13.0% | 25.0% | 42.9% | 77.8% | 20.0% | 33.3% | 16.0% | 22.2% | 27.3% |
| Esquivo | 25.0% | 53.3% | 50.0% | 35.0% | 19.2% | 8.7% | 28.6% | 22.2% | 64.3% | 15.8% | 18.2% | 40.0% | 16.7% | 20.0% |
| Equilibrado | 21.4% | 42.9% | 65.0% | 50.0% | 15.8% | 14.8% | 35.0% | 33.3% | 77.8% | 40.9% | 31.3% | 17.6% | 25.0% | 41.7% |
| Extremista ATK | 35.3% | 83.3% | 80.8% | 84.2% | 50.0% | 50.0% | 58.3% | 35.3% | 86.7% | 50.0% | 56.3% | 45.5% | 56.0% | 52.0% |
| Extremista DEF | 60.9% | 87.0% | 91.3% | 85.2% | 50.0% | 50.0% | 75.0% | 70.4% | 91.3% | 68.4% | 65.2% | 70.8% | 37.5% | 76.2% |
| Extremista ASPD | 16.7% | 75.0% | 71.4% | 65.0% | 41.7% | 25.0% | 50.0% | 50.0% | 100.0% | 37.5% | 61.1% | 52.6% | 30.4% | 44.4% |
| Extremista REF | 47.8% | 57.1% | 77.8% | 66.7% | 64.7% | 29.6% | 50.0% | 50.0% | 94.7% | 42.9% | 50.0% | 45.0% | 75.0% | 70.0% |
| Velocista | 9.1% | 22.2% | 35.7% | 22.2% | 13.3% | 8.7% | 0.0% | 5.3% | 50.0% | 13.6% | 15.4% | 7.4% | 21.4% | 16.7% |
| Berserker | 31.6% | 80.0% | 84.2% | 59.1% | 50.0% | 31.6% | 62.5% | 57.1% | 86.4% | 50.0% | 50.0% | 52.9% | 33.3% | 60.0% |
| Guardian | 36.4% | 66.7% | 81.8% | 68.8% | 43.8% | 34.8% | 38.9% | 50.0% | 84.6% | 50.0% | 50.0% | 31.6% | 31.6% | 62.5% |
| Estratega | 36.8% | 84.0% | 60.0% | 82.4% | 54.5% | 29.2% | 47.4% | 55.0% | 92.6% | 47.1% | 68.4% | 50.0% | 40.0% | 70.8% |
| Gladiador | 46.4% | 77.8% | 83.3% | 75.0% | 44.0% | 62.5% | 69.6% | 25.0% | 78.6% | 66.7% | 68.4% | 60.0% | 50.0% | 66.7% |
| Magus | 35.7% | 72.7% | 80.0% | 58.3% | 48.0% | 23.8% | 55.6% | 30.0% | 83.3% | 40.0% | 37.5% | 29.2% | 33.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.3% | 679 |
| 16-30 | 46.3% | 1071 |
| 31-50 | 50.1% | 696 |
| 51-70 | 48.4% | 419 |
| 71-100 | 55.6% | 1135 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 59.0% | 39 |
| 16-30 | 41.4% | 846 |
| 31-50 | 46.8% | 1490 |
| 51-70 | 55.5% | 611 |
| 71-100 | 58.3% | 1014 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.3% | 511 |
| 16-30 | 49.2% | 811 |
| 31-50 | 42.0% | 767 |
| 51-70 | 45.3% | 530 |
| 71-100 | 54.0% | 1381 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.1% | 921 |
| 16-30 | 46.1% | 968 |
| 31-50 | 47.4% | 772 |
| 51-70 | 53.9% | 482 |
| 71-100 | 53.3% | 857 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.8% | 1619 |
| 16-30 | 51.1% | 1053 |
| 31-50 | 48.2% | 654 |
| 51-70 | 32.6% | 291 |
| 71-100 | 30.3% | 383 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 3264 |
| 16-30 | 45.5% | 422 |
| 31-50 | 51.8% | 249 |
| 51-70 | 50.9% | 57 |
| 71-100 | 50.0% | 8 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3265 |
| 16-30 | 47.9% | 413 |
| 31-50 | 49.4% | 261 |
| 51-70 | 54.2% | 59 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.1% | 3245 |
| 16-30 | 47.7% | 457 |
| 31-50 | 51.7% | 240 |
| 51-70 | 53.7% | 54 |
| 71-100 | 50.0% | 4 |
