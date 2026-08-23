# Plan: Balance Competitivo de Combate

> Estado: aprobado para preparativos e implementación
> Objetivo: competencia justa entre personajes y enemigos del mismo nivel y presupuesto de equipamiento.

## Principios

- Un espejo exacto debe converger a 50% de victorias.
- Material define identidad horizontal dentro de su rareza; tier y rareza son progresión vertical controlada.
- Nivel habilita presupuesto y brackets, pero no multiplica directamente el daño del objeto.
- Tier se aplica una única vez por fórmula. Material, tier, habilidad y nivel no pueden escalar el mismo término dos veces.
- Hechizos permanecen utilizables; el foco aporta la mejora reemplazable de canalización y eficiencia.
- Todo material conserva sus cuatro propiedades en cualquier categoría de equipo.
  La categoría define cuánto convierte cada propiedad: un arma física puede
  aportar canalización secundaria y una armadura puede beneficiar varios roles,
  pero foco y túnica mantienen la mejor conversión para el canal mágico.

## Afinidad Cruzada De Equipamiento

El equipo no se divide en objetos “físicos” y “mágicos” aislados. Materiales
como hierro, plata, acero u oro conservan afilabilidad, conducción mágica,
resistencia y flexibilidad al convertirse en arma, foco o armadura.

- **Armas físicas**: afilabilidad sigue siendo su contribución principal al
  daño; conducción mágica aporta una canalización secundaria para híbridos.
- **Focos**: conducción mágica sigue siendo el eje principal; afilabilidad y
  flexibilidad pueden aportar una fracción menor a su estabilidad, rango o
  golpe de apoyo, nunca al mismo ratio que un arma.
- **Armaduras**: resistencia material sigue gobernando absorción y DEF; la
  conducción puede aportar buffs modestos de fulgor/dominio y la flexibilidad
  movilidad, según la pieza.
- **Artefactos**: especializan un eje, pero no invalidan las afinidades
  secundarias del resto del equipo.

La implementación debe usar coeficientes por categoría centralizados, no buffs
planos por nombre de ítem. Así, hierro habilita híbridos moderados, plata/oro
favorecen magia y acero/titanio defensa, sin convertir todos los materiales en
equipo óptimo universal.

## Preparativos Obligatorios

1. Corregir el doble escalado de tier en armas físicas y cubrirlo con pruebas de monotonicidad.
2. Añadir un resolver de afinidad por categoría que derive aportes secundarios
   de las estadísticas reales del material para arma, foco, armadura y artefacto.
   Los coeficientes se medirán antes de activarse en el catálogo real.
3. Cerrar TD-005: equipo y absorción multi-pieza en todo ataque, contraataque y reacción.
4. Terminar resolución de magia real: multi-hit, estados, KO por DOT y restauración.
5. Alinear motor real y simulador sobre las mismas fórmulas de equipo, recursos y estados.

## Orden Priorizado Por Impacto

1. **Simulador reproducible de canal mágico**: añadir batería, foco, hechizo,
   coste, dilución, multi-hit, aura, reacciones y estados al simulador. Es la
   mayor brecha: sin métricas comparables no se deben cambiar constantes.
2. **Baseline competitivo**: ejecutar espejos y matrices físico/mágico/híbrido
   con nivel, tier, material y presupuesto idénticos. Registrar semilla,
   configuración y resultados antes de tocar balance.
3. **Cerrar hallazgos del baseline**: priorizar solo defectos que superen los
   límites de winrate, primer turno, duración o consumo de recursos definidos
   en este plan. Mantener separados cambios de fórmula y cambios numéricos.
4. **Afinidad cruzada**: introducir los coeficientes secundarios de materiales
   después del baseline puro; medir híbridos contra especialistas equivalentes
   en un experimento aislado.
5. **Balance fino**: ajustar un grupo de constantes por vez y repetir la
   matriz completa. No se modifica tier, material y daño base en la misma
   iteración.

## Catálogo Experimental Antes Del Balance

El balance no usará un único ítem por arquetipo. Antes de ajustar constantes,
el simulador debe generar un catálogo experimental homogéneo, en memoria y sin
alterar el catálogo jugable, con una muestra mínima por bracket:

| arquetipo | variedad mínima a medir |
|-----------|--------------------------|
| físico | arma de una mano, dos manos, contundente, perforante, arco; armadura ligera/media/alta/total; escudo y artefacto |
| mago | foco 1h y 2h, conducción baja/media/alta, hechizo directo, multi-hit y control, túnica y artefacto de batería/dominio |
| híbrido | arma física con conducción secundaria, foco 1h con mano secundaria, armadura con afinidad secundaria y artefacto mixto |

- Cada variante se genera para los mismos brackets de nivel, tier, rareza y
  presupuesto de material.
- El muestreo es estratificado: cada combinación requerida recibe el mismo
  número de enfrentamientos, no depende de probabilidades aleatorias.
- Las cargas mágicas incluyen varios costes y patrones de hits; ninguna puede
  quedar sistemáticamente sin batería al inicio.
- Los reportes deben etiquetar arquetipo, material/tier de arma o foco,
  hechizo, coste, batería, armadura y mano secundaria para segmentar datos.
- Las afinidades cruzadas se introducen solo después de este baseline puro,
  para aislar su efecto frente a tier, material principal y hechizo.

## Matriz De Simulación

- Físico vs físico, mágico vs mágico, físico vs mágico e híbrido vs híbrido.
- Espejos exactos por nivel, material, tier y loadout.
- Cruces de materiales dentro de la misma rareza y entre brackets adyacentes.
- Métricas: winrate, primer turno, duración, daño, fulgor, dilución, procs, DOT, roturas y reparación.

## Puertas De Balance

- Espejos: 48-52% de winrate.
- Ningún arquetipo/material equivalente supera 55% de winrate agregado.
- Ventaja de primer turno máxima: 5%.
- Duración media: 7 +/- 0.5 turnos; P90 máximo: 20.
- Cada cambio se evalúa aislando una familia de parámetros y guardando baseline reproducible.
- Las afinidades secundarias se evalúan en matrices de híbridos frente a
  especialistas equivalentes; no se ajustan durante el mismo experimento que
  tier, material principal o daño base.
