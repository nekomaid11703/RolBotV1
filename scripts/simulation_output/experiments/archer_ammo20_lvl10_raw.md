# Auditoría profunda — baseline 10k

Fecha: 2026-08-06T19:47:13.503Z · Sims: 10000 · Máx rounds: 20
Filtro de nivel: parejas con |Δnivel| ≤ 10% (control de confound)

## 1. Winrate por personalidad (global, sin control de nivel)

Referencia: emparejamiento aleatorio → el winrate esperado si todas fueran iguales es 50%. Meta = la que supere el 55%.

| Grupo | Winrate | n |
|-------|---------|----|
| tanque | 66.0% | 1425 |
| extremista_defensa | 65.8% | 1450 |
| gladiador | 65.5% | 1393 |
| estratega | 63.4% | 1425 |
| berserker | 58.6% | 1457 |
| extremista_ataque | 57.4% | 1488 |
| extremista_reflejos | 57.1% | 1429 |
| extremista_velocidad | 55.1% | 1424 |
| guardian | 52.0% | 1380 |
| magus | 44.8% | 1412 |
| equilibrado | 38.1% | 1422 |
| asesino | 31.1% | 1484 |
| esquivo | 27.7% | 1406 |
| velocista | 16.6% | 1405 |

## 2. Matchup winrate A vs B (parejas con nivel similar)

Lee la celda (fila build A, columna build B) = winrate de A cuando pelea contra B. Detrás de la diagonal está el espejo.

| A\B | asesino | berserke | equilibr | esquivo | estrateg | extremis | extremis | extremis | extremis | gladiado | guardian | magus | tanque | velocist |
|-----|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| asesino | 29% | 13% | 31% | 40% | 18% | 26% | 11% | 22% | 14% | 9% | 10% | 15% | 6% | 72% |
| berserker | 81% | 45% | 85% | 83% | 47% | 52% | 42% | 53% | 48% | 30% | 48% | 57% | 25% | 89% |
| equilibrado | 37% | 24% | 34% | 37% | 16% | 35% | 12% | 17% | 37% | 19% | 20% | 24% | 16% | 56% |
| esquivo | 23% | 20% | 13% | 25% | 4% | 17% | 9% | 17% | 22% | 11% | 15% | 17% | 13% | 56% |
| estratega | 80% | 55% | 71% | 84% | 40% | 42% | 43% | 63% | 52% | 57% | 64% | 65% | 49% | 90% |
| extremista_a | 75% | 34% | 60% | 81% | 35% | 45% | 33% | 52% | 44% | 56% | 41% | 73% | 35% | 90% |
| extremista_d | 73% | 61% | 57% | 86% | 57% | 57% | 40% | 67% | 63% | 55% | 61% | 68% | 37% | 87% |
| extremista_r | 82% | 34% | 65% | 78% | 47% | 47% | 40% | 59% | 50% | 42% | 39% | 65% | 38% | 85% |
| extremista_v | 70% | 39% | 56% | 85% | 49% | 33% | 30% | 61% | 44% | 38% | 54% | 66% | 26% | 76% |
| gladiador | 87% | 33% | 75% | 79% | 61% | 50% | 45% | 59% | 65% | 51% | 63% | 65% | 52% | 91% |
| guardian | 70% | 55% | 44% | 53% | 45% | 48% | 29% | 34% | 61% | 24% | 36% | 40% | 31% | 64% |
| magus | 55% | 28% | 46% | 75% | 26% | 27% | 32% | 30% | 26% | 19% | 43% | 47% | 23% | 74% |
| tanque | 79% | 64% | 72% | 73% | 33% | 57% | 63% | 41% | 53% | 51% | 58% | 67% | 41% | 89% |
| velocista | 14% | 8% | 5% | 5% | 5% | 5% | 6% | 8% | 4% | 2% | 2% | 12% | 4% | 11% |

## 3. Efecto del equipamiento (parejas con nivel similar)

### 3.1 Naturaleza de arma

| Grupo | Winrate | n |
|-------|---------|----|
| cortante | 59.9% | 4315 |
| perforante | 53.1% | 8644 |
| contundente | 39.9% | 4354 |
| desarmado | 36.6% | 1921 |

### 3.2 Tier del arma

| Grupo | Winrate | n |
|-------|---------|----|
| S | 64.4% | 1591 |
| A | 59.1% | 728 |
| B | 53.3% | 7590 |
| C | 47.5% | 2821 |
| D | 45.1% | 4583 |

### 3.3 Material del arma

| Grupo | Winrate | n |
|-------|---------|----|
| adamantita | 65.0% | 832 |
| filo_estelar | 63.8% | 759 |
| mitril | 59.7% | 2044 |
| titanio | 59.0% | 2118 |
| acero | 50.2% | 3831 |
| hierro | 46.9% | 3861 |
| bronce | 43.4% | 3868 |
| desarmado | 36.6% | 1921 |

### 3.4 Rareza del material del arma

| Grupo | Winrate | n |
|-------|---------|----|
| mitico | 64.4% | 1591 |
| epico | 59.3% | 4162 |
| poco_comun | 46.8% | 11560 |
| ninguno | 36.6% | 1921 |

