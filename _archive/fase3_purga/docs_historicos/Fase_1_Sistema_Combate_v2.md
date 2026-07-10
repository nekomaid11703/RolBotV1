# Fase 1 — Sistema de Combate

## 1. Propósito de esta fase

Esta fase define exclusivamente el sistema de combate del juego/bot.  
Incluye combate PvE y PvP bajo una misma lógica, con prioridad de resolución para PvP.

El objetivo de esta fase es establecer un combate híbrido:

- **Estadístico**, porque el daño, la defensa, la fatiga y las resistencias se calculan con reglas numéricas.
- **Narrativo**, porque cada acción debe describirse en texto según el resultado mecánico ya resuelto por el motor.

La narrativa no decide el resultado.  
La narrativa interpreta el resultado.

---

## 2. Principio de funcionamiento general

### 2.1 Un solo sistema para PvE y PvP
El combate debe usar el mismo motor tanto contra jugadores como contra enemigos, criaturas, jefes o cualquier entidad controlada por el bot.

### 2.2 Prioridad de PvP
Si existe conflicto entre un combate contra jugador y una interacción de misión o mundo abierto, la resolución de PvP tiene prioridad.

### 2.3 Orden de resolución
Toda acción de combate debe resolverse en este orden:

1. Entrada del usuario.
2. Interpretación semántica.
3. Verificación de turnos y tipo de acción.
4. Cálculo del daño.
5. Aplicación de defensas, estados y zonas corporales.
6. Resolución del resultado.
7. Narración final.
8. Registro del evento.

---

## 3. Estructura de combate por turnos

### 3.1 Regla base
El sistema es por turnos.  
Quien inicia el ataque ejecuta el primer golpe, siempre que el objetivo no logre interceptarlo, bloquearlo, esquivarlo, huir o contraatacar antes de la resolución, siempre que sus capacidades lo permitan.

### 3.2 Ventaja del defensor
Quien recibe el ataque tiene ventaja táctica para responder con:

- contraataque,
- bloqueo,
- huida,
- evasión,
- interrupción,
- reacción defensiva.

Esa ventaja solo se aplica si el defensor cumple los requisitos de reflejos, velocidad, posición, distancia, estado y recursos disponibles.

### 3.3 Regla de prioridad inicial
Quien ataca primero golpea primero si el objetivo no puede hacer nada al respecto.

---

## 4. Distinción entre acción y transición

El sistema debe distinguir con claridad entre dos tipos de movimiento:

### 4.1 Transición
Una transición es un movimiento corto, rápido o auxiliar que no define por sí mismo el resultado principal del combate.

Ejemplos:

- sacar una poción,
- tomar una poción,
- cambiar de mano un objeto,
- acomodar postura,
- dar un paso corto,
- retroceder ligeramente,
- recoger un objeto cercano.

### 4.2 Acción
Una acción es un evento de combate que sí altera la resolución principal del turno.

Ejemplos:

- atacar,
- bloquear,
- huir,
- levantar la guardia,
- contraatacar,
- desarmar,
- usar una técnica,
- lanzar un hechizo,
- iniciar un acto ofensivo o defensivo relevante.

---

## 5. Regla de movimientos por turno

### 5.1 Movimiento asegurado
El combate permite **un movimiento asegurado por turno**.

Ese primer movimiento puede declararse como realizado.

### 5.2 Intercepción del primer movimiento
El primer movimiento de un turno, ya sea de acción o transición, puede ser interceptado siempre que no sea una acción pasiva y que la velocidad de reacción del objetivo no sea inferior al 70% de la velocidad de ataque del oponente.

Esto significa que el primer movimiento no siempre se ejecuta de forma garantizada si el enemigo tiene superioridad suficiente en velocidad.

Ejemplo:
- Si al ser atacado respondes cubriéndote, esa acción se da por hecha solo si tu reacción cumple el requisito mínimo.
- Si tu enemigo es el doble de rápido de lo que puedes reaccionar, te golpeará incluso antes de que puedas darte cuenta.

### 5.3 Segundo y tercer movimiento
El segundo y el tercero pueden ser frenados, anulados o interrumpidos por el oponente si cumple los requisitos necesarios.

### 5.4 Regla de anulación
Si un movimiento posterior depende de velocidad, distancia, reflejos, alcance o estabilidad, el oponente puede impedirlo si tiene capacidad suficiente para hacerlo.

Ejemplo:
Si un jugador intenta sacar una poción como segundo movimiento de transición, el enemigo puede patearla, interceptarla o impedirlo si está lo suficientemente cerca y si su velocidad de ataque supera los reflejos o la velocidad de reacción del objetivo.

