# Combat Simulation Report
Generated: 2026-08-07 18:57:44 | 5000 simulations | Max 20 rounds

Config: numSims=5000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.3 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 5000 |
| KO victories | 4927 (98.5%) |
| Timeouts (draws) | 73 (1.5%) |
| Avg rounds (all) | 5.1 |
| Avg rounds (KO only) | 4.8 |
| Rounds P50 / P90 / Max | 4 / 9 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 609 |
| Avg rounds | 5.3 |
| P50 / P90 | 4 / 10 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 2339/5000 |
| Winrate | 46.8% |
| Advantage over 50% | -3.2% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 404 | 597 | 67.7% |  |
| Asesino | 197 | 613 | 32.1% |  |
| Esquivo | 172 | 573 | 30.0% |  |
| Equilibrado | 233 | 589 | 39.6% |  |
| Extremista ATK | 386 | 648 | 59.6% |  |
| Extremista DEF | 409 | 562 | 72.8% | YES |
| Extremista ASPD | 348 | 613 | 56.8% |  |
| Extremista REF | 344 | 584 | 58.9% |  |
| Velocista | 110 | 585 | 18.8% |  |
| Berserker | 318 | 575 | 55.3% |  |
| Guardian | 309 | 588 | 52.6% |  |
| Estratega | 348 | 560 | 62.1% |  |
| Gladiador | 401 | 624 | 64.3% |  |
| Magus | 266 | 585 | 45.5% |  |
| Matatanques | 316 | 558 | 56.6% |  |
| Cazador | 95 | 547 | 17.4% |  |
| Rompescudos | 344 | 599 | 57.4% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 21.8 | - |
| Rests | 2.8 | 2 |
| Advances | 3.7 | - |
| Retreats | 0.6 | - |
| Battles with item use | 21.6% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.81 (avg 53.04) |
| ASPD spread (stddev) | 30.77 (avg 54.25) |
| Equipment tier A | 328 (3.3%) |
| Equipment tier B | 4214 (42.1%) |
| Equipment tier C | 1675 (16.8%) |
| Equipment tier D | 2874 (28.7%) |
| Equipment tier S | 909 (9.1%) |
| Level 100-199 | 2442 |
| Level 200-299 | 2722 |
| Level 300-399 | 2503 |
| Level 400-500 | 2333 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 2197 |
| cortante | 2253 |
| desarmado | 995 |
| perforante | 4555 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 3172 | 49.8% |
| ligera | 47 | 55.3% |
| media | 315 | 47.0% |
| total | 6466 | 50.2% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 243 | 46.5% |
| 3+ | 9757 | 50.1% |
Set bonus active: 50.1% (9757) vs inactive 46.5% (243)

### Amulet
With amulet: 50.1% (3986) vs without 50.0% (6014)

### Shield
With shield: 50.4% (6015) vs without 49.3% (3985)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 303 | 64.4% |
| B | 3800 | 54.6% |
| C | 1495 | 46.4% |
| D | 2597 | 43.2% |
| S | 810 | 71.2% |
| desarmado | 995 | 33.9% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 2004 | 49.7% |
| adamantita | 398 | 69.6% |
| bronce | 1987 | 42.4% |
| desarmado | 995 | 33.9% |
| filo_estelar | 412 | 72.8% |
| hierro | 2019 | 47.8% |
| mitril | 1115 | 60.6% |
| titanio | 1070 | 56.7% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 2185 | 58.7% |
| mitico | 810 | 71.2% |
| ninguno | 995 | 33.9% |
| poco_comun | 6010 | 46.6% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 2260 | 50.6% |
| adamantita | 465 | 46.2% |
| bronce | 2212 | 50.3% |
| filo_estelar | 441 | 51.9% |
| hierro | 2133 | 49.9% |
| mitril | 1217 | 49.1% |
| titanio | 1272 | 50.2% |

