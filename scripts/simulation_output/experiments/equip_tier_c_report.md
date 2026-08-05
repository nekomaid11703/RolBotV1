# Combat Simulation Report
Generated: 2026-08-05 02:26:27 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 12.6 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 955 (95.5%) |
| Timeouts (draws) | 45 (4.5%) |
| Avg rounds (all) | 12.1 |
| Avg rounds (KO only) | 10.2 |
| Rounds P50 / P90 / Max | 7 / 27 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 278 |
| Avg rounds | 12.6 |
| P50 / P90 | 8 / 27 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 527/1000 |
| Winrate | 52.7% |
| Advantage over 50% | 2.7% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 90 | 154 | 58.4% |  |
| Asesino | 52 | 141 | 36.9% |  |
| Esquivo | 69 | 136 | 50.7% |  |
| Equilibrado | 68 | 131 | 51.9% |  |
| Extremista ATK | 64 | 143 | 44.8% |  |
| Extremista DEF | 71 | 150 | 47.3% |  |
| Extremista ASPD | 69 | 145 | 47.6% |  |
| Extremista REF | 62 | 154 | 40.3% |  |
| Velocista | 85 | 149 | 57.0% |  |
| Berserker | 49 | 139 | 35.3% |  |
| Guardian | 90 | 148 | 60.8% | YES |
| Estratega | 86 | 150 | 57.3% |  |
| Gladiador | 79 | 130 | 60.8% |  |
| Magus | 66 | 130 | 50.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.5 | 1 |
| Heal applied | 98.1 | - |
| Rests | 6.3 | 3 |
| Advances | 4.3 | - |
| Retreats | 0.2 | - |
| Battles with item use | 52.9% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.23 (avg 46.61) |
| ASPD spread (stddev) | 31.55 (avg 52.93) |
| Equipment tier C | 2000 (100.0%) |
| Level 100-199 | 501 |
| Level 200-299 | 569 |
| Level 300-399 | 464 |
| Level 400-500 | 466 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 596 |
| cortante | 607 |
| desarmado | 201 |
| perforante | 596 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 657 | 51.1% |
| ligera | 10 | 50.0% |
| media | 57 | 49.1% |
| total | 1276 | 49.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 53 | 67.9% |
| 3+ | 1947 | 49.5% |
Set bonus active: 49.5% (1947) vs inactive 67.9% (53)

### Amulet
With amulet: 52.7% (841) vs without 48.1% (1159)

### Shield
With shield: 50.4% (1229) vs without 49.4% (771)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| C | 1799 | 51.8% |
| desarmado | 201 | 34.3% |

