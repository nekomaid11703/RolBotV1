# Combat Simulation Report
Generated: 2026-08-07 18:02:40 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1956 (97.8%) |
| Timeouts (draws) | 44 (2.2%) |
| Avg rounds (all) | 5.5 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 11 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 246 |
| Avg rounds | 6.1 |
| P50 / P90 | 5 / 12 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 963/2000 |
| Winrate | 48.1% |
| Advantage over 50% | -1.9% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 190 | 273 | 69.6% |  |
| Asesino | 67 | 235 | 28.5% |  |
| Esquivo | 80 | 302 | 26.5% |  |
| Equilibrado | 103 | 292 | 35.3% |  |
| Extremista ATK | 154 | 292 | 52.7% |  |
| Extremista DEF | 227 | 313 | 72.5% | YES |
| Extremista ASPD | 163 | 284 | 57.4% |  |
| Extremista REF | 175 | 297 | 58.9% |  |
| Velocista | 54 | 302 | 17.9% |  |
| Berserker | 160 | 300 | 53.3% |  |
| Guardian | 150 | 266 | 56.4% |  |
| Estratega | 181 | 294 | 61.6% |  |
| Gladiador | 183 | 279 | 65.6% |  |
| Magus | 113 | 271 | 41.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 26.5 | - |
| Rests | 3.1 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.7 | - |
| Battles with item use | 24.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.6% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.04 (avg 46.98) |
| ASPD spread (stddev) | 31.47 (avg 52.64) |
| Equipment tier A | 126 (3.1%) |
| Equipment tier B | 1649 (41.2%) |
| Equipment tier C | 683 (17.1%) |
| Equipment tier D | 1185 (29.6%) |
| Equipment tier S | 357 (8.9%) |
| Level 100-199 | 1040 |
| Level 200-299 | 1078 |
| Level 300-399 | 945 |
| Level 400-500 | 937 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 918 |
| cortante | 920 |
| desarmado | 374 |
| perforante | 1788 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1259 | 48.5% |
| ligera | 17 | 58.8% |
| media | 99 | 48.5% |
| total | 2625 | 50.7% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 94 | 51.1% |
| 3+ | 3906 | 50.0% |
Set bonus active: 50.0% (3906) vs inactive 51.1% (94)

### Amulet
With amulet: 50.0% (1598) vs without 50.0% (2402)

### Shield
With shield: 50.7% (2426) vs without 48.9% (1574)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 113 | 65.5% |
| B | 1478 | 56.0% |
| C | 622 | 44.9% |
| D | 1088 | 41.5% |
| S | 325 | 70.2% |
| desarmado | 374 | 37.4% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 822 | 49.8% |
| adamantita | 157 | 69.4% |
| bronce | 837 | 43.1% |
| desarmado | 374 | 37.4% |
| filo_estelar | 168 | 70.8% |
| hierro | 788 | 42.0% |
| mitril | 423 | 62.6% |
| titanio | 431 | 61.7% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 854 | 62.2% |
| mitico | 325 | 70.2% |
| ninguno | 374 | 37.4% |
| poco_comun | 2447 | 45.0% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 902 | 48.9% |
| adamantita | 192 | 42.7% |
| bronce | 905 | 51.9% |
| filo_estelar | 187 | 49.2% |
| hierro | 887 | 51.0% |
| mitril | 455 | 47.9% |
| titanio | 472 | 51.9% |

