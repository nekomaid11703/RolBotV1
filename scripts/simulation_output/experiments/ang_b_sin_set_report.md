# Combat Simulation Report
Generated: 2026-08-07 17:57:21 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.0 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.8 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1973 (98.7%) |
| Timeouts (draws) | 27 (1.3%) |
| Avg rounds (all) | 4.5 |
| Avg rounds (KO only) | 4.3 |
| Rounds P50 / P90 / Max | 3 / 8 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 225 |
| Avg rounds | 5.0 |
| P50 / P90 | 4 / 10 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 969/2000 |
| Winrate | 48.4% |
| Advantage over 50% | -1.6% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 233 | 305 | 76.4% |  |
| Asesino | 88 | 276 | 31.9% |  |
| Esquivo | 90 | 304 | 29.6% |  |
| Equilibrado | 133 | 278 | 47.8% |  |
| Extremista ATK | 136 | 293 | 46.4% |  |
| Extremista DEF | 214 | 274 | 78.1% | YES |
| Extremista ASPD | 131 | 274 | 47.8% |  |
| Extremista REF | 132 | 287 | 46.0% |  |
| Velocista | 86 | 311 | 27.7% |  |
| Berserker | 145 | 277 | 52.3% |  |
| Guardian | 169 | 279 | 60.6% |  |
| Estratega | 157 | 281 | 55.9% |  |
| Gladiador | 156 | 262 | 59.5% |  |
| Magus | 130 | 299 | 43.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.3 | 0 |
| Heal applied | 15.5 | - |
| Rests | 3.6 | 3 |
| Advances | 2.8 | - |
| Retreats | 0.5 | - |
| Battles with item use | 15.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.6% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.23 (avg 48.42) |
| ASPD spread (stddev) | 31.40 (avg 55.25) |
| Equipment tier A | 135 (3.4%) |
| Equipment tier B | 1700 (42.5%) |
| Equipment tier C | 653 (16.3%) |
| Equipment tier D | 1163 (29.1%) |
| Equipment tier S | 349 (8.7%) |
| Level 100-199 | 1067 |
| Level 200-299 | 1084 |
| Level 300-399 | 980 |
| Level 400-500 | 869 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 862 |
| cortante | 980 |
| desarmado | 377 |
| perforante | 1781 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1280 | 46.3% |
| ligera | 20 | 65.0% |
| media | 122 | 54.9% |
| total | 2578 | 51.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 108 | 50.9% |
| 3+ | 3892 | 50.0% |
Set bonus active: 0.0% (0) vs inactive 50.0% (4000)

### Amulet
With amulet: 49.9% (1613) vs without 50.1% (2387)

### Shield
With shield: 49.6% (2411) vs without 50.5% (1589)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 119 | 70.6% |
| B | 1563 | 56.1% |
| C | 579 | 42.5% |
| D | 1044 | 41.5% |
| S | 318 | 73.3% |
| desarmado | 377 | 33.7% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 806 | 48.9% |
| adamantita | 169 | 76.3% |
| bronce | 818 | 43.2% |
| desarmado | 377 | 33.7% |
| filo_estelar | 149 | 69.8% |
| hierro | 777 | 45.2% |
| mitril | 438 | 59.4% |
| titanio | 466 | 60.5% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 904 | 60.0% |
| mitico | 318 | 73.3% |
| ninguno | 377 | 33.7% |
| poco_comun | 2401 | 45.7% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 892 | 51.7% |
| adamantita | 189 | 49.7% |
| bronce | 818 | 49.4% |
| filo_estelar | 215 | 50.2% |
| hierro | 899 | 47.3% |
| mitril | 499 | 52.7% |
| titanio | 488 | 50.2% |

