# Combat Simulation Report
Generated: 2026-08-07 18:56:05 | 5000 simulations | Max 20 rounds

Config: numSims=5000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.6 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 5000 |
| KO victories | 4926 (98.5%) |
| Timeouts (draws) | 74 (1.5%) |
| Avg rounds (all) | 5.1 |
| Avg rounds (KO only) | 4.8 |
| Rounds P50 / P90 / Max | 4 / 9 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 593 |
| Avg rounds | 5.6 |
| P50 / P90 | 4 / 10 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 2382/5000 |
| Winrate | 47.6% |
| Advantage over 50% | -2.4% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 357 | 551 | 64.8% |  |
| Asesino | 187 | 549 | 34.1% |  |
| Esquivo | 191 | 616 | 31.0% |  |
| Equilibrado | 230 | 599 | 38.4% |  |
| Extremista ATK | 332 | 565 | 58.8% |  |
| Extremista DEF | 405 | 564 | 71.8% | YES |
| Extremista ASPD | 329 | 595 | 55.3% |  |
| Extremista REF | 355 | 589 | 60.3% |  |
| Velocista | 103 | 600 | 17.2% |  |
| Berserker | 330 | 579 | 57.0% |  |
| Guardian | 365 | 653 | 55.9% |  |
| Estratega | 392 | 614 | 63.8% |  |
| Gladiador | 367 | 541 | 67.8% |  |
| Magus | 289 | 602 | 48.0% |  |
| Matatanques | 319 | 585 | 54.5% |  |
| Cazador | 94 | 601 | 15.6% |  |
| Rompescudos | 354 | 597 | 59.3% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 22.8 | - |
| Rests | 3.0 | 2 |
| Advances | 3.6 | - |
| Retreats | 0.6 | - |
| Battles with item use | 21.3% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.9% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.62 (avg 52.38) |
| ASPD spread (stddev) | 30.38 (avg 53.77) |
| Equipment tier A | 359 (3.6%) |
| Equipment tier B | 4148 (41.5%) |
| Equipment tier C | 1765 (17.6%) |
| Equipment tier D | 2860 (28.6%) |
| Equipment tier S | 868 (8.7%) |
| Level 100-199 | 2356 |
| Level 200-299 | 2803 |
| Level 300-399 | 2547 |
| Level 400-500 | 2294 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 2289 |
| cortante | 2323 |
| desarmado | 1014 |
| perforante | 4374 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 3237 | 49.9% |
| ligera | 45 | 46.7% |
| media | 352 | 46.0% |
| total | 6366 | 50.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 229 | 42.8% |
| 3+ | 9771 | 50.2% |
Set bonus active: 50.2% (9771) vs inactive 42.8% (229)

### Amulet
With amulet: 50.2% (4035) vs without 49.9% (5965)

### Shield
With shield: 50.5% (6028) vs without 49.2% (3972)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 314 | 62.4% |
| B | 3727 | 55.9% |
| C | 1597 | 47.3% |
| D | 2568 | 41.4% |
| S | 780 | 67.9% |
| desarmado | 1014 | 36.3% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 2066 | 50.2% |
| adamantita | 381 | 66.4% |
| bronce | 1995 | 43.1% |
| desarmado | 1014 | 36.3% |
| filo_estelar | 399 | 69.4% |
| hierro | 2026 | 46.0% |
| mitril | 1066 | 62.7% |
| titanio | 1053 | 57.3% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 2119 | 60.0% |
| mitico | 780 | 67.9% |
| ninguno | 1014 | 36.3% |
| poco_comun | 6087 | 46.5% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 2187 | 48.8% |
| adamantita | 471 | 48.6% |
| bronce | 2249 | 51.4% |
| filo_estelar | 447 | 49.9% |
| hierro | 2183 | 50.3% |
| mitril | 1205 | 48.9% |
| titanio | 1258 | 50.6% |

