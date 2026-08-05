# Combat Simulation Report
Generated: 2026-08-05 03:22:21 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 8.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 900 (90.0%) |
| Timeouts (draws) | 100 (10.0%) |
| Avg rounds (all) | 7.6 |
| Avg rounds (KO only) | 6.1 |
| Rounds P50 / P90 / Max | 5 / 20 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 176 |
| Avg rounds | 8.1 |
| P50 / P90 | 6 / 19 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 515/1000 |
| Winrate | 51.5% |
| Advantage over 50% | 1.5% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 98 | 151 | 64.9% | YES |
| Asesino | 62 | 149 | 41.6% |  |
| Esquivo | 78 | 144 | 54.2% |  |
| Equilibrado | 77 | 132 | 58.3% |  |
| Extremista ATK | 46 | 136 | 33.8% |  |
| Extremista DEF | 86 | 154 | 55.8% |  |
| Extremista ASPD | 51 | 139 | 36.7% |  |
| Extremista REF | 45 | 131 | 34.4% |  |
| Velocista | 99 | 155 | 63.9% |  |
| Berserker | 51 | 130 | 39.2% |  |
| Guardian | 78 | 136 | 57.4% |  |
| Estratega | 86 | 142 | 60.6% |  |
| Gladiador | 65 | 133 | 48.9% |  |
| Magus | 76 | 168 | 45.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 59.9 | - |
| Rests | 2.7 | 2 |
| Advances | 4.1 | - |
| Retreats | 0.1 | - |
| Battles with item use | 43.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.2% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.07 (avg 46.80) |
| ASPD spread (stddev) | 31.26 (avg 53.31) |
| Equipment tier A | 247 (12.3%) |
| Equipment tier B | 427 (21.3%) |
| Equipment tier C | 522 (26.1%) |
| Equipment tier E | 804 (40.2%) |
| Level 100-199 | 466 |
| Level 200-299 | 579 |
| Level 300-399 | 490 |
| Level 400-500 | 465 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 582 |
| cortante | 583 |
| desarmado | 216 |
| perforante | 619 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| total | 2000 | 49.9% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 49.9% |
Set bonus active: 49.9% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 51.4% (821) vs without 48.9% (1179)

### Shield
With shield: 0.0% (0) vs without 49.9% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 222 | 69.4% |
| B | 385 | 58.7% |
| C | 462 | 51.9% |
| E | 715 | 40.4% |
| desarmado | 216 | 41.2% |

