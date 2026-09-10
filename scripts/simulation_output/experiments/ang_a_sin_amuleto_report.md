# Combat Simulation Report
Generated: 2026-08-07 17:57:21 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.5 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1940 (97.0%) |
| Timeouts (draws) | 60 (3.0%) |
| Avg rounds (all) | 6.0 |
| Avg rounds (KO only) | 5.5 |
| Rounds P50 / P90 / Max | 5 / 12 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 248 |
| Avg rounds | 6.5 |
| P50 / P90 | 5 / 12 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 931/2000 |
| Winrate | 46.6% |
| Advantage over 50% | -3.4% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 197 | 292 | 67.5% | YES |
| Asesino | 82 | 271 | 30.3% |  |
| Esquivo | 87 | 272 | 32.0% |  |
| Equilibrado | 96 | 272 | 35.3% |  |
| Extremista ATK | 140 | 260 | 53.8% |  |
| Extremista DEF | 201 | 300 | 67.0% |  |
| Extremista ASPD | 158 | 288 | 54.9% |  |
| Extremista REF | 168 | 306 | 54.9% |  |
| Velocista | 63 | 295 | 21.4% |  |
| Berserker | 195 | 327 | 59.6% |  |
| Guardian | 161 | 313 | 51.4% |  |
| Estratega | 161 | 265 | 60.8% |  |
| Gladiador | 171 | 277 | 61.7% |  |
| Magus | 120 | 262 | 45.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 30.9 | - |
| Rests | 3.3 | 2 |
| Advances | 4.1 | - |
| Retreats | 0.7 | - |
| Battles with item use | 26.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.2% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 33.29 (avg 44.16) |
| ASPD spread (stddev) | 31.48 (avg 53.44) |
| Equipment tier A | 124 (3.1%) |
| Equipment tier B | 1635 (40.9%) |
| Equipment tier C | 705 (17.6%) |
| Equipment tier D | 1180 (29.5%) |
| Equipment tier S | 356 (8.9%) |
| Level 100-199 | 975 |
| Level 200-299 | 1130 |
| Level 300-399 | 1003 |
| Level 400-500 | 892 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 912 |
| cortante | 932 |
| desarmado | 392 |
| perforante | 1764 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1293 | 50.3% |
| ligera | 21 | 57.1% |
| media | 138 | 38.4% |
| ninguna | 1 | 0.0% |
| total | 2547 | 50.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 1 | 0.0% |
| 1-2 | 81 | 44.4% |
| 3+ | 3918 | 50.1% |
Set bonus active: 50.1% (3918) vs inactive 43.9% (82)

### Amulet
With amulet: 0.0% (0) vs without 50.0% (4000)

### Shield
With shield: 50.7% (2442) vs without 49.0% (1558)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 114 | 57.9% |
| B | 1477 | 57.5% |
| C | 624 | 45.4% |
| D | 1074 | 41.2% |
| S | 319 | 75.2% |
| desarmado | 392 | 30.1% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 861 | 48.4% |
| adamantita | 155 | 74.2% |
| bronce | 814 | 42.0% |
| desarmado | 392 | 30.1% |
| filo_estelar | 164 | 76.2% |
| hierro | 809 | 47.8% |
| mitril | 417 | 62.6% |
| titanio | 388 | 60.6% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 805 | 61.6% |
| mitico | 319 | 75.2% |
| ninguno | 392 | 30.1% |
| poco_comun | 2484 | 46.1% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 905 | 45.7% |
| adamantita | 191 | 50.3% |
| bronce | 894 | 51.1% |
| filo_estelar | 174 | 46.6% |
| hierro | 877 | 51.4% |
| mitril | 496 | 53.4% |
| ninguno | 2 | 0.0% |
| titanio | 461 | 51.2% |

