# Combat Simulation Report
Generated: 2026-08-07 18:06:56 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.3 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.8 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1964 (98.2%) |
| Timeouts (draws) | 36 (1.8%) |
| Avg rounds (all) | 5.5 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 220 |
| Avg rounds | 6.3 |
| P50 / P90 | 5 / 12 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 960/2000 |
| Winrate | 48.0% |
| Advantage over 50% | -2.0% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 220 | 314 | 70.1% |  |
| Asesino | 71 | 286 | 24.8% |  |
| Esquivo | 81 | 277 | 29.2% |  |
| Equilibrado | 126 | 313 | 40.3% |  |
| Extremista ATK | 177 | 304 | 58.2% |  |
| Extremista DEF | 199 | 264 | 75.4% | YES |
| Extremista ASPD | 148 | 282 | 52.5% |  |
| Extremista REF | 161 | 284 | 56.7% |  |
| Velocista | 49 | 290 | 16.9% |  |
| Berserker | 159 | 296 | 53.7% |  |
| Guardian | 158 | 288 | 54.9% |  |
| Estratega | 146 | 246 | 59.3% |  |
| Gladiador | 171 | 257 | 66.5% |  |
| Magus | 133 | 299 | 44.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 24.9 | - |
| Rests | 3.1 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.7 | - |
| Battles with item use | 23.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.9% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.22 (avg 47.38) |
| ASPD spread (stddev) | 31.02 (avg 53.02) |
| Equipment tier A | 130 (3.3%) |
| Equipment tier B | 1642 (41.0%) |
| Equipment tier C | 682 (17.1%) |
| Equipment tier D | 1166 (29.1%) |
| Equipment tier S | 380 (9.5%) |
| Level 100-199 | 983 |
| Level 200-299 | 1146 |
| Level 300-399 | 961 |
| Level 400-500 | 910 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 917 |
| cortante | 886 |
| desarmado | 403 |
| perforante | 1794 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1298 | 48.7% |
| ligera | 20 | 35.0% |
| media | 122 | 46.7% |
| total | 2560 | 50.9% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 96 | 42.7% |
| 3+ | 3904 | 50.2% |
Set bonus active: 50.2% (3904) vs inactive 42.7% (96)

### Amulet
With amulet: 50.3% (1625) vs without 49.7% (2375)

### Shield
With shield: 49.6% (2437) vs without 50.6% (1563)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 116 | 61.2% |
| B | 1478 | 57.8% |
| C | 612 | 44.9% |
| D | 1045 | 40.9% |
| S | 346 | 70.2% |
| desarmado | 403 | 31.8% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 860 | 49.9% |
| adamantita | 173 | 67.6% |
| bronce | 747 | 39.8% |
| desarmado | 403 | 31.8% |
| filo_estelar | 173 | 72.8% |
| hierro | 799 | 48.2% |
| mitril | 410 | 61.7% |
| titanio | 435 | 60.7% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 845 | 61.2% |
| mitico | 346 | 70.2% |
| ninguno | 403 | 31.8% |
| poco_comun | 2406 | 46.2% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 883 | 50.1% |
| adamantita | 188 | 48.9% |
| bronce | 901 | 49.8% |
| filo_estelar | 187 | 49.2% |
| hierro | 899 | 49.8% |
| mitril | 462 | 48.3% |
| ninguno | 1 | 0.0% |
| titanio | 479 | 52.8% |

