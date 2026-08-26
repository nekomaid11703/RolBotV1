# Combat Simulation Report
Generated: 2026-08-06 14:08:50 | 150 simulations | Max 20 rounds

Config: numSims=150

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.8 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.9 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 150 |
| KO victories | 141 (94.0%) |
| Timeouts (draws) | 9 (6.0%) |
| Avg rounds (all) | 6.9 |
| Avg rounds (KO only) | 6.0 |
| Rounds P50 / P90 / Max | 5 / 15 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 35 |
| Avg rounds | 5.8 |
| P50 / P90 | 5 / 9 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 71/150 |
| Winrate | 47.3% |
| Advantage over 50% | -2.7% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 9 | 16 | 56.3% |  |
| Asesino | 6 | 22 | 27.3% |  |
| Esquivo | 4 | 20 | 20.0% |  |
| Equilibrado | 9 | 21 | 42.9% |  |
| Extremista ATK | 11 | 17 | 64.7% |  |
| Extremista DEF | 6 | 16 | 37.5% |  |
| Extremista ASPD | 9 | 18 | 50.0% |  |
| Extremista REF | 12 | 24 | 50.0% |  |
| Velocista | 6 | 21 | 28.6% |  |
| Berserker | 17 | 28 | 60.7% |  |
| Guardian | 17 | 34 | 50.0% |  |
| Estratega | 18 | 21 | 85.7% | YES |
| Gladiador | 16 | 23 | 69.6% |  |
| Magus | 10 | 19 | 52.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.8 | 0 |
| Heal applied | 35.2 | - |
| Rests | 3.2 | 2 |
| Advances | 4.5 | - |
| Retreats | 0.1 | - |
| Battles with item use | 26.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.7% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.42 (avg 46.65) |
| ASPD spread (stddev) | 31.73 (avg 53.64) |
| Equipment tier E | 300 (100.0%) |
| Level 100-199 | 80 |
| Level 200-299 | 78 |
| Level 300-399 | 62 |
| Level 400-500 | 80 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 58 |
| cortante | 65 |
| desarmado | 31 |
| perforante | 146 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 108 | 43.5% |
| ligera | 1 | 0.0% |
| media | 6 | 66.7% |
| total | 185 | 53.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 6 | 16.7% |
| 3+ | 294 | 50.7% |
Set bonus active: 50.7% (294) vs inactive 16.7% (6)

### Amulet
With amulet: 57.0% (121) vs without 45.3% (179)

### Shield
With shield: 52.0% (177) vs without 47.2% (123)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| E | 269 | 53.2% |
| desarmado | 31 | 22.6% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 61 | 42.6% |
| adamantita | 16 | 68.8% |
| bronce | 58 | 48.3% |
| desarmado | 31 | 22.6% |
| filo_estelar | 7 | 71.4% |
| hierro | 63 | 52.4% |
| mitril | 30 | 60.0% |
| titanio | 34 | 64.7% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 64 | 62.5% |
| mitico | 23 | 69.6% |
| ninguno | 31 | 22.6% |
| poco_comun | 182 | 47.8% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 76 | 47.4% |
| adamantita | 10 | 50.0% |
| bronce | 58 | 51.7% |
| filo_estelar | 14 | 57.1% |
| hierro | 61 | 50.8% |
| mitril | 43 | 41.9% |
| titanio | 38 | 57.9% |