### 5.5 Reacciones ofensivas y de retirada
En caso de ser una reacción ofensiva como huir, contraatacar y demás, se aplica la misma regla.

Solo puedes huir efectivamente si tus reflejos son más altos que el 70% de la velocidad enemiga.

## 6. Regla de redacción obligatoria para combate

El sistema exige una diferencia formal entre lo que se **hace** y lo que se **intenta**.

### 6.1 Primer movimiento
El primer movimiento de una acción o transición puede escribirse como realizado.

Ejemplo:
- “Tomé la poción.”
- “Bloqueé el golpe.”
- “Retrocedí un paso.”

### 6.2 Segundo movimiento
El segundo movimiento debe escribirse como intento o posibilidad.

Ejemplo:
- “Intenté levantarme.”
- “Traté de atacar.”
- “Busqué sacar la espada.”

### 6.3 Regla de advertencia
Si el usuario no respeta esta diferencia, el sistema debe lanzar una advertencia de mano blanca.

---

## 7. Sistema de infracciones narrativas

### 7.1 Mano blanca
Se considera mano blanca cuando el jugador da por hecho una acción que todavía puede ser interrumpida, anulada o frustrada por el oponente o por el estado del combate.

Ejemplo:
- escribir como hecho una secuencia de varias acciones que todavía no fueron resueltas;
- asumir que una acción ocurrió sin pasar por la mecánica del turno;
- declarar como garantizado algo que depende de la respuesta del enemigo.

### 7.2 Mano negra
Se considera mano negra manipular, condicionar o sobreentender una acción o reacción de otro jugador que no pertenece al propio turno ni está bajo control del propio personaje.

Ejemplo:
- escribir que un golpe fue efectivo sin considerar que el otro podía esquivarlo;
- decidir la reacción del oponente;
- describir como confirmada una consecuencia que aún no fue resuelta por el motor.

### 7.3 Función del validador
El sistema debe tener un validador narrativo que detecte estas infracciones y emita advertencia antes de resolver la acción.

---

## 8. Estadísticas base del combate

Cada personaje utiliza las siguientes estadísticas:

- Vida
- Fulgor
- Fatiga
- Fuerza
- Resistencia física
- Resistencia mágica
- Reflejos
- Velocidad de ataque
- Precisión
- Velocidad de desplazamiento
- Dominio del fulgor

### 8.1 Vida
La vida es universal y todos los personajes parten de 100 puntos.

La vida representa el estado saludable general del cuerpo.  
No representa únicamente “golpes”, sino integridad biológica y capacidad de seguir combatiendo.

### 8.2 Fulgor
El fulgor es la barra de energía usada para cualquier cosa que no pueda explicarse de manera científica o puramente física.

Regla base:
- todo lo sobrenatural consume fulgor;
- la potencia se multiplica por la precisión;
- el consumo se resuelve contra el dominio del fulgor.

### 8.3 Fatiga
La fatiga aumenta cuando el cuerpo se explota de forma continua.

Regla base:
- si pasas más de 5 turnos en movimiento físico continuo, entras en fatiga;
- la fatiga empeora con cada turno sin descanso;
- la fatiga disminuye las estadísticas;
- la fatiga afecta todas las estadísticas excepto la defensa y las estadísticas de tipo almacenado como el fulgor;
- el descanso reduce el nivel de fatiga según salud, resistencia y factores externos;
- el descanso no elimina la fatiga, solo la reinicia a un estado menor.

---

## 9. Reglas de vida y K.O.

### 9.1 Umbral de K.O.
Tener menos de 30 puntos de vida en condiciones normales deja al personaje K.O.

### 9.2 Resistencia y absorción
La vida es universal, pero lo que cambia entre razas, clases, equipos y estados es:

- cuánta resistencia tiene el cuerpo,
- cuánta absorción aplica,
- cuánto daño real entra al organismo.

---

## 10. Sistema de daño corporal

El sistema de daño debe ser localizado y funcional.

### 10.1 Regla base
Todo el cuerpo posee resistencia física y mágica general.  
Si no hay protección, todo el cuerpo recibe la misma cantidad de daño general.

### 10.2 Daño a extremidades
El daño a extremidades funciona de adentro hacia afuera.

Ejemplos:
- un daño en la muñeca afecta la mano;
- un daño en el hombro afecta todo el brazo.

### 10.3 Umbral de inutilización
Cuando el daño sobrepasa cierto umbral de la resistencia base de la zona afectada, sin contar buffs, la zona queda inutilizada.

### 10.4 Umbral de amputación
Cuando una zona llega a 0 de resistencia base, se considera amputación o pérdida total de la funcionalidad de la zona.

