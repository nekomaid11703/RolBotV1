# Combat Simulation Report
Generated: 2026-08-05 02:26:04 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 11.9 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 956 (95.6%) |
| Timeouts (draws) | 44 (4.4%) |
| Avg rounds (all) | 11.0 |
| Avg rounds (KO only) | 9.2 |
| Rounds P50 / P90 / Max | 6 / 27 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 150 |
| Avg rounds | 11.9 |
| P50 / P90 | 8 / 27 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 472/1000 |
| Winrate | 47.2% |
| Advantage over 50% | -2.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 75 | 123 | 61.0% | YES |
| Asesino | 60 | 161 | 37.3% |  |
| Esquivo | 68 | 138 | 49.3% |  |
| Equilibrado | 78 | 146 | 53.4% |  |
| Extremista ATK | 64 | 136 | 47.1% |  |
| Extremista DEF | 77 | 134 | 57.5% |  |
| Extremista ASPD | 66 | 150 | 44.0% |  |
| Extremista REF | 76 | 153 | 49.7% |  |
| Velocista | 86 | 149 | 57.7% |  |
| Berserker | 57 | 133 | 42.9% |  |
| Guardian | 85 | 150 | 56.7% |  |
| Estratega | 76 | 144 | 52.8% |  |
| Gladiador | 70 | 132 | 53.0% |  |
| Magus | 62 | 151 | 41.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.3 | 0 |
| Heal applied | 77.0 | - |
| Rests | 6.3 | 3 |
| Advances | 3.6 | - |
| Retreats | 0.2 | - |
| Battles with item use | 45.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 88.8% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.13 (avg 46.57) |
| ASPD spread (stddev) | 31.32 (avg 52.85) |
| Equipment tier A | 208 (10.4%) |
| Equipment tier B | 431 (21.6%) |
| Equipment tier C | 504 (25.2%) |
| Equipment tier E | 857 (42.9%) |
| Level 100-199 | 519 |
| Level 200-299 | 537 |
| Level 300-399 | 511 |
| Level 400-500 | 433 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 553 |
| cortante | 599 |
| desarmado | 225 |
| perforante | 623 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| media | 2000 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 50.0% |
Set bonus active: 50.0% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 51.7% (773) vs without 48.9% (1227)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 179 | 68.7% |
| B | 377 | 57.8% |
| C | 452 | 54.4% |
| E | 767 | 43.7% |
| desarmado | 225 | 34.7% |

