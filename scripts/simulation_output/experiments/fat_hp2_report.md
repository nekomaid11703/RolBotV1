# Combat Simulation Report
Generated: 2026-08-05 03:17:56 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.1 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1856 (92.8%) |
| Timeouts (draws) | 144 (7.2%) |
| Avg rounds (all) | 6.4 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 16 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 296 |
| Avg rounds | 7.1 |
| P50 / P90 | 5 / 19 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 949/2000 |
| Winrate | 47.4% |
| Advantage over 50% | -2.6% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 176 | 272 | 64.7% |  |
| Asesino | 110 | 261 | 42.1% |  |
| Esquivo | 124 | 275 | 45.1% |  |
| Equilibrado | 179 | 326 | 54.9% |  |
| Extremista ATK | 128 | 291 | 44.0% |  |
| Extremista DEF | 182 | 316 | 57.6% |  |
| Extremista ASPD | 128 | 292 | 43.8% |  |
| Extremista REF | 100 | 264 | 37.9% |  |
| Velocista | 185 | 275 | 67.3% | YES |
| Berserker | 125 | 306 | 40.8% |  |
| Guardian | 183 | 292 | 62.7% |  |
| Estratega | 134 | 267 | 50.2% |  |
| Gladiador | 125 | 263 | 47.5% |  |
| Magus | 119 | 300 | 39.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.9 | 0 |
| Heal applied | 44.6 | - |
| Rests | 2.3 | 1 |
| Advances | 3.8 | - |
| Retreats | 0.0 | - |
| Battles with item use | 38.6% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.2% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.21 (avg 47.08) |
| ASPD spread (stddev) | 31.02 (avg 52.48) |
| Equipment tier A | 484 (12.1%) |
| Equipment tier B | 813 (20.3%) |
| Equipment tier C | 1044 (26.1%) |
| Equipment tier E | 1659 (41.5%) |
| Level 100-199 | 980 |
| Level 200-299 | 1163 |
| Level 300-399 | 981 |
| Level 400-500 | 876 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1183 |
| cortante | 1200 |
| desarmado | 391 |
| perforante | 1226 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1271 | 48.9% |
| ligera | 24 | 50.0% |
| media | 131 | 42.7% |
| total | 2574 | 50.9% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 84 | 38.1% |
| 3+ | 3916 | 50.2% |
Set bonus active: 50.2% (3916) vs inactive 38.1% (84)

### Amulet
With amulet: 51.0% (1583) vs without 49.2% (2417)

### Shield
With shield: 50.3% (2371) vs without 49.5% (1629)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 432 | 65.7% |
| B | 736 | 58.7% |
| C | 942 | 50.2% |
| E | 1499 | 42.8% |
| desarmado | 391 | 42.7% |

