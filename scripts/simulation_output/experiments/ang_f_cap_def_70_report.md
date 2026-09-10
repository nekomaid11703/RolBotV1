# Combat Simulation Report
Generated: 2026-08-07 18:06:56 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.3 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1956 (97.8%) |
| Timeouts (draws) | 44 (2.2%) |
| Avg rounds (all) | 5.7 |
| Avg rounds (KO only) | 5.3 |
| Rounds P50 / P90 / Max | 4 / 11 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 249 |
| Avg rounds | 6.3 |
| P50 / P90 | 5 / 13 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 965/2000 |
| Winrate | 48.3% |
| Advantage over 50% | -1.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 191 | 283 | 67.5% | YES |
| Asesino | 80 | 244 | 32.8% |  |
| Esquivo | 75 | 307 | 24.4% |  |
| Equilibrado | 102 | 276 | 37.0% |  |
| Extremista ATK | 150 | 262 | 57.3% |  |
| Extremista DEF | 195 | 289 | 67.5% |  |
| Extremista ASPD | 165 | 297 | 55.6% |  |
| Extremista REF | 168 | 278 | 60.4% |  |
| Velocista | 45 | 284 | 15.8% |  |
| Berserker | 171 | 295 | 58.0% |  |
| Guardian | 172 | 318 | 54.1% |  |
| Estratega | 174 | 285 | 61.1% |  |
| Gladiador | 185 | 295 | 62.7% |  |
| Magus | 127 | 287 | 44.3% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 28.6 | - |
| Rests | 3.1 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.7 | - |
| Battles with item use | 25.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.6% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.09 (avg 46.90) |
| ASPD spread (stddev) | 31.04 (avg 53.00) |
| Equipment tier A | 144 (3.6%) |
| Equipment tier B | 1659 (41.5%) |
| Equipment tier C | 696 (17.4%) |
| Equipment tier D | 1164 (29.1%) |
| Equipment tier S | 337 (8.4%) |
| Level 100-199 | 955 |
| Level 200-299 | 1110 |
| Level 300-399 | 990 |
| Level 400-500 | 945 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 861 |
| cortante | 890 |
| desarmado | 415 |
| perforante | 1834 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1287 | 49.7% |
| ligera | 12 | 50.0% |
| media | 133 | 42.1% |
| total | 2568 | 50.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 100 | 43.0% |
| 3+ | 3900 | 50.2% |
Set bonus active: 50.2% (3900) vs inactive 43.0% (100)

### Amulet
With amulet: 51.8% (1567) vs without 48.8% (2433)

### Shield
With shield: 50.3% (2390) vs without 49.5% (1610)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 129 | 61.2% |
| B | 1479 | 58.4% |
| C | 621 | 45.7% |
| D | 1059 | 40.5% |
| S | 297 | 74.1% |
| desarmado | 415 | 29.9% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 822 | 50.9% |
| adamantita | 143 | 72.7% |
| bronce | 785 | 39.6% |
| desarmado | 415 | 29.9% |
| filo_estelar | 154 | 75.3% |
| hierro | 829 | 47.5% |
| mitril | 434 | 62.0% |
| titanio | 418 | 63.2% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 852 | 62.6% |
| mitico | 297 | 74.1% |
| ninguno | 415 | 29.9% |
| poco_comun | 2436 | 46.1% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 824 | 48.7% |
| adamantita | 171 | 49.7% |
| bronce | 875 | 49.3% |
| filo_estelar | 186 | 44.1% |
| hierro | 939 | 52.2% |
| mitril | 513 | 49.3% |
| titanio | 492 | 52.4% |