### Nature by level bracket
- **100-199**: contundente: 553, cortante: 525, desarmado: 240, perforante: 1038
- **200-299**: contundente: 627, cortante: 698, desarmado: 290, perforante: 1188
- **300-399**: contundente: 591, cortante: 586, desarmado: 246, perforante: 1124
- **400-500**: contundente: 518, cortante: 514, desarmado: 238, perforante: 1024

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 46.8% | 2426 | 51.0% | 7574 | -4.2pp |
| d_fulgor | 46.7% | 2403 | 51.0% | 7597 | -4.3pp |
| r_fulgor | 46.9% | 2407 | 51.0% | 7593 | -4.0pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 25.6 | 1 | 139 | 12 | 23 | 35 |
| Asesino | 51.1 | 1 | 169 | 21 | 46 | 73 |
| Esquivo | 26.6 | 1 | 122 | 14 | 24 | 34 |
| Equilibrado | 33.6 | 1 | 145 | 13 | 29 | 48 |
| Extremista ATK | 62.0 | 1 | 183 | 33 | 65 | 86 |
| Extremista DEF | 24.8 | 1 | 143 | 13 | 22 | 32 |
| Extremista ASPD | 50.2 | 1 | 160 | 26 | 45 | 75 |
| Extremista REF | 30.4 | 1 | 148 | 14 | 26 | 41 |
| Velocista | 27.5 | 1 | 134 | 15 | 23 | 35 |
| Berserker | 60.6 | 1 | 167 | 31 | 65 | 84 |
| Guardian | 25.5 | 1 | 137 | 14 | 22 | 33 |
| Estratega | 35.3 | 1 | 147 | 17 | 32 | 48 |
| Gladiador | 50.8 | 1 | 179 | 21 | 49 | 73 |
| Magus | 46.0 | 1 | 178 | 19 | 40 | 68 |
| Matatanques | 50.3 | 1 | 175 | 19 | 48 | 74 |
| Cazador | 47.8 | 1 | 174 | 18 | 38 | 72 |
| Rompescudos | 51.8 | 1 | 186 | 21 | 50 | 76 |

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
| Matatanques | 0 | 0 | 0.0% |
| Cazador | 0 | 0 | 0.0% |
| Rompescudos | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 267 | 1851 | 14.4% |
| Asesino | 103 | 1283 | 8.0% |
| Esquivo | 815 | 1563 | 52.1% |
| Equilibrado | 449 | 1927 | 23.3% |
| Extremista ATK | 193 | 1234 | 15.6% |
| Extremista DEF | 539 | 2136 | 25.2% |
| Extremista ASPD | 153 | 1301 | 11.8% |
| Extremista REF | 1340 | 1692 | 79.2% |
| Velocista | 251 | 1620 | 15.5% |
| Berserker | 186 | 1176 | 15.8% |
| Guardian | 400 | 2703 | 14.8% |
| Estratega | 992 | 1552 | 63.9% |
| Gladiador | 556 | 1174 | 47.4% |
| Magus | 348 | 1435 | 24.3% |
| Matatanques | 222 | 1641 | 13.5% |
| Cazador | 98 | 1067 | 9.2% |
| Rompescudos | 450 | 1337 | 33.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus | Matatanques | Cazador | Rompescudos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 43 | 53 | 54 | 12 | 17 | 15 | 9 | 100 | 14 | 44 | 15 | 11 | 23 | 24 | 84 | 14 |
| 5 | 38 | 48 | 61 | 60 | 22 | 30 | 23 | 16 | 105 | 23 | 55 | 22 | 22 | 30 | 33 | 87 | 22 |
| 10 | 39 | 48 | 60 | 60 | 22 | 32 | 23 | 16 | 105 | 23 | 54 | 22 | 22 | 30 | 33 | 87 | 23 |
| 15 | 39 | 48 | 61 | 60 | 22 | 33 | 23 | 16 | 105 | 23 | 54 | 22 | 22 | 30 | 33 | 87 | 23 |
| 20 | 39 | 48 | 61 | 60 | 22 | 33 | 23 | 16 | 106 | 23 | 55 | 22 | 22 | 30 | 33 | 87 | 23 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus | vs Matatanques | vs Cazador | vs Rompescudos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 83.3% | 75.0% | 81.0% | 62.1% | 46.9% | 67.7% | 51.9% | 92.9% | 69.0% | 47.1% | 30.6% | 36.7% | 85.7% | 75.7% | 93.9% | 50.0% |
| Asesino | 16.7% | 50.0% | 54.5% | 30.3% | 11.1% | 14.3% | 25.0% | 34.6% | 82.1% | 21.1% | 34.1% | 17.5% | 15.4% | 30.3% | 20.8% | 77.8% | 19.4% |
| Esquivo | 25.0% | 45.5% | 50.0% | 56.3% | 28.2% | 11.9% | 20.0% | 25.0% | 74.5% | 14.3% | 25.6% | 16.7% | 22.5% | 16.7% | 19.0% | 66.7% | 14.3% |
| Equilibrado | 19.0% | 69.7% | 43.8% | 50.0% | 38.9% | 15.9% | 37.1% | 23.7% | 73.3% | 28.1% | 20.5% | 41.9% | 22.2% | 39.0% | 33.3% | 86.8% | 27.0% |
| Extremista ATK | 37.9% | 88.9% | 71.8% | 61.1% | 50.0% | 36.0% | 46.2% | 42.9% | 85.3% | 51.4% | 55.0% | 47.5% | 33.3% | 80.8% | 52.9% | 91.1% | 55.2% |
| Extremista DEF | 53.1% | 85.7% | 88.1% | 84.1% | 64.0% | 50.0% | 75.8% | 69.4% | 92.1% | 78.8% | 72.7% | 44.8% | 50.0% | 69.0% | 60.5% | 96.6% | 72.7% |
| Extremista ASPD | 32.3% | 75.0% | 80.0% | 62.9% | 53.8% | 24.2% | 50.0% | 58.8% | 100.0% | 54.8% | 36.4% | 42.9% | 45.0% | 53.3% | 46.3% | 88.2% | 43.6% |
| Extremista REF | 48.1% | 65.4% | 75.0% | 76.3% | 57.1% | 27.8% | 41.2% | 50.0% | 92.3% | 57.6% | 52.5% | 62.9% | 36.4% | 72.5% | 54.5% | 97.1% | 52.1% |
| Velocista | 7.1% | 17.9% | 25.5% | 26.7% | 14.7% | 7.9% | 0.0% | 7.7% | 50.0% | 18.9% | 16.7% | 4.7% | 12.5% | 9.7% | 20.9% | 35.3% | 9.1% |
| Berserker | 31.0% | 78.9% | 85.7% | 71.9% | 48.6% | 21.2% | 45.2% | 42.4% | 81.1% | 50.0% | 45.9% | 39.4% | 45.2% | 72.5% | 57.1% | 93.9% | 46.7% |
| Guardian | 52.9% | 65.9% | 74.4% | 79.5% | 45.0% | 27.3% | 63.6% | 47.5% | 83.3% | 54.1% | 50.0% | 33.3% | 40.0% | 55.3% | 43.6% | 88.2% | 52.6% |
| Estratega | 69.4% | 82.5% | 83.3% | 58.1% | 52.5% | 55.2% | 57.1% | 37.1% | 95.3% | 60.6% | 66.7% | 50.0% | 36.4% | 62.1% | 61.4% | 93.3% | 63.9% |
| Gladiador | 63.3% | 84.6% | 77.5% | 77.8% | 66.7% | 50.0% | 55.0% | 63.6% | 87.5% | 54.8% | 60.0% | 63.6% | 50.0% | 76.9% | 67.6% | 97.1% | 58.1% |
| Magus | 14.3% | 69.7% | 83.3% | 61.0% | 19.2% | 31.0% | 46.7% | 27.5% | 90.3% | 27.5% | 44.7% | 37.9% | 23.1% | 50.0% | 45.5% | 90.2% | 37.5% |
| Matatanques | 24.3% | 79.2% | 81.0% | 66.7% | 47.1% | 39.5% | 53.7% | 45.5% | 79.1% | 42.9% | 56.4% | 38.6% | 32.4% | 54.5% | 50.0% | 94.4% | 38.5% |
| Cazador | 6.1% | 22.2% | 33.3% | 13.2% | 8.9% | 3.4% | 11.8% | 2.9% | 64.7% | 6.1% | 11.8% | 6.7% | 2.9% | 9.8% | 5.6% | 50.0% | 7.0% |
| Rompescudos | 50.0% | 80.6% | 85.7% | 73.0% | 44.8% | 27.3% | 56.4% | 47.9% | 90.9% | 53.3% | 47.4% | 36.1% | 41.9% | 62.5% | 61.5% | 93.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.7% | 1355 |
| 16-30 | 48.8% | 2295 |
| 31-50 | 49.3% | 1747 |
| 51-70 | 48.2% | 1083 |
| 71-100 | 52.9% | 3520 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.1% | 83 |
| 16-30 | 40.1% | 2281 |
| 31-50 | 49.7% | 4068 |
| 51-70 | 52.3% | 1443 |
| 71-100 | 60.1% | 2125 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.1% | 1019 |
| 16-30 | 46.1% | 2057 |
| 31-50 | 46.4% | 2010 |
| 51-70 | 47.1% | 1388 |
| 71-100 | 53.7% | 3526 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.1% | 2238 |
| 16-30 | 47.4% | 2719 |
| 31-50 | 47.6% | 1887 |
| 51-70 | 48.2% | 1116 |
| 71-100 | 56.5% | 2040 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 59.5% | 3810 |
| 16-30 | 51.9% | 2780 |
| 31-50 | 47.1% | 1649 |
| 51-70 | 34.0% | 724 |
| 71-100 | 25.7% | 1037 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 8049 |
| 16-30 | 44.7% | 1178 |
| 31-50 | 49.1% | 629 |
| 51-70 | 60.2% | 133 |
| 71-100 | 72.7% | 11 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 8061 |
| 16-30 | 45.0% | 1177 |
| 31-50 | 49.8% | 622 |
| 51-70 | 55.5% | 128 |
| 71-100 | 83.3% | 12 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 8073 |
| 16-30 | 43.7% | 1140 |
| 31-50 | 51.2% | 642 |
| 51-70 | 57.7% | 130 |
| 71-100 | 66.7% | 15 |