### Nature by level bracket
- **100-199**: contundente: 139, cortante: 138, desarmado: 51, perforante: 173
- **200-299**: contundente: 180, cortante: 169, desarmado: 61, perforante: 159
- **300-399**: contundente: 136, cortante: 151, desarmado: 51, perforante: 126
- **400-500**: contundente: 141, cortante: 149, desarmado: 38, perforante: 138

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 38.0% | 461 | 53.6% | 1539 | -15.6pp |
| d_fulgor | 39.2% | 464 | 53.3% | 1536 | -14.0pp |
| r_fulgor | 38.2% | 456 | 53.5% | 1544 | -15.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 17.0 | 0 | 60 | 0 | 13 | 31 |
| Asesino | 52.1 | 0 | 97 | 46 | 47 | 59 |
| Esquivo | 13.4 | 0 | 57 | 0 | 7 | 25 |
| Equilibrado | 24.4 | 0 | 77 | 0 | 26 | 46 |
| Extremista ATK | 57.9 | 0 | 99 | 46 | 51 | 70 |
| Extremista DEF | 6.4 | 0 | 71 | 0 | 0 | 5 |
| Extremista ASPD | 52.1 | 9 | 94 | 46 | 49 | 64 |
| Extremista REF | 29.7 | 0 | 67 | 16 | 31 | 45 |
| Velocista | 24.0 | 0 | 58 | 10 | 21 | 39 |
| Berserker | 55.7 | 0 | 98 | 46 | 50 | 68 |
| Guardian | 10.8 | 0 | 51 | 0 | 0 | 21 |
| Estratega | 31.8 | 0 | 85 | 17 | 35 | 46 |
| Gladiador | 49.6 | 0 | 91 | 46 | 46 | 56 |
| Magus | 45.6 | 0 | 93 | 40 | 46 | 47 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 267 | 267 | 100.0% |
| Asesino | 357 | 357 | 100.0% |
| Esquivo | 1565 | 1565 | 100.0% |
| Equilibrado | 641 | 641 | 100.0% |
| Extremista ATK | 295 | 295 | 100.0% |
| Extremista DEF | 637 | 637 | 100.0% |
| Extremista ASPD | 225 | 225 | 100.0% |
| Extremista REF | 236 | 236 | 100.0% |
| Velocista | 475 | 475 | 100.0% |
| Berserker | 269 | 269 | 100.0% |
| Guardian | 335 | 335 | 100.0% |
| Estratega | 213 | 213 | 100.0% |
| Gladiador | 228 | 228 | 100.0% |
| Magus | 464 | 464 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 1 | 1812 | 0.1% |
| Asesino | 8 | 876 | 0.9% |
| Esquivo | 324 | 2010 | 16.1% |
| Equilibrado | 29 | 1184 | 2.4% |
| Extremista ATK | 68 | 882 | 7.7% |
| Extremista DEF | 435 | 2040 | 21.3% |
| Extremista ASPD | 145 | 955 | 15.2% |
| Extremista REF | 758 | 1206 | 62.9% |
| Velocista | 0 | 922 | 0.0% |
| Berserker | 104 | 996 | 10.4% |
| Guardian | 3 | 1370 | 0.2% |
| Estratega | 572 | 1070 | 53.5% |
| Gladiador | 298 | 799 | 37.3% |
| Magus | 175 | 1038 | 16.9% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 16 | 14 | 13 | 18 | 11 | 9 | 11 | 10 | 6 | 11 | 13 | 15 | 10 | 15 |
| 5 | 27 | 22 | 18 | 24 | 20 | 18 | 19 | 14 | 13 | 19 | 23 | 19 | 18 | 23 |
| 10 | 30 | 21 | 22 | 27 | 20 | 23 | 19 | 12 | 18 | 19 | 27 | 18 | 19 | 22 |
| 15 | 31 | 21 | 25 | 27 | 21 | 26 | 19 | 11 | 18 | 19 | 28 | 19 | 20 | 22 |
| 20 | 31 | 22 | 27 | 27 | 22 | 28 | 20 | 12 | 18 | 19 | 29 | 19 | 21 | 22 |
| 25 | 31 | 23 | 29 | 27 | 22 | 28 | 20 | 12 | 20 | 19 | 29 | 20 | 21 | 23 |
| 30 | 30 | 23 | 30 | 28 | 23 | 27 | 20 | 12 | 20 | 20 | 29 | 20 | 22 | 23 |
| 40 | 30 | 23 | 31 | 29 | 23 | 27 | 21 | 13 | 20 | 20 | 28 | 20 | 22 | 23 |
| 50 | 29 | 24 | 33 | 29 | 24 | 27 | 21 | 13 | 20 | 21 | 28 | 20 | 22 | 24 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 64.3% | 46.2% | 50.0% | 83.3% | 43.8% | 90.9% | 90.0% | 50.0% | 88.9% | 28.6% | 53.8% | 66.7% | 35.7% |
| Asesino | 35.7% | 50.0% | 37.5% | 33.3% | 50.0% | 30.0% | 50.0% | 40.0% | 18.2% | 75.0% | 30.8% | 40.0% | 27.3% | 14.3% |
| Esquivo | 53.8% | 62.5% | 50.0% | 44.4% | 60.0% | 60.0% | 42.9% | 45.5% | 40.0% | 77.8% | 28.6% | 41.7% | 56.3% | 37.5% |
| Equilibrado | 50.0% | 66.7% | 55.6% | 50.0% | 57.1% | 50.0% | 44.4% | 61.5% | 57.1% | 85.7% | 20.0% | 50.0% | 25.0% | 50.0% |
| Extremista ATK | 16.7% | 50.0% | 40.0% | 42.9% | 50.0% | 83.3% | 33.3% | 46.2% | 50.0% | 62.5% | 23.1% | 41.7% | 37.5% | 50.0% |
| Extremista DEF | 56.3% | 70.0% | 40.0% | 50.0% | 16.7% | 50.0% | 22.2% | 50.0% | 22.2% | 71.4% | 60.0% | 25.0% | 33.3% | 58.3% |
| Extremista ASPD | 9.1% | 50.0% | 57.1% | 55.6% | 66.7% | 77.8% | 50.0% | 64.3% | 16.7% | 40.0% | 31.3% | 54.5% | 33.3% | 50.0% |
| Extremista REF | 10.0% | 60.0% | 54.5% | 38.5% | 53.8% | 50.0% | 35.7% | 50.0% | 33.3% | 36.4% | 37.5% | 23.1% | 25.0% | 44.4% |
| Velocista | 50.0% | 81.8% | 60.0% | 42.9% | 50.0% | 77.8% | 83.3% | 66.7% | 50.0% | 81.8% | 40.0% | 42.9% | 50.0% | 57.1% |
| Berserker | 11.1% | 25.0% | 22.2% | 14.3% | 37.5% | 28.6% | 60.0% | 63.6% | 18.2% | 50.0% | 26.7% | 42.9% | 11.1% | 71.4% |
| Guardian | 71.4% | 69.2% | 71.4% | 80.0% | 76.9% | 40.0% | 68.8% | 62.5% | 60.0% | 73.3% | 50.0% | 30.0% | 50.0% | 44.4% |
| Estratega | 46.2% | 60.0% | 58.3% | 50.0% | 58.3% | 75.0% | 45.5% | 76.9% | 57.1% | 57.1% | 70.0% | 50.0% | 30.8% | 80.0% |
| Gladiador | 33.3% | 72.7% | 43.8% | 75.0% | 62.5% | 66.7% | 66.7% | 75.0% | 50.0% | 88.9% | 50.0% | 69.2% | 50.0% | 44.4% |
| Magus | 64.3% | 85.7% | 62.5% | 50.0% | 50.0% | 41.7% | 50.0% | 55.6% | 42.9% | 28.6% | 55.6% | 20.0% | 55.6% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.3% | 350 |
| 16-30 | 49.9% | 547 |
| 31-50 | 54.3% | 346 |
| 51-70 | 55.9% | 195 |
| 71-100 | 50.2% | 562 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 35.7% | 14 |
| 16-30 | 34.7% | 438 |
| 31-50 | 46.6% | 734 |
| 51-70 | 64.3% | 319 |
| 71-100 | 59.8% | 495 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 264 |
| 16-30 | 42.0% | 417 |
| 31-50 | 47.5% | 364 |
| 51-70 | 46.8% | 237 |
| 71-100 | 56.8% | 718 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.7% | 487 |
| 16-30 | 45.5% | 481 |
| 31-50 | 50.1% | 367 |
| 51-70 | 61.9% | 226 |
| 71-100 | 57.9% | 439 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.4% | 806 |
| 16-30 | 42.6% | 545 |
| 31-50 | 52.4% | 334 |
| 51-70 | 68.5% | 127 |
| 71-100 | 70.2% | 188 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.0% | 1639 |
| 16-30 | 38.6% | 220 |
| 31-50 | 35.9% | 117 |
| 51-70 | 22.7% | 22 |
| 71-100 | 0.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.8% | 1633 |
| 16-30 | 40.5% | 222 |
| 31-50 | 35.0% | 117 |
| 51-70 | 22.2% | 27 |
| 71-100 | 0.0% | 1 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.2% | 1635 |
| 16-30 | 34.1% | 223 |
| 31-50 | 40.5% | 116 |
| 51-70 | 29.2% | 24 |
| 71-100 | 0.0% | 2 |