### 10.5 Daño al core
El core incluye:
- pecho,
- abdomen.

El daño al core afecta al cuerpo completo en general.

### 10.6 Cabeza
La cabeza tiene un umbral de daño antes del K.O más débil que el resto del cuerpo.

---

## 11. Tipos de daño

Las armas y técnicas pueden producir tres tipos principales de daño:

- cortadura,
- impacto,
- efecto.

### 11.1 Daño por impacto
El daño por impacto equivale a la fuerza del portador después de restar penalizaciones o aplicar buffs.

### 11.2 Daño por cortadura
El daño por corte tiene la característica de ignorar por completo la resistencia física base.  
Por norma general, siempre amputa la extremidad.

#### Excepción contra objetos duros
Si el corte choca con un objeto duro, se aplica un cálculo especial:

- solo corta si la fuerza del portador y la resistencia de la espada superan la dureza del objeto;
- la espada recibe una cantidad de daño equivalente a la fuerza necesaria para atravesar esa dureza;
- si no logra atravesarlo, puede romperse.

### 11.3 Daño por efecto
El daño por efecto representa daños o consecuencias que no se resuelven por fuerza bruta directa.

Ejemplos:
- veneno,
- quemadura,
- congelación,
- aturdimiento,
- miedo,
- corrupción,
- daño sensorial.

### 11.4 Daño mágico
El daño mágico puede imitar cualquier tipo de daño, incluyendo daño por efecto.

Regla base:
- no se calcula por fuerza;
- se calcula por dominio del fulgor;
- consume fulgor como combustible.

---

## 12. Fórmula general de daño

El daño se calcula por una fórmula fija que sigue este orden:

1. condiciones iniciales,
2. excepciones,
3. multiplicadores,
4. críticos,
5. incertidumbre final,
6. resta a la estadística atacada.

### 12.1 Regla de cálculo
El motor debe tomar en cuenta:

- tipo de ataque,
- arma o método,
- zona afectada,
- resistencia de la víctima,
- defensa de la zona,
- buffs,
- debuffs,
- estado del atacante,
- fatiga,
- cobertura,
- objetos de protección,
- compatibilidad con el tipo de daño.

### 12.2 Incertidumbre final
Al final del cálculo se aplica un porcentaje de incertidumbre.  
Ese margen se resta o ajusta a la estadística atacada para introducir variación sin romper el control numérico del sistema.

---

## 13. Críticos

El crítico funciona por porcentaje crítico base, modificado por estadísticas.

### 13.1 Regla base
Cada personaje tiene un número base de crítico según ciertas estadísticas.

### 13.2 Futuras variaciones
Ese porcentaje podrá aumentar o disminuir en actualizaciones posteriores.

---

## 14. Fulgor y sobrenaturalidad

Todo aquello que no pueda explicarse de manera científica consume fulgor.

### 14.1 Regla general
La potencia del efecto sobrenatural se multiplica por la precisión y se paga con fulgor.

### 14.2 Uso
Esto aplica a:
- magia,
- técnicas sobrenaturales,
- habilidades especiales,
- efectos imposibles de justificar físicamente,
- manifestaciones no científicas.

---

## 15. Sistema de fatiga

### 15.1 Entrada en fatiga
La fatiga se activa cuando el personaje mantiene esfuerzo físico continuo durante más de 5 turnos.

### 15.2 Efecto
La fatiga reduce estadísticas de combate y empeora con cada turno adicional sin descanso.

### 15.3 Descanso
Un turno de descanso puede retroceder el nivel de fatiga en función de:
- salud,
- resistencia,
- factores externos.

### 15.4 Persistencia
El descanso no elimina completamente la fatiga, solo la reinicia.

---

## 16. Sistema de objetos y almacenamiento

### 16.1 Sistema por peso
El almacenamiento se basa en peso, no en un límite estricto de cantidad de objetos.

### 16.2 Capacidad real
La limitación está dada por:
- cuánto peso cargas,
- cuánto peso puedes mover,
- cuánto peso puedes estabilizar.

### 16.3 Penalización
El exceso de peso produce:
- penalización de agilidad,
- penalización de movilidad,
- posible pérdida de loot por sobrecarga.

### 16.4 Regla de realidad física
No todo objeto pesado es útil por sí mismo.

Ejemplo:
Un millón de plumas no pesan de forma exagerada, pero son inviables de transportar si al moverte se caen o se dispersan.

### 16.5 Moneda
Todo tiene peso y penalización de movilidad, menos las estelas, que funcionan como moneda sin impacto de peso relevante.