### Nature by level bracket
- **100-199**: contundente: 210, cortante: 248, desarmado: 92, perforante: 425
- **200-299**: contundente: 268, cortante: 248, desarmado: 113, perforante: 501
- **300-399**: contundente: 225, cortante: 240, desarmado: 101, perforante: 437
- **400-500**: contundente: 209, cortante: 196, desarmado: 86, perforante: 401

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 49.6% | 984 | 50.1% | 3016 | -0.5pp |
| d_fulgor | 49.1% | 984 | 50.3% | 3016 | -1.2pp |
| r_fulgor | 49.5% | 993 | 50.1% | 3007 | -0.6pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 26.5 | 1 | 133 | 14 | 22 | 38 |
| Asesino | 45.5 | 1 | 167 | 14 | 38 | 71 |
| Esquivo | 23.6 | 1 | 124 | 13 | 22 | 30 |
| Equilibrado | 29.7 | 1 | 153 | 12 | 21 | 38 |
| Extremista ATK | 57.6 | 1 | 173 | 26 | 55 | 82 |
| Extremista DEF | 25.0 | 1 | 120 | 14 | 20 | 32 |
| Extremista ASPD | 45.6 | 1 | 160 | 17 | 37 | 70 |
| Extremista REF | 30.3 | 1 | 121 | 14 | 24 | 39 |
| Velocista | 28.8 | 1 | 124 | 13 | 24 | 38 |
| Berserker | 64.7 | 1 | 183 | 39 | 66 | 88 |
| Guardian | 20.8 | 1 | 142 | 10 | 17 | 28 |
| Estratega | 30.2 | 1 | 136 | 12 | 24 | 44 |
| Gladiador | 46.5 | 1 | 169 | 18 | 43 | 69 |
| Magus | 43.7 | 1 | 141 | 18 | 41 | 66 |

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
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 157 | 1003 | 15.7% |
| Asesino | 55 | 681 | 8.1% |
| Esquivo | 501 | 822 | 60.9% |
| Equilibrado | 283 | 1073 | 26.4% |
| Extremista ATK | 97 | 664 | 14.6% |
| Extremista DEF | 455 | 1258 | 36.2% |
| Extremista ASPD | 139 | 760 | 18.3% |
| Extremista REF | 732 | 980 | 74.7% |
| Velocista | 103 | 854 | 12.1% |
| Berserker | 138 | 833 | 16.6% |
| Guardian | 272 | 1539 | 17.7% |
| Estratega | 633 | 935 | 67.7% |
| Gladiador | 316 | 645 | 49.0% |
| Magus | 285 | 775 | 36.8% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 22 | 52 | 51 | 52 | 15 | 17 | 12 | 12 | 99 | 16 | 42 | 16 | 10 | 20 |
| 5 | 36 | 58 | 55 | 57 | 24 | 28 | 20 | 20 | 103 | 25 | 55 | 23 | 21 | 28 |
| 10 | 37 | 58 | 54 | 58 | 24 | 31 | 20 | 20 | 103 | 25 | 55 | 22 | 21 | 27 |
| 15 | 37 | 58 | 54 | 58 | 24 | 32 | 20 | 20 | 104 | 25 | 55 | 22 | 21 | 28 |
| 20 | 37 | 58 | 55 | 58 | 24 | 32 | 20 | 20 | 104 | 25 | 55 | 22 | 21 | 28 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 93.8% | 76.0% | 72.7% | 68.8% | 50.0% | 70.6% | 46.2% | 95.8% | 87.0% | 77.3% | 50.0% | 44.8% | 66.7% |
| Asesino | 6.3% | 50.0% | 50.0% | 38.5% | 13.3% | 38.9% | 25.0% | 9.5% | 57.1% | 18.2% | 33.3% | 17.6% | 21.1% | 27.3% |
| Esquivo | 24.0% | 50.0% | 50.0% | 46.2% | 20.0% | 23.8% | 44.4% | 23.5% | 61.1% | 13.0% | 50.0% | 16.7% | 11.8% | 7.1% |
| Equilibrado | 27.3% | 61.5% | 53.8% | 50.0% | 42.1% | 11.1% | 18.2% | 21.1% | 76.0% | 29.2% | 27.8% | 31.6% | 25.0% | 29.2% |
| Extremista ATK | 31.3% | 86.7% | 80.0% | 57.9% | 50.0% | 31.6% | 50.0% | 66.7% | 91.7% | 40.0% | 31.3% | 47.6% | 71.4% | 42.1% |
| Extremista DEF | 50.0% | 61.1% | 76.2% | 88.9% | 68.4% | 50.0% | 57.1% | 60.0% | 100.0% | 76.9% | 57.9% | 60.0% | 52.2% | 80.0% |
| Extremista ASPD | 29.4% | 75.0% | 55.6% | 81.8% | 50.0% | 42.9% | 50.0% | 58.3% | 81.5% | 25.0% | 45.5% | 46.7% | 42.9% | 66.7% |
| Extremista REF | 53.8% | 90.5% | 76.5% | 78.9% | 33.3% | 40.0% | 41.7% | 50.0% | 76.5% | 50.0% | 40.0% | 46.4% | 36.4% | 69.6% |
| Velocista | 4.2% | 42.9% | 38.9% | 24.0% | 8.3% | 0.0% | 18.5% | 23.5% | 50.0% | 10.7% | 19.4% | 12.5% | 16.7% | 25.0% |
| Berserker | 13.0% | 81.8% | 87.0% | 70.8% | 60.0% | 23.1% | 75.0% | 50.0% | 89.3% | 50.0% | 50.0% | 45.5% | 64.5% | 81.3% |
| Guardian | 22.7% | 66.7% | 50.0% | 72.2% | 68.8% | 42.1% | 54.5% | 60.0% | 80.6% | 50.0% | 50.0% | 28.6% | 27.3% | 44.4% |
| Estratega | 50.0% | 82.4% | 83.3% | 68.4% | 52.4% | 40.0% | 53.3% | 53.6% | 87.5% | 54.5% | 71.4% | 50.0% | 33.3% | 80.0% |
| Gladiador | 55.2% | 78.9% | 88.2% | 75.0% | 28.6% | 47.8% | 57.1% | 63.6% | 83.3% | 35.5% | 72.7% | 66.7% | 50.0% | 76.5% |
| Magus | 33.3% | 72.7% | 92.9% | 70.8% | 57.9% | 20.0% | 33.3% | 30.4% | 75.0% | 18.8% | 55.6% | 20.0% | 23.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.6% | 1065 |
| 16-30 | 50.1% | 863 |
| 31-50 | 49.4% | 591 |
| 51-70 | 47.3% | 366 |
| 71-100 | 54.4% | 1115 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 38.1% | 21 |
| 16-30 | 41.9% | 852 |
| 31-50 | 48.7% | 1508 |
| 51-70 | 51.7% | 601 |
| 71-100 | 58.0% | 1018 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 55.6% | 507 |
| 16-30 | 46.2% | 808 |
| 31-50 | 46.9% | 714 |
| 51-70 | 45.6% | 535 |
| 71-100 | 53.3% | 1436 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 915 |
| 16-30 | 49.0% | 1000 |
| 31-50 | 48.2% | 755 |
| 51-70 | 48.4% | 461 |
| 71-100 | 52.9% | 869 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.9% | 1632 |
| 16-30 | 52.5% | 1077 |
| 31-50 | 46.6% | 656 |
| 51-70 | 31.8% | 277 |
| 71-100 | 31.3% | 358 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.1% | 3193 |
| 16-30 | 47.2% | 479 |
| 31-50 | 51.9% | 239 |
| 51-70 | 54.5% | 77 |
| 71-100 | 75.0% | 12 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.1% | 3196 |
| 16-30 | 46.5% | 475 |
| 31-50 | 53.8% | 238 |
| 51-70 | 55.0% | 80 |
| 71-100 | 63.6% | 11 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 3218 |
| 16-30 | 47.5% | 457 |
| 31-50 | 52.3% | 256 |
| 51-70 | 60.3% | 58 |
| 71-100 | 54.5% | 11 |
