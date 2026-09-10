# Combat Simulation Report
Generated: 2026-08-05 14:02:19 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.2 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1810 (90.5%) |
| Timeouts (draws) | 190 (9.5%) |
| Avg rounds (all) | 7.3 |
| Avg rounds (KO only) | 5.9 |
| Rounds P50 / P90 / Max | 5 / 20 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 302 |
| Avg rounds | 7.2 |
| P50 / P90 | 5 / 18 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 923/2000 |
| Winrate | 46.2% |
| Advantage over 50% | -3.8% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 184 | 277 | 66.4% |  |
| Asesino | 95 | 256 | 37.1% |  |
| Esquivo | 92 | 297 | 31.0% |  |
| Equilibrado | 116 | 293 | 39.6% |  |
| Extremista ATK | 141 | 272 | 51.8% |  |
| Extremista DEF | 217 | 313 | 69.3% | YES |
| Extremista ASPD | 104 | 245 | 42.4% |  |
| Extremista REF | 176 | 313 | 56.2% |  |
| Velocista | 100 | 310 | 32.3% |  |
| Berserker | 145 | 280 | 51.8% |  |
| Guardian | 137 | 269 | 50.9% |  |
| Estratega | 183 | 301 | 60.8% |  |
| Gladiador | 172 | 286 | 60.1% |  |
| Magus | 137 | 288 | 47.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.7 | 0 |
| Heal applied | 32.9 | - |
| Rests | 4.1 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.0 | - |
| Battles with item use | 28.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.1% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.02 (avg 46.71) |
| ASPD spread (stddev) | 31.16 (avg 52.85) |
| Equipment tier A | 475 (11.9%) |
| Equipment tier B | 864 (21.6%) |
| Equipment tier C | 1046 (26.2%) |
| Equipment tier E | 1615 (40.4%) |
| Level 100-199 | 960 |
| Level 200-299 | 1092 |
| Level 300-399 | 1026 |
| Level 400-500 | 922 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 901 |
| cortante | 863 |
| desarmado | 395 |
| perforante | 1841 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2183 | 50.2% |
| ligera | 412 | 48.3% |
| media | 383 | 47.8% |
| total | 1022 | 51.1% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 89 | 42.7% |
| 3+ | 3911 | 50.1% |
Set bonus active: 50.1% (3911) vs inactive 42.7% (89)

### Amulet
With amulet: 50.7% (1571) vs without 49.5% (2429)

### Shield
With shield: 50.4% (2425) vs without 49.4% (1575)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 428 | 59.6% |
| B | 768 | 57.4% |
| C | 952 | 50.5% |
| E | 1457 | 44.9% |
| desarmado | 395 | 42.5% |

