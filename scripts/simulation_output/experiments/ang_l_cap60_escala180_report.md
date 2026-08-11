# Combat Simulation Report
Generated: 2026-08-07 18:09:32 | 2000 simulations | Max 20 rounds

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
| KO victories | 1953 (97.7%) |
| Timeouts (draws) | 47 (2.3%) |
| Avg rounds (all) | 5.5 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 252 |
| Avg rounds | 6.1 |
| P50 / P90 | 5 / 11 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 942/2000 |
| Winrate | 47.1% |
| Advantage over 50% | -2.9% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 216 | 313 | 69.0% | YES |
| Asesino | 89 | 319 | 27.9% |  |
| Esquivo | 80 | 270 | 29.6% |  |
| Equilibrado | 106 | 277 | 38.3% |  |
| Extremista ATK | 161 | 287 | 56.1% |  |
| Extremista DEF | 188 | 276 | 68.1% |  |
| Extremista ASPD | 170 | 298 | 57.0% |  |
| Extremista REF | 146 | 244 | 59.8% |  |
| Velocista | 50 | 296 | 16.9% |  |
| Berserker | 163 | 288 | 56.6% |  |
| Guardian | 141 | 283 | 49.8% |  |
| Estratega | 188 | 304 | 61.8% |  |
| Gladiador | 159 | 251 | 63.3% |  |
| Magus | 143 | 294 | 48.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 28.2 | - |
| Rests | 3.1 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.7 | - |
| Battles with item use | 25.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.3% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.30 (avg 47.78) |
| ASPD spread (stddev) | 31.34 (avg 53.50) |
| Equipment tier A | 129 (3.2%) |
| Equipment tier B | 1646 (41.1%) |
| Equipment tier C | 680 (17.0%) |
| Equipment tier D | 1160 (29.0%) |
| Equipment tier S | 385 (9.6%) |
| Level 100-199 | 970 |
| Level 200-299 | 1137 |
| Level 300-399 | 970 |
| Level 400-500 | 923 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 883 |
| cortante | 917 |
| desarmado | 389 |
| perforante | 1811 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1233 | 48.7% |
| ligera | 21 | 38.1% |
| media | 111 | 48.6% |
| total | 2635 | 50.8% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 90 | 34.4% |
| 3+ | 3910 | 50.4% |
Set bonus active: 50.4% (3910) vs inactive 34.4% (90)

### Amulet
With amulet: 50.0% (1603) vs without 50.0% (2397)

### Shield
With shield: 49.8% (2417) vs without 50.3% (1583)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 120 | 65.0% |
| B | 1487 | 54.3% |
| C | 616 | 48.4% |
| D | 1048 | 41.1% |
| S | 340 | 74.4% |
| desarmado | 389 | 34.2% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 831 | 50.3% |
| adamantita | 181 | 71.3% |
| bronce | 795 | 41.5% |
| desarmado | 389 | 34.2% |
| filo_estelar | 159 | 78.0% |
| hierro | 776 | 46.3% |
| mitril | 429 | 59.9% |
| titanio | 440 | 56.8% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 869 | 58.3% |
| mitico | 340 | 74.4% |
| ninguno | 389 | 34.2% |
| poco_comun | 2402 | 46.1% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 914 | 49.6% |
| adamantita | 197 | 49.7% |
| bronce | 890 | 51.3% |
| filo_estelar | 192 | 49.0% |
| hierro | 877 | 48.9% |
| mitril | 457 | 51.6% |
| ninguno | 1 | 100.0% |
| titanio | 472 | 49.2% |