### Nature by level bracket
- **100-199**: contundente: 239, cortante: 240, desarmado: 95, perforante: 466
- **200-299**: contundente: 238, cortante: 232, desarmado: 99, perforante: 509
- **300-399**: contundente: 230, cortante: 225, desarmado: 86, perforante: 404
- **400-500**: contundente: 211, cortante: 223, desarmado: 94, perforante: 409

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 46.4% | 905 | 51.1% | 3095 | -4.6pp |
| d_fulgor | 46.8% | 901 | 50.9% | 3099 | -4.1pp |
| r_fulgor | 46.2% | 918 | 51.1% | 3082 | -4.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 25.2 | 1 | 133 | 11 | 20 | 33 |
| Asesino | 50.3 | 1 | 139 | 17 | 47 | 80 |
| Esquivo | 24.2 | 1 | 122 | 12 | 23 | 31 |
| Equilibrado | 33.4 | 1 | 139 | 17 | 31 | 44 |
| Extremista ATK | 56.0 | 1 | 178 | 26 | 59 | 79 |
| Extremista DEF | 25.0 | 1 | 146 | 13 | 21 | 33 |
| Extremista ASPD | 49.6 | 1 | 140 | 24 | 48 | 73 |
| Extremista REF | 33.8 | 1 | 145 | 18 | 28 | 45 |
| Velocista | 30.3 | 1 | 137 | 17 | 27 | 39 |
| Berserker | 60.0 | 1 | 148 | 30 | 67 | 84 |
| Guardian | 23.0 | 0 | 135 | 11 | 20 | 31 |
| Estratega | 34.9 | 1 | 142 | 17 | 32 | 48 |
| Gladiador | 54.3 | 1 | 165 | 21 | 52 | 76 |
| Magus | 43.6 | 1 | 164 | 18 | 39 | 62 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 4 | 4 | 100.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 155 | 963 | 16.1% |
| Asesino | 76 | 615 | 12.4% |
| Esquivo | 515 | 902 | 57.1% |
| Equilibrado | 261 | 968 | 27.0% |
| Extremista ATK | 108 | 721 | 15.0% |
| Extremista DEF | 444 | 1217 | 36.5% |
| Extremista ASPD | 95 | 687 | 13.8% |
| Extremista REF | 651 | 843 | 77.2% |
| Velocista | 103 | 815 | 12.6% |
| Berserker | 68 | 644 | 10.6% |
| Guardian | 136 | 1177 | 11.6% |
| Estratega | 576 | 824 | 69.9% |
| Gladiador | 266 | 550 | 48.4% |
| Magus | 173 | 656 | 26.4% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 21 | 47 | 54 | 48 | 15 | 17 | 12 | 14 | 97 | 13 | 44 | 14 | 11 | 23 |
| 5 | 37 | 52 | 60 | 55 | 24 | 30 | 22 | 21 | 102 | 21 | 56 | 22 | 21 | 30 |
| 10 | 39 | 52 | 59 | 55 | 25 | 32 | 21 | 20 | 102 | 21 | 57 | 22 | 21 | 29 |
| 15 | 39 | 52 | 59 | 55 | 25 | 33 | 21 | 20 | 102 | 22 | 58 | 22 | 21 | 29 |
| 20 | 39 | 51 | 59 | 55 | 25 | 33 | 21 | 20 | 102 | 22 | 58 | 22 | 21 | 29 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 100.0% | 82.6% | 89.7% | 70.0% | 46.4% | 57.7% | 52.2% | 100.0% | 66.7% | 46.7% | 78.6% | 43.8% | 80.0% |
| Asesino | 0.0% | 50.0% | 57.9% | 60.0% | 18.8% | 3.7% | 7.7% | 18.2% | 73.9% | 27.3% | 12.5% | 0.0% | 7.7% | 41.2% |
| Esquivo | 17.4% | 42.1% | 50.0% | 43.5% | 22.7% | 9.5% | 13.3% | 21.4% | 68.4% | 10.0% | 13.0% | 16.0% | 15.4% | 21.7% |
| Equilibrado | 10.3% | 40.0% | 56.5% | 50.0% | 36.4% | 13.0% | 26.1% | 36.4% | 76.0% | 50.0% | 30.0% | 12.0% | 18.8% | 53.3% |
| Extremista ATK | 30.0% | 81.3% | 77.3% | 63.6% | 50.0% | 31.0% | 58.6% | 42.1% | 87.5% | 46.2% | 44.4% | 26.7% | 36.8% | 80.0% |
| Extremista DEF | 53.6% | 96.3% | 90.5% | 87.0% | 69.0% | 50.0% | 70.0% | 50.0% | 100.0% | 84.2% | 65.2% | 65.2% | 29.4% | 94.4% |
| Extremista ASPD | 42.3% | 92.3% | 86.7% | 73.9% | 41.4% | 30.0% | 50.0% | 45.5% | 85.0% | 58.8% | 73.7% | 77.3% | 20.8% | 64.3% |
| Extremista REF | 47.8% | 81.8% | 78.6% | 63.6% | 57.9% | 50.0% | 54.5% | 50.0% | 77.8% | 61.5% | 46.2% | 39.1% | 44.4% | 65.4% |
| Velocista | 0.0% | 26.1% | 31.6% | 24.0% | 12.5% | 0.0% | 15.0% | 22.2% | 50.0% | 0.0% | 22.2% | 3.8% | 25.0% | 12.5% |
| Berserker | 33.3% | 72.7% | 90.0% | 50.0% | 53.8% | 15.8% | 41.2% | 38.5% | 100.0% | 50.0% | 42.9% | 48.1% | 45.0% | 66.7% |
| Guardian | 53.3% | 87.5% | 87.0% | 70.0% | 55.6% | 34.8% | 26.3% | 53.8% | 77.8% | 57.1% | 50.0% | 30.0% | 50.0% | 46.7% |
| Estratega | 21.4% | 100.0% | 84.0% | 88.0% | 73.3% | 34.8% | 22.7% | 60.9% | 96.2% | 51.9% | 70.0% | 50.0% | 42.1% | 65.4% |
| Gladiador | 56.3% | 92.3% | 84.6% | 81.3% | 63.2% | 70.6% | 79.2% | 55.6% | 75.0% | 55.0% | 50.0% | 57.9% | 50.0% | 66.7% |
| Magus | 20.0% | 58.8% | 78.3% | 46.7% | 20.0% | 5.6% | 35.7% | 34.6% | 87.5% | 33.3% | 53.3% | 34.6% | 33.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.1% | 674 |
| 16-30 | 48.0% | 1077 |
| 31-50 | 51.7% | 693 |
| 51-70 | 49.7% | 429 |
| 71-100 | 53.3% | 1127 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.7% | 36 |
| 16-30 | 41.0% | 862 |
| 31-50 | 47.2% | 1540 |
| 51-70 | 53.3% | 584 |
| 71-100 | 60.7% | 978 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.7% | 499 |
| 16-30 | 46.7% | 855 |
| 31-50 | 46.2% | 746 |
| 51-70 | 44.7% | 490 |
| 71-100 | 53.5% | 1410 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.4% | 938 |
| 16-30 | 49.2% | 950 |
| 31-50 | 47.5% | 728 |
| 51-70 | 48.9% | 466 |
| 71-100 | 54.0% | 918 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.6% | 1635 |
| 16-30 | 52.1% | 1088 |
| 31-50 | 47.0% | 641 |
| 51-70 | 42.4% | 271 |
| 71-100 | 24.9% | 365 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3289 |
| 16-30 | 42.7% | 391 |
| 31-50 | 50.4% | 262 |
| 51-70 | 39.2% | 51 |
| 71-100 | 57.1% | 7 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.9% | 3274 |
| 16-30 | 44.4% | 394 |
| 31-50 | 46.8% | 263 |
| 51-70 | 53.0% | 66 |
| 71-100 | 66.7% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 3280 |
| 16-30 | 45.3% | 408 |
| 31-50 | 49.8% | 239 |
| 51-70 | 48.5% | 68 |
| 71-100 | 40.0% | 5 |