### Nature by level bracket
- **100-199**: contundente: 190, cortante: 205, desarmado: 101, perforante: 464
- **200-299**: contundente: 279, cortante: 230, desarmado: 102, perforante: 481
- **300-399**: contundente: 215, cortante: 228, desarmado: 89, perforante: 494
- **400-500**: contundente: 217, cortante: 200, desarmado: 103, perforante: 402

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 45.8% | 996 | 51.4% | 3004 | -5.6pp |
| d_fulgor | 45.8% | 987 | 51.3% | 3013 | -5.5pp |
| r_fulgor | 46.3% | 987 | 51.2% | 3013 | -4.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 15.6 | 0 | 106 | 6 | 12 | 22 |
| Asesino | 41.3 | 0 | 110 | 22 | 36 | 61 |
| Esquivo | 10.7 | 0 | 106 | 0 | 6 | 14 |
| Equilibrado | 23.0 | 0 | 106 | 8 | 20 | 33 |
| Extremista ATK | 45.9 | 0 | 114 | 20 | 49 | 71 |
| Extremista DEF | 6.0 | 0 | 100 | 0 | 0 | 8 |
| Extremista ASPD | 35.4 | 0 | 109 | 13 | 32 | 50 |
| Extremista REF | 22.4 | 0 | 106 | 12 | 18 | 28 |
| Velocista | 20.7 | 0 | 106 | 9 | 15 | 29 |
| Berserker | 47.1 | 0 | 105 | 25 | 50 | 68 |
| Guardian | 9.7 | 0 | 106 | 0 | 0 | 15 |
| Estratega | 23.8 | 0 | 106 | 11 | 20 | 31 |
| Gladiador | 40.2 | 0 | 112 | 18 | 37 | 59 |
| Magus | 36.3 | 0 | 111 | 17 | 33 | 53 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 307 | 307 | 100.0% |
| Asesino | 166 | 166 | 100.0% |
| Esquivo | 1201 | 1201 | 100.0% |
| Equilibrado | 923 | 923 | 100.0% |
| Extremista ATK | 115 | 115 | 100.0% |
| Extremista DEF | 381 | 381 | 100.0% |
| Extremista ASPD | 125 | 125 | 100.0% |
| Extremista REF | 194 | 194 | 100.0% |
| Velocista | 819 | 819 | 100.0% |
| Berserker | 212 | 212 | 100.0% |
| Guardian | 347 | 347 | 100.0% |
| Estratega | 530 | 530 | 100.0% |
| Gladiador | 312 | 312 | 100.0% |
| Magus | 310 | 310 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 26 | 1465 | 1.8% |
| Asesino | 17 | 794 | 2.1% |
| Esquivo | 375 | 2054 | 18.3% |
| Equilibrado | 52 | 1851 | 2.8% |
| Extremista ATK | 115 | 945 | 12.2% |
| Extremista DEF | 334 | 1590 | 21.0% |
| Extremista ASPD | 69 | 951 | 7.3% |
| Extremista REF | 942 | 1351 | 69.7% |
| Velocista | 0 | 1715 | 0.0% |
| Berserker | 158 | 1046 | 15.1% |
| Guardian | 46 | 1773 | 2.6% |
| Estratega | 840 | 1682 | 49.9% |
| Gladiador | 381 | 1073 | 35.5% |
| Magus | 235 | 1224 | 19.2% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 22 | 34 | 51 | 48 | 12 | 14 | 11 | 10 | 76 | 12 | 40 | 14 | 9 | 21 |
| 5 | 33 | 40 | 54 | 53 | 22 | 25 | 20 | 16 | 77 | 21 | 47 | 20 | 20 | 28 |
| 10 | 35 | 40 | 56 | 54 | 23 | 29 | 20 | 15 | 78 | 22 | 48 | 19 | 20 | 28 |
| 15 | 35 | 40 | 57 | 54 | 23 | 32 | 20 | 15 | 78 | 22 | 49 | 19 | 21 | 28 |
| 20 | 36 | 40 | 58 | 55 | 23 | 34 | 20 | 15 | 78 | 22 | 49 | 20 | 21 | 28 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 87.5% | 77.3% | 65.0% | 64.7% | 50.0% | 78.9% | 52.2% | 85.7% | 68.2% | 75.0% | 35.3% | 47.1% | 66.7% |
| Asesino | 12.5% | 50.0% | 77.8% | 71.4% | 31.6% | 20.0% | 58.8% | 21.4% | 57.9% | 18.2% | 33.3% | 30.8% | 31.8% | 25.0% |
| Esquivo | 22.7% | 22.2% | 50.0% | 52.4% | 50.0% | 18.2% | 36.8% | 19.2% | 37.0% | 23.5% | 41.2% | 30.8% | 9.5% | 13.6% |
| Equilibrado | 35.0% | 28.6% | 47.6% | 50.0% | 52.9% | 25.0% | 18.8% | 39.1% | 71.4% | 48.0% | 48.1% | 30.0% | 21.4% | 29.2% |
| Extremista ATK | 35.3% | 68.4% | 50.0% | 47.1% | 50.0% | 21.1% | 66.7% | 52.0% | 81.0% | 53.3% | 35.3% | 43.5% | 44.4% | 73.7% |
| Extremista DEF | 50.0% | 80.0% | 81.8% | 75.0% | 78.9% | 50.0% | 73.9% | 73.9% | 68.2% | 84.0% | 56.3% | 58.6% | 72.4% | 72.2% |
| Extremista ASPD | 21.1% | 41.2% | 63.2% | 81.3% | 33.3% | 26.1% | 50.0% | 18.8% | 60.0% | 44.4% | 56.3% | 41.7% | 35.3% | 38.9% |
| Extremista REF | 47.8% | 78.6% | 80.8% | 60.9% | 48.0% | 26.1% | 81.3% | 50.0% | 81.8% | 45.8% | 60.0% | 22.2% | 53.3% | 76.2% |
| Velocista | 14.3% | 42.1% | 63.0% | 28.6% | 19.0% | 31.8% | 40.0% | 18.2% | 50.0% | 34.8% | 37.9% | 16.7% | 20.0% | 30.8% |
| Berserker | 31.8% | 81.8% | 76.5% | 52.0% | 46.7% | 16.0% | 55.6% | 54.2% | 65.2% | 50.0% | 47.1% | 57.9% | 42.1% | 55.6% |
| Guardian | 25.0% | 66.7% | 58.8% | 51.9% | 64.7% | 43.8% | 43.8% | 40.0% | 62.1% | 52.9% | 50.0% | 58.3% | 30.4% | 68.2% |
| Estratega | 64.7% | 69.2% | 69.2% | 70.0% | 56.5% | 37.9% | 58.3% | 77.8% | 83.3% | 42.1% | 41.7% | 50.0% | 57.1% | 68.2% |
| Gladiador | 52.9% | 68.2% | 90.5% | 78.6% | 55.6% | 27.6% | 64.7% | 46.7% | 80.0% | 57.9% | 69.6% | 42.9% | 50.0% | 75.0% |
| Magus | 33.3% | 75.0% | 86.4% | 70.8% | 26.3% | 27.8% | 61.1% | 23.8% | 69.2% | 44.4% | 31.8% | 31.8% | 25.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.9% | 697 |
| 16-30 | 49.0% | 1035 |
| 31-50 | 51.1% | 754 |
| 51-70 | 48.9% | 401 |
| 71-100 | 53.1% | 1113 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 25.0% | 32 |
| 16-30 | 38.6% | 822 |
| 31-50 | 49.5% | 1519 |
| 51-70 | 52.5% | 627 |
| 71-100 | 59.3% | 1000 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 489 |
| 16-30 | 45.7% | 836 |
| 31-50 | 47.8% | 741 |
| 51-70 | 48.5% | 530 |
| 71-100 | 53.4% | 1404 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.6% | 869 |
| 16-30 | 46.5% | 1009 |
| 31-50 | 50.8% | 711 |
| 51-70 | 50.2% | 474 |
| 71-100 | 55.2% | 937 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.5% | 1593 |
| 16-30 | 52.9% | 1124 |
| 31-50 | 48.5% | 602 |
| 51-70 | 38.4% | 279 |
| 71-100 | 38.1% | 402 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.9% | 3208 |
| 16-30 | 44.0% | 470 |
| 31-50 | 49.6% | 262 |
| 51-70 | 50.0% | 50 |
| 71-100 | 30.0% | 10 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.7% | 3208 |
| 16-30 | 45.2% | 460 |
| 31-50 | 51.9% | 262 |
| 51-70 | 38.1% | 63 |
| 71-100 | 57.1% | 7 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3220 |
| 16-30 | 42.1% | 456 |
| 31-50 | 52.5% | 261 |
| 51-70 | 46.4% | 56 |
| 71-100 | 42.9% | 7 |
