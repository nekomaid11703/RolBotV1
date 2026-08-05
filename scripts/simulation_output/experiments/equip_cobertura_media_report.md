# Combat Simulation Report
Generated: 2026-08-05 03:22:16 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.3 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 915 (91.5%) |
| Timeouts (draws) | 85 (8.5%) |
| Avg rounds (all) | 6.9 |
| Avg rounds (KO only) | 5.6 |
| Rounds P50 / P90 / Max | 5 / 18 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 146 |
| Avg rounds | 7.3 |
| P50 / P90 | 5 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 457/1000 |
| Winrate | 45.7% |
| Advantage over 50% | -4.3% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 86 | 138 | 62.3% |  |
| Asesino | 55 | 151 | 36.4% |  |
| Esquivo | 60 | 137 | 43.8% |  |
| Equilibrado | 66 | 129 | 51.2% |  |
| Extremista ATK | 61 | 150 | 40.7% |  |
| Extremista DEF | 104 | 147 | 70.7% | YES |
| Extremista ASPD | 63 | 144 | 43.8% |  |
| Extremista REF | 68 | 158 | 43.0% |  |
| Velocista | 90 | 143 | 62.9% |  |
| Berserker | 62 | 132 | 47.0% |  |
| Guardian | 93 | 150 | 62.0% |  |
| Estratega | 69 | 128 | 53.9% |  |
| Gladiador | 74 | 160 | 46.3% |  |
| Magus | 49 | 133 | 36.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.0 | 0 |
| Heal applied | 53.4 | - |
| Rests | 2.8 | 1 |
| Advances | 3.3 | - |
| Retreats | 0.1 | - |
| Battles with item use | 42.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.8% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.62 (avg 48.34) |
| ASPD spread (stddev) | 31.74 (avg 53.77) |
| Equipment tier A | 257 (12.8%) |
| Equipment tier B | 411 (20.5%) |
| Equipment tier C | 542 (27.1%) |
| Equipment tier E | 790 (39.5%) |
| Level 100-199 | 484 |
| Level 200-299 | 555 |
| Level 300-399 | 492 |
| Level 400-500 | 469 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 552 |
| cortante | 618 |
| desarmado | 204 |
| perforante | 626 |

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
With amulet: 52.9% (817) vs without 48.0% (1183)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 234 | 61.5% |
| B | 373 | 58.2% |
| C | 484 | 48.6% |
| E | 705 | 43.7% |
| desarmado | 204 | 47.1% |