### Nature by level bracket
- **100-199**: contundente: 149, cortante: 155, desarmado: 52, perforante: 163
- **200-299**: contundente: 145, cortante: 167, desarmado: 56, perforante: 169
- **300-399**: contundente: 139, cortante: 150, desarmado: 63, perforante: 159
- **400-500**: contundente: 120, cortante: 127, desarmado: 54, perforante: 132

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 43.8% | 502 | 52.1% | 1498 | -8.2pp |
| d_fulgor | 42.7% | 496 | 52.4% | 1504 | -9.7pp |
| r_fulgor | 43.8% | 500 | 52.1% | 1500 | -8.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 14.2 | 0 | 128 | 0 | 8 | 19 |
| Asesino | 56.5 | 0 | 128 | 36 | 49 | 71 |
| Esquivo | 13.8 | 0 | 128 | 0 | 9 | 19 |
| Equilibrado | 27.3 | 0 | 128 | 8 | 23 | 44 |
| Extremista ATK | 52.1 | 0 | 128 | 33 | 52 | 71 |
| Extremista DEF | 6.1 | 0 | 128 | 0 | 0 | 6 |
| Extremista ASPD | 46.0 | 12 | 128 | 21 | 46 | 59 |
| Extremista REF | 23.3 | 0 | 128 | 10 | 19 | 28 |
| Velocista | 25.3 | 0 | 128 | 9 | 19 | 35 |
| Berserker | 58.0 | 0 | 128 | 46 | 58 | 74 |
| Guardian | 9.1 | 0 | 128 | 0 | 0 | 14 |
| Estratega | 26.9 | 0 | 128 | 16 | 21 | 35 |
| Gladiador | 50.0 | 0 | 128 | 27 | 47 | 67 |
| Magus | 40.5 | 0 | 128 | 20 | 35 | 51 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 187 | 187 | 100.0% |
| Asesino | 180 | 180 | 100.0% |
| Esquivo | 1253 | 1253 | 100.0% |
| Equilibrado | 1038 | 1038 | 100.0% |
| Extremista ATK | 64 | 64 | 100.0% |
| Extremista DEF | 501 | 501 | 100.0% |
| Extremista ASPD | 173 | 173 | 100.0% |
| Extremista REF | 224 | 224 | 100.0% |
| Velocista | 557 | 557 | 100.0% |
| Berserker | 68 | 68 | 100.0% |
| Guardian | 639 | 639 | 100.0% |
| Estratega | 500 | 500 | 100.0% |
| Gladiador | 184 | 184 | 100.0% |
| Magus | 267 | 267 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 38 | 1081 | 3.5% |
| Asesino | 6 | 669 | 0.9% |
| Esquivo | 327 | 1750 | 18.7% |
| Equilibrado | 34 | 1675 | 2.0% |
| Extremista ATK | 31 | 654 | 4.7% |
| Extremista DEF | 264 | 1625 | 16.2% |
| Extremista ASPD | 95 | 916 | 10.4% |
| Extremista REF | 724 | 1133 | 63.9% |
| Velocista | 0 | 998 | 0.0% |
| Berserker | 91 | 727 | 12.5% |
| Guardian | 9 | 1781 | 0.5% |
| Estratega | 617 | 1367 | 45.1% |
| Gladiador | 297 | 858 | 34.6% |
| Magus | 130 | 927 | 14.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 17 | 16 | 16 | 21 | 10 | 12 | 13 | 11 | 7 | 12 | 16 | 19 | 11 | 20 |
| 5 | 26 | 24 | 19 | 28 | 20 | 21 | 21 | 14 | 14 | 20 | 23 | 22 | 18 | 25 |
| 10 | 30 | 24 | 22 | 29 | 20 | 24 | 21 | 13 | 16 | 21 | 25 | 21 | 18 | 25 |
| 15 | 31 | 24 | 24 | 30 | 20 | 27 | 21 | 13 | 15 | 21 | 27 | 22 | 19 | 25 |
| 20 | 31 | 25 | 26 | 30 | 21 | 29 | 21 | 13 | 15 | 21 | 28 | 22 | 19 | 25 |
| 25 | 32 | 25 | 27 | 30 | 21 | 29 | 21 | 14 | 18 | 21 | 28 | 23 | 19 | 26 |
| 30 | 31 | 25 | 29 | 31 | 21 | 29 | 21 | 14 | 18 | 21 | 28 | 23 | 19 | 26 |
| 40 | 31 | 25 | 30 | 31 | 21 | 30 | 21 | 14 | 19 | 21 | 28 | 24 | 19 | 26 |
| 50 | 31 | 25 | 31 | 31 | 21 | 30 | 21 | 15 | 19 | 21 | 29 | 25 | 19 | 26 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 75.0% | 75.0% | 33.3% | 70.0% | 57.1% | 77.8% | 77.8% | 50.0% | 66.7% | 60.0% | 61.5% | 56.3% | 57.1% |
| Asesino | 25.0% | 50.0% | 40.0% | 25.0% | 44.4% | 27.3% | 36.4% | 28.6% | 54.5% | 54.5% | 27.3% | 42.9% | 35.7% | 30.0% |
| Esquivo | 25.0% | 60.0% | 50.0% | 54.5% | 41.7% | 62.5% | 50.0% | 25.0% | 50.0% | 61.5% | 46.2% | 50.0% | 55.6% | 41.7% |
| Equilibrado | 66.7% | 75.0% | 45.5% | 50.0% | 40.0% | 62.5% | 45.5% | 41.7% | 50.0% | 66.7% | 44.4% | 40.0% | 33.3% | 61.5% |
| Extremista ATK | 30.0% | 55.6% | 58.3% | 60.0% | 50.0% | 28.6% | 75.0% | 50.0% | 31.3% | 50.0% | 25.0% | 50.0% | 71.4% | 66.7% |
| Extremista DEF | 42.9% | 72.7% | 37.5% | 37.5% | 71.4% | 50.0% | 80.0% | 75.0% | 22.2% | 70.0% | 62.5% | 57.1% | 40.0% | 62.5% |
| Extremista ASPD | 22.2% | 63.6% | 50.0% | 54.5% | 25.0% | 20.0% | 50.0% | 42.9% | 30.0% | 35.7% | 30.0% | 46.2% | 37.5% | 86.7% |
| Extremista REF | 22.2% | 71.4% | 75.0% | 58.3% | 50.0% | 25.0% | 57.1% | 50.0% | 57.1% | 28.6% | 41.7% | 42.9% | 55.6% | 50.0% |
| Velocista | 50.0% | 45.5% | 50.0% | 50.0% | 68.8% | 77.8% | 70.0% | 42.9% | 50.0% | 71.4% | 53.8% | 38.5% | 90.9% | 50.0% |
| Berserker | 33.3% | 45.5% | 38.5% | 33.3% | 50.0% | 30.0% | 64.3% | 71.4% | 28.6% | 50.0% | 18.2% | 50.0% | 0.0% | 62.5% |
| Guardian | 40.0% | 72.7% | 53.8% | 55.6% | 75.0% | 37.5% | 70.0% | 58.3% | 46.2% | 81.8% | 50.0% | 27.3% | 44.4% | 72.7% |
| Estratega | 38.5% | 57.1% | 50.0% | 60.0% | 50.0% | 42.9% | 53.8% | 57.1% | 61.5% | 50.0% | 72.7% | 50.0% | 33.3% | 56.3% |
| Gladiador | 43.8% | 64.3% | 44.4% | 66.7% | 28.6% | 60.0% | 62.5% | 44.4% | 9.1% | 100.0% | 55.6% | 66.7% | 50.0% | 72.7% |
| Magus | 42.9% | 70.0% | 58.3% | 38.5% | 33.3% | 37.5% | 13.3% | 50.0% | 50.0% | 37.5% | 27.3% | 43.8% | 27.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.2% | 357 |
| 16-30 | 51.7% | 532 |
| 31-50 | 54.7% | 351 |
| 51-70 | 46.1% | 193 |
| 71-100 | 49.2% | 567 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 27.3% | 11 |
| 16-30 | 37.4% | 428 |
| 31-50 | 46.0% | 800 |
| 51-70 | 60.8% | 286 |
| 71-100 | 62.1% | 475 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.4% | 270 |
| 16-30 | 46.6% | 384 |
| 31-50 | 50.7% | 383 |
| 51-70 | 48.9% | 276 |
| 71-100 | 54.1% | 687 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.3% | 485 |
| 16-30 | 43.8% | 479 |
| 31-50 | 48.7% | 388 |
| 51-70 | 62.0% | 221 |
| 71-100 | 59.5% | 427 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.6% | 817 |
| 16-30 | 43.8% | 562 |
| 31-50 | 45.6% | 305 |
| 51-70 | 74.0% | 131 |
| 71-100 | 69.7% | 185 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 1619 |
| 16-30 | 38.9% | 226 |
| 31-50 | 49.2% | 132 |
| 51-70 | 47.6% | 21 |
| 71-100 | 0.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.6% | 1621 |
| 16-30 | 40.7% | 214 |
| 31-50 | 45.5% | 134 |
| 51-70 | 51.7% | 29 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 1622 |
| 16-30 | 42.1% | 221 |
| 31-50 | 47.6% | 126 |
| 51-70 | 48.1% | 27 |
| 71-100 | 25.0% | 4 |