### 3.5 Cobertura dominante

| Grupo | Winrate | n |
|-------|---------|----|
| total | 50.8% | 12351 |
| alta | 48.9% | 6188 |
| ligera | 45.3% | 75 |
| media | 44.7% | 618 |

### 3.6 Con munición (arquero)

| Grupo | Winrate | n |
|-------|---------|----|
| con munición | 55.4% | 4331 |
| sin munición | 50.8% | 4313 |
| no ranged | 47.5% | 10590 |

### 3.7 Con escudo

| Grupo | Winrate | n |
|-------|---------|----|
| con escudo | 50.0% | 11665 |
| sin escudo | 50.0% | 7569 |

### 3.8 Con amuleto

| Grupo | Winrate | n |
|-------|---------|----|
| con amuleto | 50.9% | 7591 |
| sin amuleto | 49.4% | 11643 |

### 3.9 Set bonus activo

| Grupo | Winrate | n |
|-------|---------|----|
| set activo | 50.1% | 18862 |
| set inactivo | 42.5% | 372 |

## 4. Winrate del set bonus / amuleto / escudo por bracket de nivel (¿progresión o balance?)

Si el set/amuleto dieran progresión pura, su efecto sería constante; si fueran balance, el winrate sería ~50% en todo bracket.

### Set bonus activo

| Bracket nivel | Winrate con | n | Winrate sin | n | Diff |
|---------------|-------------|----|-------------|----|------|
| 100–199 | 50.0% | 4066 | 36.6% | 71 | 13.3pp |
| 200–299 | 50.1% | 4687 | 46.7% | 107 | 3.3pp |
| 300–399 | 50.3% | 4891 | 37.3% | 110 | 13.0pp |
| 400–500 | 50.1% | 5218 | 48.8% | 84 | 1.3pp |

### Amuleto

| Bracket nivel | Winrate con | n | Winrate sin | n | Diff |
|---------------|-------------|----|-------------|----|------|
| 100–199 | 51.3% | 1564 | 48.7% | 2573 | 2.6pp |
| 200–299 | 50.8% | 1902 | 49.5% | 2892 | 1.3pp |
| 300–399 | 51.7% | 2008 | 48.8% | 2993 | 2.9pp |
| 400–500 | 49.9% | 2117 | 50.2% | 3185 | -0.3pp |

### Escudo

| Bracket nivel | Winrate con | n | Winrate sin | n | Diff |
|---------------|-------------|----|-------------|----|------|
| 100–199 | 49.3% | 2529 | 50.3% | 1608 | -1.0pp |
| 200–299 | 50.6% | 2911 | 49.1% | 1883 | 1.4pp |
| 300–399 | 50.4% | 3003 | 49.4% | 1998 | 1.0pp |
| 400–500 | 49.5% | 3222 | 51.0% | 2080 | -1.5pp |

## 5. Meta y anti-meta (winrate de cada personalidad con el equipo que le tocó)

Descompone el winrate global de cada personalidad según armó/perdió el bono de set. Un build que depende del set para ganar es frágil (anti-meta lo quita).

| Build | Winrate | n |
|-------|---------|----|
| extremista_defensa · set SÍ | 66.0% | 1341 |
| tanque · set SÍ | 65.7% | 1331 |
| gladiador · set SÍ | 65.1% | 1322 |
| estratega · set SÍ | 64.2% | 1340 |
| berserker · set SÍ | 59.2% | 1384 |
| extremista_reflejos · set SÍ | 57.6% | 1360 |
| extremista_ataque · set SÍ | 57.3% | 1404 |
| extremista_velocidad · set SÍ | 55.6% | 1332 |
| extremista_ataque · set no | 54.1% | 37 |
| guardian · set SÍ | 52.8% | 1308 |
| magus · set SÍ | 45.0% | 1339 |
| equilibrado · set SÍ | 38.1% | 1351 |
| asesino · set SÍ | 30.9% | 1403 |
| equilibrado · set no | 30.3% | 33 |
| esquivo · set SÍ | 27.5% | 1334 |
| velocista · set SÍ | 16.5% | 1313 |
| velocista · set no | 11.1% | 36 |

**Meta**: extremista_defensa · set SÍ ≈ 66.0% · **Anti-meta/peor**: velocista · set no ≈ 11.1%

## 6. Duración media de la pelea por personalidad (¿builds que estiran o matan rápido?)