### Nature by level bracket
- **100-199**: contundente: 122, cortante: 143, desarmado: 57, perforante: 162
- **200-299**: contundente: 156, cortante: 184, desarmado: 52, perforante: 163
- **300-399**: contundente: 138, cortante: 140, desarmado: 57, perforante: 157
- **400-500**: contundente: 136, cortante: 151, desarmado: 38, perforante: 144

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 43.4% | 482 | 52.1% | 1518 | -8.7pp |
| d_fulgor | 43.9% | 487 | 51.9% | 1513 | -8.0pp |
| r_fulgor | 44.0% | 468 | 51.8% | 1532 | -7.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 17.7 | 0 | 128 | 4 | 14 | 24 |
| Asesino | 59.1 | 14 | 128 | 46 | 55 | 71 |
| Esquivo | 16.7 | 0 | 128 | 0 | 11 | 21 |
| Equilibrado | 27.9 | 0 | 97 | 14 | 27 | 42 |
| Extremista ATK | 60.2 | 19 | 128 | 43 | 59 | 78 |
| Extremista DEF | 7.5 | 0 | 128 | 0 | 0 | 11 |
| Extremista ASPD | 53.7 | 0 | 128 | 22 | 46 | 78 |
| Extremista REF | 25.5 | 0 | 128 | 9 | 19 | 37 |
| Velocista | 20.3 | 0 | 128 | 10 | 14 | 24 |
| Berserker | 61.3 | 0 | 128 | 46 | 56 | 76 |
| Guardian | 14.7 | 0 | 128 | 0 | 10 | 20 |
| Estratega | 34.4 | 8 | 128 | 19 | 24 | 41 |
| Gladiador | 47.0 | 0 | 128 | 22 | 46 | 63 |
| Magus | 46.0 | 12 | 128 | 24 | 44 | 56 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 112 | 112 | 100.0% |
| Asesino | 153 | 153 | 100.0% |
| Esquivo | 536 | 536 | 100.0% |
| Equilibrado | 347 | 347 | 100.0% |
| Extremista ATK | 95 | 95 | 100.0% |
| Extremista DEF | 153 | 153 | 100.0% |
| Extremista ASPD | 86 | 86 | 100.0% |
| Extremista REF | 100 | 100 | 100.0% |
| Velocista | 208 | 208 | 100.0% |
| Berserker | 52 | 52 | 100.0% |
| Guardian | 235 | 235 | 100.0% |
| Estratega | 132 | 132 | 100.0% |
| Gladiador | 193 | 193 | 100.0% |
| Magus | 104 | 104 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 40 | 750 | 5.3% |
| Asesino | 1 | 431 | 0.2% |
| Esquivo | 167 | 822 | 20.3% |
| Equilibrado | 20 | 753 | 2.7% |
| Extremista ATK | 44 | 533 | 8.3% |
| Extremista DEF | 156 | 708 | 22.0% |
| Extremista ASPD | 38 | 495 | 7.7% |
| Extremista REF | 542 | 792 | 68.4% |
| Velocista | 0 | 433 | 0.0% |
| Berserker | 61 | 432 | 14.1% |
| Guardian | 4 | 790 | 0.5% |
| Estratega | 263 | 544 | 48.3% |
| Gladiador | 199 | 662 | 30.1% |
| Magus | 105 | 593 | 17.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 19 | 18 | 19 | 13 | 10 | 11 | 14 | 7 | 13 | 14 | 16 | 9 | 21 |
| 5 | 24 | 25 | 22 | 26 | 20 | 18 | 18 | 17 | 13 | 20 | 21 | 18 | 17 | 26 |
| 10 | 25 | 25 | 25 | 29 | 20 | 22 | 18 | 17 | 16 | 20 | 23 | 18 | 16 | 25 |
| 15 | 26 | 26 | 27 | 30 | 20 | 25 | 18 | 16 | 16 | 21 | 25 | 19 | 16 | 25 |
| 20 | 26 | 26 | 28 | 31 | 20 | 26 | 18 | 17 | 16 | 21 | 26 | 19 | 16 | 25 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 100.0% | 50.0% | 27.3% | 70.0% | 40.0% | 81.8% | 64.3% | 85.7% | 69.2% | 37.5% | 62.5% | 66.7% | 92.3% |
| Asesino | 0.0% | 50.0% | 37.5% | 46.2% | 36.4% | 7.7% | 27.3% | 23.1% | 22.2% | 40.0% | 42.9% | 41.7% | 46.7% | 83.3% |
| Esquivo | 50.0% | 62.5% | 50.0% | 28.6% | 90.0% | 30.0% | 46.7% | 33.3% | 33.3% | 50.0% | 33.3% | 37.5% | 26.7% | 45.5% |
| Equilibrado | 72.7% | 53.8% | 71.4% | 50.0% | 16.7% | 70.0% | 42.9% | 66.7% | 11.1% | 25.0% | 55.6% | 28.6% | 58.3% | 50.0% |
| Extremista ATK | 30.0% | 63.6% | 10.0% | 83.3% | 50.0% | 16.7% | 30.8% | 58.3% | 25.0% | 43.8% | 36.4% | 50.0% | 33.3% | 50.0% |
| Extremista DEF | 60.0% | 92.3% | 70.0% | 30.0% | 83.3% | 50.0% | 81.8% | 80.0% | 75.0% | 87.5% | 40.0% | 60.0% | 75.0% | 85.7% |
| Extremista ASPD | 18.2% | 72.7% | 53.3% | 57.1% | 69.2% | 18.2% | 50.0% | 38.5% | 18.2% | 50.0% | 20.0% | 50.0% | 58.3% | 37.5% |
| Extremista REF | 35.7% | 76.9% | 66.7% | 33.3% | 41.7% | 20.0% | 61.5% | 50.0% | 27.3% | 37.5% | 14.3% | 41.7% | 41.7% | 50.0% |
| Velocista | 14.3% | 77.8% | 66.7% | 88.9% | 75.0% | 25.0% | 81.8% | 72.7% | 50.0% | 72.7% | 42.9% | 41.7% | 87.5% | 61.5% |
| Berserker | 30.8% | 60.0% | 50.0% | 75.0% | 56.3% | 12.5% | 50.0% | 62.5% | 27.3% | 50.0% | 25.0% | 54.5% | 57.1% | 70.0% |
| Guardian | 62.5% | 57.1% | 66.7% | 44.4% | 63.6% | 60.0% | 80.0% | 85.7% | 57.1% | 75.0% | 50.0% | 50.0% | 58.3% | 66.7% |
| Estratega | 37.5% | 58.3% | 62.5% | 71.4% | 50.0% | 40.0% | 50.0% | 58.3% | 58.3% | 45.5% | 50.0% | 50.0% | 44.4% | 72.7% |
| Gladiador | 33.3% | 53.3% | 73.3% | 41.7% | 66.7% | 25.0% | 41.7% | 58.3% | 12.5% | 42.9% | 41.7% | 55.6% | 50.0% | 62.5% |
| Magus | 7.7% | 16.7% | 54.5% | 50.0% | 50.0% | 14.3% | 62.5% | 50.0% | 38.5% | 30.0% | 33.3% | 27.3% | 37.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.1% | 346 |
| 16-30 | 54.5% | 501 |
| 31-50 | 53.2% | 327 |
| 51-70 | 50.9% | 226 |
| 71-100 | 45.8% | 600 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.1% | 7 |
| 16-30 | 35.2% | 395 |
| 31-50 | 45.0% | 786 |
| 51-70 | 52.4% | 317 |
| 71-100 | 68.1% | 495 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.1% | 267 |
| 16-30 | 47.1% | 393 |
| 31-50 | 47.0% | 347 |
| 51-70 | 52.0% | 256 |
| 71-100 | 51.6% | 737 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.2% | 449 |
| 16-30 | 47.2% | 509 |
| 31-50 | 48.5% | 365 |
| 51-70 | 58.0% | 219 |
| 71-100 | 55.2% | 458 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.9% | 815 |
| 16-30 | 45.1% | 521 |
| 31-50 | 40.9% | 323 |
| 51-70 | 72.3% | 148 |
| 71-100 | 74.6% | 193 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.8% | 1628 |
| 16-30 | 38.3% | 222 |
| 31-50 | 52.7% | 110 |
| 51-70 | 35.3% | 34 |
| 71-100 | 16.7% | 6 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.3% | 1629 |
| 16-30 | 43.4% | 221 |
| 31-50 | 48.7% | 113 |
| 51-70 | 38.2% | 34 |
| 71-100 | 33.3% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.2% | 1616 |
| 16-30 | 42.0% | 226 |
| 31-50 | 53.4% | 118 |
| 51-70 | 36.4% | 33 |
| 71-100 | 28.6% | 7 |