### Nature by level bracket
- **100-199**: contundente: 233, cortante: 253, desarmado: 102, perforante: 479
- **200-299**: contundente: 241, cortante: 264, desarmado: 119, perforante: 460
- **300-399**: contundente: 200, cortante: 237, desarmado: 83, perforante: 460
- **400-500**: contundente: 188, cortante: 226, desarmado: 73, perforante: 382

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 45.2% | 1010 | 51.6% | 2990 | -6.4pp |
| d_fulgor | 44.7% | 999 | 51.7% | 3001 | -7.0pp |
| r_fulgor | 45.4% | 996 | 51.5% | 3004 | -6.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 28.3 | 1 | 129 | 15 | 25 | 39 |
| Asesino | 58.5 | 1 | 182 | 23 | 60 | 88 |
| Esquivo | 28.9 | 1 | 139 | 16 | 25 | 38 |
| Equilibrado | 41.8 | 1 | 184 | 24 | 36 | 61 |
| Extremista ATK | 65.3 | 1 | 181 | 40 | 65 | 89 |
| Extremista DEF | 22.4 | 1 | 156 | 9 | 18 | 31 |
| Extremista ASPD | 54.1 | 1 | 185 | 29 | 54 | 77 |
| Extremista REF | 39.7 | 1 | 137 | 20 | 32 | 55 |
| Velocista | 35.1 | 1 | 128 | 17 | 31 | 48 |
| Berserker | 65.4 | 1 | 182 | 31 | 69 | 90 |
| Guardian | 26.4 | 1 | 126 | 13 | 24 | 35 |
| Estratega | 37.1 | 1 | 154 | 15 | 31 | 52 |
| Gladiador | 64.9 | 4 | 188 | 38 | 59 | 87 |
| Magus | 49.7 | 1 | 175 | 26 | 46 | 71 |

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
| Tanque | 162 | 770 | 21.0% |
| Asesino | 77 | 589 | 13.1% |
| Esquivo | 462 | 841 | 54.9% |
| Equilibrado | 307 | 939 | 32.7% |
| Extremista ATK | 115 | 742 | 15.5% |
| Extremista DEF | 291 | 738 | 39.4% |
| Extremista ASPD | 130 | 692 | 18.8% |
| Extremista REF | 544 | 794 | 68.5% |
| Velocista | 138 | 822 | 16.8% |
| Berserker | 112 | 641 | 17.5% |
| Guardian | 146 | 1028 | 14.2% |
| Estratega | 557 | 797 | 69.9% |
| Gladiador | 220 | 501 | 43.9% |
| Magus | 249 | 761 | 32.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 21 | 45 | 65 | 57 | 13 | 15 | 16 | 14 | 100 | 16 | 43 | 17 | 11 | 25 |
| 5 | 37 | 50 | 68 | 65 | 19 | 26 | 21 | 18 | 108 | 22 | 56 | 22 | 18 | 29 |
| 10 | 37 | 50 | 68 | 65 | 19 | 28 | 22 | 19 | 108 | 22 | 56 | 23 | 19 | 29 |
| 15 | 37 | 50 | 68 | 65 | 19 | 29 | 22 | 19 | 108 | 22 | 56 | 22 | 19 | 29 |
| 20 | 37 | 50 | 68 | 65 | 19 | 29 | 22 | 19 | 108 | 22 | 56 | 22 | 19 | 29 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 91.3% | 89.3% | 81.0% | 86.4% | 73.3% | 89.5% | 73.7% | 81.3% | 86.4% | 73.1% | 56.0% | 38.9% | 96.0% |
| Asesino | 8.7% | 50.0% | 66.7% | 33.3% | 29.2% | 0.0% | 33.3% | 40.0% | 57.9% | 38.5% | 22.2% | 33.3% | 30.4% | 25.0% |
| Esquivo | 10.7% | 33.3% | 50.0% | 31.3% | 33.3% | 10.7% | 41.4% | 38.9% | 54.2% | 30.0% | 5.3% | 20.0% | 18.8% | 34.8% |
| Equilibrado | 19.0% | 66.7% | 68.8% | 50.0% | 62.5% | 20.0% | 60.0% | 46.2% | 86.4% | 39.4% | 38.9% | 35.0% | 46.2% | 57.1% |
| Extremista ATK | 13.6% | 70.8% | 66.7% | 37.5% | 50.0% | 8.0% | 37.5% | 64.7% | 70.0% | 25.0% | 27.3% | 60.0% | 41.2% | 69.2% |
| Extremista DEF | 26.7% | 100.0% | 89.3% | 80.0% | 92.0% | 50.0% | 80.0% | 81.0% | 93.3% | 100.0% | 50.0% | 69.2% | 76.5% | 73.7% |
| Extremista ASPD | 10.5% | 66.7% | 58.6% | 40.0% | 62.5% | 20.0% | 50.0% | 55.6% | 78.3% | 28.6% | 35.3% | 50.0% | 44.4% | 52.9% |
| Extremista REF | 26.3% | 60.0% | 61.1% | 53.8% | 35.3% | 19.0% | 44.4% | 50.0% | 66.7% | 38.9% | 55.6% | 31.8% | 33.3% | 63.6% |
| Velocista | 18.8% | 42.1% | 45.8% | 13.6% | 30.0% | 6.7% | 21.7% | 33.3% | 50.0% | 12.0% | 26.3% | 9.1% | 28.6% | 26.7% |
| Berserker | 13.6% | 61.5% | 70.0% | 60.6% | 75.0% | 0.0% | 71.4% | 61.1% | 88.0% | 50.0% | 36.4% | 52.9% | 33.3% | 59.1% |
| Guardian | 26.9% | 77.8% | 94.7% | 61.1% | 72.7% | 50.0% | 64.7% | 44.4% | 73.7% | 63.6% | 50.0% | 55.0% | 50.0% | 63.2% |
| Estratega | 44.0% | 66.7% | 80.0% | 65.0% | 40.0% | 30.8% | 50.0% | 68.2% | 90.9% | 47.1% | 45.0% | 50.0% | 33.3% | 68.4% |
| Gladiador | 61.1% | 69.6% | 81.3% | 53.8% | 58.8% | 23.5% | 55.6% | 66.7% | 71.4% | 66.7% | 50.0% | 66.7% | 50.0% | 57.1% |
| Magus | 4.0% | 75.0% | 65.2% | 42.9% | 30.8% | 26.3% | 47.1% | 36.4% | 73.3% | 40.9% | 36.8% | 31.6% | 42.9% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.8% | 647 |
| 16-30 | 51.1% | 1010 |
| 31-50 | 46.9% | 710 |
| 51-70 | 51.0% | 443 |
| 71-100 | 51.8% | 1190 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.3% | 1341 |
| 16-30 | 46.1% | 945 |
| 31-50 | 57.4% | 659 |
| 51-70 | 54.7% | 285 |
| 71-100 | 70.5% | 770 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 62.4% | 450 |
| 16-30 | 47.0% | 773 |
| 31-50 | 45.2% | 732 |
| 51-70 | 45.0% | 515 |
| 71-100 | 51.8% | 1530 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.3% | 860 |
| 16-30 | 48.5% | 980 |
| 31-50 | 50.0% | 716 |
| 51-70 | 46.3% | 490 |
| 71-100 | 52.3% | 954 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1553 |
| 16-30 | 51.8% | 1057 |
| 31-50 | 53.0% | 628 |
| 51-70 | 43.4% | 320 |
| 71-100 | 37.8% | 442 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.1% | 3191 |
| 16-30 | 43.7% | 471 |
| 31-50 | 45.6% | 261 |
| 51-70 | 56.5% | 69 |
| 71-100 | 50.0% | 8 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.2% | 3206 |
| 16-30 | 43.7% | 474 |
| 31-50 | 46.3% | 255 |
| 51-70 | 50.0% | 60 |
| 71-100 | 60.0% | 5 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3200 |
| 16-30 | 44.3% | 476 |
| 31-50 | 45.8% | 262 |
| 51-70 | 62.5% | 56 |
| 71-100 | 50.0% | 6 |