### Nature by level bracket
- **100-199**: contundente: 15, cortante: 16, desarmado: 8, perforante: 41
- **200-299**: contundente: 13, cortante: 18, desarmado: 12, perforante: 35
- **300-399**: contundente: 11, cortante: 12, desarmado: 6, perforante: 33
- **400-500**: contundente: 19, cortante: 19, desarmado: 5, perforante: 37

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 50.0% | 76 | 50.0% | 224 | 0.0pp |
| d_fulgor | 50.6% | 79 | 49.8% | 221 | 0.9pp |
| r_fulgor | 50.7% | 75 | 49.8% | 225 | 0.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 17.7 | 7 | 39 | 9 | 14 | 20 |
| Asesino | 30.1 | 7 | 61 | 10 | 22 | 47 |
| Esquivo | 10.9 | 5 | 33 | 9 | 11 | 14 |
| Equilibrado | 23.6 | 5 | 82 | 12 | 20 | 33 |
| Extremista ATK | 54.1 | 20 | 100 | 36 | 61 | 64 |
| Extremista DEF | 14.3 | 2 | 51 | 8 | 11 | 17 |
| Extremista ASPD | 41.4 | 10 | 76 | 16 | 48 | 58 |
| Extremista REF | 16.8 | 9 | 53 | 11 | 14 | 21 |
| Velocista | 21.0 | 4 | 68 | 14 | 15 | 20 |
| Berserker | 55.2 | 9 | 76 | 50 | 51 | 71 |
| Guardian | 15.1 | 2 | 32 | 9 | 11 | 21 |
| Estratega | 22.6 | 9 | 61 | 19 | 20 | 27 |
| Gladiador | 38.6 | 12 | 77 | 23 | 30 | 51 |
| Magus | 40.9 | 11 | 77 | 20 | 32 | 64 |

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
| Tanque | 14 | 88 | 15.9% |
| Asesino | 0 | 54 | 0.0% |
| Esquivo | 60 | 102 | 58.8% |
| Equilibrado | 32 | 92 | 34.8% |
| Extremista ATK | 19 | 52 | 36.5% |
| Extremista DEF | 0 | 140 | 0.0% |
| Extremista ASPD | 5 | 67 | 7.5% |
| Extremista REF | 98 | 106 | 92.5% |
| Velocista | 21 | 77 | 27.3% |
| Berserker | 68 | 142 | 47.9% |
| Guardian | 50 | 178 | 28.1% |
| Estratega | 45 | 50 | 90.0% |
| Gladiador | 39 | 59 | 66.1% |
| Magus | 35 | 68 | 51.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 29 | 41 | 52 | 55 | 10 | 25 | 6 | 7 | 70 | 18 | 28 | 7 | 9 | 25 |
| 5 | 35 | 48 | 53 | 59 | 21 | 39 | 16 | 12 | 71 | 27 | 35 | 17 | 18 | 32 |
| 10 | 35 | 47 | 53 | 60 | 21 | 44 | 16 | 11 | 71 | 23 | 35 | 15 | 19 | 34 |
| 15 | 35 | 47 | 52 | 60 | 22 | 49 | 16 | 11 | 73 | 22 | 36 | 16 | 19 | 34 |
| 20 | 35 | 47 | 52 | 60 | 22 | 50 | 16 | 11 | 72 | 22 | 36 | 16 | 19 | 34 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 0.0% | 75.0% | 100.0% | 0.0% | 0.0% | 50.0% | 100.0% | 0.0% | 100.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% |
| Asesino | 25.0% | 50.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 40.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Esquivo | 0.0% | 0.0% | 50.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% | 50.0% | 25.0% | 0.0% | 0.0% | 0.0% |
| Equilibrado | 100.0% | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% | 33.3% | 33.3% | 0.0% | 0.0% |
| Extremista ATK | 0.0% | 0.0% | 100.0% | 100.0% | 50.0% | 100.0% | 0.0% | 0.0% | 0.0% | 66.7% | 66.7% | 0.0% | 0.0% | 50.0% |
| Extremista DEF | 50.0% | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 75.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Extremista ASPD | 0.0% | 100.0% | 100.0% | 100.0% | 0.0% | 0.0% | 50.0% | 0.0% | 0.0% | 0.0% | 33.3% | 50.0% | 0.0% | 0.0% |
| Extremista REF | 0.0% | 60.0% | 0.0% | 0.0% | 100.0% | 25.0% | 100.0% | 0.0% | 0.0% | 50.0% | 33.3% | 0.0% | 50.0% | 100.0% |
| Velocista | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 50.0% | 50.0% | 50.0% | 0.0% | 0.0% | 0.0% |
| Berserker | 0.0% | 100.0% | 50.0% | 100.0% | 33.3% | 100.0% | 100.0% | 50.0% | 50.0% | 0.0% | 60.0% | 0.0% | 50.0% | 60.0% |
| Guardian | 0.0% | 0.0% | 75.0% | 66.7% | 33.3% | 100.0% | 66.7% | 66.7% | 50.0% | 40.0% | 50.0% | 0.0% | 0.0% | 50.0% |
| Estratega | 100.0% | 100.0% | 100.0% | 66.7% | 100.0% | 100.0% | 50.0% | 100.0% | 100.0% | 100.0% | 100.0% | 0.0% | 100.0% | 50.0% |
| Gladiador | 0.0% | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 50.0% | 100.0% | 50.0% | 100.0% | 0.0% | 50.0% | 100.0% |
| Magus | 100.0% | 100.0% | 0.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0.0% | 100.0% | 40.0% | 50.0% | 50.0% | 0.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.0% | 55 |
| 16-30 | 49.4% | 81 |
| 31-50 | 50.0% | 52 |
| 51-70 | 44.8% | 29 |
| 71-100 | 59.0% | 83 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 0.0% | 0 |
| 16-30 | 38.5% | 65 |
| 31-50 | 50.0% | 114 |
| 51-70 | 63.0% | 46 |
| 71-100 | 52.0% | 75 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.5% | 40 |
| 16-30 | 46.6% | 58 |
| 31-50 | 42.9% | 56 |
| 51-70 | 50.0% | 36 |
| 71-100 | 58.2% | 110 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.7% | 73 |
| 16-30 | 40.0% | 65 |
| 31-50 | 42.1% | 57 |
| 51-70 | 60.5% | 38 |
| 71-100 | 59.7% | 67 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.8% | 125 |
| 16-30 | 48.8% | 82 |
| 31-50 | 45.0% | 40 |
| 51-70 | 38.1% | 21 |
| 71-100 | 40.6% | 32 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 242 |
| 16-30 | 53.1% | 32 |
| 31-50 | 45.5% | 22 |
| 51-70 | 25.0% | 4 |
| 71-100 | 0.0% | 0 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 242 |
| 16-30 | 51.4% | 37 |
| 31-50 | 46.7% | 15 |
| 51-70 | 40.0% | 5 |
| 71-100 | 100.0% | 1 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.8% | 242 |
| 16-30 | 50.0% | 36 |
| 31-50 | 35.3% | 17 |
| 51-70 | 60.0% | 5 |
| 71-100 | 0.0% | 0 |
