# Combat Simulation Report
Generated: 2026-08-05 02:25:56 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 13.8 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 949 (94.9%) |
| Timeouts (draws) | 51 (5.1%) |
| Avg rounds (all) | 12.0 |
| Avg rounds (KO only) | 9.9 |
| Rounds P50 / P90 / Max | 7 / 29 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 140 |
| Avg rounds | 13.8 |
| P50 / P90 | 8 / 39 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 526/1000 |
| Winrate | 52.6% |
| Advantage over 50% | 2.6% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 107 | 163 | 65.6% | YES |
| Asesino | 44 | 148 | 29.7% |  |
| Esquivo | 70 | 129 | 54.3% |  |
| Equilibrado | 93 | 151 | 61.6% |  |
| Extremista ATK | 59 | 149 | 39.6% |  |
| Extremista DEF | 74 | 134 | 55.2% |  |
| Extremista ASPD | 54 | 140 | 38.6% |  |
| Extremista REF | 60 | 134 | 44.8% |  |
| Velocista | 86 | 149 | 57.7% |  |
| Berserker | 60 | 133 | 45.1% |  |
| Guardian | 87 | 148 | 58.8% |  |
| Estratega | 67 | 147 | 45.6% |  |
| Gladiador | 68 | 132 | 51.5% |  |
| Magus | 71 | 143 | 49.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.4 | 1 |
| Heal applied | 85.0 | - |
| Rests | 6.7 | 3 |
| Advances | 4.1 | - |
| Retreats | 0.2 | - |
| Battles with item use | 50.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.14 (avg 47.48) |
| ASPD spread (stddev) | 31.22 (avg 53.36) |
| Equipment tier A | 227 (11.3%) |
| Equipment tier B | 428 (21.4%) |
| Equipment tier C | 519 (25.9%) |
| Equipment tier E | 826 (41.3%) |
| Level 100-199 | 483 |
| Level 200-299 | 571 |
| Level 300-399 | 489 |
| Level 400-500 | 457 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 588 |
| cortante | 573 |
| desarmado | 220 |
| perforante | 619 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 554 | 47.3% |
| ligera | 15 | 33.3% |
| media | 172 | 47.7% |
| total | 1259 | 51.7% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 105 | 41.0% |
| 3+ | 1895 | 50.5% |
Set bonus active: 50.5% (1895) vs inactive 41.0% (105)

### Amulet
With amulet: 51.3% (792) vs without 49.2% (1208)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 203 | 70.4% |
| B | 375 | 57.3% |
| C | 469 | 52.2% |
| E | 733 | 41.7% |
| desarmado | 220 | 41.4% |