### Nature by level bracket
- **100-199**: contundente: 227, cortante: 226, desarmado: 90, perforante: 440
- **200-299**: contundente: 254, cortante: 250, desarmado: 118, perforante: 524
- **300-399**: contundente: 222, cortante: 211, desarmado: 100, perforante: 428
- **400-500**: contundente: 214, cortante: 199, desarmado: 95, perforante: 402

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 48.3% | 945 | 50.5% | 3055 | -2.3pp |
| d_fulgor | 47.8% | 951 | 50.6% | 3049 | -2.8pp |
| r_fulgor | 47.8% | 946 | 50.7% | 3054 | -2.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 24.7 | 1 | 125 | 13 | 21 | 32 |
| Asesino | 38.0 | 1 | 143 | 9 | 29 | 59 |
| Esquivo | 27.3 | 1 | 115 | 16 | 22 | 34 |
| Equilibrado | 36.4 | 1 | 160 | 16 | 33 | 50 |
| Extremista ATK | 62.2 | 1 | 180 | 33 | 64 | 86 |
| Extremista DEF | 25.0 | 1 | 137 | 13 | 22 | 34 |
| Extremista ASPD | 46.4 | 1 | 150 | 23 | 39 | 69 |
| Extremista REF | 34.6 | 1 | 148 | 17 | 32 | 46 |
| Velocista | 28.0 | 3 | 120 | 14 | 24 | 38 |
| Berserker | 62.9 | 1 | 185 | 39 | 65 | 85 |
| Guardian | 25.2 | 1 | 129 | 12 | 23 | 33 |
| Estratega | 32.2 | 1 | 135 | 15 | 27 | 46 |
| Gladiador | 49.0 | 1 | 164 | 20 | 45 | 72 |
| Magus | 43.0 | 1 | 171 | 16 | 37 | 63 |

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
| Tanque | 188 | 1060 | 17.7% |
| Asesino | 49 | 719 | 6.8% |
| Esquivo | 520 | 882 | 59.0% |
| Equilibrado | 246 | 1057 | 23.3% |
| Extremista ATK | 138 | 728 | 19.0% |
| Extremista DEF | 271 | 894 | 30.3% |
| Extremista ASPD | 143 | 693 | 20.6% |
| Extremista REF | 677 | 867 | 78.1% |
| Velocista | 139 | 776 | 17.9% |
| Berserker | 132 | 709 | 18.6% |
| Guardian | 207 | 1284 | 16.1% |
| Estratega | 536 | 743 | 72.1% |
| Gladiador | 245 | 498 | 49.2% |
| Magus | 186 | 713 | 26.1% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 19 | 41 | 57 | 55 | 15 | 16 | 13 | 11 | 98 | 16 | 44 | 14 | 12 | 21 |
| 5 | 34 | 45 | 62 | 63 | 24 | 29 | 20 | 18 | 102 | 24 | 57 | 23 | 22 | 29 |
| 10 | 34 | 45 | 62 | 63 | 24 | 31 | 21 | 18 | 102 | 24 | 57 | 21 | 22 | 28 |
| 15 | 35 | 45 | 62 | 63 | 24 | 32 | 21 | 18 | 102 | 24 | 57 | 22 | 22 | 29 |
| 20 | 35 | 45 | 62 | 63 | 24 | 33 | 21 | 18 | 102 | 24 | 58 | 22 | 22 | 29 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 87.5% | 84.0% | 76.5% | 77.8% | 68.4% | 52.4% | 65.0% | 91.3% | 78.3% | 60.7% | 61.5% | 55.6% | 64.7% |
| Asesino | 12.5% | 50.0% | 52.6% | 50.0% | 14.3% | 0.0% | 12.5% | 13.0% | 73.9% | 20.0% | 19.0% | 0.0% | 20.0% | 23.1% |
| Esquivo | 16.0% | 47.4% | 50.0% | 34.8% | 20.0% | 11.1% | 18.8% | 33.3% | 29.4% | 31.3% | 33.3% | 17.6% | 6.3% | 33.3% |
| Equilibrado | 23.5% | 50.0% | 65.2% | 50.0% | 37.5% | 37.5% | 44.8% | 27.3% | 71.4% | 29.4% | 31.6% | 33.3% | 16.7% | 34.8% |
| Extremista ATK | 22.2% | 85.7% | 80.0% | 62.5% | 50.0% | 30.4% | 76.9% | 44.4% | 88.2% | 57.7% | 50.0% | 47.1% | 45.0% | 62.5% |
| Extremista DEF | 31.6% | 100.0% | 88.9% | 62.5% | 69.6% | 50.0% | 86.4% | 66.7% | 95.7% | 80.0% | 87.5% | 60.0% | 83.3% | 80.0% |
| Extremista ASPD | 47.6% | 87.5% | 81.3% | 55.2% | 23.1% | 13.6% | 50.0% | 64.7% | 91.3% | 41.2% | 31.6% | 41.2% | 20.0% | 80.0% |
| Extremista REF | 35.0% | 87.0% | 66.7% | 72.7% | 55.6% | 33.3% | 35.3% | 50.0% | 96.0% | 52.2% | 45.0% | 57.9% | 18.2% | 72.2% |
| Velocista | 8.7% | 26.1% | 70.6% | 28.6% | 11.8% | 4.3% | 8.7% | 4.0% | 50.0% | 8.0% | 4.5% | 6.3% | 9.5% | 22.7% |
| Berserker | 21.7% | 80.0% | 68.8% | 70.6% | 42.3% | 20.0% | 58.8% | 47.8% | 92.0% | 50.0% | 56.0% | 66.7% | 33.3% | 62.5% |
| Guardian | 39.3% | 81.0% | 66.7% | 68.4% | 50.0% | 12.5% | 68.4% | 55.0% | 95.5% | 44.0% | 50.0% | 42.3% | 35.3% | 60.0% |
| Estratega | 38.5% | 100.0% | 82.4% | 66.7% | 52.9% | 40.0% | 52.9% | 42.1% | 93.8% | 33.3% | 57.7% | 50.0% | 57.1% | 75.0% |
| Gladiador | 44.4% | 80.0% | 93.8% | 83.3% | 55.0% | 16.7% | 80.0% | 81.8% | 90.5% | 66.7% | 64.7% | 42.9% | 50.0% | 87.0% |
| Magus | 35.3% | 76.9% | 66.7% | 65.2% | 37.5% | 20.0% | 20.0% | 27.8% | 77.3% | 37.5% | 40.0% | 25.0% | 13.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.1% | 661 |
| 16-30 | 51.1% | 1059 |
| 31-50 | 48.1% | 725 |
| 51-70 | 46.4% | 392 |
| 71-100 | 53.5% | 1163 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.1% | 36 |
| 16-30 | 39.4% | 851 |
| 31-50 | 47.8% | 1519 |
| 51-70 | 52.5% | 609 |
| 71-100 | 61.4% | 985 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.2% | 477 |
| 16-30 | 50.1% | 820 |
| 31-50 | 45.7% | 761 |
| 51-70 | 45.5% | 563 |
| 71-100 | 51.9% | 1379 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 943 |
| 16-30 | 47.4% | 1010 |
| 31-50 | 48.7% | 706 |
| 51-70 | 50.3% | 487 |
| 71-100 | 53.5% | 854 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.6% | 1599 |
| 16-30 | 53.0% | 1108 |
| 31-50 | 47.9% | 620 |
| 51-70 | 35.0% | 300 |
| 71-100 | 28.2% | 373 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3261 |
| 16-30 | 45.1% | 439 |
| 31-50 | 53.9% | 230 |
| 51-70 | 57.8% | 64 |
| 71-100 | 66.7% | 6 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3264 |
| 16-30 | 43.3% | 436 |
| 31-50 | 54.7% | 234 |
| 51-70 | 62.9% | 62 |
| 71-100 | 100.0% | 4 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.8% | 3267 |
| 16-30 | 47.8% | 431 |
| 31-50 | 53.0% | 236 |
| 51-70 | 63.3% | 60 |
| 71-100 | 50.0% | 6 |