### Nature by level bracket
- **100-199**: contundente: 203, cortante: 211, desarmado: 89, perforante: 467
- **200-299**: contundente: 251, cortante: 277, desarmado: 112, perforante: 497
- **300-399**: contundente: 191, cortante: 224, desarmado: 97, perforante: 458
- **400-500**: contundente: 238, cortante: 205, desarmado: 91, perforante: 389

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 48.9% | 978 | 50.4% | 3022 | -1.5pp |
| d_fulgor | 48.1% | 968 | 50.6% | 3032 | -2.5pp |
| r_fulgor | 48.7% | 977 | 50.4% | 3023 | -1.7pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.1 | 1 | 132 | 10 | 24 | 38 |
| Asesino | 42.6 | 1 | 153 | 14 | 35 | 67 |
| Esquivo | 22.7 | 1 | 122 | 11 | 18 | 32 |
| Equilibrado | 35.7 | 1 | 144 | 14 | 32 | 50 |
| Extremista ATK | 55.8 | 1 | 180 | 22 | 54 | 82 |
| Extremista DEF | 24.5 | 1 | 157 | 11 | 21 | 33 |
| Extremista ASPD | 47.8 | 1 | 177 | 17 | 41 | 75 |
| Extremista REF | 30.1 | 1 | 138 | 11 | 25 | 41 |
| Velocista | 31.2 | 1 | 141 | 17 | 26 | 38 |
| Berserker | 59.8 | 1 | 166 | 27 | 64 | 82 |
| Guardian | 25.5 | 1 | 121 | 14 | 23 | 33 |
| Estratega | 36.1 | 1 | 131 | 21 | 32 | 47 |
| Gladiador | 53.1 | 1 | 162 | 24 | 50 | 77 |
| Magus | 47.2 | 1 | 149 | 24 | 45 | 67 |

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
| Tanque | 208 | 1067 | 19.5% |
| Asesino | 87 | 807 | 10.8% |
| Esquivo | 459 | 836 | 54.9% |
| Equilibrado | 204 | 831 | 24.5% |
| Extremista ATK | 146 | 694 | 21.0% |
| Extremista DEF | 215 | 963 | 22.3% |
| Extremista ASPD | 97 | 794 | 12.2% |
| Extremista REF | 691 | 827 | 83.6% |
| Velocista | 117 | 857 | 13.7% |
| Berserker | 147 | 727 | 20.2% |
| Guardian | 171 | 1246 | 13.7% |
| Estratega | 616 | 884 | 69.7% |
| Gladiador | 201 | 480 | 41.9% |
| Magus | 206 | 718 | 28.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 20 | 45 | 49 | 53 | 13 | 17 | 14 | 14 | 99 | 14 | 42 | 18 | 10 | 23 |
| 5 | 35 | 51 | 54 | 61 | 22 | 30 | 22 | 21 | 108 | 22 | 54 | 25 | 21 | 30 |
| 10 | 36 | 51 | 54 | 60 | 22 | 33 | 22 | 20 | 107 | 22 | 53 | 24 | 21 | 30 |
| 15 | 36 | 51 | 54 | 61 | 22 | 33 | 22 | 20 | 108 | 22 | 53 | 24 | 21 | 30 |
| 20 | 36 | 51 | 54 | 61 | 22 | 33 | 22 | 20 | 108 | 22 | 52 | 24 | 21 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 100.0% | 78.3% | 88.2% | 66.7% | 56.3% | 73.9% | 68.4% | 95.7% | 81.8% | 61.5% | 36.8% | 43.8% | 71.4% |
| Asesino | 0.0% | 50.0% | 62.5% | 48.0% | 21.4% | 0.0% | 8.3% | 7.7% | 69.6% | 15.0% | 19.2% | 29.6% | 13.0% | 33.3% |
| Esquivo | 21.7% | 37.5% | 50.0% | 27.8% | 13.6% | 25.0% | 22.7% | 23.5% | 80.0% | 11.1% | 38.1% | 23.1% | 23.1% | 29.4% |
| Equilibrado | 11.8% | 52.0% | 72.2% | 50.0% | 22.2% | 9.5% | 26.1% | 23.1% | 88.0% | 33.3% | 50.0% | 23.1% | 23.8% | 33.3% |
| Extremista ATK | 33.3% | 78.6% | 86.4% | 77.8% | 50.0% | 26.3% | 42.1% | 44.4% | 73.9% | 57.1% | 40.0% | 45.5% | 33.3% | 72.2% |
| Extremista DEF | 43.8% | 100.0% | 75.0% | 90.5% | 73.7% | 50.0% | 79.2% | 58.8% | 92.6% | 55.6% | 42.9% | 56.5% | 55.6% | 67.9% |
| Extremista ASPD | 26.1% | 91.7% | 77.3% | 73.9% | 57.9% | 20.8% | 50.0% | 41.7% | 92.9% | 46.2% | 38.5% | 47.6% | 33.3% | 70.8% |
| Extremista REF | 31.6% | 92.3% | 76.5% | 76.9% | 55.6% | 41.2% | 58.3% | 50.0% | 92.3% | 58.3% | 58.8% | 57.1% | 68.8% | 30.4% |
| Velocista | 4.3% | 30.4% | 20.0% | 12.0% | 26.1% | 7.4% | 7.1% | 7.7% | 50.0% | 5.6% | 25.0% | 8.7% | 15.0% | 25.0% |
| Berserker | 18.2% | 85.0% | 88.9% | 66.7% | 42.9% | 44.4% | 53.8% | 41.7% | 94.4% | 50.0% | 60.0% | 59.3% | 45.0% | 61.5% |
| Guardian | 38.5% | 80.8% | 61.9% | 50.0% | 60.0% | 57.1% | 61.5% | 41.2% | 75.0% | 40.0% | 50.0% | 24.0% | 27.8% | 41.2% |
| Estratega | 63.2% | 70.4% | 76.9% | 76.9% | 54.5% | 43.5% | 52.4% | 42.9% | 91.3% | 40.7% | 76.0% | 50.0% | 58.3% | 69.6% |
| Gladiador | 56.3% | 87.0% | 76.9% | 76.2% | 66.7% | 44.4% | 66.7% | 31.3% | 85.0% | 55.0% | 72.2% | 41.7% | 50.0% | 60.0% |
| Magus | 28.6% | 66.7% | 70.6% | 66.7% | 27.8% | 32.1% | 29.2% | 69.6% | 75.0% | 38.5% | 58.8% | 30.4% | 40.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.3% | 696 |
| 16-30 | 49.9% | 993 |
| 31-50 | 49.6% | 730 |
| 51-70 | 49.5% | 418 |
| 71-100 | 53.3% | 1163 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 31.4% | 35 |
| 16-30 | 40.5% | 869 |
| 31-50 | 48.0% | 1495 |
| 51-70 | 55.3% | 626 |
| 71-100 | 58.8% | 975 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 505 |
| 16-30 | 48.9% | 781 |
| 31-50 | 44.3% | 768 |
| 51-70 | 45.4% | 496 |
| 71-100 | 54.3% | 1450 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 940 |
| 16-30 | 49.2% | 1021 |
| 31-50 | 45.0% | 765 |
| 51-70 | 47.5% | 419 |
| 71-100 | 56.3% | 855 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.0% | 1622 |
| 16-30 | 52.7% | 1115 |
| 31-50 | 46.9% | 622 |
| 51-70 | 33.0% | 279 |
| 71-100 | 24.3% | 362 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 3206 |
| 16-30 | 48.1% | 462 |
| 31-50 | 49.6% | 252 |
| 51-70 | 62.8% | 78 |
| 71-100 | 50.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 3211 |
| 16-30 | 47.3% | 463 |
| 31-50 | 51.8% | 251 |
| 51-70 | 58.9% | 73 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 3220 |
| 16-30 | 46.5% | 441 |
| 31-50 | 55.6% | 266 |
| 51-70 | 49.2% | 65 |
| 71-100 | 62.5% | 8 |