### Nature by level bracket
- **100-199**: contundente: 139, cortante: 146, desarmado: 54, perforante: 144
- **200-299**: contundente: 182, cortante: 163, desarmado: 57, perforante: 169
- **300-399**: contundente: 149, cortante: 137, desarmado: 59, perforante: 144
- **400-500**: contundente: 118, cortante: 127, desarmado: 50, perforante: 162

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.9% | 473 | 52.5% | 1527 | -10.7pp |
| d_fulgor | 41.1% | 460 | 52.7% | 1540 | -11.6pp |
| r_fulgor | 41.2% | 464 | 52.7% | 1536 | -11.5pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 14.3 | 0 | 128 | 0 | 11 | 19 |
| Asesino | 53.3 | 0 | 128 | 35 | 48 | 75 |
| Esquivo | 11.7 | 0 | 128 | 0 | 3 | 16 |
| Equilibrado | 28.6 | 0 | 128 | 0 | 26 | 42 |
| Extremista ATK | 55.8 | 0 | 128 | 40 | 49 | 74 |
| Extremista DEF | 5.6 | 0 | 128 | 0 | 0 | 0 |
| Extremista ASPD | 50.8 | 0 | 128 | 30 | 47 | 65 |
| Extremista REF | 30.8 | 0 | 128 | 12 | 19 | 42 |
| Velocista | 21.6 | 0 | 128 | 9 | 16 | 26 |
| Berserker | 56.2 | 0 | 128 | 46 | 52 | 75 |
| Guardian | 10.0 | 0 | 128 | 0 | 2 | 14 |
| Estratega | 24.8 | 0 | 128 | 11 | 19 | 27 |
| Gladiador | 52.0 | 0 | 128 | 34 | 47 | 71 |
| Magus | 46.6 | 0 | 128 | 22 | 41 | 64 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 186 | 186 | 100.0% |
| Asesino | 183 | 183 | 100.0% |
| Esquivo | 1597 | 1597 | 100.0% |
| Equilibrado | 1019 | 1019 | 100.0% |
| Extremista ATK | 139 | 139 | 100.0% |
| Extremista DEF | 104 | 104 | 100.0% |
| Extremista ASPD | 165 | 165 | 100.0% |
| Extremista REF | 113 | 113 | 100.0% |
| Velocista | 730 | 730 | 100.0% |
| Berserker | 125 | 125 | 100.0% |
| Guardian | 680 | 680 | 100.0% |
| Estratega | 420 | 420 | 100.0% |
| Gladiador | 180 | 180 | 100.0% |
| Magus | 505 | 505 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 61 | 1579 | 3.9% |
| Asesino | 2 | 676 | 0.3% |
| Esquivo | 241 | 1962 | 12.3% |
| Equilibrado | 44 | 1675 | 2.6% |
| Extremista ATK | 112 | 919 | 12.2% |
| Extremista DEF | 281 | 1310 | 21.5% |
| Extremista ASPD | 62 | 826 | 7.5% |
| Extremista REF | 651 | 915 | 71.1% |
| Velocista | 0 | 1260 | 0.0% |
| Berserker | 162 | 892 | 18.2% |
| Guardian | 43 | 1965 | 2.2% |
| Estratega | 687 | 1400 | 49.1% |
| Gladiador | 222 | 747 | 29.7% |
| Magus | 68 | 1083 | 6.3% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 14 | 15 | 12 | 17 | 11 | 12 | 10 | 10 | 6 | 9 | 15 | 14 | 10 | 16 |
| 5 | 25 | 21 | 16 | 24 | 18 | 21 | 19 | 14 | 12 | 19 | 23 | 19 | 18 | 23 |
| 10 | 29 | 21 | 19 | 26 | 18 | 26 | 19 | 13 | 14 | 20 | 26 | 17 | 19 | 24 |
| 15 | 30 | 21 | 22 | 26 | 19 | 27 | 19 | 13 | 14 | 19 | 30 | 18 | 19 | 24 |
| 20 | 31 | 21 | 23 | 26 | 19 | 29 | 19 | 13 | 14 | 20 | 31 | 18 | 19 | 25 |
| 25 | 30 | 21 | 24 | 27 | 19 | 28 | 19 | 13 | 14 | 20 | 32 | 18 | 20 | 26 |
| 30 | 30 | 21 | 24 | 27 | 19 | 28 | 19 | 13 | 14 | 20 | 32 | 19 | 20 | 26 |
| 40 | 29 | 22 | 25 | 28 | 19 | 28 | 19 | 13 | 14 | 20 | 32 | 19 | 20 | 27 |
| 50 | 29 | 22 | 25 | 28 | 20 | 27 | 20 | 13 | 14 | 20 | 31 | 19 | 20 | 28 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 85.7% | 50.0% | 57.1% | 86.7% | 50.0% | 90.0% | 70.0% | 60.0% | 72.7% | 42.9% | 65.0% | 71.4% | 61.5% |
| Asesino | 14.3% | 50.0% | 27.3% | 18.2% | 50.0% | 40.0% | 40.0% | 30.8% | 23.1% | 37.5% | 8.3% | 33.3% | 37.5% | 22.2% |
| Esquivo | 50.0% | 72.7% | 50.0% | 43.8% | 100.0% | 75.0% | 53.8% | 66.7% | 50.0% | 33.3% | 25.0% | 55.6% | 40.0% | 57.1% |
| Equilibrado | 42.9% | 81.8% | 56.3% | 50.0% | 66.7% | 60.0% | 66.7% | 91.7% | 44.4% | 80.0% | 66.7% | 53.8% | 45.5% | 64.3% |
| Extremista ATK | 13.3% | 50.0% | 0.0% | 33.3% | 50.0% | 47.1% | 52.9% | 55.6% | 33.3% | 50.0% | 16.7% | 37.5% | 50.0% | 40.0% |
| Extremista DEF | 50.0% | 60.0% | 25.0% | 40.0% | 52.9% | 50.0% | 83.3% | 66.7% | 40.0% | 81.8% | 55.6% | 50.0% | 44.4% | 50.0% |
| Extremista ASPD | 10.0% | 60.0% | 46.2% | 33.3% | 47.1% | 16.7% | 50.0% | 14.3% | 16.7% | 30.0% | 46.2% | 62.5% | 33.3% | 55.6% |
| Extremista REF | 30.0% | 69.2% | 33.3% | 8.3% | 44.4% | 33.3% | 85.7% | 50.0% | 45.5% | 37.5% | 60.0% | 50.0% | 41.7% | 50.0% |
| Velocista | 40.0% | 76.9% | 50.0% | 55.6% | 66.7% | 60.0% | 83.3% | 54.5% | 50.0% | 100.0% | 41.2% | 45.5% | 55.6% | 45.5% |
| Berserker | 27.3% | 62.5% | 66.7% | 20.0% | 50.0% | 18.2% | 70.0% | 62.5% | 0.0% | 50.0% | 42.9% | 66.7% | 50.0% | 50.0% |
| Guardian | 57.1% | 91.7% | 75.0% | 33.3% | 83.3% | 44.4% | 53.8% | 40.0% | 58.8% | 57.1% | 50.0% | 55.6% | 54.5% | 72.7% |
| Estratega | 35.0% | 66.7% | 44.4% | 46.2% | 62.5% | 50.0% | 37.5% | 50.0% | 54.5% | 33.3% | 44.4% | 50.0% | 20.0% | 42.9% |
| Gladiador | 28.6% | 62.5% | 60.0% | 54.5% | 50.0% | 55.6% | 66.7% | 58.3% | 44.4% | 50.0% | 45.5% | 80.0% | 50.0% | 33.3% |
| Magus | 38.5% | 77.8% | 42.9% | 35.7% | 60.0% | 50.0% | 44.4% | 50.0% | 54.5% | 50.0% | 27.3% | 57.1% | 66.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.1% | 347 |
| 16-30 | 51.2% | 516 |
| 31-50 | 52.3% | 346 |
| 51-70 | 53.9% | 206 |
| 71-100 | 48.5% | 585 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 28.0% | 25 |
| 16-30 | 34.5% | 458 |
| 31-50 | 45.3% | 704 |
| 51-70 | 60.3% | 307 |
| 71-100 | 65.4% | 506 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.7% | 255 |
| 16-30 | 44.5% | 391 |
| 31-50 | 52.0% | 379 |
| 51-70 | 53.5% | 256 |
| 71-100 | 51.9% | 719 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.0% | 478 |
| 16-30 | 44.7% | 501 |
| 31-50 | 54.2% | 365 |
| 51-70 | 57.0% | 235 |
| 71-100 | 58.9% | 421 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.8% | 792 |
| 16-30 | 40.5% | 546 |
| 31-50 | 50.2% | 313 |
| 51-70 | 75.7% | 152 |
| 71-100 | 73.1% | 197 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.9% | 1641 |
| 16-30 | 39.3% | 211 |
| 31-50 | 41.5% | 123 |
| 51-70 | 57.1% | 21 |
| 71-100 | 50.0% | 4 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 1633 |
| 16-30 | 37.5% | 232 |
| 31-50 | 39.3% | 107 |
| 51-70 | 50.0% | 24 |
| 71-100 | 50.0% | 4 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 1640 |
| 16-30 | 37.7% | 220 |
| 31-50 | 42.1% | 114 |
| 51-70 | 36.4% | 22 |
| 71-100 | 75.0% | 4 |