### Nature by level bracket
- **100-199**: contundente: 133, cortante: 136, desarmado: 52, perforante: 145
- **200-299**: contundente: 173, cortante: 178, desarmado: 55, perforante: 173
- **300-399**: contundente: 132, cortante: 144, desarmado: 56, perforante: 158
- **400-500**: contundente: 144, cortante: 125, desarmado: 53, perforante: 143

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 40.7% | 474 | 52.8% | 1526 | -12.0pp |
| d_fulgor | 39.6% | 470 | 53.1% | 1530 | -13.5pp |
| r_fulgor | 41.4% | 478 | 52.6% | 1522 | -11.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.4 | 0 | 128 | 6 | 14 | 24 |
| Asesino | 58.7 | 0 | 128 | 38 | 52 | 73 |
| Esquivo | 16.7 | 0 | 128 | 0 | 14 | 22 |
| Equilibrado | 37.2 | 0 | 128 | 23 | 33 | 46 |
| Extremista ATK | 56.2 | 0 | 128 | 46 | 51 | 69 |
| Extremista DEF | 7.6 | 0 | 128 | 0 | 0 | 8 |
| Extremista ASPD | 44.4 | 13 | 128 | 22 | 42 | 52 |
| Extremista REF | 23.7 | 0 | 128 | 11 | 19 | 31 |
| Velocista | 23.9 | 0 | 128 | 11 | 17 | 27 |
| Berserker | 58.5 | 0 | 128 | 44 | 61 | 74 |
| Guardian | 11.8 | 0 | 128 | 0 | 4 | 18 |
| Estratega | 32.1 | 0 | 128 | 19 | 26 | 42 |
| Gladiador | 49.9 | 0 | 128 | 30 | 45 | 68 |
| Magus | 44.1 | 11 | 128 | 19 | 46 | 66 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 169 | 169 | 100.0% |
| Asesino | 104 | 104 | 100.0% |
| Esquivo | 501 | 501 | 100.0% |
| Equilibrado | 271 | 271 | 100.0% |
| Extremista ATK | 59 | 59 | 100.0% |
| Extremista DEF | 193 | 193 | 100.0% |
| Extremista ASPD | 117 | 117 | 100.0% |
| Extremista REF | 65 | 65 | 100.0% |
| Velocista | 241 | 241 | 100.0% |
| Berserker | 53 | 53 | 100.0% |
| Guardian | 159 | 159 | 100.0% |
| Estratega | 137 | 137 | 100.0% |
| Gladiador | 180 | 180 | 100.0% |
| Magus | 257 | 257 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 30 | 809 | 3.7% |
| Asesino | 8 | 362 | 2.2% |
| Esquivo | 226 | 810 | 27.9% |
| Equilibrado | 12 | 608 | 2.0% |
| Extremista ATK | 50 | 484 | 10.3% |
| Extremista DEF | 240 | 996 | 24.1% |
| Extremista ASPD | 43 | 517 | 8.3% |
| Extremista REF | 444 | 618 | 71.8% |
| Velocista | 0 | 530 | 0.0% |
| Berserker | 27 | 397 | 6.8% |
| Guardian | 3 | 867 | 0.3% |
| Estratega | 354 | 633 | 55.9% |
| Gladiador | 194 | 547 | 35.5% |
| Magus | 147 | 689 | 21.3% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 12 | 14 | 12 | 15 | 8 | 8 | 10 | 9 | 5 | 9 | 15 | 14 | 9 | 14 |
| 5 | 24 | 19 | 16 | 22 | 16 | 18 | 18 | 13 | 10 | 17 | 23 | 17 | 18 | 19 |
| 10 | 26 | 20 | 18 | 24 | 16 | 23 | 17 | 12 | 15 | 17 | 25 | 16 | 17 | 19 |
| 15 | 27 | 20 | 21 | 24 | 16 | 25 | 17 | 11 | 15 | 17 | 26 | 16 | 18 | 19 |
| 20 | 26 | 20 | 21 | 25 | 16 | 26 | 18 | 11 | 15 | 17 | 26 | 16 | 18 | 20 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 70.0% | 50.0% | 54.5% | 72.7% | 75.0% | 100.0% | 69.2% | 50.0% | 92.3% | 44.4% | 11.1% | 50.0% | 69.2% |
| Asesino | 30.0% | 50.0% | 45.5% | 33.3% | 33.3% | 46.2% | 55.6% | 100.0% | 33.3% | 40.0% | 20.0% | 31.3% | 16.7% | 58.3% |
| Esquivo | 50.0% | 54.5% | 50.0% | 40.0% | 50.0% | 58.3% | 70.0% | 50.0% | 63.6% | 72.7% | 50.0% | 35.7% | 50.0% | 63.6% |
| Equilibrado | 45.5% | 66.7% | 60.0% | 50.0% | 92.9% | 50.0% | 66.7% | 55.6% | 0.0% | 58.3% | 66.7% | 57.1% | 37.5% | 55.0% |
| Extremista ATK | 27.3% | 66.7% | 50.0% | 7.1% | 50.0% | 54.5% | 57.1% | 60.0% | 0.0% | 22.2% | 12.5% | 25.0% | 66.7% | 0.0% |
| Extremista DEF | 25.0% | 53.8% | 41.7% | 50.0% | 45.5% | 50.0% | 60.0% | 100.0% | 54.5% | 100.0% | 43.8% | 62.5% | 80.0% | 53.3% |
| Extremista ASPD | 0.0% | 44.4% | 30.0% | 33.3% | 42.9% | 40.0% | 50.0% | 66.7% | 62.5% | 50.0% | 20.0% | 11.1% | 33.3% | 60.0% |
| Extremista REF | 30.8% | 0.0% | 50.0% | 44.4% | 40.0% | 0.0% | 33.3% | 50.0% | 36.4% | 33.3% | 0.0% | 37.5% | 38.5% | 40.0% |
| Velocista | 50.0% | 66.7% | 36.4% | 100.0% | 100.0% | 45.5% | 37.5% | 63.6% | 50.0% | 85.7% | 60.0% | 75.0% | 76.9% | 83.3% |
| Berserker | 7.7% | 60.0% | 27.3% | 41.7% | 77.8% | 0.0% | 50.0% | 66.7% | 14.3% | 50.0% | 28.6% | 28.6% | 69.2% | 33.3% |
| Guardian | 55.6% | 80.0% | 25.0% | 33.3% | 87.5% | 56.3% | 80.0% | 100.0% | 40.0% | 71.4% | 50.0% | 36.4% | 23.1% | 71.4% |
| Estratega | 88.9% | 68.8% | 64.3% | 42.9% | 75.0% | 37.5% | 88.9% | 62.5% | 25.0% | 71.4% | 63.6% | 50.0% | 57.1% | 50.0% |
| Gladiador | 50.0% | 83.3% | 50.0% | 62.5% | 33.3% | 20.0% | 66.7% | 61.5% | 23.1% | 30.8% | 76.9% | 42.9% | 50.0% | 50.0% |
| Magus | 30.8% | 41.7% | 36.4% | 45.0% | 100.0% | 40.0% | 40.0% | 60.0% | 16.7% | 66.7% | 28.6% | 50.0% | 50.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.2% | 346 |
| 16-30 | 50.6% | 516 |
| 31-50 | 55.9% | 372 |
| 51-70 | 54.4% | 215 |
| 71-100 | 45.7% | 551 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.8% | 13 |
| 16-30 | 32.2% | 423 |
| 31-50 | 44.8% | 746 |
| 51-70 | 62.9% | 286 |
| 71-100 | 64.1% | 532 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.4% | 256 |
| 16-30 | 43.3% | 381 |
| 31-50 | 49.2% | 374 |
| 51-70 | 54.0% | 278 |
| 71-100 | 52.7% | 711 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.9% | 477 |
| 16-30 | 45.5% | 473 |
| 31-50 | 51.6% | 368 |
| 51-70 | 57.7% | 248 |
| 71-100 | 58.8% | 434 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.6% | 812 |
| 16-30 | 41.4% | 538 |
| 31-50 | 51.0% | 300 |
| 51-70 | 78.7% | 141 |
| 71-100 | 75.1% | 209 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 1620 |
| 16-30 | 36.7% | 240 |
| 31-50 | 48.7% | 115 |
| 51-70 | 27.3% | 22 |
| 71-100 | 0.0% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 1626 |
| 16-30 | 35.9% | 231 |
| 31-50 | 49.2% | 120 |
| 51-70 | 13.0% | 23 |
| 71-100 | 0.0% | 0 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 1626 |
| 16-30 | 36.2% | 232 |
| 31-50 | 50.0% | 116 |
| 51-70 | 30.4% | 23 |
| 71-100 | 0.0% | 3 |
