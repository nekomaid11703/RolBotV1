## CLASIFICACIÓN DE ACCIÓN

Texto del jugador: "{text}"

Clasifica esta acción entre:
- **attack**: ataque directo (golpear, cortar, disparar, lanzar, hechizar)
- **defend**: defensa (bloquear, esquivar, cubrirse, proteger)
- **flee**: huir (escapar, retirarse, correr)
- **interact**: observar (mirar, examinar, analizar, inspeccionar, explorar)
- **transition**: acción auxiliar (tomar objeto, cambiar arma, beber poción)
- **use_item**: usar objeto consumible

Reglas:
- Si describe preparación/observación SIN verbos de ataque -> interact
- Si es principalmente diálogo sin acción -> interact
- Si hay verbo de ataque + zona -> attack
- Si hay "defender/esquivar/bloquear" -> defend

Responde SOLO este JSON:
{"action_type":"string","intent":"ofensivo|defensivo|retirada|auxiliar","target_id":"string|null","confidence":0.0-1.0}
