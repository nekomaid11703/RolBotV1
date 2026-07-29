# 📜 Especificación Técnica: Sistema de Ítems, Materiales, Coberturas y Naturalezas de Daño

> **Versión**: 1.0.0 — Documento Canónico del Sistema de Ítems y Equipamiento  
> **Estado**: Especificación Aprobada para Implementación

---

## 1. Sistema de Tiers (E, D, C, B, A, S, N)

Todos los ítems y materiales del juego pertenecen a un **Tier de Calidad**, el cual aplica un multiplicador a las estadísticas base del objeto o material.

| Tier | Nombre | Modificador | Multiplicador |
| :--- | :--- | :---: | :---: |
| **E** | Escaso / Elemental | +12% | `1.12x` |
| **D** | Distinguido | +24% | `1.24x` |
| **C** | Notable | +36% | `1.36x` |
| **B** | Bueno / Bueno Superior | +48% | `1.48x` |
| **A** | Alto / Avanzado | +60% | `1.60x` |
| **S** | Supremo / Superior | +72% | `1.72x` |
| **N** | Nirvana / Nether / Nadir | +84% | `1.84x` |

---

## 2. Naturalezas de Daño Físico y Fórmulas de Combate

El combate cuerpo a cuerpo y a distancia con armas se clasifica en 3 naturalezas físicas. Cualquier otra forma de daño (incluyendo **combate desarmado**) mantiene la fórmula matemática original:

$$\text{Daño Desarmado} = \left\lfloor \text{ATK} \times \frac{100}{100 + \text{DEF}_{\text{natural}}} \right\rfloor$$

### 🗡️ A. Cortante (Ej: Espadas, Katanas, Hachas)
* **Penetración de Defensa Natural**: Ignora del 12% al 84% de la defensa natural del objetivo según el tier del arma ($12\% \times \text{TierIndex}$, donde E=1, D=2, ..., N=7).
* **Fórmula de Daño**:
  $$\text{Daño Cortante} = (0.80 \times \text{STR}) + \text{DañoFijo}_{\text{arma}}$$
* **Resistencia Material**: Interactúa normalmente contra la durabilidad de la armadura/escudo.

### 🔨 B. Contundente (Ej: Mazos, Martillos, Garrotes)
* **Efectividad contra Estructuras / Armaduras**: Multiplica el daño infligido a la **Resistencia Material** (durabilidad del equipo) según su Tier:
  * Tier E: `1.2x` | Tier D: `1.5x` | Tier C: `2.0x` | Tier B: `3.0x` | Tier A: `4.0x` | Tier S: `5.0x` | Tier N: `6.0x`.
* **Defensa Natural**: Interactúa de forma normal contra la defensa natural del cuerpo del enemigo.

### 🎯 C. Perforante (Ej: Estocadas, Lanzas, Flechas)
* **Ignora 100% Defensa Natural**: El ataque salta completamente la stat `DEF` corporal del defensor.
* **Penalización Material**: Su daño se reduce un **50% (0.5x)** contra la **Resistencia Material** del equipo enemigo.
* **Daño Fijo e Indefensión de Fuerza**: Daño base fijo multiplicado por el factor de Tier (`1.2x` a `6.0x`). La stat de Fuerza (`STR`) no suma daño plano, sino que reemplaza a la Velocidad de Ataque (`ASPD`) para determinar la velocidad de la estocada (el `ASPD` base se ignora).

---

## 3. Sistema de Materiales y Crafteo

Los materiales se utilizan en la forja de ítems y dictan las estadísticas base mediante 4 atributos (rango base 1–100, escalados por el Tier del material):

1. **Afilabilidad**: Determina la agudeza del filo (aumenta el daño base de armas cortantes y perforantes).
2. **Conducción Mágica**: Mide la afinidad con el Fulgor (reduce el coste de Fulgor en hechizos/habilidades).
3. **Resistencia Material**: Dureza y durabilidad física del objeto.
   * *Mecánica de Rotura*: Absorbe el 100% del daño entrante restándolo a la resistencia actual del ítem. Cuando la resistencia llega a 0, **el ítem se rompe** y el exceso de daño se inflige a la salud corporal natural del objetivo.
4. **Flexibilidad**: Mide la elasticidad y acumulación de energía sin romperse (aumenta el daño base de arcos sin contar la flecha).

### Categorías de Materiales (Jerarquía Progresiva)
*Nota: El peor material de una categoría supera al mejor material Tier N de la categoría anterior.*

* 🪵 **Comunes**: Madera, Cuero, Hueso, Piedra.
* 🪙 **Poco Comunes**: Bronce, Plata, Hierro, Acero.
* 💎 **Raros**: Regulares en 2 stats, balanceados en el resto (Oro, Platino, Obsidiana, Madera de Caoba).
* 🛡️ **Épicos**: Excelentes en 1 stat y regulares en las demás (Titanio, Mitril, Oricalco).
* 🐉 **Legendarios**: Excelentes en 2 stats y regulares en las demás (Madera del Irminsul, Mineral Pálido, Obsidiana Azul, Luminita).
* 🌟 **Míticos (Solo 4 en el juego)**: Representan el Top 1 en su atributo principal, excelentes en la secundaria y regulares en las demás.

---

## 4. Equipamiento, Slots y Cobertura de Armadura

### Ranuras de Equipamiento (Slots)
1. **Cabeza** (Cascos, Capuchas, Coronas)
2. **Pecho** (Pechos, Cotas, Corazas)
3. **Pantalones** (Grebas, Pantalones, Perneras)
4. **Botas** (Calzado, Botas pesadas)
5. **Mano Derecha** (Arma principal / Escudo)
6. **Mano Izquierda** (Arma secundaria / Escudo)
   * *Armas a dos manos* (Arcos, Espadas Largas, Mazos pesados) ocupan **Mano Derecha + Mano Izquierda**.
7. **Artefactos (4 slots)**: Anillos, Amuletos, Reliquias.

### Bonos de Set
* Al equipar al menos **3 piezas del mismo conjunto de armadura o artefactos**, se activa una habilidad pasiva/bonificador de Set.

### Grados de Cobertura de Armadura (por parte corporal)
Cada pieza de armadura posee uno de 4 grados de cobertura corporal, equilibrando protección vs. agilidad/fatiga:
1. **Total**: Máxima Resistencia Material y DEF, pero genera penalizaciones de `MSPD` y aumenta el costo de Fatiga por movimiento.
2. **Alta**: Protección sólida con ligera penalización de agilidad.
3. **Media**: Balance equilibrado entre defensa y agilidad.
4. **Ligera**: Mínima defensa física pero otorga bonos de movilidad (`MSPD` / `REF`) y bajo costo de Fatiga.

---

## 5. Clasificación de Categorías Generales de Ítems

1. **`weapon`**: Armas físicas y mágicas con naturalezas de daño, rango y uso de manos.
2. **`armor`**: Piezas de equipamiento para Cabeza, Pecho, Pantalones y Botas con cobertura y resistencia material.
3. **`artifact`**: Reliquias/Accesorios equipables en los 4 slots de artefactos.
4. **`consumable`**: Objetos de un único uso (Pociones, Llaves, Invocadores, Comida). Dependen fuertemente de sus módulos (`heal`, `buff`, `summon`, etc.).
5. **`material`**: Insumos con atributos (Afilabilidad, Conducción, Resistencia, Flexibilidad) usados en crafteo.
6. **`special`**: Ítems no consumibles ni de combate (Escrituras de propiedad, ítems de comercio, coleccionables, futuras mecánicas de mascota/tamagotchi).