### Nature by level bracket
- **100-199**: contundente: 534, cortante: 565, desarmado: 240, perforante: 1103
- **200-299**: contundente: 588, cortante: 618, desarmado: 268, perforante: 1248
- **300-399**: contundente: 550, cortante: 560, desarmado: 266, perforante: 1127
- **400-500**: contundente: 525, cortante: 510, desarmado: 221, perforante: 1077

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 47.7% | 2518 | 50.8% | 7482 | -3.1pp |
| d_fulgor | 47.3% | 2516 | 50.9% | 7484 | -3.6pp |
| r_fulgor | 48.1% | 2489 | 50.6% | 7511 | -2.5pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 25.6 | 1 | 146 | 12 | 22 | 35 |
| Asesino | 46.2 | 1 | 158 | 13 | 40 | 74 |
| Esquivo | 27.7 | 1 | 141 | 16 | 23 | 35 |
| Equilibrado | 33.3 | 1 | 149 | 18 | 29 | 42 |
| Extremista ATK | 58.5 | 1 | 175 | 24 | 59 | 87 |
| Extremista DEF | 24.0 | 0 | 148 | 12 | 20 | 31 |
| Extremista ASPD | 50.3 | 1 | 174 | 22 | 43 | 72 |
| Extremista REF | 32.8 | 1 | 144 | 16 | 29 | 44 |
| Velocista | 29.7 | 0 | 125 | 17 | 26 | 38 |
| Berserker | 59.3 | 1 | 181 | 28 | 62 | 82 |
| Guardian | 24.4 | 0 | 143 | 13 | 23 | 33 |
| Estratega | 34.1 | 1 | 146 | 17 | 29 | 48 |
| Gladiador | 50.9 | 1 | 176 | 18 | 49 | 78 |
| Magus | 45.6 | 1 | 163 | 18 | 38 | 71 |
| Matatanques | 48.1 | 1 | 155 | 17 | 42 | 71 |
| Cazador | 46.9 | 1 | 147 | 18 | 38 | 72 |
| Rompescudos | 54.5 | 1 | 163 | 24 | 53 | 80 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 1 | 1 | 100.0% |
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
| Gladiador | 7 | 7 | 100.0% |
| Magus | 0 | 0 | 0.0% |
| Matatanques | 0 | 0 | 0.0% |
| Cazador | 0 | 0 | 0.0% |
| Rompescudos | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 249 | 2006 | 12.4% |
| Asesino | 154 | 1440 | 10.7% |
| Esquivo | 896 | 1608 | 55.7% |
| Equilibrado | 476 | 1861 | 25.6% |
| Extremista ATK | 164 | 1413 | 11.6% |
| Extremista DEF | 497 | 1812 | 27.4% |
| Extremista ASPD | 211 | 1408 | 15.0% |
| Extremista REF | 1243 | 1573 | 79.0% |
| Velocista | 243 | 1611 | 15.1% |
| Berserker | 144 | 1257 | 11.5% |
| Guardian | 233 | 2450 | 9.5% |
| Estratega | 967 | 1444 | 67.0% |
| Gladiador | 435 | 1207 | 36.0% |
| Magus | 318 | 1362 | 23.3% |
| Matatanques | 195 | 1497 | 13.0% |
| Cazador | 105 | 972 | 10.8% |
| Rompescudos | 456 | 1322 | 34.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus | Matatanques | Cazador | Rompescudos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 23 | 47 | 57 | 51 | 13 | 15 | 13 | 12 | 100 | 14 | 44 | 14 | 11 | 22 | 27 | 83 | 14 |
| 5 | 36 | 52 | 61 | 58 | 22 | 25 | 21 | 18 | 105 | 23 | 56 | 22 | 22 | 29 | 36 | 89 | 22 |
| 10 | 37 | 51 | 61 | 58 | 23 | 28 | 21 | 17 | 105 | 23 | 55 | 22 | 22 | 29 | 36 | 89 | 21 |
| 15 | 38 | 51 | 61 | 58 | 23 | 30 | 21 | 17 | 105 | 23 | 56 | 22 | 22 | 29 | 36 | 89 | 21 |
| 20 | 38 | 51 | 61 | 58 | 23 | 30 | 21 | 17 | 105 | 23 | 56 | 22 | 22 | 29 | 36 | 89 | 21 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus | vs Matatanques | vs Cazador | vs Rompescudos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 81.1% | 78.9% | 90.6% | 58.7% | 25.6% | 77.1% | 58.6% | 90.6% | 79.5% | 56.7% | 38.2% | 48.6% | 82.8% | 71.9% | 100.0% | 65.6% |
| Asesino | 18.9% | 50.0% | 65.6% | 35.7% | 13.6% | 13.9% | 24.1% | 39.3% | 80.0% | 27.6% | 20.0% | 22.2% | 20.9% | 28.3% | 19.4% | 73.1% | 18.6% |
| Esquivo | 21.1% | 34.4% | 50.0% | 51.6% | 22.5% | 11.8% | 17.9% | 21.6% | 80.6% | 14.7% | 48.3% | 15.2% | 14.7% | 17.1% | 21.2% | 61.5% | 25.0% |
| Equilibrado | 9.4% | 64.3% | 48.4% | 50.0% | 28.9% | 17.9% | 34.2% | 23.4% | 80.8% | 36.8% | 33.3% | 24.0% | 30.0% | 57.7% | 37.5% | 71.4% | 32.5% |
| Extremista ATK | 41.3% | 86.4% | 77.5% | 71.1% | 50.0% | 31.0% | 56.3% | 48.7% | 83.7% | 52.2% | 57.1% | 58.8% | 53.1% | 53.3% | 42.1% | 90.9% | 53.8% |
| Extremista DEF | 74.4% | 86.1% | 88.2% | 82.1% | 69.0% | 50.0% | 62.1% | 53.5% | 96.4% | 71.4% | 60.0% | 67.9% | 59.4% | 71.1% | 82.1% | 94.4% | 72.7% |
| Extremista ASPD | 22.9% | 75.9% | 82.1% | 65.8% | 43.8% | 37.9% | 50.0% | 55.6% | 95.1% | 50.0% | 48.7% | 63.9% | 34.7% | 66.7% | 51.2% | 80.0% | 61.8% |
| Extremista REF | 41.4% | 60.7% | 78.4% | 76.6% | 51.3% | 46.5% | 44.4% | 50.0% | 85.3% | 33.3% | 69.0% | 51.9% | 41.7% | 66.7% | 58.3% | 90.0% | 43.8% |
| Velocista | 9.4% | 20.0% | 19.4% | 19.2% | 16.3% | 3.6% | 4.9% | 14.7% | 50.0% | 15.2% | 19.0% | 7.7% | 9.1% | 25.8% | 12.2% | 30.8% | 31.4% |
| Berserker | 20.5% | 72.4% | 85.3% | 63.2% | 47.8% | 28.6% | 50.0% | 66.7% | 84.8% | 50.0% | 43.3% | 53.3% | 39.5% | 74.2% | 51.9% | 80.0% | 46.2% |
| Guardian | 43.3% | 80.0% | 51.7% | 66.7% | 42.9% | 40.0% | 51.3% | 31.0% | 81.0% | 56.7% | 50.0% | 27.9% | 31.4% | 48.8% | 51.5% | 100.0% | 34.4% |
| Estratega | 61.8% | 77.8% | 84.8% | 76.0% | 41.2% | 32.1% | 36.1% | 48.1% | 92.3% | 46.7% | 72.1% | 50.0% | 55.3% | 74.3% | 55.3% | 100.0% | 52.8% |
| Gladiador | 51.4% | 79.1% | 85.3% | 70.0% | 46.9% | 40.6% | 65.3% | 58.3% | 90.9% | 60.5% | 68.6% | 44.7% | 50.0% | 72.7% | 57.1% | 100.0% | 52.8% |
| Magus | 17.2% | 71.7% | 82.9% | 42.3% | 46.7% | 28.9% | 33.3% | 33.3% | 74.2% | 25.8% | 51.2% | 25.7% | 27.3% | 50.0% | 38.9% | 81.5% | 39.0% |
| Matatanques | 28.1% | 80.6% | 78.8% | 62.5% | 57.9% | 17.9% | 48.8% | 41.7% | 87.8% | 48.1% | 48.5% | 44.7% | 42.9% | 61.1% | 50.0% | 94.1% | 58.3% |
| Cazador | 0.0% | 26.9% | 38.5% | 28.6% | 9.1% | 5.6% | 20.0% | 10.0% | 69.2% | 20.0% | 0.0% | 0.0% | 0.0% | 18.5% | 5.9% | 50.0% | 6.7% |
| Rompescudos | 34.4% | 81.4% | 75.0% | 67.5% | 46.2% | 27.3% | 38.2% | 56.3% | 68.6% | 53.8% | 65.6% | 47.2% | 47.2% | 61.0% | 41.7% | 93.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.0% | 1377 |
| 16-30 | 48.7% | 2151 |
| 31-50 | 49.5% | 1773 |
| 51-70 | 47.9% | 1109 |
| 71-100 | 52.5% | 3590 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.7% | 84 |
| 16-30 | 43.1% | 2318 |
| 31-50 | 47.7% | 4095 |
| 51-70 | 53.5% | 1471 |
| 71-100 | 60.4% | 2032 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.7% | 1052 |
| 16-30 | 47.6% | 2009 |
| 31-50 | 44.6% | 1953 |
| 51-70 | 46.9% | 1332 |
| 71-100 | 53.4% | 3654 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.1% | 2317 |
| 16-30 | 46.7% | 2691 |
| 31-50 | 47.4% | 1969 |
| 51-70 | 46.5% | 1086 |
| 71-100 | 56.6% | 1937 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.1% | 3983 |
| 16-30 | 52.9% | 2678 |
| 31-50 | 48.5% | 1636 |
| 51-70 | 31.6% | 725 |
| 71-100 | 25.2% | 978 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 7987 |
| 16-30 | 46.4% | 1197 |
| 31-50 | 47.7% | 640 |
| 51-70 | 56.3% | 160 |
| 71-100 | 75.0% | 16 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 8018 |
| 16-30 | 46.6% | 1159 |
| 31-50 | 47.8% | 644 |
| 51-70 | 53.3% | 169 |
| 71-100 | 90.0% | 10 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 8022 |
| 16-30 | 47.0% | 1167 |
| 31-50 | 48.2% | 629 |
| 51-70 | 54.4% | 169 |
| 71-100 | 69.2% | 13 |