| Personalidad | Duración media | Daño/turno medio | Winrate | n |
|--------------|----------------|------------------|---------|----|
| extremista_defensa | 10.35 | 24.7 | 65.8% | 1450 |
| tanque | 9.08 | 26.8 | 66.0% | 1425 |
| guardian | 8.80 | 21.7 | 52.0% | 1380 |
| extremista_reflejos | 8.01 | 30.5 | 57.1% | 1429 |
| estratega | 7.42 | 33.4 | 63.4% | 1425 |
| gladiador | 5.68 | 49.0 | 65.5% | 1393 |
| extremista_velocidad | 5.55 | 44.5 | 55.1% | 1424 |
| equilibrado | 5.48 | 27.6 | 38.1% | 1422 |
| esquivo | 5.39 | 16.4 | 27.7% | 1406 |
| magus | 5.33 | 37.6 | 44.8% | 1412 |
| berserker | 5.22 | 54.8 | 58.6% | 1457 |
| extremista_ataque | 5.13 | 52.8 | 57.4% | 1488 |
| asesino | 4.09 | 31.5 | 31.1% | 1484 |
| velocista | 3.99 | 12.6 | 16.6% | 1405 |

## 7. Builds que llevan a timeout (pelea que no muere)

| Personalidad | Tasa de timeout | n |
|--------------|-----------------|----|
| extremista_defensa | 14.7% | 1450 |
| guardian | 9.9% | 1380 |
| tanque | 9.7% | 1425 |
| extremista_reflejos | 7.5% | 1429 |
| estratega | 6.0% | 1425 |
| esquivo | 2.8% | 1406 |
| gladiador | 2.2% | 1393 |
| equilibrado | 1.8% | 1422 |
| magus | 1.6% | 1412 |
| extremista_velocidad | 1.1% | 1424 |
| berserker | 1.0% | 1457 |
| extremista_ataque | 0.8% | 1488 |
| asesino | 0.5% | 1484 |
| velocista | 0.5% | 1405 |

## 8. Perfil de stats real por personalidad (media por 100 de nivel)

| Personalidad | ATK | DEF | ASPD | REF | MSPD | HP |
|--------------|---|---|---|---|---|---|
| berserker | 31.9 | 11.9 | 20.2 | 7.4 | 4.8 | 12.1 |
| velocista | 6.8 | 12.7 | 20.2 | 11.6 | 27.4 | 11.1 |
| extremista_velocidad | 20.2 | 12.1 | 31.2 | 7.7 | 4.9 | 12.6 |
| guardian | 6.7 | 31.6 | 8.3 | 8.6 | 11.5 | 23.2 |
| estratega | 11.6 | 16.0 | 18.3 | 24.9 | 6.0 | 13.5 |
| equilibrado | 14.9 | 20.8 | 13.3 | 13.6 | 13.7 | 14.4 |
| tanque | 7.0 | 32.5 | 13.2 | 7.4 | 7.5 | 21.7 |
| gladiador | 24.7 | 14.9 | 19.6 | 14.8 | 4.9 | 11.1 |
| extremista_reflejos | 9.1 | 12.1 | 19.0 | 31.0 | 4.9 | 12.8 |
| extremista_ataque | 32.1 | 11.9 | 19.0 | 7.8 | 5.0 | 12.7 |
| extremista_defensa | 7.2 | 34.8 | 5.6 | 11.9 | 6.0 | 22.7 |
| asesino | 26.1 | 12.5 | 22.8 | 8.3 | 11.2 | 9.1 |
| esquivo | 7.5 | 22.1 | 9.9 | 25.7 | 15.1 | 9.7 |
| magus | 19.8 | 14.8 | 24.6 | 12.6 | 7.6 | 10.9 |

## 9. Desempate por HP residual en timeouts (¿defensa roba empates?)

De 427 timeouts, el ganador tiene más HP residual en 48.2% (regla del motor).

¿La build con más DEF total gana el desempate?

| Condición (en timeouts) | Winrate | n |
|-------------------------|---------|----|
| guardian · def>=60:false | 76.2% | 21 |
| tanque · armorBonusDef>=200:true | 73.3% | 60 |
| tanque · def>=60:true | 68.1% | 119 |
| tanque · set:true | 66.7% | 135 |
| extremista_defensa · armorBonusDef>=200:false | 66.4% | 119 |
| extremista_defensa · set:true | 66.2% | 210 |
| extremista_defensa · def>=60:true | 64.7% | 204 |
| extremista_defensa · armorBonusDef>=200:true | 63.8% | 94 |
| tanque · def>=60:false | 63.2% | 19 |
| tanque · armorBonusDef>=200:false | 62.8% | 78 |
| guardian · armorBonusDef>=200:true | 58.9% | 56 |
| guardian · set:true | 57.6% | 132 |
| guardian · armorBonusDef>=200:false | 56.3% | 80 |
| guardian · def>=60:true | 53.9% | 115 |
| equilibrado · set:true | 53.8% | 26 |

Interpretación: si las condiciones defensivas superan 50% en timeouts, la defensa roba empates (sesgo del desempate por HP residual).

## Veredicto (resumen de hallazgos)

- **Meta**: extremista_defensa 66.0% (n=1360) — por encima del target 55%.
- **Builds malas**: magus 44.9%, equilibrado 37.9%, asesino 31.0%, esquivo 27.6%, velocista 16.3% (target: ninguna < 45% con n≥50).
- **Sesgo de nivel**: ver sección de auditoría estándar (el mayor nivel gana ≈29% — nivel NO predice victoria).
- **Ventaja 1er atacante**: ver auditoría estándar (target ≤5%).