### Nature by level bracket
- **100-199**: contundente: 197, cortante: 214, desarmado: 91, perforante: 453
- **200-299**: contundente: 245, cortante: 262, desarmado: 120, perforante: 483
- **300-399**: contundente: 224, cortante: 201, desarmado: 99, perforante: 466
- **400-500**: contundente: 195, cortante: 213, desarmado: 105, perforante: 432

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 49.3% | 1015 | 50.3% | 2985 | -1.0pp |
| d_fulgor | 48.7% | 1010 | 50.4% | 2990 | -1.7pp |
| r_fulgor | 49.0% | 997 | 50.3% | 3003 | -1.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.0 | 1 | 119 | 13 | 25 | 38 |
| Asesino | 43.2 | 1 | 141 | 13 | 42 | 66 |
| Esquivo | 24.8 | 1 | 130 | 14 | 21 | 29 |
| Equilibrado | 32.6 | 1 | 161 | 16 | 29 | 45 |
| Extremista ATK | 57.9 | 1 | 181 | 24 | 59 | 88 |
| Extremista DEF | 26.7 | 1 | 136 | 14 | 23 | 35 |
| Extremista ASPD | 46.3 | 1 | 155 | 20 | 44 | 68 |
| Extremista REF | 32.2 | 1 | 139 | 17 | 29 | 44 |
| Velocista | 27.8 | 1 | 121 | 12 | 24 | 38 |
| Berserker | 60.7 | 1 | 173 | 32 | 64 | 86 |
| Guardian | 23.1 | 1 | 133 | 10 | 18 | 30 |
| Estratega | 34.0 | 1 | 138 | 17 | 29 | 47 |
| Gladiador | 51.8 | 1 | 150 | 23 | 49 | 77 |
| Magus | 44.0 | 1 | 172 | 17 | 37 | 64 |

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
| Tanque | 181 | 961 | 18.8% |
| Asesino | 69 | 585 | 11.8% |
| Esquivo | 581 | 974 | 59.7% |
| Equilibrado | 259 | 995 | 26.0% |
| Extremista ATK | 91 | 687 | 13.2% |
| Extremista DEF | 349 | 1132 | 30.8% |
| Extremista ASPD | 139 | 820 | 17.0% |
| Extremista REF | 639 | 832 | 76.8% |
| Velocista | 90 | 809 | 11.1% |
| Berserker | 100 | 679 | 14.7% |
| Guardian | 185 | 1312 | 14.1% |
| Estratega | 631 | 877 | 71.9% |
| Gladiador | 305 | 595 | 51.3% |
| Magus | 223 | 795 | 28.1% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 23 | 47 | 56 | 53 | 14 | 15 | 12 | 11 | 107 | 13 | 44 | 15 | 10 | 26 |
| 5 | 37 | 52 | 60 | 58 | 23 | 28 | 22 | 17 | 110 | 22 | 59 | 23 | 20 | 33 |
| 10 | 39 | 52 | 60 | 58 | 23 | 31 | 22 | 16 | 111 | 22 | 59 | 23 | 20 | 33 |
| 15 | 39 | 52 | 61 | 59 | 24 | 32 | 22 | 17 | 111 | 22 | 60 | 23 | 20 | 33 |
| 20 | 39 | 52 | 61 | 59 | 24 | 33 | 22 | 17 | 111 | 22 | 60 | 23 | 20 | 33 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 84.0% | 100.0% | 83.3% | 62.5% | 53.8% | 66.7% | 56.3% | 88.9% | 80.0% | 42.9% | 47.4% | 52.6% | 65.0% |
| Asesino | 16.0% | 50.0% | 73.7% | 38.9% | 25.0% | 14.3% | 22.2% | 25.0% | 69.6% | 16.7% | 37.5% | 25.0% | 10.0% | 27.8% |
| Esquivo | 0.0% | 26.3% | 50.0% | 27.8% | 10.0% | 8.3% | 19.0% | 19.0% | 62.5% | 17.4% | 37.9% | 10.3% | 27.3% | 17.6% |
| Equilibrado | 16.7% | 61.1% | 72.2% | 50.0% | 46.7% | 19.0% | 29.4% | 16.7% | 77.3% | 47.8% | 21.1% | 16.7% | 15.4% | 32.0% |
| Extremista ATK | 37.5% | 75.0% | 90.0% | 53.3% | 50.0% | 40.0% | 61.1% | 38.9% | 86.7% | 52.4% | 63.6% | 48.1% | 38.9% | 73.1% |
| Extremista DEF | 46.2% | 85.7% | 91.7% | 81.0% | 60.0% | 50.0% | 57.1% | 63.2% | 90.5% | 52.2% | 80.0% | 47.4% | 66.7% | 78.6% |
| Extremista ASPD | 33.3% | 77.8% | 81.0% | 70.6% | 38.9% | 42.9% | 50.0% | 35.3% | 87.5% | 50.0% | 48.3% | 44.4% | 42.1% | 78.9% |
| Extremista REF | 43.8% | 75.0% | 81.0% | 83.3% | 61.1% | 36.8% | 64.7% | 50.0% | 95.7% | 45.0% | 40.7% | 59.3% | 45.8% | 83.3% |
| Velocista | 11.1% | 30.4% | 37.5% | 22.7% | 13.3% | 9.5% | 12.5% | 4.3% | 50.0% | 0.0% | 0.0% | 6.7% | 12.0% | 15.8% |
| Berserker | 20.0% | 83.3% | 82.6% | 52.2% | 47.6% | 47.8% | 50.0% | 55.0% | 100.0% | 50.0% | 55.6% | 41.7% | 50.0% | 66.7% |
| Guardian | 57.1% | 62.5% | 62.1% | 78.9% | 36.4% | 20.0% | 51.7% | 59.3% | 100.0% | 44.4% | 50.0% | 40.7% | 39.4% | 60.0% |
| Estratega | 52.6% | 75.0% | 89.7% | 83.3% | 51.9% | 52.6% | 55.6% | 40.7% | 93.3% | 58.3% | 59.3% | 50.0% | 40.9% | 63.6% |
| Gladiador | 47.4% | 90.0% | 72.7% | 84.6% | 61.1% | 33.3% | 57.9% | 54.2% | 88.0% | 50.0% | 60.6% | 59.1% | 50.0% | 75.0% |
| Magus | 35.0% | 72.2% | 82.4% | 68.0% | 26.9% | 21.4% | 21.1% | 16.7% | 84.2% | 33.3% | 40.0% | 36.4% | 25.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.1% | 674 |
| 16-30 | 48.2% | 1082 |
| 31-50 | 47.7% | 703 |
| 51-70 | 48.8% | 414 |
| 71-100 | 56.6% | 1127 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 33.3% | 30 |
| 16-30 | 42.8% | 884 |
| 31-50 | 48.3% | 1438 |
| 51-70 | 51.1% | 618 |
| 71-100 | 58.4% | 1030 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.6% | 487 |
| 16-30 | 46.8% | 793 |
| 31-50 | 46.0% | 791 |
| 51-70 | 45.5% | 536 |
| 71-100 | 54.6% | 1393 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.9% | 913 |
| 16-30 | 48.8% | 989 |
| 31-50 | 47.6% | 695 |
| 51-70 | 48.8% | 477 |
| 71-100 | 51.7% | 926 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.7% | 1606 |
| 16-30 | 52.9% | 1100 |
| 31-50 | 46.0% | 619 |
| 51-70 | 34.2% | 278 |
| 71-100 | 28.0% | 397 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3206 |
| 16-30 | 49.8% | 456 |
| 31-50 | 44.9% | 263 |
| 51-70 | 63.1% | 65 |
| 71-100 | 60.0% | 10 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 3204 |
| 16-30 | 46.5% | 458 |
| 31-50 | 48.8% | 256 |
| 51-70 | 57.9% | 76 |
| 71-100 | 66.7% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3194 |
| 16-30 | 47.6% | 466 |
| 31-50 | 50.0% | 272 |
| 51-70 | 51.7% | 58 |
| 71-100 | 90.0% | 10 |