### Nature by level bracket
- **100-199**: contundente: 301, cortante: 274, desarmado: 100, perforante: 305
- **200-299**: contundente: 349, cortante: 337, desarmado: 109, perforante: 368
- **300-399**: contundente: 282, cortante: 302, desarmado: 88, perforante: 309
- **400-500**: contundente: 251, cortante: 287, desarmado: 94, perforante: 244

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 43.1% | 977 | 52.2% | 3023 | -9.1pp |
| d_fulgor | 43.0% | 970 | 52.2% | 3030 | -9.2pp |
| r_fulgor | 43.4% | 960 | 52.0% | 3040 | -8.6pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 18.0 | 0 | 128 | 1 | 13 | 26 |
| Asesino | 61.5 | 0 | 128 | 46 | 59 | 84 |
| Esquivo | 15.6 | 0 | 128 | 0 | 8 | 22 |
| Equilibrado | 30.5 | 0 | 128 | 13 | 27 | 46 |
| Extremista ATK | 54.8 | 0 | 128 | 46 | 50 | 72 |
| Extremista DEF | 6.1 | 0 | 128 | 0 | 0 | 5 |
| Extremista ASPD | 46.3 | 10 | 128 | 21 | 39 | 64 |
| Extremista REF | 27.6 | 0 | 128 | 12 | 20 | 38 |
| Velocista | 21.6 | 0 | 128 | 10 | 18 | 27 |
| Berserker | 60.6 | 14 | 128 | 46 | 59 | 77 |
| Guardian | 10.8 | 0 | 128 | 0 | 0 | 14 |
| Estratega | 29.1 | 0 | 128 | 17 | 21 | 39 |
| Gladiador | 45.7 | 0 | 128 | 19 | 46 | 61 |
| Magus | 43.2 | 0 | 128 | 22 | 41 | 51 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 186 | 186 | 100.0% |
| Asesino | 167 | 167 | 100.0% |
| Esquivo | 1246 | 1246 | 100.0% |
| Equilibrado | 762 | 762 | 100.0% |
| Extremista ATK | 246 | 246 | 100.0% |
| Extremista DEF | 231 | 231 | 100.0% |
| Extremista ASPD | 70 | 70 | 100.0% |
| Extremista REF | 339 | 339 | 100.0% |
| Velocista | 420 | 420 | 100.0% |
| Berserker | 116 | 116 | 100.0% |
| Guardian | 374 | 374 | 100.0% |
| Estratega | 297 | 297 | 100.0% |
| Gladiador | 181 | 181 | 100.0% |
| Magus | 319 | 319 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 25 | 1119 | 2.2% |
| Asesino | 10 | 521 | 1.9% |
| Esquivo | 220 | 1638 | 13.4% |
| Equilibrado | 72 | 1358 | 5.3% |
| Extremista ATK | 148 | 888 | 16.7% |
| Extremista DEF | 443 | 1655 | 26.8% |
| Extremista ASPD | 63 | 627 | 10.0% |
| Extremista REF | 646 | 1120 | 57.7% |
| Velocista | 0 | 711 | 0.0% |
| Berserker | 90 | 743 | 12.1% |
| Guardian | 2 | 1288 | 0.2% |
| Estratega | 550 | 1052 | 52.3% |
| Gladiador | 302 | 747 | 40.4% |
| Magus | 138 | 878 | 15.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 14 | 15 | 17 | 10 | 9 | 9 | 10 | 7 | 9 | 13 | 12 | 9 | 15 |
| 5 | 22 | 19 | 18 | 21 | 17 | 17 | 16 | 13 | 11 | 15 | 21 | 16 | 16 | 20 |
| 10 | 25 | 19 | 21 | 23 | 17 | 22 | 16 | 12 | 14 | 16 | 23 | 16 | 16 | 20 |
| 15 | 25 | 19 | 23 | 23 | 17 | 25 | 16 | 13 | 14 | 16 | 25 | 16 | 16 | 20 |
| 20 | 25 | 19 | 24 | 24 | 17 | 26 | 16 | 13 | 14 | 16 | 25 | 16 | 16 | 20 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 76.2% | 65.0% | 50.0% | 80.0% | 66.7% | 82.4% | 60.0% | 70.4% | 65.2% | 52.0% | 56.5% | 61.5% | 70.6% |
| Asesino | 23.8% | 50.0% | 50.0% | 37.0% | 50.0% | 52.4% | 38.1% | 71.4% | 17.6% | 30.0% | 27.8% | 50.0% | 61.1% | 45.0% |
| Esquivo | 30.0% | 50.0% | 45.0% | 42.9% | 45.8% | 50.0% | 37.5% | 75.0% | 25.0% | 66.7% | 14.3% | 52.9% | 43.5% | 56.3% |
| Equilibrado | 50.0% | 63.0% | 57.1% | 50.0% | 52.4% | 60.9% | 52.2% | 57.1% | 11.1% | 78.6% | 53.3% | 50.0% | 52.2% | 65.2% |
| Extremista ATK | 20.0% | 50.0% | 54.2% | 47.6% | 50.0% | 25.0% | 31.3% | 73.7% | 16.0% | 63.2% | 41.2% | 33.3% | 47.4% | 64.3% |
| Extremista DEF | 33.3% | 47.6% | 50.0% | 39.1% | 75.0% | 50.0% | 75.0% | 92.0% | 42.9% | 73.1% | 22.7% | 57.9% | 70.6% | 75.0% |
| Extremista ASPD | 17.6% | 61.9% | 62.5% | 47.8% | 68.8% | 25.0% | 50.0% | 45.5% | 17.6% | 30.0% | 15.8% | 47.4% | 52.6% | 56.5% |
| Extremista REF | 40.0% | 28.6% | 25.0% | 42.9% | 26.3% | 8.0% | 54.5% | 50.0% | 41.2% | 46.2% | 37.5% | 56.0% | 41.7% | 29.4% |
| Velocista | 29.6% | 82.4% | 75.0% | 88.9% | 84.0% | 57.1% | 82.4% | 58.8% | 50.0% | 87.5% | 75.0% | 61.9% | 73.3% | 54.5% |
| Berserker | 34.8% | 70.0% | 33.3% | 21.4% | 36.8% | 26.9% | 70.0% | 53.8% | 12.5% | 50.0% | 41.7% | 47.4% | 42.9% | 54.5% |
| Guardian | 48.0% | 72.2% | 85.7% | 46.7% | 58.8% | 77.3% | 84.2% | 62.5% | 25.0% | 58.3% | 50.0% | 50.0% | 72.7% | 88.0% |
| Estratega | 43.5% | 50.0% | 47.1% | 50.0% | 66.7% | 42.1% | 52.6% | 44.0% | 38.1% | 52.6% | 50.0% | 50.0% | 52.9% | 65.4% |
| Gladiador | 38.5% | 38.9% | 56.5% | 47.8% | 52.6% | 29.4% | 47.4% | 58.3% | 26.7% | 57.1% | 27.3% | 47.1% | 50.0% | 59.3% |
| Magus | 29.4% | 55.0% | 43.8% | 34.8% | 35.7% | 25.0% | 43.5% | 70.6% | 45.5% | 45.5% | 12.0% | 34.6% | 40.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.2% | 705 |
| 16-30 | 52.0% | 1036 |
| 31-50 | 52.8% | 686 |
| 51-70 | 50.9% | 450 |
| 71-100 | 47.0% | 1123 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.0% | 25 |
| 16-30 | 35.9% | 875 |
| 31-50 | 44.8% | 1484 |
| 51-70 | 60.6% | 601 |
| 71-100 | 63.6% | 1015 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 507 |
| 16-30 | 43.6% | 819 |
| 31-50 | 51.6% | 742 |
| 51-70 | 49.8% | 578 |
| 71-100 | 52.8% | 1354 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.3% | 964 |
| 16-30 | 45.6% | 1029 |
| 31-50 | 48.7% | 700 |
| 51-70 | 60.5% | 451 |
| 71-100 | 54.8% | 856 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.3% | 1642 |
| 16-30 | 40.6% | 1104 |
| 31-50 | 45.1% | 599 |
| 51-70 | 78.0% | 286 |
| 71-100 | 80.5% | 369 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.6% | 3245 |
| 16-30 | 46.1% | 432 |
| 31-50 | 40.7% | 246 |
| 51-70 | 33.3% | 69 |
| 71-100 | 37.5% | 8 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.6% | 3237 |
| 16-30 | 44.9% | 441 |
| 31-50 | 41.4% | 249 |
| 51-70 | 36.9% | 65 |
| 71-100 | 25.0% | 8 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.5% | 3238 |
| 16-30 | 45.9% | 451 |
| 31-50 | 39.1% | 235 |
| 51-70 | 43.3% | 67 |
| 71-100 | 22.2% | 9 |