---

## 17. Zonas equipables

Las zonas equipables del cuerpo son:

- cabeza,
- cuello,
- pecho,
- espalda,
- brazos,
- manos,
- piernas,
- pies,
- accesorio 1,
- accesorio 2.

---

## 18. Armaduras

### 18.1 Regla de cobertura
Las armaduras protegen únicamente la zona que cubren.

### 18.2 Ejemplos
- casco protege cabeza,
- armadura de pecho protege pecho,
- protección de brazo protege brazo,
- bota protege pies.

### 18.3 Requisito técnico
El sistema debe mapear cada pieza de armadura a su zona exacta de protección.

---

## 19. Armas

### 19.1 Tipos de daño de armas
Las armas pueden causar:
- cortadura,
- impacto,
- efecto,
- daño mágico.

### 19.2 Daño por impacto
El daño por impacto equivale a la fuerza real del portador después de aplicar modificadores.

### 19.3 Daño por corte
El corte ignora resistencia física base y normalmente amputa, salvo interacción contra objetos duros.

### 19.4 Daño mágico
El daño mágico copia o reproduce el tipo de daño deseado, pero su cálculo se hace por dominio del fulgor.

---

## 20. Resistencia de objetos

### 20.1 Regla base
Todos los objetos del mundo tienen estadística de resistencia.

### 20.2 Sin vida
Los objetos no tienen vida.  
Si su resistencia llega a 0, se consideran hechos polvo o destruidos.

### 20.3 Filo
Los objetos con filo pierden filo con cada uso.

### 20.4 Interacción con objetos duros
Si el objeto intenta atravesar algo más duro de lo esperado, pierde resistencia adicional.

---

## 21. Consumibles y usables

### 21.1 Uso instantáneo
Los consumibles y usables son de uso instantáneo en su turno de transición.

### 21.2 Uso fuera de transición
Fuera de ese turno, dependen de la velocidad de ataque para ser consumidos a tiempo.

### 21.3 Regla de curación
Los objetos de curación no mágicos solo frenan heridas.  
No sanan heridas de forma real.

---

## 22. Uso universal de objetos en combate

Todo puede usarse en combate, incluso una piedra encontrada en el suelo.

### 22.1 Regla de efectividad
La efectividad depende siempre de las estadísticas involucradas.

### 22.2 Curación no mágica
La curación no mágica solo frena daño o estabiliza, no regenera ni repara completamente.

---

## 23. Botín

### 23.1 Loot de jugador
Si el enemigo es un jugador, el botín será el que ese jugador traiga.

### 23.2 Loot de NPC
Si el enemigo es un NPC, criatura o jefe, el botín es aleatorio pero coherente con quien es o con lo que tenía.

---

## 24. Rareza de objetos

Los objetos también tendrán rareza, igual que las razas.

### 24.1 Privilegio de identidad
A partir de cierto nivel de rareza, los objetos pueden convertirse en objetos con identidad.

### 24.2 Conversión
Para convertir un objeto normal en uno con identidad se debe usar un comando que verifique los requisitos.

### 24.3 Regla de progresión
No todos los objetos pueden tener identidad de forma inmediata.  
Debe existir una lógica de desbloqueo y validación.

---

## 25. Requisitos del motor de combate

El motor de combate debe incluir:

- parser de comandos,
- interpretación semántica,
- lectura de intención,
- validación de turno,
- validación de acción o transición,
- cálculo de daño,
- cálculo de resistencia,
- lectura de cobertura,
- lectura de zona corporal,
- aplicación de estados,
- resolución de K.O.,
- generación narrativa,
- registro de combate,
- detección de infracciones narrativas.

---

## 26. Regla de calidad del sistema

El sistema debe ser suficientemente estricto para evitar abuso narrativo, pero suficientemente flexible para permitir rol libre, narración dinámica y combates expresivos.

La prioridad debe ser:

1. consistencia mecánica,
2. claridad narrativa,
3. fidelidad al turno,
4. coherencia con el estado del personaje,
5. compatibilidad futura con progresión, economía y misiones.

---

## 27. Criterio de cierre de esta fase

Esta fase queda cerrada cuando el motor pueda:

- diferenciar acción y transición,
- resolver combate por turnos,
- interpretar intenciones de forma semántica,
- calcular daño por fórmulas fijas,
- aplicar zonas corporales,
- detectar mano blanca y mano negra,
- manejar fatiga,
- usar inventario por peso,
- gestionar armaduras por cobertura,
- calcular daño de objetos y armas,
- resolver loot de jugador o NPC,
- y narrar el resultado sin alterar la mecánica.
